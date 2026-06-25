import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventory, productVariants, products } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { EmptyState } from "@/components/shared/empty-state";
import { InventoryRow } from "@/components/admin/inventory-row";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
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
    .where(eq(inventory.storeId, DEFAULT_STORE_ID))
    .orderBy(asc(inventory.stockAvailable));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Inventory
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Adjust stock levels and low-stock thresholds for product variants.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No inventory yet"
          description="Inventory rows are created when product variants are added."
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
