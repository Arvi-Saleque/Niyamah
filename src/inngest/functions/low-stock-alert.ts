import { and, eq, inArray } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import {
  inventory,
  productVariants,
  products,
  storeSettings,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { sendLowStockAdminEmail } from "@/lib/resend";
import { createNotification } from "@/lib/notifications/notification-repository";

/**
 * Low stock alert — runs after every order is created.
 *
 * For each variant in the order, checks if stockAvailable has dropped
 * to or below its lowStockThreshold. If so, emails the store contact
 * email and creates an in-app notification (broadcast — userId=null).
 */
export const lowStockAlert = inngest.createFunction(
  {
    id: "low-stock-alert",
    name: "Low stock alert",
    triggers: [{ event: "commerce/order.created" }],
  },
  async ({ event, step }) => {
    const { items } = event.data as {
      items?: Array<{ id: number; quantity: number; price: number }>;
    };
    if (!items || items.length === 0) return { skipped: "no_items" };

    const variantIds = items.map((i) => i.id).filter((id) => id > 0);
    if (variantIds.length === 0) return { skipped: "no_variants" };

    const lowRows = await step.run("find-low-stock", async () => {
      return db
        .select({
          variantId: inventory.variantId,
          stockAvailable: inventory.stockAvailable,
          lowStockThreshold: inventory.lowStockThreshold,
          productName: products.name,
          sku: productVariants.sku,
        })
        .from(inventory)
        .innerJoin(
          productVariants,
          eq(productVariants.id, inventory.variantId),
        )
        .innerJoin(products, eq(products.id, productVariants.productId))
        .where(
          and(
            eq(inventory.storeId, DEFAULT_STORE_ID),
            eq(inventory.trackStock, true),
            inArray(inventory.variantId, variantIds),
          ),
        );
    });

    const triggered = lowRows.filter(
      (r) => r.stockAvailable <= r.lowStockThreshold,
    );
    if (triggered.length === 0) return { lowCount: 0 };

    const adminEmail = await step.run("resolve-admin-email", async () => {
      const settings = await db
        .select({ email: storeSettings.contactEmail })
        .from(storeSettings)
        .where(eq(storeSettings.storeId, DEFAULT_STORE_ID))
        .limit(1);
      return (
        settings[0]?.email ??
        process.env.LOW_STOCK_ALERT_EMAIL ??
        process.env.HIGH_RISK_ALERT_EMAIL ??
        null
      );
    });

    for (const row of triggered) {
      // Debounced send per variant — avoids spamming on repeat orders.
      await step.run(`alert-${row.variantId}`, async () => {
        if (adminEmail) {
          await sendLowStockAdminEmail({
            to: adminEmail,
            productName: row.productName,
            sku: row.sku,
            stockAvailable: row.stockAvailable,
            threshold: row.lowStockThreshold,
          });
        }
        await createNotification({
          userId: null,
          type: "inventory.low_stock",
          title: `Low stock: ${row.productName}`,
          body: `Only ${row.stockAvailable} left (threshold ${row.lowStockThreshold}).`,
        });
      });
    }

    return { lowCount: triggered.length };
  },
);
