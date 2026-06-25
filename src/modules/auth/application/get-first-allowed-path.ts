import type { AdminAccessContext } from "../infrastructure/rbac.repository";

export function getFirstAllowedAdminPath(ctx: AdminAccessContext): string {
  if (ctx.isOwner) return "/admin";

  if (ctx.permissions.has("dashboard.view")) return "/admin";
  if (ctx.permissions.has("orders.view")) return "/admin/orders";
  if (ctx.permissions.has("products.view")) return "/admin/products";
  if (ctx.permissions.has("customers.view")) return "/admin/customers";
  if (ctx.permissions.has("analytics.view")) return "/admin/analytics";
  if (ctx.permissions.has("inventory.view")) return "/admin/inventory";
  if (ctx.permissions.has("returns.view")) return "/admin/returns";
  if (ctx.permissions.has("shipping.view")) return "/admin/shipping";
  if (ctx.permissions.has("reviews.view")) return "/admin/reviews";
  if (ctx.permissions.has("blacklist.view")) return "/admin/blacklist";
  if (ctx.permissions.has("coupons.view")) return "/admin/coupons";
  if (ctx.permissions.has("campaigns.view")) return "/admin/campaigns";
  if (ctx.permissions.has("blog.view")) return "/admin/blog";
  if (ctx.permissions.has("slider.view")) return "/admin/slider";
  if (ctx.permissions.has("homepage.view")) return "/admin/homepage";
  if (ctx.permissions.has("navigation.view")) return "/admin/navigation";
  if (ctx.permissions.has("media.view")) return "/admin/media";
  if (ctx.permissions.has("audit.view")) return "/admin/audit";
  if (ctx.permissions.has("staff.view")) return "/admin/staff";
  if (ctx.permissions.has("settings.view")) return "/admin/settings";

  return "/admin/access-denied";
}
