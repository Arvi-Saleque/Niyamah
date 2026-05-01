import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(categories.id));

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Categories
      </h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-alt)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No categories yet.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3">{c.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">{c.status ? "Active" : "Hidden"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
