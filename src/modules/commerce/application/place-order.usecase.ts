import { sql, eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  inventory,
  orders,
  orderItems,
  orderStatusHistory,
  payments,
  productVariants,
  products,
  productImages,
  addresses,
  coupons,
  couponUsage,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { addressRepository } from "../infrastructure/address.repository";
import { shippingRepository } from "../infrastructure/shipping.repository";
import {
  couponRepository,
  CouponError,
} from "../infrastructure/coupon.repository";
import { orderRepository } from "../infrastructure/order.repository";
import { blacklistRepository } from "../infrastructure/blacklist.repository";
import type { CheckoutInput } from "@/lib/validations/commerce";

export class CheckoutError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
    this.name = "CheckoutError";
  }
}

export interface CheckoutResult {
  orderId: number;
  status: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
}

function effectiveVariantPrice(opts: {
  basePrice: string;
  salePrice: string | null;
  priceOverride: string | null;
  salePriceOverride: string | null;
}): string {
  if (opts.salePriceOverride) return opts.salePriceOverride;
  if (opts.priceOverride) return opts.priceOverride;
  if (opts.salePrice) return opts.salePrice;
  return opts.basePrice;
}

/**
 * Place an order — fully transactional.
 * Steps:
 *  1. Idempotency check by `idempotencyKey`
 *  2. Resolve cart (must belong to user/session)
 *  3. Resolve shipping address (existing or inline)
 *  4. Resolve shipping rate + price
 *  5. Validate + apply coupon (optional)
 *  6. Lock inventory rows; verify stock; reserve stock
 *  7. Insert order, order_items (snapshot from variant + product)
 *  8. Insert payment (COD = UNPAID/PENDING)
 *  9. Insert order_status_history (PENDING)
 * 10. Record coupon usage (if any)
 * 11. Clear cart
 */
