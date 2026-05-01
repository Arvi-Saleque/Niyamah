import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  campaigns,
  campaignProducts,
  products,
  productImages,
  coupons,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  CampaignCreateInput,
  CampaignUpdateInput,
} from "@/lib/validations/marketing";

export class CampaignError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "CampaignError";
  }
}

export const campaignRepository = {
  async list(opts: { page?: number; limit?: number; status?: string } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const conds = [eq(campaigns.storeId, DEFAULT_STORE_ID)];
    if (opts.status) {
      conds.push(eq(campaigns.status, opts.status as "draft" | "scheduled" | "active" | "ended" | "archived"));
    }
    const items = await db
      .select()
      .from(campaigns)
      .where(and(...conds))
      .orderBy(desc(campaigns.id))
      .limit(limit)
      .offset((page - 1) * limit);
    return { items, page, limit };
  },

  async findBySlug(slug: string) {
    const [row] = await db
      .select()
      .from(campaigns)
      .where(
        and(eq(campaigns.storeId, DEFAULT_STORE_ID), eq(campaigns.slug, slug)),
      )
      .limit(1);
    return row ?? null;
  },

  async findById(id: number) {
    const [row] = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.storeId, DEFAULT_STORE_ID), eq(campaigns.id, id)))
      .limit(1);
    return row ?? null;
  },

  async findBySlugWithProducts(slug: string) {
    const campaign = await this.findBySlug(slug);
    if (!campaign) return null;

    const linkedRows = await db
      .select({ productId: campaignProducts.productId })
      .from(campaignProducts)
      .where(eq(campaignProducts.campaignId, campaign.id));

    const productIds = linkedRows.map((r) => r.productId);
    if (productIds.length === 0)
      return { campaign, products: [], coupon: null };

    const productRows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        status: products.status,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    // primary images
    const imgRows = productIds.length
      ? await db
          .select({
            productId: productImages.productId,
            url: productImages.url,
            isPrimary: productImages.isPrimary,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];
    const imgByProduct = new Map<number, string>();
    for (const r of imgRows) {
      if (r.isPrimary || !imgByProduct.has(r.productId)) {
        imgByProduct.set(r.productId, r.url);
      }
    }

    let coupon = null;
    if (campaign.couponId) {
      const [c] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.id, campaign.couponId))
        .limit(1);
      coupon = c ?? null;
    }

    return {
      campaign,
      products: productRows.map((p) => ({
        ...p,
        image: imgByProduct.get(p.id) ?? null,
      })),
      coupon,
    };
  },

  async create(input: CampaignCreateInput, _actorId: string) {
    const exists = await this.findBySlug(input.slug);
    if (exists) throw new CampaignError("SLUG_TAKEN", "Slug already in use.");

    return db.transaction(async (tx) => {
      const [campaign] = await tx
        .insert(campaigns)
        .values({
          storeId: DEFAULT_STORE_ID,
          name: input.name,
          slug: input.slug,
          description: input.description ?? null,
          bannerImage: input.bannerImage ?? null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          couponId: input.couponId ?? null,
          status: input.status,
        })
        .returning();
      if (!campaign) throw new CampaignError("CREATE_FAILED", "Insert failed.");

      if (input.productIds.length > 0) {
        await tx.insert(campaignProducts).values(
          input.productIds.map((productId) => ({
            campaignId: campaign.id,
            productId,
          })),
        );
      }
      return campaign;
    });
  },

  async update(id: number, input: CampaignUpdateInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    return db.transaction(async (tx) => {
      const [updated] = await tx
        .update(campaigns)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.bannerImage !== undefined && { bannerImage: input.bannerImage }),
          ...(input.startDate !== undefined && {
            startDate: input.startDate ? new Date(input.startDate) : null,
          }),
          ...(input.endDate !== undefined && {
            endDate: input.endDate ? new Date(input.endDate) : null,
          }),
          ...(input.couponId !== undefined && { couponId: input.couponId }),
          ...(input.status !== undefined && { status: input.status }),
        })
        .where(eq(campaigns.id, id))
        .returning();

      if (input.productIds !== undefined) {
        await tx
          .delete(campaignProducts)
          .where(eq(campaignProducts.campaignId, id));
        if (input.productIds.length > 0) {
          await tx.insert(campaignProducts).values(
            input.productIds.map((productId) => ({
              campaignId: id,
              productId,
            })),
          );
        }
      }
      return updated ?? null;
    });
  },

  async remove(id: number) {
    const result = await db
      .delete(campaigns)
      .where(and(eq(campaigns.storeId, DEFAULT_STORE_ID), eq(campaigns.id, id)))
      .returning({ id: campaigns.id });
    return result.length > 0;
  },
};
