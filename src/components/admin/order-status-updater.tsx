"use client";

import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
  className?: string;
}

/** Admin order detail widget for changing order status with optimistic UI. */
export function OrderStatusUpdater({ orderId, currentStatus, onUpdate, className }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(orderId, status);
    setLoading(false);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <StatusBadge status={status} />
      <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={handleSave} disabled={loading || status === currentStatus} className="h-8 bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
        {loading ? "…" : "Update"}
      </Button>
    </div>
  );
}
