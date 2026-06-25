export const PERMISSIONS = [
  { key: "admin.access", label: "Base Admin Access", description: "Base admin access" },
  { key: "dashboard.view", label: "View Dashboard", description: "View dashboard metrics" },
  { key: "analytics.view", label: "View Analytics", description: "View detailed analytics" },
  { key: "products.view", label: "View Products", description: "View products" },
  { key: "products.manage", label: "Manage Products", description: "Manage products" },
  { key: "categories.view", label: "View Categories", description: "View categories" },
  { key: "categories.manage", label: "Manage Categories", description: "Manage categories" },
  { key: "brands.view", label: "View Brands", description: "View brands" },
  { key: "brands.manage", label: "Manage Brands", description: "Manage brands" },
  { key: "inventory.view", label: "View Inventory", description: "View inventory" },
  { key: "inventory.adjust", label: "Adjust Inventory", description: "Adjust inventory levels" },
  { key: "media.view", label: "View Media", description: "View media library" },
  { key: "media.manage", label: "Manage Media", description: "Manage media library" },
  { key: "orders.view", label: "View Orders", description: "View orders" },
  { key: "orders.update_status", label: "Update Order Status", description: "Update order statuses" },
  { key: "orders.dispatch", label: "Dispatch Orders", description: "Dispatch orders via courier" },
  { key: "returns.view", label: "View Returns", description: "View return requests" },
  { key: "returns.manage", label: "Manage Returns", description: "Manage return requests" },
  { key: "shipping.view", label: "View Shipping", description: "View shipping zones and rates" },
  { key: "shipping.manage", label: "Manage Shipping", description: "Manage shipping zones and rates" },
  { key: "customers.view", label: "View Customers", description: "View customers" },
  { key: "reviews.view", label: "View Reviews", description: "View product reviews" },
  { key: "reviews.manage", label: "Manage Reviews", description: "Manage product reviews" },
  { key: "blacklist.view", label: "View Blacklist", description: "View customer blacklist" },
  { key: "blacklist.manage", label: "Manage Blacklist", description: "Manage customer blacklist" },
  { key: "coupons.view", label: "View Coupons", description: "View coupons" },
  { key: "coupons.manage", label: "Manage Coupons", description: "Manage coupons" },
  { key: "campaigns.view", label: "View Campaigns", description: "View marketing campaigns" },
  { key: "campaigns.manage", label: "Manage Campaigns", description: "Manage marketing campaigns" },
  { key: "blog.view", label: "View Blog", description: "View blog posts and categories" },
  { key: "blog.manage", label: "Manage Blog", description: "Manage blog posts and categories" },
  { key: "slider.view", label: "View Slider", description: "View homepage sliders" },
  { key: "slider.manage", label: "Manage Slider", description: "Manage homepage sliders" },
  { key: "homepage.view", label: "View Homepage", description: "View homepage sections" },
  { key: "homepage.manage", label: "Manage Homepage", description: "Manage homepage sections" },
  { key: "navigation.view", label: "View Navigation", description: "View store navigation" },
  { key: "navigation.manage", label: "Manage Navigation", description: "Manage store navigation" },
  { key: "notifications.view", label: "View Notifications", description: "View system notifications" },
  { key: "audit.view", label: "View Audit Logs", description: "View system audit logs" },
  { key: "staff.view", label: "View Staff", description: "View staff accounts" },
  { key: "staff.manage", label: "Manage Staff", description: "Manage staff accounts" },
  { key: "settings.view", label: "View Settings", description: "View store settings" },
  { key: "settings.manage", label: "Manage Settings", description: "Manage store settings" }
] as const;

export type PermissionKey = typeof PERMISSIONS[number]["key"];

export interface RoleDefinition {
  key: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
}

export const SYSTEM_ROLES: RoleDefinition[] = [
  {
    key: "owner",
    name: "Owner",
    description: "Full access. Cannot be demoted or removed.",
    // Owner implicitly has all permissions at runtime, but we map them for completeness.
    permissions: PERMISSIONS.map(p => p.key)
  },
  {
    key: "administrator",
    name: "Administrator",
    description: "Almost full operational access.",
    permissions: PERMISSIONS.map(p => p.key)
  },
  {
    key: "manager",
    name: "Manager",
    description: "Broad operational access.",
    permissions: [
      "admin.access", "dashboard.view", "analytics.view",
      "products.view", "products.manage", "categories.view", "categories.manage",
      "brands.view", "brands.manage", "inventory.view", "inventory.adjust",
      "orders.view", "orders.update_status", "orders.dispatch",
      "returns.view", "returns.manage", "shipping.view", "shipping.manage",
      "customers.view", "reviews.view", "reviews.manage",
      "coupons.view", "coupons.manage", "campaigns.view", "campaigns.manage"
    ]
  },
  {
    key: "order_manager",
    name: "Order Manager",
    description: "Manage orders and shipments.",
    permissions: [
      "admin.access", "dashboard.view",
      "orders.view", "orders.update_status", "orders.dispatch",
      "returns.view", "returns.manage", "shipping.view", "shipping.manage",
      "customers.view", "blacklist.view", "blacklist.manage"
    ]
  },
  {
    key: "inventory_manager",
    name: "Inventory Manager",
    description: "Manage catalog and inventory.",
    permissions: [
      "admin.access", "dashboard.view",
      "products.view", "categories.view", "brands.view",
      "inventory.view", "inventory.adjust", "media.view"
    ]
  },
  {
    key: "marketing_manager",
    name: "Marketing Manager",
    description: "Manage promotions and content.",
    permissions: [
      "admin.access", "dashboard.view", "analytics.view",
      "products.view", "customers.view", "reviews.view",
      "coupons.view", "coupons.manage", "campaigns.view", "campaigns.manage",
      "blog.view", "blog.manage", "slider.view", "slider.manage",
      "homepage.view", "homepage.manage", "navigation.view", "navigation.manage",
      "media.view", "media.manage"
    ]
  },
  {
    key: "content_editor",
    name: "Content Editor",
    description: "Manage catalog and CMS content.",
    permissions: [
      "admin.access",
      "products.view", "products.manage", "categories.view", "categories.manage",
      "brands.view", "brands.manage", "media.view", "media.manage",
      "blog.view", "blog.manage", "slider.view", "slider.manage",
      "homepage.view", "homepage.manage", "navigation.view", "navigation.manage"
    ]
  },
  {
    key: "customer_support",
    name: "Customer Support",
    description: "View orders and customers.",
    permissions: [
      "admin.access", "dashboard.view",
      "orders.view", "returns.view", "customers.view",
      "reviews.view", "reviews.manage", "blacklist.view"
    ]
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only access.",
    permissions: [
      "admin.access", "dashboard.view", "analytics.view",
      "products.view", "categories.view", "brands.view", "inventory.view", "media.view",
      "orders.view", "returns.view", "shipping.view", "customers.view", "reviews.view", "blacklist.view",
      "coupons.view", "campaigns.view", "blog.view", "slider.view", "homepage.view", "navigation.view",
      "notifications.view", "audit.view", "staff.view", "settings.view"
    ]
  }
];
