"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin/api-client";

interface ReturnReviewActionsProps {
  returnId: number;
  suggestedRefund: number;
}

/** Approve / Reject action panel for a pending return request. */
export function ReturnReviewActions({
  returnId,
  suggestedRefund,
}: ReturnReviewActionsProps) {
  const router = useRouter();
  const [refundAmount, setRefundAmount] = useState<string>(
    suggestedRefund.toFixed(2),
  );
  const [adminNote, setAdminNote] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  const submit = async (status: "APPROVED" | "REJECTED") => {
    setBusy(status === "APPROVED" ? "approve" : "reject");
    const body: Record<string, unknown> = {
      status,
      adminNote: adminNote.trim() || undefined,
    };
    if (status === "APPROVED") {
      body.refundAmount = Number(refundAmount);
    }
    const result = await adminFetch(`/api/v1/admin/returns/${returnId}`, {
      method: "PATCH",
      body,
      successMessage:
        status === "APPROVED" ? "Return approved & refunded." : "Return rejected.",
    });
    setBusy(null);
    if (result.ok) router.refresh();
  };

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <h2 className="mb-4 font-semibold">Review</h2>
      <div className="space-y-3">
        <div>
          <Label htmlFor="refund">Refund amount</Label>
          <Input
            id="refund"
            type="number"
            min={0}
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Required when approving.
          </p>
        </div>
        <div>
          <Label htmlFor="note">Admin note (optional)</Label>
          <Textarea
            id="note"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className="mt-1"
            placeholder="Internal note shown to customer…"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => submit("APPROVED")}
            disabled={busy !== null}
            className="flex-1"
          >
            {busy === "approve" ? "Approving…" : "Approve & refund"}
          </Button>
          <Button
            variant="outline"
            onClick={() => submit("REJECTED")}
            disabled={busy !== null}
            className="flex-1"
          >
            {busy === "reject" ? "Rejecting…" : "Reject"}
          </Button>
        </div>
      </div>
    </section>
  );
}
