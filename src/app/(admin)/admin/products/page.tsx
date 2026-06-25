import Link from "next/link";
import Image from "next/image";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { Plus, Package } from "lucide-react";
import { db } from "@/lib/db";
import { products, categories, productImages } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TABS = ["all", "draft", "published", "archived"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const statusLower = (sp.status ?? "all").toLowerCase();
  const status: StatusTab = STATUS_TABS.includes(statusLower as StatusTab)
    ? (statusLower as StatusTab)
    : "all";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const limit = 25;
  const offset = (page - 1) * limit;

  const where = [eq(products.storeId, DEFAULT_STORE_ID)];
  if (status !== "all") {
    where.push(eq(products.status, status as (typeof products.$inferSelect)["status"]));
  }
  if (q) where.push(ilike(products.name, `%${q}%`));

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        status: products.status,
        featured: products.featured,
        categoryName: categories.name,
        thumbnailUrl: sql<string | null>`(
          SELECT ${productImages.url} FROM ${productImages}
          WHERE ${productImages.productId} = ${products.id}
          ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC
          LIMIT 1
        )`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...where))
      .orderBy(desc(products.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(products)
      .where(and(...where)),
  ]);

  const total = Number(totalRow[0]?.c ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const buildHref = (next: { status?: StatusTab; q?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    if (s !== "all") params.set("status", s);
    const term = next.q ?? q;
    if (term) params.set("q", term);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    return `/admin/products${params.toString() ? `?${params}` : ""}`;
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${total} product${total === 1 ? "" : "s"} in catalog.`}
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-1 h-4 w-4" /> New product
            </Link>
          </Button>
        }
      />

      <form action="/admin/products" method="get" className="mb-3">
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <Input
          name="q"
          placeholder="Search products by name…"
          defaultValue={q}
          className="max-w-md"
        />
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: s, page: 1 })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === s
                ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products match"
          description={
            q
              ? "Try a different search term or status."
              : "Create your first product to start selling."
          }
          action={
            !q ? (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-1 h-4 w-4" /> New product
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-alt)]">
                        {r.thumbnailUrl ? (
                          <Image
                            src={r.thumbnailUrl}
                            alt={r.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <Package className="absolute inset-0 m-auto h-4 w-4 text-[var(--color-text-muted)]" />
                        )}
                      </div>
                      <Link
                        href={`/admin/products/${r.id}`}
                        className="font-medium hover:text-[var(--color-accent)]"
                      >
                        {r.name}
                      </Link>
                      {r.featured && (
                        <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {r.categoryName ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.salePrice ? (
                      <>
                        <span className="font-medium">{formatCurrency(Number(r.salePrice))}</span>
                        <span className="ml-1 text-xs text-[var(--color-text-muted)] line-through">
                          {formatCurrency(Number(r.price))}
                        </span>
                      </>
                    ) : (
                      formatCurrency(Number(r.price))
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-[var(--color-text-muted)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 hover:bg-[var(--color-surface-alt)]"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildHref({ page: page + 1 })}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 hover:bg-[var(--color-surface-alt)]"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
