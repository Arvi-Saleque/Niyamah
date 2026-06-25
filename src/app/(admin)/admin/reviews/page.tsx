"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { RatingStars } from "@/components/shared/rating-stars";
import { StatusBadge } from "@/components/shared/status-badge";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

interface AdminReview {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  status: ReviewStatus;
  createdAt: string;
  productName?: string | null;
  productId?: number;
  userName?: string | null;
}

const TABS: { label: string; value: "ALL" | ReviewStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<"ALL" | ReviewStatus>("PENDING");
  const [rows, setRows] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const url =
        tab === "ALL"
          ? "/api/v1/admin/reviews?limit=100"
          : `/api/v1/admin/reviews?limit=100&status=${tab}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      const data = json?.data ?? json;
      const list: AdminReview[] = Array.isArray(data)
        ? data
        : (data?.items ?? data?.rows ?? []);
      setRows(list);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await load(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const moderate = async (id: number, status: ReviewStatus) => {
    const res = await fetch(`/api/v1/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success(`Review ${status.toLowerCase()}`);
    void (async () => { await load(); })();
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/v1/admin/reviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Review deleted");
    void (async () => { await load(); })();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Reviews
        </h1>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.value
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState title="No reviews" description="Nothing to moderate here." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{r.productName ?? "—"}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <RatingStars rating={r.rating} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>

              {r.title && <div className="font-medium">{r.title}</div>}
              {r.body && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {r.body}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {r.status !== "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => moderate(r.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                )}
                {r.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moderate(r.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                )}
                {r.status !== "PENDING" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moderate(r.id, "PENDING")}
                  >
                    Reset to pending
                  </Button>
                )}
                <ConfirmDialog
                  trigger={
                    <Button size="sm" variant="ghost" className="text-red-600">
                      Delete
                    </Button>
                  }
                  title="Delete review?"
                  description="This action cannot be undone."
                  confirmLabel="Delete"
                  destructive
                  onConfirm={() => remove(r.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
