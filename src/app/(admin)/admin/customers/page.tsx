import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      verified: users.verified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "customer"))
    .orderBy(desc(users.createdAt))
    .limit(100);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
        Customers
      </h1>
      {rows.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customer accounts will appear here when users register."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Verified</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="hover:text-[var(--color-accent)]"
                    >
                      {c.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.email}</td>
                  <td className="px-4 py-3">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3">{c.verified ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.createdAt.toLocaleDateString()}
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
