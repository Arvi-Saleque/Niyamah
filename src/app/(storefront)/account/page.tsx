import Link from "next/link";
import { Heading, Text } from "@/components/shared/typography";

export default function AccountOverviewPage() {
  return (
    <div className="space-y-4">
      <Heading as="h2" size="lg">
        Overview
      </Heading>
      <Text variant="muted">
        Manage your orders, saved items, addresses, and account information from
        the side menu.
      </Text>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 hover:shadow-md"
        >
          <div className="font-semibold">Recent orders</div>
          <Text variant="muted" className="mt-1 text-sm">
            View status, invoices, and tracking.
          </Text>
        </Link>
        <Link
          href="/account/wishlist"
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 hover:shadow-md"
        >
          <div className="font-semibold">Wishlist</div>
          <Text variant="muted" className="mt-1 text-sm">
            Items you saved for later.
          </Text>
        </Link>
      </div>
    </div>
  );
}
