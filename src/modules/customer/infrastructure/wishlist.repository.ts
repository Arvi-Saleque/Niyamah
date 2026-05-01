import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  wishlists,
  wishlistItems,
  products,
  productImages,
  orderItems,
  orders,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export const wishlistRepository = {
  async getOrCreate(userId: string) {
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.storeId, DEFAULT_STORE_ID),
      ),
    });
    if (existing) return existing;
    const [created] = await db
      .insert(wishlists)
      .values({ userId, storeId: DEFAULT_STORE_ID })
      .returning();
    return created!;
  },

  async list(userId: string) {
    const wl = await this.getOrCreate(userId);
    const rows = await db
      .select({
        id: wishlistItems.id,
        productId: wishlistItems.productId,
        variantId: wishlistItems.variantId,
        addedAt: wishlistItems.addedAt,
        productName: products.name,
        productSlug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        productStatus: products.status,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .where(eq(wishlistItems.wishlistId, wl.id))
      .orderBy(desc(wishlistItems.addedAt));

    if (!rows.length) return [];

    const productIds = rows.map((r) => r.productId);
    const imgs = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .where(
        sql`${productImages.productId} IN ${productIds} AND ${productImages.isPrimary} = true`,
      );
    const imgMap = new Map(imgs.map((i) => [i.productId, i.url]));

    return rows.map((r) => ({
      ...r,
      imageUrl: imgMap.get(r.productId) ?? null,
    }));
  },

  async add(userId: string, productId: number, variantId?: number) {
    const wl = await this.getOrCreate(userId);
    try {
      const [row] = await db
        .insert(wishlistItems)
        .values({
          wishlistId: wl.id,
          productId,
          variantId: variantId ?? null,
        })
        .returning();
      return { added: true, item: row };
    } catch {
      // Unique constraint hit — already in wishlist
      return { added: false, item: null };
    }
  },

  async remove(userId: string, productId: number) {
    const wl = await this.getOrCreate(userId);
    const result = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wl.id),
          eq(wishlistItems.productId, productId),
        ),
      )
      .returning({ id: wishlistItems.id });
    return result.length > 0;
  },

  async has(userId: string, productId: number): Promise<boolean> {
    const wl = await this.getOrCreate(userId);
    const row = await db.query.wishlistItems.findFirst({
      where: and(
        eq(wishlistItems.wishlistId, wl.id),
        eq(wishlistItems.productId, productId),
      ),
    });
    return !!row;
  },

  /** Used to mark `verified_purchase` on reviews. */
  async userBoughtProduct(userId: string, productId: number): Promise<boolean> {
    const rows = await db
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.userId, userId),
          sql`EXISTS (SELECT 1 FROM product_variants pv WHERE pv.id = ${orderItems.variantId} AND pv.product_id = ${productId})`,
        ),
      )
      .limit(1);
    return rows.length > 0;
  },
};
