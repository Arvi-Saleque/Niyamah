import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews, products } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      status: reviews.status,
      createdAt: reviews.createdAt,
      productName: products.name,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(reviews.id))
    .limit(100);

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Reviews
      </h1>
      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-[var(--color-text-secondary)]">No reviews yet.</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{r.productName ?? "—"}</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs uppercase">
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                ★ {r.rating} — {r.title ?? "(no title)"}
              </div>
              {r.body && <p className="mt-2 text-sm">{r.body}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
