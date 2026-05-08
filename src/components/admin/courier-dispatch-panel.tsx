"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin/api-client";
import { formatCurrency } from "@/lib/utils";

interface CourierDispatchPanelProps {
  orderId: number;
  codAmount: number;
}

const COURIERS = [
  { value: "steadfast", label: "Steadfast" },
  { value: "pathao", label: "Pathao (manual record)" },
  { value: "redx", label: "RedX (manual record)" },
  { value: "sundarban", label: "Sundarban (manual record)" },
  { value: "manual", label: "Manual / other" },
] as const;

/** Dispatch the order to a courier and move it to SHIPPED. */
export function CourierDispatchPanel({
  orderId,
  codAmount,
}: CourierDispatchPanelProps) {
  const router = useRouter();
  const [courier, setCourier] = useState<string>("steadfast");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const dispatch = async () => {
    setBusy(true);
    const r = await adminFetch(`/api/v1/admin/orders/${orderId}/courier`, {
      method: "POST",
      body: { courier, note: note.trim() || undefined },
      successMessage: "Dispatched to courier.",
    });
    setBusy(false);
    if (r.ok) router.refresh();
  };

  return (
    <section className="rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-light)]/30 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Truck className="h-4 w-4 text-[var(--color-accent-dark)]" />
        <h2 className="font-semibold">Dispatch courier</h2>
      </div>
      <div className="space-y-3">
        <div>
          <Label>Courier</Label>
          <Select value={courier} onValueChange={setCourier}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURIERS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {codAmount > 0 && (
          <p className="rounded-md bg-white/60 px-2 py-1 text-xs text-[var(--color-text-secondary)]">
            COD amount to collect:{" "}
            <span className="font-medium">{formatCurrency(codAmount)}</span>
          </p>
        )}
        <div>
          <Label htmlFor="dispatch-note">Note (optional)</Label>
          <Textarea
            id="dispatch-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-1"
            placeholder="Special handling instructions…"
          />
        </div>
        <Button onClick={dispatch} disabled={busy} className="w-full">
          {busy ? "Dispatching…" : "Dispatch & mark shipped"}
        </Button>
      </div>
    </section>
  );
}