export async function placeOrderUseCase(opts: {
  cartId: number;
  userId: string | null;
  input: CheckoutInput;
}): Promise<CheckoutResult> {
  const { cartId, userId, input } = opts;

  // ── 1. Idempotency
  const previous = await orderRepository.findByIdempotencyKey(
    input.idempotencyKey,
  );
  if (previous) {
    return {
      orderId: previous.id,
      status: previous.status,
      total: previous.total,
      paymentMethod: input.paymentMethod,
      paymentStatus: "UNPAID",
    };
  }

  // ── 2. Cart
  const cart = await db.query.carts.findFirst({
    where: and(eq(carts.id, cartId), eq(carts.storeId, DEFAULT_STORE_ID)),
  });
  if (!cart) throw new CheckoutError("CART_NOT_FOUND", "Cart not found.", 404);
  if (userId && cart.userId && cart.userId !== userId) {
    throw new CheckoutError("CART_NOT_OWNED", "Cart belongs to another user.", 403);
  }

  // ── 2a. Blacklist enforcement (COD-specific)
  if (input.paymentMethod === "COD") {
    const phoneToCheck =
      input.guestPhone ?? input.shippingAddress?.phone ?? null;
    const emailToCheck = input.guestEmail ?? null;
    if (phoneToCheck || emailToCheck) {
      const match = await blacklistRepository.findMatch({
        phone: phoneToCheck,
        email: emailToCheck,
      });
      if (match) {
        throw new CheckoutError(
          "BLACKLISTED",
          "Cash on Delivery is not available for this contact. Please contact support.",
          403,
        );
      }
    }
  }

  const lines = await db
    .select({
      cartItemId: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,
      priceSnapshot: cartItems.priceSnapshot,
      productId: products.id,
      productName: products.name,
      variantSku: productVariants.sku,
      variantStatus: productVariants.status,
      basePrice: products.price,
      salePrice: products.salePrice,
      priceOverride: productVariants.priceOverride,
      salePriceOverride: productVariants.salePriceOverride,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.variantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .where(eq(cartItems.cartId, cartId));

  if (!lines.length) throw new CheckoutError("EMPTY_CART", "Cart is empty.");
  for (const l of lines) {
    if (!l.variantStatus) {
      throw new CheckoutError(
        "INACTIVE_VARIANT",
        `${l.productName} variant is no longer available.`,
      );
    }
  }

  // ── 3. Shipping address
  let shippingAddrSnapshot: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    district: string;
    area: string | null;
    city: string | null;
    postalCode: string | null;
  };

  if (input.addressId && userId) {
    const addr = await addressRepository.findForUser(input.addressId, userId);
    if (!addr) throw new CheckoutError("ADDRESS_NOT_FOUND", "Address not found.", 404);
    shippingAddrSnapshot = {
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      district: addr.district,
      area: addr.area,
      city: addr.city,
      postalCode: addr.postalCode,
    };
  } else if (input.shippingAddress) {
    shippingAddrSnapshot = {
      name: input.shippingAddress.name,
      phone: input.shippingAddress.phone,
      addressLine1: input.shippingAddress.addressLine1,
      addressLine2: input.shippingAddress.addressLine2 ?? null,
      district: input.shippingAddress.district,
      area: input.shippingAddress.area ?? null,
      city: input.shippingAddress.city ?? null,
      postalCode: input.shippingAddress.postalCode ?? null,
    };
    // Optionally persist for logged-in users
    if (userId) {
      await addressRepository.create(userId, input.shippingAddress);
    }
  } else {
    throw new CheckoutError("ADDRESS_REQUIRED", "Shipping address is required.");
  }

  // ── 4. Shipping rate
  const rate = await shippingRepository.findRate(input.shippingRateId);
  if (!rate) throw new CheckoutError("RATE_NOT_FOUND", "Shipping rate not found.", 404);

  // ── 5. Subtotal + coupon + shipping
  const pricedLines = lines.map((line) => ({
    ...line,
    unitPrice: effectiveVariantPrice(line),
  }));
  const subtotal = pricedLines.reduce(
    (acc, l) => acc + Number(l.unitPrice) * l.quantity,
    0,
  );

  let discountAmount = 0;
  let freeShipping = false;
  let couponMeta: { id: number; code: string } | null = null;
  if (input.couponCode) {
    try {
      const result = await couponRepository.validateForCart({
        code: input.couponCode,
        subtotal,
        userId,
      });
      discountAmount = result.amount;
      freeShipping = result.freeShipping;
      couponMeta = { id: result.couponId, code: result.code };
    } catch (err) {
      if (err instanceof CouponError) {
        throw new CheckoutError(`COUPON_${err.code}`, err.message);
      }
      throw err;
    }
  }

  const shippingPrice = freeShipping
    ? 0
    : shippingRepository.computePrice(rate, subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingPrice);

  // ── 6–10. Transaction
  const orderId = await db.transaction(async (tx) => {
    // Lock inventory rows for these variants and verify stock
    const variantIds = pricedLines.map((l) => l.variantId);
    const stockRows = await tx
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.storeId, DEFAULT_STORE_ID),
          inArray(inventory.variantId, variantIds),
        ),
      )
      .for("update");

    const stockMap = new Map(stockRows.map((s) => [s.variantId, s]));

    for (const l of pricedLines) {
      const stock = stockMap.get(l.variantId);
      if (!stock) {
        throw new CheckoutError(
          "STOCK_NOT_TRACKED",
          `Stock unavailable for ${l.productName}.`,
        );
      }
      if (stock.trackStock && stock.stockAvailable < l.quantity) {
        throw new CheckoutError(
          "INSUFFICIENT_STOCK",
          `Only ${stock.stockAvailable} left of ${l.productName}.`,
        );
      }
    }

    // Reserve stock
    for (const l of pricedLines) {
      await tx
        .update(inventory)
        .set({
          stockReserved: sql`${inventory.stockReserved} + ${l.quantity}`,
          stockAvailable: sql`${inventory.stockAvailable} - ${l.quantity}`,
        })
        .where(eq(inventory.variantId, l.variantId));
    }

    // Insert order
    const [order] = await tx
      .insert(orders)
      .values({
        storeId: DEFAULT_STORE_ID,
        userId: userId ?? null,
        guestEmail: !userId ? input.guestEmail ?? null : null,
        guestPhone: !userId ? input.guestPhone ?? null : null,
        shippingName: shippingAddrSnapshot.name,
        shippingPhone: shippingAddrSnapshot.phone,
        shippingAddressLine1: shippingAddrSnapshot.addressLine1,
        shippingAddressLine2: shippingAddrSnapshot.addressLine2,
        shippingDistrict: shippingAddrSnapshot.district,
        shippingArea: shippingAddrSnapshot.area,
        shippingCity: shippingAddrSnapshot.city,
        shippingPostalCode: shippingAddrSnapshot.postalCode,
        status: "CONFIRMED",
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        shippingAmount: shippingPrice.toFixed(2),
        total: total.toFixed(2),
        couponId: couponMeta?.id ?? null,
        couponCode: couponMeta?.code ?? null,
        note: input.note ?? null,
        idempotencyKey: input.idempotencyKey,
      })
      .returning();
    if (!order) throw new CheckoutError("ORDER_CREATE_FAILED", "Could not create order.", 500);

    // Snapshot: fetch primary images for items
    const productIds = [...new Set(pricedLines.map((l) => l.productId))];
    const imgRows = await tx
      .select({ productId: productImages.productId, url: productImages.url })
      .from(productImages)
      .where(
        sql`${productImages.productId} IN ${productIds} AND ${productImages.isPrimary} = true`,
      );
    const imgMap = new Map(imgRows.map((i) => [i.productId, i.url]));

    await tx.insert(orderItems).values(
      pricedLines.map((l) => ({
        orderId: order.id,
        variantId: l.variantId,
        productName: l.productName,
        sku: l.variantSku,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        totalPrice: (Number(l.unitPrice) * l.quantity).toFixed(2),
        imageUrl: imgMap.get(l.productId) ?? null,
      })),
    );

    // Payment row — COD starts as PENDING/UNPAID
    const initialPaymentStatus = "UNPAID";
    await tx.insert(payments).values({
      storeId: DEFAULT_STORE_ID,
      orderId: order.id,
      method: input.paymentMethod,
      status: initialPaymentStatus,
      amount: total.toFixed(2),
      currency: "BDT",
    });

    // Order status history
    await tx.insert(orderStatusHistory).values({
      orderId: order.id,
      fromStatus: null,
      toStatus: "CONFIRMED",
      note: "Order placed.",
      actorId: userId ?? null,
    });

    if (couponMeta) {
      const bumped = await tx
        .update(coupons)
        .set({ usageCount: sql`${coupons.usageCount} + 1` })
        .where(
          and(
            eq(coupons.id, couponMeta.id),
            sql`(${coupons.usageLimit} IS NULL OR ${coupons.usageCount} < ${coupons.usageLimit})`,
          ),
        )
        .returning({ id: coupons.id });
      if (!bumped.length) {
        throw new CheckoutError("COUPON_LIMIT_REACHED", "Coupon usage limit reached.");
      }
      await tx.insert(couponUsage).values({
        couponId: couponMeta.id,
        userId,
        orderId: order.id,
      });
    }

    // Clear cart items
    await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));

    return order.id;
  });

  void addresses;

  return {
    orderId,
    status: "CONFIRMED",
    total: total.toFixed(2),
    paymentMethod: input.paymentMethod,
    paymentStatus: "UNPAID",
  };
}
