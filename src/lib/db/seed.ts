import { config } from "dotenv";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";

config({ path: ".env.local" });

import { db } from "./index";
import {
  addresses,
  auditLogs,
  banners,
  blogCategories,
  blogPosts,
  blogPostTags,
  blogTags,
  brands,
  campaignProducts,
  campaigns,
  categories,
  coupons,
  customerBlacklist,
  inventory,
  newsletterSubscribers,
  notifications,
  orderItems,
  orders,
  orderStatusHistory,
  payments,
  productImages,
  products,
  productVariants,
  returnRequests,
  reviews,
  shipments,
  shippingRates,
  shippingZones,
  storeSettings,
  stores,
  storeThemes,
  users,
  variantOptionTypes,
  variantOptionValues,
  wishlists,
  wishlistItems,
} from "./schema";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@niyamah.com.bd";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const ADMIN_NAME = "Niyamah Admin";

const CUSTOMER_PASSWORD = "Customer@12345";

const demoImages = {
  quranOpen:
    "https://images.unsplash.com/photo-1585831167895-0f9c9f0cf6cf?auto=format&fit=crop&w=900&q=80",
  quranStack:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
  prayerBeads:
    "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?auto=format&fit=crop&w=900&q=80",
  prayerMat:
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=900&q=80",
  giftBox:
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
  islamicBooks:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
  hero:
    "https://images.unsplash.com/photo-1585831167895-0f9c9f0cf6cf?auto=format&fit=crop&w=1600&q=80",
};

const productSeeds = [
  {
    name: "Color-Coded Quran with Bengali Meaning",
    slug: "color-coded-quran-bengali-meaning",
    category: "quran",
    brand: "niyamah",
    price: "1500.00",
    salePrice: "1250.00",
    sku: "NIY-QURAN-001",
    stock: 45,
    featured: true,
    bestSeller: true,
    image: demoImages.quranOpen,
    shortDescription: "Full color-coded Quran with Bengali word-by-word meaning.",
    description:
      "This color-coded Quran uses color highlighting to help beginners and learners identify different types of tajweed rules during recitation. Comes with Bengali word-by-word meaning, making it ideal for learners of all ages across Bangladesh.",
    tags: ["quran", "color-coded", "bengali", "tajweed"],
  },
  {
    name: "Easy Quran — Medium Size (Bengali Translation)",
    slug: "easy-quran-medium-bengali",
    category: "quran",
    brand: "niyamah",
    price: "1100.00",
    salePrice: "950.00",
    sku: "NIY-QURAN-002",
    stock: 38,
    featured: true,
    bestSeller: true,
    image: demoImages.islamicBooks,
    shortDescription: "Comfortable medium-size Quran with complete Bengali translation.",
    description:
      "Perfect for daily recitation at home. Medium font size with clear Arabic script and full Bengali translation. Soft cover, lightweight, and easy to hold for long reading sessions.",
    tags: ["quran", "medium", "bengali", "daily-use"],
  },
  {
    name: "Premium Bengali Translation Quran",
    slug: "premium-bengali-translation-quran",
    category: "bengali-quran",
    brand: "niyamah",
    price: "1500.00",
    salePrice: "1350.00",
    sku: "NIY-BQ-001",
    stock: 30,
    featured: true,
    bestSeller: false,
    image: demoImages.quranStack,
    shortDescription: "Large-format Quran with complete Bengali tafsir and translation.",
    description:
      "A comprehensive Bengali translation Quran with detailed tafsir notes for each ayah. Large font for ease of reading. Ideal for home, learning, and as a meaningful gift to parents.",
    tags: ["bengali-quran", "tafsir", "large-print", "gift"],
  },
  {
    name: "Islamic Gift Box — Quran + Tasbih Set",
    slug: "islamic-gift-box-quran-tasbih",
    category: "gift-box",
    brand: "niyamah",
    price: "2800.00",
    salePrice: "2400.00",
    sku: "NIY-GIFT-001",
    stock: 20,
    featured: true,
    bestSeller: true,
    image: demoImages.giftBox,
    shortDescription: "Elegant gift box with color-coded Quran and premium tasbih.",
    description:
      "A ready-to-send Islamic gift box containing a color-coded Quran and a premium wooden tasbih, packaged in a premium kraft box with ribbon. Perfect for parents, teachers, Eid, or any occasion.",
    tags: ["gift-box", "quran", "tasbih", "eid", "parents"],
  },
  {
    name: "Complete Prayer Gift Set",
    slug: "complete-prayer-gift-set",
    category: "gift-box",
    brand: "niyamah",
    price: "3200.00",
    salePrice: "2750.00",
    sku: "NIY-GIFT-002",
    stock: 15,
    featured: true,
    bestSeller: false,
    image: demoImages.giftBox,
    shortDescription: "Full prayer essentials in a beautiful gift box — mat, tasbih, and Quran.",
    description:
      "A complete Islamic gift box with a soft folding prayer mat, premium wooden tasbih, and a medium Quran — ideal for newly married couples, parents, or a thoughtful gift from abroad.",
    tags: ["gift-box", "prayer-mat", "tasbih", "quran", "newly-married"],
  },
  {
    name: "Digital Tasbih Counter",
    slug: "digital-tasbih-counter",
    category: "tasbih",
    brand: "deenstore",
    price: "450.00",
    salePrice: null,
    sku: "DS-TASBIH-001",
    stock: 80,
    featured: false,
    bestSeller: true,
    image: demoImages.prayerBeads,
    shortDescription: "Compact digital counter for dhikr and tasbeeh counting.",
    description:
      "A small, button-operated digital counter for accurate dhikr counting. Can count up to 9,999 clicks. Lightweight and easy to carry for travel or daily use. Battery included.",
    tags: ["tasbih", "digital", "dhikr", "gift"],
  },
  {
    name: "Premium Wooden Tasbih — 99 Beads",
    slug: "premium-wooden-tasbih-99-beads",
    category: "tasbih",
    brand: "deenstore",
    price: "950.00",
    salePrice: null,
    sku: "DS-TASBIH-002",
    stock: 35,
    featured: false,
    bestSeller: false,
    image: demoImages.prayerBeads,
    shortDescription: "Hand-finished natural wood 99-bead tasbih with soft knot finish.",
    description:
      "Crafted from natural wood with 99 smooth beads on a strong cord. Ideal for daily dhikr, post-prayer recitation, and gifting. Available in natural walnut and sandalwood finishes.",
    tags: ["tasbih", "wooden", "99-beads", "dhikr"],
  },
  {
    name: "Soft Velvet Prayer Mat",
    slug: "soft-velvet-prayer-mat",
    category: "prayer-mat",
    brand: "niyamah",
    price: "1200.00",
    salePrice: null,
    sku: "NIY-PM-001",
    stock: 50,
    featured: true,
    bestSeller: false,
    image: demoImages.prayerMat,
    shortDescription: "Thick soft velvet prayer mat with anti-slip base for daily salah.",
    description:
      "A premium velvet prayer mat with a comfortable thick pile and a non-slip rubber base. Comes with a matching carrying pouch. Available in green, cream, and burgundy.",
    tags: ["prayer-mat", "velvet", "soft", "daily-salah"],
  },
  {
    name: "Compact Travel Prayer Mat",
    slug: "compact-travel-prayer-mat",
    category: "prayer-mat",
    brand: "deenstore",
    price: "850.00",
    salePrice: null,
    sku: "DS-PM-001",
    stock: 40,
    featured: false,
    bestSeller: true,
    image: demoImages.prayerMat,
    shortDescription: "Foldable travel prayer mat that fits in a small carry bag.",
    description:
      "A lightweight and foldable travel prayer mat with a built-in compass. Packs into a small zip pouch. Ideal for office, travel, and outdoor prayers. Machine washable.",
    tags: ["prayer-mat", "travel", "foldable", "compact"],
  },
  {
    name: "Wooden Quran Stand (Rehal)",
    slug: "wooden-quran-stand-rehal",
    category: "quran",
    brand: "deenstore",
    price: "750.00",
    salePrice: null,
    sku: "DS-STAND-001",
    stock: 25,
    featured: false,
    bestSeller: false,
    image: demoImages.islamicBooks,
    shortDescription: "Foldable wooden Quran stand for comfortable recitation.",
    description:
      "A traditional foldable wooden Quran stand (rehal) with carved patterns. Holds any standard Quran size at a comfortable angle for recitation. Folds flat for easy storage.",
    tags: ["quran", "stand", "rehal", "wooden"],
  },
];

