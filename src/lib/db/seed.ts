 
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

import { db } from "./index";
import {
  stores,
  storeSettings,
  storeThemes,
  users,
  brands,
  categories,
} from "./schema";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@niyamah.com.bd";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const ADMIN_NAME = "Niyamah Admin";

async function ensureStore() {
  const existing = await db.query.stores.findFirst({
    where: eq(stores.slug, "niyamah"),
  });
  if (existing) {
    console.log(`✓ Store exists (id=${existing.id})`);
    return existing;
  }
  const [row] = await db
    .insert(stores)
    .values({ name: "Niyamah", slug: "niyamah", plan: "free", status: "active" })
    .returning();
  if (!row) throw new Error("Store insert failed.");
  await db.insert(storeSettings).values({
    storeId: row.id,
    currency: "BDT",
    language: "en",
    timezone: "Asia/Dhaka",
    contactEmail: ADMIN_EMAIL,
    metaTitle: "Niyamah — Premium E-Commerce",
    metaDescription:
      "Premium e-commerce experience — curated products, fast delivery, trusted quality.",
  });
  await db.insert(storeThemes).values({
    storeId: row.id,
    themeKey: "default",
    config: {
      colors: {
        bg: "#FAFAF8",
        accent: "#C9A96E",
        text: "#1A1814",
      },
    },
  });
  console.log(`✓ Created store (id=${row.id})`);
  return row;
}

async function ensureAdmin() {
  if (!ADMIN_PASSWORD) {
    throw new Error("Set SEED_ADMIN_PASSWORD in .env.local before running db:seed.");
  }
  const existing = await db.query.users.findFirst({
    where: eq(users.email, ADMIN_EMAIL),
  });
  if (existing) {
    console.log(`✓ Admin user exists (${ADMIN_EMAIL})`);
    return existing;
  }
  const passwordHash = await hash(ADMIN_PASSWORD, 12);
  const id = nanoid();
  await db.insert(users).values({
    id,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: "superadmin",
    verified: true,
    emailVerified: new Date(),
  });
  console.log(`✓ Created admin user (${ADMIN_EMAIL})`);
  return { id };
}

async function ensureSeedBrands(storeId: number) {
  const existing = await db.query.brands.findFirst({
    where: eq(brands.storeId, storeId),
  });
  if (existing) {
    console.log("✓ Brands already seeded");
    return;
  }
  await db.insert(brands).values([
    { storeId, name: "Niyamah", slug: "niyamah", featured: true, status: true },
    { storeId, name: "Heritage", slug: "heritage", featured: false, status: true },
  ]);
  console.log("✓ Seeded 2 brands");
}

async function ensureSeedCategories(storeId: number) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.storeId, storeId),
  });
  if (existing) {
    console.log("✓ Categories already seeded");
    return;
  }
  await db.insert(categories).values([
    { storeId, name: "Apparel", slug: "apparel", sortOrder: 1, status: true },
    { storeId, name: "Accessories", slug: "accessories", sortOrder: 2, status: true },
    { storeId, name: "Home & Living", slug: "home-living", sortOrder: 3, status: true },
  ]);
  console.log("✓ Seeded 3 root categories");
}

async function main() {
  console.log("→ Seeding Niyamah...");
  const store = await ensureStore();
  await ensureAdmin();
  await ensureSeedBrands(store.id);
  await ensureSeedCategories(store.id);
  console.log("✔ Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✖ Seed failed:", err);
    process.exit(1);
  });
