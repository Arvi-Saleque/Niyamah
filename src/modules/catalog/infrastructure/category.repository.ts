import { and, asc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
  ListQueryInput,
} from "@/lib/validations/catalog";
import { uniqueSlug, toSlug } from "@/lib/utils/slug";

export const categoryRepository = {
  async list(query: Partial<ListQueryInput> = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const where = [eq(categories.storeId, DEFAULT_STORE_ID)];
    if (query.q) {
      where.push(ilike(categories.name, `%${query.q}%`));
    }

    const [rows, [{ count }]] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(and(...where))
        .orderBy(asc(categories.sortOrder), asc(categories.name))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(categories)
        .where(and(...where)),
    ]);

    return { items: rows, total: count, page, limit };
  },

  async findBySlug(slug: string) {
    const row = await db.query.categories.findFirst({
      where: and(
        eq(categories.storeId, DEFAULT_STORE_ID),
        eq(categories.slug, slug),
      ),
    });
    return row ?? null;
  },

  async findById(id: number) {
    const row = await db.query.categories.findFirst({
      where: and(
        eq(categories.storeId, DEFAULT_STORE_ID),
        eq(categories.id, id),
      ),
    });
    return row ?? null;
  },

  async existsBySlug(slug: string, excludeId?: number) {
    const row = await db.query.categories.findFirst({
      where: and(
        eq(categories.storeId, DEFAULT_STORE_ID),
        eq(categories.slug, slug),
      ),
      columns: { id: true },
    });
    if (!row) return false;
    if (excludeId && row.id === excludeId) return false;
    return true;
  },

  async create(input: CategoryCreateInput) {
    const baseSlug = input.slug ? toSlug(input.slug) : toSlug(input.name);
    const slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s));

    const [row] = await db
      .insert(categories)
      .values({
        storeId: DEFAULT_STORE_ID,
        name: input.name,
        slug,
        parentId: input.parentId ?? null,
        image: input.image ?? null,
        description: input.description ?? null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        sortOrder: input.sortOrder ?? 0,
        status: input.status ?? true,
      })
      .returning();
    return row;
  },

  async update(id: number, input: CategoryUpdateInput) {
    let slug: string | undefined;
    if (input.slug) {
      const baseSlug = toSlug(input.slug);
      slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s, id));
    }

    const [row] = await db
      .update(categories)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(slug !== undefined && { slug }),
        ...(input.parentId !== undefined && { parentId: input.parentId }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && {
          seoDescription: input.seoDescription,
        }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.status !== undefined && { status: input.status }),
      })
      .where(
        and(eq(categories.storeId, DEFAULT_STORE_ID), eq(categories.id, id)),
      )
      .returning();
    return row ?? null;
  },

  async remove(id: number) {
    const result = await db
      .delete(categories)
      .where(
        and(eq(categories.storeId, DEFAULT_STORE_ID), eq(categories.id, id)),
      )
      .returning({ id: categories.id });
    return result.length > 0;
  },

  async tree() {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.storeId, DEFAULT_STORE_ID))
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    type Node = (typeof rows)[number] & { children: Node[] };
    const map = new Map<number, Node>();
    const roots: Node[] = [];
    for (const r of rows) {
      map.set(r.id, { ...r, children: [] });
    }
    for (const r of rows) {
      const node = map.get(r.id)!;
      if (r.parentId && map.has(r.parentId)) {
        map.get(r.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },
};