async function ensureStore() {
  const existing = await db.query.stores.findFirst({
    where: eq(stores.slug, "niyamah"),
  });
  if (existing) {
    console.log(`Store exists (id=${existing.id})`);
    return existing;
  }

  const [row] = await db
    .insert(stores)
    .values({ name: "Niyamah", slug: "niyamah", plan: "starter", status: "active" })
    .returning();
  if (!row) throw new Error("Store insert failed.");

  await db.insert(storeSettings).values({
    storeId: row.id,
    currency: "BDT",
    language: "en",
    timezone: "Asia/Dhaka",
    contactEmail: ADMIN_EMAIL,
    contactPhone: "+8801700000000",
    address: "House 12, Road 7, Dhanmondi, Dhaka",
    metaTitle: "Niyamah - Quran, Prayer Essentials & Islamic Gifts",
    metaDescription:
      "Your trusted source for Quran, Bengali Quran, tasbih, prayer mats, and meaningful Islamic gift boxes — with Cash on Delivery across Bangladesh.",
  });
  await db.insert(storeThemes).values({
    storeId: row.id,
    themeKey: "default",
    config: {
      colors: {
        bg: "#FAF7EE",
        accent: "#007A3D",
        text: "#162018",
      },
    },
  });
  console.log(`Created store (id=${row.id})`);
  return row;
}

async function ensureAdmin() {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, ADMIN_EMAIL),
  });
  if (existing) {
    console.log(`Admin user exists (${ADMIN_EMAIL})`);
    return existing;
  }
  if (!ADMIN_PASSWORD) {
    throw new Error("Set SEED_ADMIN_PASSWORD in .env.local before running db:seed.");
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
  console.log(`Created admin user (${ADMIN_EMAIL})`);
  return { id };
}

async function ensureDemoCustomer() {
  const email = "customer@niyamah.test";
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    console.log(`Demo customer exists (${email})`);
    return existing;
  }

  const id = nanoid();
  await db.insert(users).values({
    id,
    name: "Demo Customer",
    email,
    phone: "+8801711111111",
    passwordHash: await hash(CUSTOMER_PASSWORD, 12),
    role: "customer",
    verified: true,
    emailVerified: new Date(),
  });
  console.log(`Created demo customer (${email} / ${CUSTOMER_PASSWORD})`);
  return { id, email, name: "Demo Customer" };
}

async function ensureBrand(storeId: number, name: string, slug: string, featured = false) {
  const existing = await db.query.brands.findFirst({
    where: and(eq(brands.storeId, storeId), eq(brands.slug, slug)),
  });
  if (existing) return existing;

  const [row] = await db
    .insert(brands)
    .values({
      storeId,
      name,
      slug,
      description: `${name} curated collection for the Niyamah demo store.`,
      featured,
      status: true,
      seoTitle: `${name} | Niyamah`,
      seoDescription: `Shop ${name} products from Niyamah.`,
    })
    .returning();
  if (!row) throw new Error(`Could not create brand ${slug}`);
  return row;
}

