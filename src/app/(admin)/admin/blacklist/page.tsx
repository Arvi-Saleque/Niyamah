import { blacklistRepository } from "@/modules/commerce/infrastructure/blacklist.repository";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { ShieldOff } from "lucide-react";
import { BlacklistAddDialog } from "@/components/admin/blacklist-add-dialog";
import { BlacklistRemoveButton } from "@/components/admin/blacklist-remove-button";

export const dynamic = "force-dynamic";

const REASON_LABELS: Record<string, string> = {
  REPEATED_REFUSAL: "Repeated COD refusal",
  FAKE_ORDERS: "Fake orders",
  FRAUD: "Fraud",
  ABUSE: "Abuse",
  OTHER: "Other",
};

export default async function AdminBlacklistPage() {
  const items = await blacklistRepository.list();

  return (
    <div>
      <PageHeader
        title="COD Blacklist"
        description="Phone numbers and emails blocked from placing cash-on-delivery orders."
        actions={<BlacklistAddDialog />}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={ShieldOff}
          title="No one is blacklisted"
          description="Add a phone or email to prevent COD orders from problem customers."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="w-1 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    {row.phone && <div className="font-medium">{row.phone}</div>}
                    {row.email && (
                      <div className="text-[var(--color-text-secondary)]">{row.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">{REASON_LABELS[row.reason] ?? row.reason}</td>
                  <td className="max-w-md truncate px-4 py-3 text-[var(--color-text-muted)]">
                    {row.note ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BlacklistRemoveButton id={row.id} />
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
