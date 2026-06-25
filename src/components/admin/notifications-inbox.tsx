"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/admin/empty-state";
import { adminFetch } from "@/lib/admin/api-client";

interface NotificationRow {
  id: number;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
}

interface ListResponse {
  items: NotificationRow[];
  unreadCount: number;
}

const TYPE_LABEL: Record<string, string> = {
  "order.created": "New order",
  "order.confirmed": "Order confirmed",
  "order.cancelled": "Order cancelled",
  "order.shipped": "Order shipped",
  "order.delivered": "Order delivered",
  "return.requested": "Return requested",
  "return.approved": "Return approved",
  "return.rejected": "Return rejected",
  "refund.processed": "Refund processed",
  "stock.low": "Low stock",
};

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationsInbox() {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    const url = `/api/v1/notifications?limit=50${filter === "unread" ? "&unread=1" : ""}`;
    const r = await adminFetch<ListResponse>(url, { toastOnError: false });
    if (r.ok && r.data) {
      setItems(r.data.items);
      setUnread(r.data.unreadCount);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void (async () => { await load(); })();
  }, [load]);

  const markOne = async (id: number) => {
    const r = await adminFetch(`/api/v1/notifications/${id}`, { method: "PATCH" });
    if (r.ok) {
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnread((c) => Math.max(0, c - 1));
    }
  };

  const markAll = async () => {
    const r = await adminFetch<{ updated: number }>("/api/v1/notifications", {
      method: "PATCH",
      successMessage: "All marked as read.",
    });
    if (r.ok) {
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    }
  };

  const remove = async (id: number) => {
    const r = await adminFetch(`/api/v1/notifications/${id}`, {
      method: "DELETE",
    });
    if (r.ok) setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              filter === "all"
                ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              filter === "unread"
                ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
            }`}
          >
            Unread {unread > 0 && `(${unread})`}
          </button>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
          description="System events will appear here as they happen."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 ${
                n.read
                  ? "border-[var(--color-border)] bg-white"
                  : "border-[var(--color-accent)]/40 bg-[var(--color-accent-light)]/40"
              }`}
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-alt)]">
                <Bell className="h-4 w-4 text-[var(--color-text-secondary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{n.title}</p>
                  <span className="shrink-0 rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                    {TYPE_LABEL[n.type] ?? n.type}
                  </span>
                </div>
                {n.body && (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {n.body}
                  </p>
                )}
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Mark as read"
                    onClick={() => markOne(n.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  className="text-[var(--color-error)] hover:text-[var(--color-error)]"
                  onClick={() => remove(n.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
