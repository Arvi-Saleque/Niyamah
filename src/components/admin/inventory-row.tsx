"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Props {
  id: number;
  productName: string | null;
  sku: string | null;
  stockOnHand: number;
  stockReserved: number;
  stockAvailable: number;
  lowStockThreshold: number;
  trackStock: boolean;
}

export function InventoryRow(props: Props) {
  const [onHand, setOnHand] = useState(props.stockOnHand);
  const [threshold, setThreshold] = useState(props.lowStockThreshold);
  const [tracked, setTracked] = useState(props.trackStock);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(props.stockAvailable);

  const dirty =
    onHand !== props.stockOnHand ||
    threshold !== props.lowStockThreshold ||
    tracked !== props.trackStock;

  const isLow = available <= threshold;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/inventory/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockOnHand: onHand,
          lowStockThreshold: threshold,
          trackStock: tracked,
        }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const data = json?.data ?? json;
      if (typeof data?.stockAvailable === "number") {
        setAvailable(data.stockAvailable);
      } else {
        setAvailable(Math.max(0, onHand - props.stockReserved));
      }
      toast.success("Inventory updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-t border-[var(--color-border)]">
      <td className="px-4 py-3 font-medium">{props.productName ?? "—"}</td>
      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
        {props.sku ?? "—"}
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min={0}
          value={onHand}
          onChange={(e) => setOnHand(Number(e.target.value))}
          className="w-24"
        />
      </td>
      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
        {props.stockReserved}
      </td>
      <td className={`px-4 py-3 font-medium ${isLow ? "text-red-600" : ""}`}>
        {available}
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-20"
        />
      </td>
      <td className="px-4 py-3">
        <Switch checked={tracked} onCheckedChange={setTracked} />
      </td>
      <td className="px-4 py-3">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </td>
    </tr>
  );
}
