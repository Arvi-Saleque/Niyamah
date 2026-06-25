import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventory, productVariants, products } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { InventoryRow } from "@/components/admin/inventory-row";

export const dynamic = "force-dynamic";

export default async function AdminLowStockPage() {
  const rows = await db
    .select({
      id: inventory.id,
      variantId: inventory.variantId,
      stockOnHand: inventory.stockOnHand,
      stockReserved: inventory.stockReserved,
      stockAvailable: inventory.stockAvailable,
      lowStockThreshold: inventory.lowStockThreshold,
      trackStock: inventory.trackStock,
      sku: productVariants.sku,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .where(
      and(
        eq(inventory.storeId, DEFAULT_STORE_ID),
        eq(inventory.trackStock, true),
        sql`${inventory.stockAvailable} <= ${inventory.lowStockThreshold}`,
      ),
    )
    .orderBy(sql`${inventory.stockAvailable} asc`);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3">
        <Link href="/admin/inventory">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to inventory
        </Link>
      </Button>

      <PageHeader title="Low stock" description="Variants at or below their low-stock threshold." />

      {rows.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="All stock healthy"
          description="No tracked variants are currently below threshold."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">On hand</th>
                <th className="px-4 py-3 font-medium">Reserved</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Low stock at</th>
                <th className="px-4 py-3 font-medium">Tracked</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <InventoryRow
                  key={r.id}
                  id={r.id}
                  productName={r.productName}
                  sku={r.sku}
                  stockOnHand={r.stockOnHand}
                  stockReserved={r.stockReserved}
                  stockAvailable={r.stockAvailable}
                  lowStockThreshold={r.lowStockThreshold}
                  trackStock={r.trackStock}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