async function ensureCategory(
  storeId: number,
  name: string,
  slug: string,
  sortOrder: number,
  image: string,
) {
  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.storeId, storeId), eq(categories.slug, slug)),
  });
  if (existing) return existing;

  const [row] = await db
    .insert(categories)
    .values({
      storeId,
      name,
      slug,
      image,
      description: `Explore curated ${name.toLowerCase()} products from Niyamah.`,
      seoTitle: `${name} | Niyamah`,
      seoDescription: `Shop ${name.toLowerCase()} products from Niyamah.`,
      sortOrder,
      status: true,
    })
    .returning();
  if (!row) throw new Error(`Could not create category ${slug}`);
  return row;
}

async function ensureCatalog(storeId: number) {
  const brandMap = new Map<string, { id: number }>();
  for (const brand of [
    ["Niyamah", "niyamah", true],
    ["Deen Store", "deenstore", true],
    ["Al-Barakah", "al-barakah", false],
  ] as const) {
    brandMap.set(brand[1], await ensureBrand(storeId, brand[0], brand[1], brand[2]));
  }

  const categoryMap = new Map<string, { id: number }>();
  const categorySeed = [
    ["Quran", "quran", 1, demoImages.quranOpen],
    ["Bengali Quran", "bengali-quran", 2, demoImages.quranStack],
    ["Gift Box", "gift-box", 3, demoImages.giftBox],
    ["Prayer Mat", "prayer-mat", 4, demoImages.prayerMat],
    ["Tasbih", "tasbih", 5, demoImages.prayerBeads],
  ] as const;
  for (const category of categorySeed) {
    categoryMap.set(
      category[1],
      await ensureCategory(storeId, category[0], category[1], category[2], category[3]),
    );
  }

  const productsCreated: Array<{ id: number; variantId: number; name: string; price: string; image: string }> = [];
  for (const seed of productSeeds) {
    const existing = await db.query.products.findFirst({
      where: and(eq(products.storeId, storeId), eq(products.slug, seed.slug)),
    });

    const product =
      existing ??
      (
        await db
          .insert(products)
          .values({
            storeId,
            categoryId: categoryMap.get(seed.category)?.id,
            brandId: brandMap.get(seed.brand)?.id,
            name: seed.name,
            slug: seed.slug,
            shortDescription: seed.shortDescription,
            description: seed.description,
            price: seed.price,
            salePrice: seed.salePrice,
            costPrice: (Number(seed.price) * 0.55).toFixed(2),
            sku: seed.sku,
            status: "published",
            featured: seed.featured,
            bestSeller: seed.bestSeller,
            seoTitle: `${seed.name} | Niyamah`,
            seoDescription: seed.shortDescription,
            ogImage: seed.image,
            tags: seed.tags,
          })
          .returning()
      )[0];

    if (!product) throw new Error(`Could not create product ${seed.slug}`);

    const existingImage = await db.query.productImages.findFirst({
      where: eq(productImages.productId, product.id),
    });
    if (!existingImage) {
      await db.insert(productImages).values([
        {
          productId: product.id,
          url: seed.image,
          alt: seed.name,
          sortOrder: 0,
          isPrimary: true,
        },
        {
          productId: product.id,
          url: demoImages.islamicBooks,
          alt: `${seed.name} lifestyle`,
          sortOrder: 1,
          isPrimary: false,
        },
      ]);
    }

    let variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.productId, product.id),
    });
    if (!variant) {
      const [sizeType] = await db
        .insert(variantOptionTypes)
        .values({ productId: product.id, name: "Size" })
        .returning();
      if (!sizeType) throw new Error(`Could not create size option for ${seed.slug}`);

      const [regularSize] = await db
        .insert(variantOptionValues)
        .values({ optionTypeId: sizeType.id, value: "Regular" })
        .returning();
      if (!regularSize) throw new Error(`Could not create option value for ${seed.slug}`);

      [variant] = await db
        .insert(productVariants)
        .values({
          productId: product.id,
          sku: `${seed.sku}-REG`,
          imageUrl: seed.image,
          status: true,
          sortOrder: 0,
        })
        .returning();
      if (!variant) throw new Error(`Could not create variant for ${seed.slug}`);

      await db.insert(inventory).values({
        storeId,
        variantId: variant.id,
        stockOnHand: seed.stock,
        stockReserved: 0,
        stockAvailable: seed.stock,
        lowStockThreshold: 5,
        trackStock: true,
      });
    }

    productsCreated.push({
      id: product.id,
      variantId: variant.id,
      name: product.name,
      price: seed.salePrice ?? seed.price,
      image: seed.image,
    });
  }

  console.log(`Catalog ready (${productsCreated.length} products)`);
  return productsCreated;
}

