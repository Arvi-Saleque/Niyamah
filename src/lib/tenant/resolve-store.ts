import { headers } from "next/headers";
import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

/**
 * Resolve the active storeId from request context. Looks at:
 *   1. ``x-store-id`` header (set by middleware in multi-tenant deployments)
 *   2. ``host`` header — match against ``stores.domain``
 *   3. Falls back to ``DEFAULT_STORE_ID``
 *
 * Returns the numeric storeId. Safe to call from server components and route
 * handlers.
 */
export async function resolveStoreId(): Promise<number> {
  try {
    const h = await headers();

    const explicit = h.get("x-store-id");
    if (explicit && /^\d+$/.test(explicit)) {
      return Number(explicit);
    }

    const host = h.get("host");
    if (host) {
      const cleanHost = host.split(":")[0];
      if (cleanHost && cleanHost !== "localhost") {
        const [row] = await db
          .select({ id: stores.id })
          .from(stores)
          .where(eq(stores.domain, cleanHost))
          .limit(1);
        if (row) return row.id;
      }
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_STORE_ID;
}
