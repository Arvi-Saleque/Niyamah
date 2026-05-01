import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { coupons, couponUsage } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  CouponCreateInput,
} from "@/lib/validations/commerce";

export interface CouponDiscount {
  amount: number;
  freeShipping: boolean;
  couponId: number;
  code: string;
}

export class CouponError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "CouponError";
  }
}

export const couponRepository = {
  async list() {
    return db
      .select()
      .from(coupons)
      .where(eq(coupons.storeId, DEFAULT_STORE_ID));
  },

  async findByCode(code: string) {
    const row = await db.query.coupons.findFirst({
      where: and(
        eq(coupons.storeId, DEFAULT_STORE_ID),
        eq(coupons.code, code.toUpperCase()),
      ),
    });
    return row ?? null;
  },

  async create(input: CouponCreateInput) {
    const [row] = await db
      .insert(coupons)
      .values({
        storeId: DEFAULT_STORE_ID,
        code: input.code.toUpperCase(),
        type: input.type,
        value: input.value.toString(),
        minOrderAmount:
          input.minOrderAmount != null
            ? input.minOrderAmount.toString()
            : null,
        maxDiscountAmount:
          input.maxDiscountAmount != null
            ? input.maxDiscountAmount.toString()
            : null,
        usageLimit: input.usageLimit ?? null,
        perUserLimit: input.perUserLimit ?? 1,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        status: input.status ?? "active",
      })
      .returning();
    return row;
  },

  async remove(id: number) {
    const result = await db
      .delete(coupons)
      .where(and(eq(coupons.storeId, DEFAULT_STORE_ID), eq(coupons.id, id)))
      .returning({ id: coupons.id });
    return result.length > 0;
  },

  /**
   * Validate a coupon for a given subtotal and (optional) userId, then return
   * the discount it would produce. Throws `CouponError` on any rule violation.
   */
  async validateForCart(opts: {
    code: string;
    subtotal: number;
    userId?: string | null;
  }): Promise<CouponDiscount> {
    const coupon = await this.findByCode(opts.code);
    if (!coupon) throw new CouponError("NOT_FOUND", "Coupon not found.");
    if (coupon.status !== "active")
      throw new CouponError("INACTIVE", "Coupon is inactive.");

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now)
      throw new CouponError("NOT_STARTED", "Coupon not active yet.");
    if (coupon.endDate && coupon.endDate < now)
      throw new CouponError("EXPIRED", "Coupon expired.");

    if (
      coupon.minOrderAmount &&
      opts.subtotal < Number(coupon.minOrderAmount)
    ) {
      throw new CouponError(
        "MIN_ORDER",
        `Minimum order of ${coupon.minOrderAmount} required.`,
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new CouponError("LIMIT_REACHED", "Coupon usage limit reached.");
    }

    if (opts.userId) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(couponUsage)
        .where(
          and(
            eq(couponUsage.couponId, coupon.id),
            eq(couponUsage.userId, opts.userId),
          ),
        );
      if (count >= coupon.perUserLimit) {
        throw new CouponError(
          "PER_USER_LIMIT",
          "You have already used this coupon.",
        );
      }
    }

    let amount = 0;
    let freeShipping = false;
    if (coupon.type === "PERCENTAGE") {
      amount = (opts.subtotal * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount) {
        amount = Math.min(amount, Number(coupon.maxDiscountAmount));
      }
    } else if (coupon.type === "FLAT") {
      amount = Math.min(opts.subtotal, Number(coupon.value));
    } else if (coupon.type === "FREE_SHIPPING") {
      freeShipping = true;
    }

    return {
      amount: Math.round(amount * 100) / 100,
      freeShipping,
      couponId: coupon.id,
      code: coupon.code,
    };
  },

  async recordUsage(couponId: number, userId: string | null, orderId: number) {
    await db.insert(couponUsage).values({
      couponId,
      userId,
      orderId,
    });
    await db
      .update(coupons)
      .set({ usageCount: sql`${coupons.usageCount} + 1` })
      .where(eq(coupons.id, couponId));
  },
};