async function ensureMarketing(storeId: number, productRows: Array<{ id: number }>) {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const couponSeeds = [
    {
      code: "WELCOME10",
      type: "PERCENTAGE" as const,
      value: "10.00",
      minOrderAmount: "1000.00",
      maxDiscountAmount: "500.00",
      usageLimit: 250,
      perUserLimit: 1,
    },
    {
      code: "FREESHIP",
      type: "FREE_SHIPPING" as const,
      value: "0.00",
      minOrderAmount: "1500.00",
      maxDiscountAmount: null,
      usageLimit: 200,
      perUserLimit: 2,
    },
    {
      code: "FLAT300",
      type: "FLAT" as const,
      value: "300.00",
      minOrderAmount: "2500.00",
      maxDiscountAmount: null,
      usageLimit: 100,
      perUserLimit: 1,
    },
  ];

  let welcomeCouponId: number | null = null;
  for (const seed of couponSeeds) {
    const existing = await db.query.coupons.findFirst({
      where: and(eq(coupons.storeId, storeId), eq(coupons.code, seed.code)),
    });
    if (existing) {
      if (seed.code === "WELCOME10") welcomeCouponId = existing.id;
      continue;
    }
    const [row] = await db
      .insert(coupons)
      .values({
        storeId,
        ...seed,
        startDate: now,
        endDate: nextMonth,
        status: "active",
      })
      .returning();
    if (seed.code === "WELCOME10") welcomeCouponId = row?.id ?? null;
  }

  const existingCampaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.storeId, storeId), eq(campaigns.slug, "eid-style-edit")),
  });
  const campaign =
    existingCampaign ??
    (
      await db
        .insert(campaigns)
        .values({
          storeId,
          name: "Eid Style Edit",
          slug: "eid-style-edit",
          description: "Festive picks across apparel, gifts, accessories, and home.",
          bannerImage: demoImages.hero,
          startDate: now,
          endDate: nextMonth,
          couponId: welcomeCouponId,
          status: "active",
        })
        .returning()
    )[0];

  if (campaign) {
    for (const product of productRows.slice(0, 5)) {
      await db
        .insert(campaignProducts)
        .values({ campaignId: campaign.id, productId: product.id })
        .onConflictDoNothing();
    }
  }

  const existingBanner = await db.query.banners.findFirst({
    where: and(eq(banners.storeId, storeId), eq(banners.title, "Premium Quran & Gift Collection")),
  });
  if (!existingBanner) {
    await db.insert(banners).values([
      {
        storeId,
        title: "Premium Quran & Gift Collection",
        imageUrl: demoImages.hero,
        linkUrl: "/category/quran",
        position: "hero",
        status: "active",
        sortOrder: 1,
      },
      {
        storeId,
        title: "Islamic Gift Box Collection",
        imageUrl: demoImages.giftBox,
        linkUrl: "/category/gift-box",
        position: "homepage",
        status: "active",
        sortOrder: 2,
      },
    ]);
  }

  console.log("Marketing data ready");
}

async function ensureShipping(storeId: number) {
  const existing = await db.query.shippingZones.findFirst({
    where: and(eq(shippingZones.storeId, storeId), eq(shippingZones.name, "Dhaka Metro")),
  });
  if (existing) {
    console.log("Shipping zones already seeded");
    return;
  }

  const [dhaka] = await db
    .insert(shippingZones)
    .values({
      storeId,
      name: "Dhaka Metro",
      districts: ["Dhaka"],
      deliveryDaysMin: 1,
      deliveryDaysMax: 2,
    })
    .returning();
  const [nationwide] = await db
    .insert(shippingZones)
    .values({
      storeId,
      name: "Nationwide",
      districts: ["Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur"],
      deliveryDaysMin: 3,
      deliveryDaysMax: 5,
    })
    .returning();

  if (!dhaka || !nationwide) throw new Error("Could not create shipping zones.");

  await db.insert(shippingRates).values([
    { zoneId: dhaka.id, name: "Inside Dhaka", price: "70.00", freeAboveAmount: "3000.00" },
    { zoneId: nationwide.id, name: "Outside Dhaka", price: "120.00", freeAboveAmount: "5000.00" },
  ]);
  console.log("Shipping data ready");
}

async function ensureBlog(storeId: number, adminId: string) {
  const existingCategory = await db.query.blogCategories.findFirst({
    where: and(eq(blogCategories.storeId, storeId), eq(blogCategories.slug, "islamic-guide")),
  });
  const category =
    existingCategory ??
    (
      await db
        .insert(blogCategories)
        .values({ storeId, name: "Islamic Guide", slug: "islamic-guide" })
        .returning()
    )[0];
  if (!category) throw new Error("Could not create blog category.");

  const tagRows = [];
  for (const [name, slug] of [
    ["Quran", "quran"],
    ["Gifting", "gifting"],
    ["Prayer", "prayer"],
  ] as const) {
    const existing = await db.query.blogTags.findFirst({
      where: and(eq(blogTags.storeId, storeId), eq(blogTags.slug, slug)),
    });
    if (existing) {
      tagRows.push(existing);
      continue;
    }
    const [tag] = await db.insert(blogTags).values({ storeId, name, slug }).returning();
    if (tag) tagRows.push(tag);
  }

  const postSeeds = [
    {
      title: "How to Choose a Quran for Daily Recitation",
      slug: "how-to-choose-quran-daily-recitation",
      excerpt: "A practical guide to finding the right Quran edition for your daily reading habit.",
      image: demoImages.quranOpen,
      content:
        "When choosing a Quran for daily recitation, consider the font size, paper quality, and whether you need a Bengali translation. Color-coded editions are excellent for beginners learning tajweed. Choose a size that fits comfortably in your hands for longer sessions.",
    },
    {
      title: "Best Islamic Gifts for Parents in Bangladesh",
      slug: "best-islamic-gifts-for-parents",
      excerpt: "Thoughtful Islamic gift ideas that are meaningful, useful, and easy to send anywhere in Bangladesh.",
      image: demoImages.giftBox,
      content:
        "A Quran gift box is one of the most meaningful gifts for parents. Combine a color-coded Quran with a premium tasbih and a soft prayer mat for a complete gift. Niyamah gift boxes can be delivered with Cash on Delivery across all 64 districts of Bangladesh.",
    },
    {
      title: "Why Color-Coded Quran Helps Beginners",
      slug: "why-color-coded-quran-helps-beginners",
      excerpt: "Understanding the tajweed color system and how it makes Quran recitation easier for new learners.",
      image: demoImages.islamicBooks,
      content:
        "Color-coded Quran editions use different colors to mark different tajweed rules such as ghunnah, qalqalah, and madd letters. This visual system helps beginners identify and apply rules during recitation without needing a separate tajweed guide.",
    },
    {
      title: "How to Care for Prayer Mats and Tasbih",
      slug: "how-to-care-for-prayer-mats-and-tasbih",
      excerpt: "Simple tips to keep your prayer mat clean and your tasbih in good condition for years.",
      image: demoImages.prayerMat,
      content:
        "Prayer mats should be shaken gently after each use and stored in a clean, dry place. For velvet mats, spot-clean with a damp cloth rather than machine washing. Wooden tasbih should be kept away from water and stored in the pouch provided to maintain the wood finish.",
    },
  ];

  for (const seed of postSeeds) {
    const existing = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.storeId, storeId), eq(blogPosts.slug, seed.slug)),
    });
    const post =
      existing ??
      (
        await db
          .insert(blogPosts)
          .values({
            storeId,
            categoryId: category.id,
            authorId: adminId,
            title: seed.title,
            slug: seed.slug,
            excerpt: seed.excerpt,
            content: seed.content,
            featuredImage: seed.image,
            status: "published",
            publishedAt: new Date(),
            seoTitle: `${seed.title} | Niyamah Journal`,
            seoDescription: seed.excerpt,
            ogImage: seed.image,
          })
          .returning()
      )[0];
    if (post) {
      for (const tag of tagRows.slice(0, 2)) {
        await db.insert(blogPostTags).values({ postId: post.id, tagId: tag.id }).onConflictDoNothing();
      }
    }
  }
  console.log("Blog data ready");
}

