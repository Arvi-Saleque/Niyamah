import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  productVariants,
  products,
  productImages,
  inventory,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export interface CartLine {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  variantSku: string | null;
  imageUrl: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  stockAvailable: number;
}

export interface CartView {
  id: number;
  userId: string | null;
  sessionId: string | null;
  items: CartLine[];
  subtotal: string;
  itemCount: number;
}

async function loadCart(cartId: number): Promise<CartView | null> {
  const cart = await db.query.carts.findFirst({
    where: and(eq(carts.id, cartId), eq(carts.storeId, DEFAULT_STORE_ID)),
  });
  if (!cart) return null;

  const lines = await db
    .select({
      id: cartItems.id,
      variantId: cartItems.variantId,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      variantSku: productVariants.sku,
      basePrice: products.price,
      salePrice: products.salePrice,
      priceOverride: productVariants.priceOverride,
      salePriceOverride: productVariants.salePriceOverride,
      priceSnapshot: cartItems.priceSnapshot,
      quantity: cartItems.quantity,
      stockAvailable: inventory.stockAvailable,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.variantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(inventory, eq(inventory.variantId, productVariants.id))
    .where(eq(cartItems.cartId, cart.id));

  // Primary images per product
  const productIds = [...new Set(lines.map((l) => l.productId))];
  const images = productIds.length
    ? await db
        .select({ productId: productImages.productId, url: productImages.url })
        .from(productImages)
        .where(
          sql`${productImages.productId} IN ${productIds} AND ${productImages.isPrimary} = true`,
        )
    : [];
  const imageMap = new Map(images.map((i) => [i.productId, i.url]));

  let subtotal = 0;
  const items: CartLine[] = lines.map((l) => {
    const unitPrice = l.priceSnapshot;
    const lineTotal = (Number(unitPrice) * l.quantity).toFixed(2);
    subtotal += Number(lineTotal);
    return {
      id: l.id,
      variantId: l.variantId,
      productId: l.productId,
      productName: l.productName,
      productSlug: l.productSlug,
      variantSku: l.variantSku,
      imageUrl: imageMap.get(l.productId) ?? null,
      unitPrice,
      quantity: l.quantity,
      lineTotal,
      stockAvailable: l.stockAvailable ?? 0,
    };
  });

  return {
    id: cart.id,
    userId: cart.userId,
    sessionId: cart.sessionId,
    items,
    subtotal: subtotal.toFixed(2),
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  };
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

export const cartRepository = {
  /** Find or create a cart for a logged-in user (preferred) or session id. */
  async findOrCreate(opts: {
    userId?: string | null;
    sessionId?: string | null;
  }): Promise<CartView> {
    if (!opts.userId && !opts.sessionId) {
      throw new Error("Need userId or sessionId to resolve a cart.");
    }

    let existing = opts.userId
      ? await db.query.carts.findFirst({
          where: and(
            eq(carts.storeId, DEFAULT_STORE_ID),
            eq(carts.userId, opts.userId),
          ),
        })
      : await db.query.carts.findFirst({
          where: and(
            eq(carts.storeId, DEFAULT_STORE_ID),
            eq(carts.sessionId, opts.sessionId!),
            isNull(carts.userId),
          ),
        });

    if (!existing) {
      const [created] = await db
        .insert(carts)
        .values({
          storeId: DEFAULT_STORE_ID,
          userId: opts.userId ?? null,
          sessionId: opts.sessionId ?? null,
        })
        .returning();
      if (!created) throw new Error("Cart insert failed.");
      existing = created;
    }

    const view = await loadCart(existing.id);
    if (!view) throw new Error("Cart vanished after creation.");
    return view;
  },

  async addItem(cartId: number, variantId: number, quantity: number) {
    const variant = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        priceOverride: productVariants.priceOverride,
        salePriceOverride: productVariants.salePriceOverride,
        basePrice: products.price,
        salePrice: products.salePrice,
        status: productVariants.status,
        stockAvailable: inventory.stockAvailable,
        trackStock: inventory.trackStock,
      })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .leftJoin(inventory, eq(inventory.variantId, productVariants.id))
      .where(eq(productVariants.id, variantId))
      .limit(1);

    const selectedVariant = variant[0];
    if (!selectedVariant || !selectedVariant.status) {
      throw new Error("Variant not available.");
    }

    const unitPrice = effectiveVariantPrice(selectedVariant);

    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.variantId, variantId),
      ),
    });

    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (selectedVariant.trackStock !== false && selectedVariant.stockAvailable != null) {
      if (selectedVariant.stockAvailable < nextQuantity) {
        throw new Error(`Only ${selectedVariant.stockAvailable} item(s) are available.`);
      }
    }

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: nextQuantity, priceSnapshot: unitPrice })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        cartId,
        variantId,
        quantity,
        priceSnapshot: unitPrice,
      });
    }

    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cartId));

    return loadCart(cartId);
  },

  async updateItem(cartId: number, itemId: number, quantity: number) {
    if (quantity === 0) {
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, itemId)));
    } else {
      await db
        .update(cartItems)
        .set({ quantity })
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, itemId)));
    }
    return loadCart(cartId);
  },

  async removeItem(cartId: number, itemId: number) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, itemId)));
    return loadCart(cartId);
  },

  async clear(cartId: number) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return loadCart(cartId);
  },

  /** Merge a guest (sessionId) cart into a user's cart on login. */
  async mergeGuestIntoUser(sessionId: string, userId: string) {
    const guest = await db.query.carts.findFirst({
      where: and(
        eq(carts.storeId, DEFAULT_STORE_ID),
        eq(carts.sessionId, sessionId),
        isNull(carts.userId),
      ),
    });
    if (!guest) return null;

    const userCart = await this.findOrCreate({ userId });
    const guestItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, guest.id));

    for (const gi of guestItems) {
      await this.addItem(userCart.id, gi.variantId, gi.quantity);
    }

    await db.delete(carts).where(eq(carts.id, guest.id));
    return loadCart(userCart.id);
  },

  load: loadCart,
};
