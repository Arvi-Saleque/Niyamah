"use client";

import { useState } from "react";
import { Bell, ShoppingCart, Package, Tag, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

export interface NotificationItem {
  id: string;
  type: "order" | "product" | "coupon" | "info";
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const TypeIcon = { order: ShoppingCart, product: Package, coupon: Tag, info: Info };

/** Admin topbar notification bell with unread count and dropdown panel. */
export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold">Notifications</span>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-[var(--color-accent)]" onClick={onMarkAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">No notifications</p>
          ) : (
            notifications.map((n) => {
              const Icon = TypeIcon[n.type];
              return (
                <button
                  key={n.id}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-alt)] transition-colors",
                    !n.isRead && "bg-[var(--color-accent)]/5",
                  )}
                  onClick={() => { onMarkRead(n.id); }}
                >
                  <div className="mt-0.5 rounded-lg bg-[var(--color-accent)]/10 p-1.5 shrink-0">
                    <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                      {new Date(n.createdAt).toLocaleString("en-BD")}
                    </p>
                  </div>
                  {!n.isRead && <Badge variant="secondary" className="mt-1 shrink-0 text-[10px] h-4">New</Badge>}
                </button>
              );
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