async function ensureReviewsAndOrders(
  storeId: number,
  customerId: string,
  productRows: Array<{ id: number; variantId: number; name: string; price: string; image: string }>,
) {
  const existingAddress = await db.query.addresses.findFirst({
    where: and(eq(addresses.storeId, storeId), eq(addresses.userId, customerId)),
  });
  if (!existingAddress) {
    await db.insert(addresses).values({
      storeId,
      userId: customerId,
      label: "Home",
      name: "Demo Customer",
      phone: "+8801711111111",
      addressLine1: "House 20, Road 4",
      area: "Dhanmondi",
      district: "Dhaka",
      city: "Dhaka",
      postalCode: "1209",
      isDefault: true,
    });
  }

  const existingOrder = await db.query.orders.findFirst({
    where: and(eq(orders.storeId, storeId), eq(orders.idempotencyKey, "seed-order-001")),
  });
  if (!existingOrder) {
    const first = productRows[0];
    const second = productRows[2];
    if (first && second) {
      const subtotal = Number(first.price) * 1 + Number(second.price) * 2;
      const shipping = 70;
      const total = subtotal + shipping;
      const [order] = await db
        .insert(orders)
        .values({
          storeId,
          userId: customerId,
          shippingName: "Demo Customer",
          shippingPhone: "+8801711111111",
          shippingAddressLine1: "House 20, Road 4",
          shippingDistrict: "Dhaka",
          shippingArea: "Dhanmondi",
          shippingCity: "Dhaka",
          shippingPostalCode: "1209",
          status: "PROCESSING",
          subtotal: subtotal.toFixed(2),
          discountAmount: "0.00",
          shippingAmount: shipping.toFixed(2),
          total: total.toFixed(2),
          note: "Seed order for admin UI testing.",
          idempotencyKey: "seed-order-001",
        })
        .returning();

      if (order) {
        await db.insert(orderItems).values([
          {
            orderId: order.id,
            variantId: first.variantId,
            productName: first.name,
            sku: "SEED-ITEM-1",
            quantity: 1,
            unitPrice: first.price,
            totalPrice: first.price,
            imageUrl: first.image,
          },
          {
            orderId: order.id,
            variantId: second.variantId,
            productName: second.name,
            sku: "SEED-ITEM-2",
            quantity: 2,
            unitPrice: second.price,
            totalPrice: (Number(second.price) * 2).toFixed(2),
            imageUrl: second.image,
          },
        ]);
        await db.insert(payments).values({
          storeId,
          orderId: order.id,
          method: "COD",
          status: "UNPAID",
          amount: total.toFixed(2),
          currency: "BDT",
        });
        await db.insert(orderStatusHistory).values({
          orderId: order.id,
          fromStatus: null,
          toStatus: "PROCESSING",
          note: "Seed demo order.",
          actorId: customerId,
        });
      }
    }
  }

  for (const [idx, product] of productRows.slice(0, 5).entries()) {
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.storeId, storeId), eq(reviews.productId, product.id), eq(reviews.userId, customerId)),
    });
    if (existingReview) continue;
    const reviewContent = [
      { title: "Excellent Quran edition", body: "The color-coded Quran arrived beautifully. The Bengali meaning is very clear and the print quality is excellent. Cash on Delivery worked smoothly." },
      { title: "Perfect gift for my parents", body: "Gifted the Quran + tasbih box to my parents — they were very happy. The packaging was clean and professional. Will order again, in sha Allah." },
      { title: "Quick delivery, great product", body: "Fast delivery and the Bengali Quran matched exactly what was described. Highly recommend Niyamah for Islamic essentials." },
      { title: "Tasbih is very well made", body: "The wooden tasbih is smooth and the cord is strong. Very satisfied with the quality. Good value for the price." },
      { title: "Prayer mat is soft and durable", body: "The velvet prayer mat is thick and comfortable. The non-slip base works well on tiles. Good quality for the price." },
    ];
    const rc = reviewContent[idx % reviewContent.length]!;
    await db.insert(reviews).values({
      storeId,
      productId: product.id,
      userId: customerId,
      rating: (idx % 5 === 3 ? 4 : 5) as 4 | 5,
      title: rc.title,
      body: rc.body,
      status: "APPROVED",
      verifiedPurchase: true,
    });
  }
  console.log("Orders, address, and reviews ready");
}

