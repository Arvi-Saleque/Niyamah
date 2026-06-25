import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(blogPosts.id))
    .limit(100);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Blog Posts
        </h1>
        <Button asChild>
          <Link href="/admin/blog/new">+ New post</Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Write your first blog post to share with customers."
          action={
            <Button asChild>
              <Link href="/admin/blog/new">Create post</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/blog/${p.id}`} className="hover:text-[var(--color-accent)]">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{p.slug}</td>
                  <td className="px-4 py-3 uppercase">{p.status}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {p.publishedAt?.toLocaleDateString() ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
