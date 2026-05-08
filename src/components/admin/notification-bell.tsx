"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body?: string | null;
  createdAt: string | Date;
  read: boolean;
}

const POLL_MS = 60000;

function timeAgo(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

/** Bell icon with live unread badge + 5 most recent notifications dropdown. */
export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);

  const refresh = async () => {
    try {
      const res = await fetch("/api/v1/notifications?limit=5", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = (await res.json()) as {
        success: boolean;
        data: { items: NotificationItem[]; unreadCount: number };
      };
      if (json.success) {
        setItems(json.data.items ?? []);
        setUnread(
          json.data.unreadCount ??
            json.data.items.filter((n) => !n.read).length,
        );
      }
    } catch {
      /* network blip; try again next tick */
    }
  };

  useEffect(() => {
    void refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-error)] px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unread > 0 && (
            <span className="text-xs font-normal text-[var(--color-text-muted)]">
              {unread} unread
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">
            You&apos;re all caught up.
          </p>
        ) : (
          items.map((n) => {
            const content = (
              <div className="flex w-full flex-col gap-0.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-tight">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span
                      aria-hidden
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                    />
                  )}
                </div>
                {n.body && (
                  <span className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {n.body}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
            );
            return (
              <DropdownMenuItem
                key={n.id}
                asChild
                className="cursor-pointer items-start gap-0"
              >
                <Link href="/admin/notifications">{content}</Link>
              </DropdownMenuItem>
            );
          })
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-[var(--color-accent)]"
          >
            View all
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
