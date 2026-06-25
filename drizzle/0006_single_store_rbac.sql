ALTER TABLE "roles" ADD COLUMN "key" varchar(50);
ALTER TABLE "roles" ADD COLUMN "is_system" boolean DEFAULT false NOT NULL;
ALTER TABLE "roles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "roles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "store_users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "store_users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "store_users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;

-- Populate existing roles with temporary keys so we can set it NOT NULL safely
UPDATE "roles" SET "key" = 'legacy_' || "id" WHERE "key" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "roles" ALTER COLUMN "key" SET NOT NULL;

-- Add unique index
CREATE UNIQUE INDEX IF NOT EXISTS "roles_store_id_key_idx" ON "roles" USING btree ("store_id","key");

-- Insert permissions
INSERT INTO permissions (key, description) VALUES
  ('admin.access', 'Base admin access'),
  ('dashboard.view', 'View dashboard metrics'),
  ('analytics.view', 'View detailed analytics'),
  ('products.view', 'View products'),
  ('products.manage', 'Manage products'),
  ('categories.view', 'View categories'),
  ('categories.manage', 'Manage categories'),
  ('brands.view', 'View brands'),
  ('brands.manage', 'Manage brands'),
  ('inventory.view', 'View inventory'),
  ('inventory.adjust', 'Adjust inventory levels'),
  ('media.view', 'View media library'),
  ('media.manage', 'Manage media library'),
  ('orders.view', 'View orders'),
  ('orders.update_status', 'Update order statuses'),
  ('orders.dispatch', 'Dispatch orders via courier'),
  ('returns.view', 'View return requests'),
  ('returns.manage', 'Manage return requests'),
  ('shipping.view', 'View shipping zones and rates'),
  ('shipping.manage', 'Manage shipping zones and rates'),
  ('customers.view', 'View customers'),
  ('reviews.view', 'View product reviews'),
  ('reviews.manage', 'Manage product reviews'),
  ('blacklist.view', 'View customer blacklist'),
  ('blacklist.manage', 'Manage customer blacklist'),
  ('coupons.view', 'View coupons'),
  ('coupons.manage', 'Manage coupons'),
  ('campaigns.view', 'View marketing campaigns'),
  ('campaigns.manage', 'Manage marketing campaigns'),
  ('blog.view', 'View blog posts and categories'),
  ('blog.manage', 'Manage blog posts and categories'),
  ('slider.view', 'View homepage sliders'),
  ('slider.manage', 'Manage homepage sliders'),
  ('homepage.view', 'View homepage sections'),
  ('homepage.manage', 'Manage homepage sections'),
  ('navigation.view', 'View store navigation'),
  ('navigation.manage', 'Manage store navigation'),
  ('notifications.view', 'View system notifications'),
  ('audit.view', 'View system audit logs'),
  ('staff.view', 'View staff accounts'),
  ('staff.manage', 'Manage staff accounts'),
  ('settings.view', 'View store settings'),
  ('settings.manage', 'Manage store settings')
ON CONFLICT (key) DO NOTHING;

-- Seed Roles
-- We assume the default store has id = 1.
INSERT INTO roles (store_id, name, key, description, is_system) VALUES
  (1, 'Owner', 'owner', 'Full access. Cannot be demoted or removed.', true),
  (1, 'Administrator', 'administrator', 'Almost full operational access.', true),
  (1, 'Manager', 'manager', 'Broad operational access.', true),
  (1, 'Order Manager', 'order_manager', 'Manage orders and shipments.', true),
  (1, 'Inventory Manager', 'inventory_manager', 'Manage catalog and inventory.', true),
  (1, 'Marketing Manager', 'marketing_manager', 'Manage promotions and content.', true),
  (1, 'Content Editor', 'content_editor', 'Manage catalog and CMS content.', true),
  (1, 'Customer Support', 'customer_support', 'View orders and customers.', true),
  (1, 'Viewer', 'viewer', 'Read-only access.', true)
ON CONFLICT (store_id, key) DO NOTHING;

-- Grant Permissions safely using standard SQL DO block
DO $$ 
DECLARE
  v_store_id INT := 1;
