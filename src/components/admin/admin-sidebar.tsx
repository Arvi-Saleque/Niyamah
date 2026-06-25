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
  Layout,
  Undo2,
  ShieldOff,
  Bell,
  Boxes,
  BarChart3,
  ScrollText,
  Menu,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";

import { type PermissionKey } from "@/modules/auth/domain/rbac-catalog";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: PermissionKey;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view" },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "analytics.view" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package, permission: "products.view" },
      { label: "Categories", href: "/admin/categories", icon: Tag, permission: "categories.view" },
      { label: "Brands", href: "/admin/brands", icon: Store, permission: "brands.view" },
      { label: "Inventory", href: "/admin/inventory", icon: Boxes, permission: "inventory.view" },
      { label: "Media", href: "/admin/media", icon: Image, permission: "media.view" },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart, permission: "orders.view" },
      { label: "Returns", href: "/admin/returns", icon: Undo2, permission: "returns.view" },
      { label: "Shipping", href: "/admin/shipping", icon: Truck, permission: "shipping.view" },
    ],
  },
  {
    title: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users, permission: "customers.view" },
      { label: "Reviews", href: "/admin/reviews", icon: Star, permission: "reviews.view" },
      { label: "Blacklist", href: "/admin/blacklist", icon: ShieldOff, permission: "blacklist.view" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: Percent, permission: "coupons.view" },
      { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone, permission: "campaigns.view" },
      { label: "Blog", href: "/admin/blog", icon: BookOpen, permission: "blog.view" },
      { label: "Slider", href: "/admin/slider", icon: SlidersHorizontal, permission: "slider.view" },
      { label: "Homepage", href: "/admin/homepage", icon: Layout, permission: "homepage.view" },
      { label: "Navigation", href: "/admin/navigation", icon: Menu, permission: "navigation.view" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell, permission: "notifications.view" },
      { label: "Audit logs", href: "/admin/audit", icon: ScrollText, permission: "audit.view" },
      { label: "Staff", href: "/admin/staff", icon: Users, permission: "staff.view" },
      { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.view" },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
  permissions?: Set<string> | "all";
}

/** Collapsible left sidebar for the admin panel. */
export function AdminSidebar({ className, permissions = "all" }: AdminSidebarProps) {
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

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => {
            if (permissions === "all") return true;
            if (!item.permission) return true;
            return permissions.has(item.permission);
          });
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-3">
              {!collapsed && (
                <p className="px-4 pb-1 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                  {section.title}
                </p>
              )}
              {visibleItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors",
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
            </div>
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
