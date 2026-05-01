import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { Heading, Text } from "@/components/shared/typography";
import { getCurrentUser } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account/orders");

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.userId))
    .orderBy(desc(orders.id))
    .limit(50);

  const myOrders = rows.filter((o) => o.storeId === DEFAULT_STORE_ID);

  return (
    <div>
      <Heading as="h2" size="lg" className="mb-4">
        My Orders
      </Heading>
      {myOrders.length === 0 ? (
        <Text variant="muted">You have no orders yet.</Text>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <Link
              key={o.id}
              href={`/track/${o.id}`}
              className="block rounded-2xl border border-[var(--color-border)] bg-white p-4 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {o.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(Number(o.total))}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {o.status}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