BEGIN
  -- We'll use a temporary table to map role keys to permissions
  CREATE TEMP TABLE temp_role_permissions (
    role_key VARCHAR,
    permission_key VARCHAR
  ) ON COMMIT DROP;

  -- Insert all relations into temp table
  INSERT INTO temp_role_permissions (role_key, permission_key) VALUES
    -- Owner (all)
    ('owner', 'admin.access'), ('owner', 'dashboard.view'), ('owner', 'analytics.view'), 
    ('owner', 'products.view'), ('owner', 'products.manage'), ('owner', 'categories.view'), ('owner', 'categories.manage'), 
    ('owner', 'brands.view'), ('owner', 'brands.manage'), ('owner', 'inventory.view'), ('owner', 'inventory.adjust'), 
    ('owner', 'media.view'), ('owner', 'media.manage'), ('owner', 'orders.view'), ('owner', 'orders.update_status'), 
    ('owner', 'orders.dispatch'), ('owner', 'returns.view'), ('owner', 'returns.manage'), ('owner', 'shipping.view'), 
    ('owner', 'shipping.manage'), ('owner', 'customers.view'), ('owner', 'reviews.view'), ('owner', 'reviews.manage'), 
    ('owner', 'blacklist.view'), ('owner', 'blacklist.manage'), ('owner', 'coupons.view'), ('owner', 'coupons.manage'), 
    ('owner', 'campaigns.view'), ('owner', 'campaigns.manage'), ('owner', 'blog.view'), ('owner', 'blog.manage'), 
    ('owner', 'slider.view'), ('owner', 'slider.manage'), ('owner', 'homepage.view'), ('owner', 'homepage.manage'), 
    ('owner', 'navigation.view'), ('owner', 'navigation.manage'), ('owner', 'notifications.view'), ('owner', 'audit.view'), 
    ('owner', 'staff.view'), ('owner', 'staff.manage'), ('owner', 'settings.view'), ('owner', 'settings.manage'),
    
    -- Administrator (all)
    ('administrator', 'admin.access'), ('administrator', 'dashboard.view'), ('administrator', 'analytics.view'), 
    ('administrator', 'products.view'), ('administrator', 'products.manage'), ('administrator', 'categories.view'), ('administrator', 'categories.manage'), 
    ('administrator', 'brands.view'), ('administrator', 'brands.manage'), ('administrator', 'inventory.view'), ('administrator', 'inventory.adjust'), 
    ('administrator', 'media.view'), ('administrator', 'media.manage'), ('administrator', 'orders.view'), ('administrator', 'orders.update_status'), 
    ('administrator', 'orders.dispatch'), ('administrator', 'returns.view'), ('administrator', 'returns.manage'), ('administrator', 'shipping.view'), 
    ('administrator', 'shipping.manage'), ('administrator', 'customers.view'), ('administrator', 'reviews.view'), ('administrator', 'reviews.manage'), 
    ('administrator', 'blacklist.view'), ('administrator', 'blacklist.manage'), ('administrator', 'coupons.view'), ('administrator', 'coupons.manage'), 
    ('administrator', 'campaigns.view'), ('administrator', 'campaigns.manage'), ('administrator', 'blog.view'), ('administrator', 'blog.manage'), 
    ('administrator', 'slider.view'), ('administrator', 'slider.manage'), ('administrator', 'homepage.view'), ('administrator', 'homepage.manage'), 
    ('administrator', 'navigation.view'), ('administrator', 'navigation.manage'), ('administrator', 'notifications.view'), ('administrator', 'audit.view'), 
    ('administrator', 'staff.view'), ('administrator', 'staff.manage'), ('administrator', 'settings.view'), ('administrator', 'settings.manage'),
    
    -- Manager
    ('manager', 'admin.access'), ('manager', 'dashboard.view'), ('manager', 'analytics.view'), 
    ('manager', 'products.view'), ('manager', 'products.manage'), ('manager', 'categories.view'), ('manager', 'categories.manage'), 
    ('manager', 'brands.view'), ('manager', 'brands.manage'), ('manager', 'inventory.view'), ('manager', 'inventory.adjust'), 
    ('manager', 'orders.view'), ('manager', 'orders.update_status'), ('manager', 'orders.dispatch'), 
    ('manager', 'returns.view'), ('manager', 'returns.manage'), ('manager', 'shipping.view'), ('manager', 'shipping.manage'), 
    ('manager', 'customers.view'), ('manager', 'reviews.view'), ('manager', 'reviews.manage'), 
    ('manager', 'coupons.view'), ('manager', 'coupons.manage'), ('manager', 'campaigns.view'), ('manager', 'campaigns.manage'),
    
    -- Order Manager
    ('order_manager', 'admin.access'), ('order_manager', 'dashboard.view'),
    ('order_manager', 'orders.view'), ('order_manager', 'orders.update_status'), ('order_manager', 'orders.dispatch'), 
    ('order_manager', 'returns.view'), ('order_manager', 'returns.manage'), ('order_manager', 'shipping.view'), ('order_manager', 'shipping.manage'), 
    ('order_manager', 'customers.view'), ('order_manager', 'blacklist.view'), ('order_manager', 'blacklist.manage'),
    
    -- Inventory Manager
    ('inventory_manager', 'admin.access'), ('inventory_manager', 'dashboard.view'), 
    ('inventory_manager', 'products.view'), ('inventory_manager', 'categories.view'), ('inventory_manager', 'brands.view'), 
    ('inventory_manager', 'inventory.view'), ('inventory_manager', 'inventory.adjust'), ('inventory_manager', 'media.view'),
    
    -- Marketing Manager
    ('marketing_manager', 'admin.access'), ('marketing_manager', 'dashboard.view'), ('marketing_manager', 'analytics.view'), 
    ('marketing_manager', 'products.view'), ('marketing_manager', 'customers.view'), ('marketing_manager', 'reviews.view'),
    ('marketing_manager', 'coupons.view'), ('marketing_manager', 'coupons.manage'), ('marketing_manager', 'campaigns.view'), ('marketing_manager', 'campaigns.manage'), 
    ('marketing_manager', 'blog.view'), ('marketing_manager', 'blog.manage'), ('marketing_manager', 'slider.view'), ('marketing_manager', 'slider.manage'), 
    ('marketing_manager', 'homepage.view'), ('marketing_manager', 'homepage.manage'), ('marketing_manager', 'navigation.view'), ('marketing_manager', 'navigation.manage'), 
    ('marketing_manager', 'media.view'), ('marketing_manager', 'media.manage'),
    
    -- Content Editor
    ('content_editor', 'admin.access'), 
    ('content_editor', 'products.view'), ('content_editor', 'products.manage'), ('content_editor', 'categories.view'), ('content_editor', 'categories.manage'), 
    ('content_editor', 'brands.view'), ('content_editor', 'brands.manage'), ('content_editor', 'media.view'), ('content_editor', 'media.manage'), 
    ('content_editor', 'blog.view'), ('content_editor', 'blog.manage'), ('content_editor', 'slider.view'), ('content_editor', 'slider.manage'), 
    ('content_editor', 'homepage.view'), ('content_editor', 'homepage.manage'), ('content_editor', 'navigation.view'), ('content_editor', 'navigation.manage'),
    
    -- Customer Support
    ('customer_support', 'admin.access'), ('customer_support', 'dashboard.view'), 
    ('customer_support', 'orders.view'), ('customer_support', 'returns.view'), ('customer_support', 'customers.view'), 
    ('customer_support', 'reviews.view'), ('customer_support', 'reviews.manage'), ('customer_support', 'blacklist.view'),
    
    -- Viewer
    ('viewer', 'admin.access'), ('viewer', 'dashboard.view'), ('viewer', 'analytics.view'),
    ('viewer', 'products.view'), ('viewer', 'categories.view'), ('viewer', 'brands.view'), ('viewer', 'inventory.view'), ('viewer', 'media.view'),
    ('viewer', 'orders.view'), ('viewer', 'returns.view'), ('viewer', 'shipping.view'), ('viewer', 'customers.view'), ('viewer', 'reviews.view'), ('viewer', 'blacklist.view'),
    ('viewer', 'coupons.view'), ('viewer', 'campaigns.view'), ('viewer', 'blog.view'), ('viewer', 'slider.view'), ('viewer', 'homepage.view'), ('viewer', 'navigation.view'),
    ('viewer', 'notifications.view'), ('viewer', 'audit.view'), ('viewer', 'staff.view'), ('viewer', 'settings.view');

  -- Insert mappings robustly
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id 
  FROM temp_role_permissions trp
  JOIN roles r ON r.key = trp.role_key AND r.store_id = v_store_id
  JOIN permissions p ON p.key = trp.permission_key
  ON CONFLICT DO NOTHING;
END $$;

-- Backfill Store Users safely
DO $$
DECLARE
  v_store_id INT := 1;
BEGIN
  -- Insert missing store_users based on legacy user roles
  INSERT INTO store_users (store_id, user_id, role_id, is_active, created_at, updated_at)
  SELECT 
    v_store_id, 
    u.id,
    (SELECT r.id FROM roles r WHERE r.store_id = v_store_id AND r.key = 
      CASE 
        WHEN u.role = 'superadmin' THEN 'owner'
        WHEN u.role = 'admin' THEN 'administrator'
        WHEN u.role = 'manager' THEN 'manager'
        WHEN u.role = 'staff' THEN 'customer_support'
      END
    ) as role_id,
    true,
    now(),
    now()
  FROM users u
  WHERE u.role IN ('superadmin', 'admin', 'manager', 'staff')
  ON CONFLICT (store_id, user_id) DO UPDATE SET 
    role_id = EXCLUDED.role_id,
    updated_at = EXCLUDED.updated_at;
END $$;
