"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Megaphone,
  Image,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  BookOpen,
  Truck,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Inventory", href: "/admin/inventory", icon: Store },
  { label: "Coupons", href: "/admin/coupons", icon: Percent },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  className?: string;
}

/** Collapsible left sidebar for the admin panel. */
export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-4">
        {collapsed ? (
          <Logo variant="image" imageSize={28} href="/admin" />
        ) : (
          <Logo variant="both" href="/admin" />
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center border-t border-[var(--color-border)] py-3 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
