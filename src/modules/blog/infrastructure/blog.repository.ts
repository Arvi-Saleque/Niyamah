import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogPostTags,
  users,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  BlogCategoryCreateInput,
  BlogTagCreateInput,
  BlogPostCreateInput,
  BlogPostUpdateInput,
} from "@/lib/validations/marketing";

export class BlogError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "BlogError";
  }
}

export const blogRepository = {
  // ── Categories ─────────────────────────────
  async listCategories() {
    return db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.storeId, DEFAULT_STORE_ID))
      .orderBy(blogCategories.name);
  },
  async createCategory(input: BlogCategoryCreateInput) {
    const [exists] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(
        and(
          eq(blogCategories.storeId, DEFAULT_STORE_ID),
          eq(blogCategories.slug, input.slug),
        ),
      )
      .limit(1);
    if (exists) throw new BlogError("SLUG_TAKEN", "Category slug exists.");
    const [row] = await db
      .insert(blogCategories)
      .values({ storeId: DEFAULT_STORE_ID, ...input })
      .returning();
    return row;
  },

  // ── Tags ────────────────────────────────────
  async listTags() {
    return db
      .select()
      .from(blogTags)
      .where(eq(blogTags.storeId, DEFAULT_STORE_ID))
      .orderBy(blogTags.name);
  },
  async createTag(input: BlogTagCreateInput) {
    const [exists] = await db
      .select({ id: blogTags.id })
      .from(blogTags)
      .where(
        and(
          eq(blogTags.storeId, DEFAULT_STORE_ID),
          eq(blogTags.slug, input.slug),
        ),
      )
      .limit(1);
    if (exists) throw new BlogError("SLUG_TAKEN", "Tag slug exists.");
    const [row] = await db
      .insert(blogTags)
      .values({ storeId: DEFAULT_STORE_ID, ...input })
      .returning();
    return row;
  },

  // ── Posts ───────────────────────────────────
  async listPosts(opts: {
    page?: number;
    limit?: number;
    status?: "draft" | "published" | "scheduled" | "archived";
    categorySlug?: string;
    tagSlug?: string;
  } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 12;

    const conds = [eq(blogPosts.storeId, DEFAULT_STORE_ID)];
    if (opts.status) conds.push(eq(blogPosts.status, opts.status));
    if (opts.categorySlug) {
      const [cat] = await db
        .select({ id: blogCategories.id })
        .from(blogCategories)
        .where(
          and(
            eq(blogCategories.storeId, DEFAULT_STORE_ID),
            eq(blogCategories.slug, opts.categorySlug),
          ),
        )
        .limit(1);
      if (!cat) return { items: [], page, limit, total: 0 };
      conds.push(eq(blogPosts.categoryId, cat.id));
    }

    let postIdFilter: number[] | null = null;
    if (opts.tagSlug) {
      const [tag] = await db
        .select({ id: blogTags.id })
        .from(blogTags)
        .where(
          and(
            eq(blogTags.storeId, DEFAULT_STORE_ID),
            eq(blogTags.slug, opts.tagSlug),
          ),
        )
        .limit(1);
      if (!tag) return { items: [], page, limit, total: 0 };
      const tagged = await db
        .select({ postId: blogPostTags.postId })
        .from(blogPostTags)
        .where(eq(blogPostTags.tagId, tag.id));
      postIdFilter = tagged.map((t) => t.postId);
      if (postIdFilter.length === 0)
        return { items: [], page, limit, total: 0 };
      conds.push(inArray(blogPosts.id, postIdFilter));
    }

    const totalRows = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(and(...conds));
    const total = totalRows[0]?.c ?? 0;

    const items = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        publishedAt: blogPosts.publishedAt,
        status: blogPosts.status,
        categoryId: blogPosts.categoryId,
        authorName: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(and(...conds))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.id))
      .limit(limit)
      .offset((page - 1) * limit);

    return { items, page, limit, total };
  },

  async findPostBySlug(slug: string) {
    const [row] = await db
      .select({
        post: blogPosts,
        author: { id: users.id, name: users.name },
        category: blogCategories,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(
        and(
          eq(blogPosts.storeId, DEFAULT_STORE_ID),
          eq(blogPosts.slug, slug),
        ),
      )
      .limit(1);
    if (!row) return null;

    const tagRows = await db
      .select({ tag: blogTags })
      .from(blogPostTags)
      .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
      .where(eq(blogPostTags.postId, row.post.id));

    return {
      ...row.post,
      author: row.author,
      category: row.category,
      tags: tagRows.map((t) => t.tag),
    };
  },

  async findPostById(id: number) {
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(
        and(eq(blogPosts.storeId, DEFAULT_STORE_ID), eq(blogPosts.id, id)),
      )
      .limit(1);
    return row ?? null;
  },

  async createPost(input: BlogPostCreateInput, authorId: string) {
    const exists = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.storeId, DEFAULT_STORE_ID),
          eq(blogPosts.slug, input.slug),
        ),
      )
      .limit(1);
    if (exists.length > 0)
      throw new BlogError("SLUG_TAKEN", "Post slug exists.");

    return db.transaction(async (tx) => {
      const [post] = await tx
        .insert(blogPosts)
        .values({
          storeId: DEFAULT_STORE_ID,
          authorId,
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt ?? null,
          content: input.content,
          featuredImage: input.featuredImage ?? null,
          categoryId: input.categoryId ?? null,
          status: input.status,
          publishedAt:
            input.publishedAt
              ? new Date(input.publishedAt)
              : input.status === "published"
                ? new Date()
                : null,
          seoTitle: input.seoTitle ?? null,
          seoDescription: input.seoDescription ?? null,
          ogImage: input.ogImage ?? null,
        })
        .returning();
      if (!post) throw new BlogError("CREATE_FAILED", "Insert failed.");

      if (input.tagIds.length > 0) {
        await tx
          .insert(blogPostTags)
          .values(input.tagIds.map((tagId) => ({ postId: post.id, tagId })));
      }
      return post;
    });
  },

  async updatePost(id: number, input: BlogPostUpdateInput) {
    const existing = await this.findPostById(id);
    if (!existing) return null;

    return db.transaction(async (tx) => {
      const [updated] = await tx
        .update(blogPosts)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
          ...(input.content !== undefined && { content: input.content }),
          ...(input.featuredImage !== undefined && { featuredImage: input.featuredImage }),
          ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.publishedAt !== undefined && {
            publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
          }),
          ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
          ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
          ...(input.ogImage !== undefined && { ogImage: input.ogImage }),
        })
        .where(eq(blogPosts.id, id))
        .returning();

      if (input.tagIds !== undefined) {
        await tx.delete(blogPostTags).where(eq(blogPostTags.postId, id));
        if (input.tagIds.length > 0) {
          await tx
            .insert(blogPostTags)
            .values(input.tagIds.map((tagId) => ({ postId: id, tagId })));
        }
      }
      return updated ?? null;
    });
  },

  async deletePost(id: number) {
    const result = await db
      .delete(blogPosts)
      .where(and(eq(blogPosts.storeId, DEFAULT_STORE_ID), eq(blogPosts.id, id)))
      .returning({ id: blogPosts.id });
    return result.length > 0;
  },

  async listPublishedSlugs() {
    return db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.storeId, DEFAULT_STORE_ID),
          eq(blogPosts.status, "published"),
        ),
      );
  },
};
