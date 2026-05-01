"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

interface AdminOrderActionsProps {
  orderId: string;
  currentStatus: string;
}

const TO_LOWER_MAP: Record<
  string,
  "pending" | "processing" | "shipped" | "delivered" | "cancelled"
> = {
  PENDING: "pending",
  CONFIRMED: "processing",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "cancelled",
  REFUNDED: "cancelled",
};

const TO_UPPER_MAP: Record<string, string> = {
  pending: "PENDING",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

/** Client-side wrapper around OrderStatusUpdater that calls the admin status API. */
export function AdminOrderActions({
  orderId,
  currentStatus,
}: AdminOrderActionsProps) {
  const router = useRouter();
  const lower = TO_LOWER_MAP[currentStatus] ?? "pending";

  const onUpdate = async (id: string, next: string) => {
    const apiStatus = TO_UPPER_MAP[next];
    const res = await fetch(`/api/v1/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: apiStatus }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to update status");
      return;
    }
    toast.success("Status updated");
    router.refresh();
  };

  return (
    <OrderStatusUpdater
      orderId={orderId}
      currentStatus={lower}
      onUpdate={onUpdate}
    />
  );
}
