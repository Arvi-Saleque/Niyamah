import { and, avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews, reviewImages } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  ReviewCreateInput,
  ReviewModerateInput,
} from "@/lib/validations/customer";

export interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export const reviewRepository = {
  async listForProduct(
    productId: number,
    opts: { page?: number; limit?: number; statusFilter?: "APPROVED" | "ALL" } = {},
  ) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 10;
    const offset = (page - 1) * limit;
    const onlyApproved = (opts.statusFilter ?? "APPROVED") === "APPROVED";

    const where = [eq(reviews.productId, productId), eq(reviews.storeId, DEFAULT_STORE_ID)];
    if (onlyApproved) where.push(eq(reviews.status, "APPROVED"));

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(and(...where))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(reviews)
        .where(and(...where)),
    ]);

    if (!items.length) return { items: [], total: total ?? 0, page, limit };

    const ids = items.map((r) => r.id);
    const imgs = await db
      .select()
      .from(reviewImages)
      .where(sql`${reviewImages.reviewId} IN ${ids}`);
    const imgMap = new Map<number, string[]>();
    for (const i of imgs) {
      const arr = imgMap.get(i.reviewId) ?? [];
      arr.push(i.url);
      imgMap.set(i.reviewId, arr);
    }

    return {
      items: items.map((r) => ({ ...r, images: imgMap.get(r.id) ?? [] })),
      total: total ?? 0,
      page,
      limit,
    };
  },

  async statsForProduct(productId: number): Promise<ReviewStats> {
    const where = and(
      eq(reviews.productId, productId),
      eq(reviews.storeId, DEFAULT_STORE_ID),
      eq(reviews.status, "APPROVED"),
    );

    const [agg] = await db
      .select({ total: count(), average: avg(reviews.rating) })
      .from(reviews)
      .where(where);

    const dist = await db
      .select({
        rating: reviews.rating,
        c: count(),
      })
      .from(reviews)
      .where(where)
      .groupBy(reviews.rating);

    const distribution: ReviewStats["distribution"] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    for (const row of dist) {
      const r = row.rating as 1 | 2 | 3 | 4 | 5;
      if (r >= 1 && r <= 5) distribution[r] = Number(row.c) || 0;
    }

    return {
      total: Number(agg?.total ?? 0),
      average: agg?.average ? Number(agg.average) : 0,
      distribution,
    };
  },

  async create(
    userId: string,
    input: ReviewCreateInput,
    verifiedPurchase: boolean,
  ) {
    return db.transaction(async (tx) => {
      const [row] = await tx
        .insert(reviews)
        .values({
          storeId: DEFAULT_STORE_ID,
          productId: input.productId,
          userId,
          orderId: input.orderId ?? null,
          rating: input.rating,
          title: input.title ?? null,
          body: input.body,
          status: "PENDING",
          verifiedPurchase,
        })
        .returning();

      if (input.images?.length && row) {
        await tx
          .insert(reviewImages)
          .values(input.images.map((url) => ({ reviewId: row.id, url })));
      }
      return row!;
    });
  },

  async listForModeration(opts: { status?: "PENDING" | "APPROVED" | "REJECTED"; page?: number; limit?: number } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const offset = (page - 1) * limit;
    const where = [eq(reviews.storeId, DEFAULT_STORE_ID)];
    if (opts.status) where.push(eq(reviews.status, opts.status));

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(and(...where))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(reviews)
        .where(and(...where)),
    ]);
    return { items, total: total ?? 0, page, limit };
  },

  async moderate(id: number, input: ReviewModerateInput) {
    const [row] = await db
      .update(reviews)
      .set({ status: input.status })
      .where(
        and(eq(reviews.id, id), eq(reviews.storeId, DEFAULT_STORE_ID)),
      )
      .returning();
    return row ?? null;
  },

  async remove(id: number) {
    const result = await db
      .delete(reviews)
      .where(
        and(eq(reviews.id, id), eq(reviews.storeId, DEFAULT_STORE_ID)),
      )
      .returning({ id: reviews.id });
    return result.length > 0;
  },
};
