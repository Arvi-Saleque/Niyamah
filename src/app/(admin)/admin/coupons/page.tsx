"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { CouponForm, type CouponFormValues } from "@/components/admin/coupon-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

interface Coupon {
  id: number;
  code: string;
  type: string;
  value: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
}

const TYPE_TO_API: Record<string, "PERCENTAGE" | "FLAT"> = {
  percentage: "PERCENTAGE",
  fixed: "FLAT",
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/coupons");
    const json = await res.json();
    if (res.ok) setItems(json.data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    async function fetchCoupons() {
      try {
        const res = await fetch("/api/v1/admin/coupons", {
          signal: controller.signal,
        });
        const json = await res.json();
        if (disposed) return;
        if (res.ok) setItems(json.data?.items ?? []);
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        toast.error("Failed to load coupons");
      } finally {
        if (!disposed) setLoading(false);
      }
    }

    void fetchCoupons();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, []);

  const onSubmit = async (values: CouponFormValues) => {
    const payload = {
      code: values.code,
      type: TYPE_TO_API[values.type] ?? "FLAT",
      value: values.value,
      ...(values.minOrderAmount !== undefined && {
        minOrderAmount: values.minOrderAmount,
      }),
      ...(values.maxUsage !== undefined && { usageLimit: values.maxUsage }),
      ...(values.expiresAt && { endDate: new Date(values.expiresAt) }),
      status: values.isActive ? "active" : "inactive",
    };
    const res = await fetch("/api/v1/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to create coupon");
      return;
    }
    toast.success("Coupon created");
    setOpen(false);
    load();
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/v1/admin/coupons/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Coupon deleted");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Coupons
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" /> New coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New coupon</DialogTitle>
            </DialogHeader>
            <CouponForm onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[var(--color-text-muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No coupons yet"
          description="Create promotional discount codes for your customers."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Limit</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">{c.value}</td>
                  <td className="px-4 py-3">{c.usageLimit ?? "—"}</td>
                  <td className="px-4 py-3">{c.status ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <ConfirmDialog
                        trigger={
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete coupon?"
                        description={`Permanently remove "${c.code}".`}
                        confirmLabel="Delete"
                        destructive
                        onConfirm={() => onDelete(c.id)}
                      />
                    </div>
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