/**
 * Seed extended operational data so every admin UI surface has content:
 * - Multiple orders across statuses (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 * - Shipments for shipped/delivered orders
 * - Return requests (PENDING + APPROVED)
 * - Customer blacklist entries
 * - Notifications (mix of read + unread)
 * - Newsletter subscribers
 * - Wishlist entries for the demo customer
 * - Audit log entries
 * - One low-stock variant for the low-stock report
 */
async function ensureOperations(
  storeId: number,
  adminId: string,
  customerId: string,
  productRows: Array<{ id: number; variantId: number; name: string; price: string; image: string }>,
) {
  if (productRows.length < 4) return;

  // 1) Diverse order set ───────────────────────────────────────────────
  const orderSeeds: Array<{
    key: string;
    status: typeof orders.$inferSelect.status;
    customer: { name: string; phone: string; email?: string };
    address: { line1: string; area: string; district: string; city: string; postal: string };
    items: Array<{ idx: number; qty: number }>;
    method: "COD" | "BKASH";
    paymentStatus: typeof payments.$inferSelect.status;
    coupon?: string;
    note?: string;
    daysAgo: number;
  }> = [
    {
      key: "seed-order-pending-001",
      status: "PENDING",
      customer: { name: "Rashed Karim", phone: "+8801712345671", email: "rashed@example.com" },
      address: { line1: "House 7, Road 12", area: "Banani", district: "Dhaka", city: "Dhaka", postal: "1213" },
      items: [{ idx: 1, qty: 1 }],
      method: "COD",
      paymentStatus: "UNPAID",
      note: "Please call before delivery.",
      daysAgo: 0,
    },
    {
      key: "seed-order-confirmed-002",
      status: "CONFIRMED",
      customer: { name: "Fatima Begum", phone: "+8801712345672", email: "fatima@example.com" },
      address: { line1: "Flat 3B, Aziz Tower", area: "Shahbagh", district: "Dhaka", city: "Dhaka", postal: "1000" },
      items: [{ idx: 0, qty: 1 }, { idx: 3, qty: 1 }],
      method: "COD",
      paymentStatus: "UNPAID",
      coupon: "WELCOME10",
      daysAgo: 1,
    },
    {
      key: "seed-order-shipped-003",
      status: "SHIPPED",
      customer: { name: "Mahmud Hossain", phone: "+8801712345673", email: "mahmud@example.com" },
      address: { line1: "Plot 22, Sector 4", area: "Uttara", district: "Dhaka", city: "Dhaka", postal: "1230" },
      items: [{ idx: 2, qty: 2 }],
      method: "COD",
      paymentStatus: "UNPAID",
      daysAgo: 3,
    },
    {
      key: "seed-order-delivered-004",
      status: "DELIVERED",
      customer: { name: "Ayesha Siddiqa", phone: "+8801712345674", email: "ayesha@example.com" },
      address: { line1: "47/A Lake Circus", area: "Kalabagan", district: "Dhaka", city: "Dhaka", postal: "1205" },
      items: [{ idx: 0, qty: 1 }, { idx: 1, qty: 1 }],
      method: "BKASH",
      paymentStatus: "PAID",
      daysAgo: 7,
    },
    {
      key: "seed-order-cancelled-005",
      status: "CANCELLED",
      customer: { name: "Rafiq Uddin", phone: "+8801712345675" },
      address: { line1: "House 9, Road 3", area: "Mohammadpur", district: "Dhaka", city: "Dhaka", postal: "1207" },
      items: [{ idx: 3, qty: 1 }],
      method: "COD",
      paymentStatus: "FAILED",
      note: "Customer no longer needed item.",
      daysAgo: 5,
    },
    {
      key: "seed-order-delivered-006",
      status: "DELIVERED",
      customer: { name: "Nusrat Jahan", phone: "+8801712345676", email: "nusrat@example.com" },
      address: { line1: "12 Court Road", area: "Sadar", district: "Sylhet", city: "Sylhet", postal: "3100" },
      items: [{ idx: 4 % productRows.length, qty: 1 }],
      method: "COD",
      paymentStatus: "PAID",
      daysAgo: 14,
    },
  ];

  const createdShipped: number[] = [];
  const createdDelivered: number[] = [];

  for (const seed of orderSeeds) {
    const existing = await db.query.orders.findFirst({
      where: and(eq(orders.storeId, storeId), eq(orders.idempotencyKey, seed.key)),
    });
    if (existing) {
      if (seed.status === "SHIPPED") createdShipped.push(existing.id);
      if (seed.status === "DELIVERED") createdDelivered.push(existing.id);
      continue;
    }

    const subtotal = seed.items.reduce((sum, it) => {
      const p = productRows[it.idx]!;
      return sum + Number(p.price) * it.qty;
    }, 0);
    const shipping = seed.address.district === "Dhaka" ? 70 : 130;
    const discount = seed.coupon ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount + shipping;
    const placedAt = new Date(Date.now() - seed.daysAgo * 86400000);

    const [order] = await db
      .insert(orders)
      .values({
        storeId,
        userId: seed.customer.email === "ayesha@example.com" ? customerId : null,
        guestEmail: seed.customer.email ?? null,
        guestPhone: seed.customer.phone,
        shippingName: seed.customer.name,
        shippingPhone: seed.customer.phone,
        shippingAddressLine1: seed.address.line1,
        shippingDistrict: seed.address.district,
        shippingArea: seed.address.area,
        shippingCity: seed.address.city,
        shippingPostalCode: seed.address.postal,
        status: seed.status,
        subtotal: subtotal.toFixed(2),
        discountAmount: discount.toFixed(2),
        shippingAmount: shipping.toFixed(2),
        total: total.toFixed(2),
        couponCode: seed.coupon ?? null,
        note: seed.note ?? null,
        idempotencyKey: seed.key,
        createdAt: placedAt,
        updatedAt: placedAt,
      })
      .returning();
    if (!order) continue;

    await db.insert(orderItems).values(
      seed.items.map((it, i) => {
        const p = productRows[it.idx]!;
        return {
          orderId: order.id,
          variantId: p.variantId,
          productName: p.name,
          sku: `${seed.key.toUpperCase()}-${i + 1}`,
          quantity: it.qty,
          unitPrice: p.price,
          totalPrice: (Number(p.price) * it.qty).toFixed(2),
          imageUrl: p.image,
        };
      }),
    );

    await db.insert(payments).values({
      storeId,
      orderId: order.id,
      method: seed.method,
      status: seed.paymentStatus,
      amount: total.toFixed(2),
      currency: "BDT",
      gatewayTransactionId: seed.method === "BKASH" ? `BKASH${order.id}${Date.now() % 100000}` : null,
    });

    type S = typeof orders.$inferSelect.status;
    const flow: S[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const targetIdx = flow.indexOf(seed.status as S);
    if (seed.status === "CANCELLED") {
      await db.insert(orderStatusHistory).values([
        { orderId: order.id, fromStatus: null, toStatus: "PENDING", note: "Order placed.", actorId: null },
        { orderId: order.id, fromStatus: "PENDING", toStatus: "CANCELLED", note: seed.note ?? "Cancelled by admin.", actorId: adminId },
      ]);
    } else if (targetIdx >= 0) {
      const rows: Array<typeof orderStatusHistory.$inferInsert> = [
        { orderId: order.id, fromStatus: null, toStatus: "PENDING", note: "Order placed.", actorId: null },
      ];
      for (let i = 1; i <= targetIdx; i++) {
        rows.push({
          orderId: order.id,
          fromStatus: flow[i - 1] as S,
          toStatus: flow[i] as S,
          note: `Auto-advanced to ${flow[i]} by seed.`,
          actorId: adminId,
        });
      }
      await db.insert(orderStatusHistory).values(rows);
    }

    if (seed.status === "SHIPPED") createdShipped.push(order.id);
    if (seed.status === "DELIVERED") createdDelivered.push(order.id);
  }

  // 2) Shipments for shipped/delivered orders ──────────────────────────
  for (const orderId of [...createdShipped, ...createdDelivered]) {
    const has = await db.query.shipments.findFirst({
      where: eq(shipments.orderId, orderId),
    });
    if (has) continue;
    const isDelivered = createdDelivered.includes(orderId);
    await db.insert(shipments).values({
      storeId,
      orderId,
      courier: "steadfast",
      trackingCode: `STF${100000 + orderId}`,
      consignmentId: `CN-${nanoid(10).toUpperCase()}`,
      status: isDelivered ? "DELIVERED" : "IN_TRANSIT",
      codAmount: "0.00",
      note: isDelivered ? "Delivered to customer." : "Picked up by Steadfast rider.",
      dispatchedBy: adminId,
    });
  }

  // 3) Return requests ─────────────────────────────────────────────────
  if (createdDelivered.length > 0) {
    const targetOrderId = createdDelivered[0]!;
    const hasReturn = await db.query.returnRequests.findFirst({
      where: eq(returnRequests.orderId, targetOrderId),
    });
    if (!hasReturn) {
      const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, targetOrderId),
      });
      if (items.length > 0) {
        await db.insert(returnRequests).values({
          storeId,
          orderId: targetOrderId,
          userId: customerId,
          reason: "Item arrived damaged in transit. Requesting refund.",
          items: items.slice(0, 1).map((it) => ({
            orderItemId: it.id,
            quantity: 1,
          })),
          status: "PENDING",
        });
      }
    }
  }
  if (createdDelivered.length > 1) {
    const targetOrderId = createdDelivered[1]!;
    const hasReturn = await db.query.returnRequests.findFirst({
      where: eq(returnRequests.orderId, targetOrderId),
    });
    if (!hasReturn) {
      const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, targetOrderId),
      });
      if (items.length > 0) {
        await db.insert(returnRequests).values({
          storeId,
          orderId: targetOrderId,
          userId: null,
          reason: "Wrong size, would like to exchange.",
          items: items.map((it) => ({ orderItemId: it.id, quantity: 1 })),
          status: "APPROVED",
          adminNote: "Approved — refund processed via bKash.",
          refundAmount: "1250.00",
          resolvedBy: adminId,
          resolvedAt: new Date(),
        });
      }
    }
  }

  // 4) Customer blacklist ──────────────────────────────────────────────
  const blacklistSeeds = [
    {
      phone: "+8801555555555",
      reason: "REPEATED_REFUSAL" as const,
      note: "Refused 3 COD deliveries in last 30 days.",
    },
    {
      phone: "+8801666666666",
      reason: "FAKE_ORDERS" as const,
      note: "Placed multiple bogus orders with invalid addresses.",
    },
    {
      email: "fraudster@example.com",
      reason: "FRAUD" as const,
      note: "Chargeback fraud reported by payment gateway.",
    },
  ];
  for (const b of blacklistSeeds) {
    const where = b.phone
      ? and(eq(customerBlacklist.storeId, storeId), eq(customerBlacklist.phone, b.phone))
      : and(eq(customerBlacklist.storeId, storeId), eq(customerBlacklist.email, b.email!));
    const existing = await db.query.customerBlacklist.findFirst({ where });
    if (existing) continue;
    await db.insert(customerBlacklist).values({
      storeId,
      phone: b.phone ?? null,
      email: b.email ?? null,
      reason: b.reason,
      note: b.note,
      createdBy: adminId,
    });
  }

  // 5) Notifications for admin (mix of read + unread) ──────────────────
  const existingNotifs = await db.query.notifications.findMany({
    where: eq(notifications.userId, adminId),
    limit: 1,
  });
  if (existingNotifs.length === 0) {
    const now = Date.now();
    await db.insert(notifications).values([
      {
        storeId,
        userId: adminId,
        type: "order.created",
        title: "New order received",
        body: "Order #1001 from Rashed Karim — ৳1,250 (COD).",
        read: false,
        createdAt: new Date(now - 5 * 60_000),
      },
      {
        storeId,
        userId: adminId,
        type: "return.requested",
        title: "Return requested",
        body: "Customer requested a return on order #1004 (damaged item).",
        read: false,
        createdAt: new Date(now - 35 * 60_000),
      },
      {
        storeId,
        userId: adminId,
        type: "stock.low",
        title: "Low stock warning",
        body: "Premium Wooden Tasbih is below the low-stock threshold.",
        read: false,
        createdAt: new Date(now - 2 * 3600_000),
      },
      {
        storeId,
        userId: adminId,
        type: "order.delivered",
        title: "Order delivered",
        body: "Order #1003 marked delivered by Steadfast.",
        read: true,
        createdAt: new Date(now - 26 * 3600_000),
      },
      {
        storeId,
        userId: adminId,
        type: "refund.processed",
        title: "Refund processed",
        body: "Refund of ৳1,250 sent for order #1004.",
        read: true,
        createdAt: new Date(now - 50 * 3600_000),
      },
    ]);
  }

  // 6) Newsletter subscribers ──────────────────────────────────────────
  const newsletterSeeds = [
    "subscriber1@example.com",
    "subscriber2@example.com",
    "ramadan-fan@example.com",
    "gift-shopper@example.com",
  ];
  for (const email of newsletterSeeds) {
    await db
      .insert(newsletterSubscribers)
      .values({ storeId, email, source: "footer" })
      .onConflictDoNothing();
  }

  // 7) Wishlist entries ────────────────────────────────────────────────
  let wishlistId: number | undefined;
  const existingWishlist = await db.query.wishlists.findFirst({
    where: and(eq(wishlists.storeId, storeId), eq(wishlists.userId, customerId)),
  });
  if (existingWishlist) {
    wishlistId = existingWishlist.id;
  } else {
    const [w] = await db
      .insert(wishlists)
      .values({ storeId, userId: customerId })
      .returning();
    wishlistId = w?.id;
  }
  if (wishlistId) {
    for (const p of productRows.slice(0, 3)) {
      await db
        .insert(wishlistItems)
        .values({ wishlistId, productId: p.id })
        .onConflictDoNothing();
    }
  }

  // 8) Audit log entries ───────────────────────────────────────────────
  const existingAudit = await db.query.auditLogs.findFirst({
    where: eq(auditLogs.storeId, storeId),
  });
  if (!existingAudit) {
    await db.insert(auditLogs).values([
      {
        storeId,
        actorId: adminId,
        action: "order.status.updated",
        entityType: "order",
        entityId: "1003",
        before: { status: "PROCESSING" },
        after: { status: "SHIPPED" },
        ip: "127.0.0.1",
      },
      {
        storeId,
        actorId: adminId,
        action: "return.approved",
        entityType: "return_request",
        entityId: "2",
        before: { status: "PENDING" },
        after: { status: "APPROVED", refundAmount: "1250.00" },
        ip: "127.0.0.1",
      },
      {
        storeId,
        actorId: adminId,
        action: "blacklist.added",
        entityType: "customer_blacklist",
        entityId: "1",
        before: null,
        after: { phone: "+8801555555555", reason: "REPEATED_REFUSAL" },
        ip: "127.0.0.1",
      },
      {
        storeId,
        actorId: adminId,
        action: "courier.dispatched",
        entityType: "shipment",
        entityId: "1",
        before: null,
        after: { courier: "steadfast", orderId: 1003 },
        ip: "127.0.0.1",
      },
    ]);
  }

  // 9) Force one variant into low-stock for the low-stock report ───────
  const firstVariantId = productRows[2]?.variantId;
  if (firstVariantId) {
    await db
      .update(inventory)
      .set({ stockOnHand: 2, stockAvailable: 2, lowStockThreshold: 5 })
      .where(eq(inventory.variantId, firstVariantId));
  }

  console.log("Operational data ready (orders, shipments, returns, blacklist, notifications, audit log)");
}

async function main() {
  console.log("Seeding Niyamah demo data...");
  const store = await ensureStore();
  const admin = await ensureAdmin();
  const customer = await ensureDemoCustomer();
  const productRows = await ensureCatalog(store.id);
  await ensureShipping(store.id);
  await ensureMarketing(store.id, productRows);
  await ensureBlog(store.id, admin.id);
  await ensureReviewsAndOrders(store.id, customer.id, productRows);
  await ensureOperations(store.id, admin.id, customer.id, productRows);
  console.log("Seed complete.");
  console.log(`Admin login: ${ADMIN_EMAIL}`);
  console.log("Demo customer login: customer@niyamah.test / Customer@12345");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
