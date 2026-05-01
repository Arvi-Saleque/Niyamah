import { and, asc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { toSlug, uniqueSlug } from "@/lib/utils/slug";
import type {
  BrandCreateInput,
  BrandUpdateInput,
  ListQueryInput,
} from "@/lib/validations/catalog";

export const brandRepository = {
  async list(query: Partial<ListQueryInput> = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const where = [eq(brands.storeId, DEFAULT_STORE_ID)];
    if (query.q) where.push(ilike(brands.name, `%${query.q}%`));

    const [rows, [{ count }]] = await Promise.all([
      db
        .select()
        .from(brands)
        .where(and(...where))
        .orderBy(asc(brands.name))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(brands)
        .where(and(...where)),
    ]);

    return { items: rows, total: count, page, limit };
  },

  async findBySlug(slug: string) {
    const row = await db.query.brands.findFirst({
      where: and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.slug, slug)),
    });
    return row ?? null;
  },

  async findById(id: number) {
    const row = await db.query.brands.findFirst({
      where: and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.id, id)),
    });
    return row ?? null;
  },

  async existsBySlug(slug: string, excludeId?: number) {
    const row = await db.query.brands.findFirst({
      where: and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.slug, slug)),
      columns: { id: true },
    });
    if (!row) return false;
    if (excludeId && row.id === excludeId) return false;
    return true;
  },

  async create(input: BrandCreateInput) {
    const baseSlug = input.slug ? toSlug(input.slug) : toSlug(input.name);
    const slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s));
    const [row] = await db
      .insert(brands)
      .values({
        storeId: DEFAULT_STORE_ID,
        name: input.name,
        slug,
        logo: input.logo ?? null,
        description: input.description ?? null,
        featured: input.featured ?? false,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        status: input.status ?? true,
      })
      .returning();
    return row;
  },

  async update(id: number, input: BrandUpdateInput) {
    let slug: string | undefined;
    if (input.slug) {
      const baseSlug = toSlug(input.slug);
      slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s, id));
    }

    const [row] = await db
      .update(brands)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(slug !== undefined && { slug }),
        ...(input.logo !== undefined && { logo: input.logo }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && {
          seoDescription: input.seoDescription,
        }),
        ...(input.status !== undefined && { status: input.status }),
      })
      .where(and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.id, id)))
      .returning();
    return row ?? null;
  },

  async remove(id: number) {
    const result = await db
      .delete(brands)
      .where(and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.id, id)))
      .returning({ id: brands.id });
    return result.length > 0;
  },
};
