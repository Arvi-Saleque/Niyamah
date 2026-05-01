import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const rows = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(campaigns.id))
    .limit(100);

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Campaigns
      </h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-alt)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Starts</th>
              <th className="px-4 py-3 font-medium">Ends</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No campaigns yet.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3 uppercase">{c.status}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.startsAt?.toLocaleDateString() ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.endsAt?.toLocaleDateString() ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
