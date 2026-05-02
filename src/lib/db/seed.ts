import { config } from "dotenv";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";

config({ path: ".env.local" });

import { db } from "./index";
import {
  addresses,
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
  inventory,
  orderItems,
  orders,
  orderStatusHistory,
  payments,
  productImages,
  products,
  productVariants,
  reviews,
  shippingRates,
  shippingZones,
  storeSettings,
  stores,
  storeThemes,
  users,
  variantOptionTypes,
  variantOptionValues,
} from "./schema";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@niyamah.com.bd";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const ADMIN_NAME = "Niyamah Admin";

const CUSTOMER_PASSWORD = "Customer@12345";

const demoImages = {
  hero:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
  fashion:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  home:
    "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=1200&q=80",
  apparel:
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80",
  accessories:
    "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=900&q=80",
  lifestyle:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
  journal:
    "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
};

const productSeeds = [
  {
    name: "Embroidered Cotton Kurti",
    slug: "embroidered-cotton-kurti",
    category: "apparel",
    brand: "niyamah",
    price: "2450.00",
    salePrice: "1990.00",
    sku: "NIY-KURTI-001",
    stock: 28,
    featured: true,
    bestSeller: true,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Soft cotton everyday kurti with subtle embroidery.",
    description:
      "A breathable cotton kurti designed for everyday comfort, with restrained embroidery and a relaxed silhouette.",
    tags: ["cotton", "kurti", "apparel"],
  },
  {
    name: "Handwoven Jamdani Scarf",
    slug: "handwoven-jamdani-scarf",
    category: "accessories",
    brand: "heritage",
    price: "1850.00",
    salePrice: null,
    sku: "HER-SCARF-002",
    stock: 16,
    featured: true,
    bestSeller: false,
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Lightweight woven scarf with Jamdani-inspired motifs.",
    description:
      "A soft accent piece for day or evening styling, woven with delicate geometric motifs.",
    tags: ["scarf", "jamdani", "accessories"],
  },
  {
    name: "Brass Statement Earrings",
    slug: "brass-statement-earrings",
    category: "accessories",
    brand: "heritage",
    price: "1250.00",
    salePrice: "990.00",
    sku: "HER-EAR-003",
    stock: 42,
    featured: false,
    bestSeller: true,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Polished brass earrings for festive and daily wear.",
    description:
      "Warm brass-tone earrings with a clean statement profile, easy to pair with ethnic or modern outfits.",
    tags: ["jewelry", "earrings", "brass"],
  },
  {
    name: "Minimal Leather Tote",
    slug: "minimal-leather-tote",
    category: "bags",
    brand: "urban-weave",
    price: "3650.00",
    salePrice: "3190.00",
    sku: "URB-TOTE-004",
    stock: 10,
    featured: true,
    bestSeller: true,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Structured tote bag with room for workday essentials.",
    description:
      "A clean, structured tote with durable handles and a roomy interior for laptop, notebook, and daily carry.",
    tags: ["bag", "tote", "leather"],
  },
  {
    name: "Ceramic Aroma Candle",
    slug: "ceramic-aroma-candle",
    category: "home-living",
    brand: "homecraft",
    price: "1450.00",
    salePrice: null,
    sku: "HOM-CANDLE-005",
    stock: 24,
    featured: false,
    bestSeller: false,
    image:
      "https://images.unsplash.com/photo-1602874801006-e26ceaf74d4b?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Soy wax candle poured in a reusable ceramic jar.",
    description:
      "A warm home fragrance candle with a reusable ceramic vessel, made for calm evenings and gifting.",
    tags: ["home", "candle", "gift"],
  },
  {
    name: "Linen Cushion Cover Set",
    slug: "linen-cushion-cover-set",
    category: "home-living",
    brand: "homecraft",
    price: "2100.00",
    salePrice: "1750.00",
    sku: "HOM-CUSHION-006",
    stock: 7,
    featured: true,
    bestSeller: false,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Set of two linen cushion covers in muted tones.",
    description:
      "Textured linen cushion covers that add softness to sofas, reading corners, and bedrooms.",
    tags: ["home", "linen", "decor"],
  },
  {
    name: "Everyday Cotton Shirt",
    slug: "everyday-cotton-shirt",
    category: "apparel",
    brand: "urban-weave",
    price: "2290.00",
    salePrice: null,
    sku: "URB-SHIRT-007",
    stock: 35,
    featured: false,
    bestSeller: true,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Crisp cotton shirt for office and weekend wear.",
    description:
      "A reliable cotton shirt with a neat collar, balanced fit, and soft hand-feel.",
    tags: ["shirt", "cotton", "apparel"],
  },
  {
    name: "Gift Box - Festive Essentials",
    slug: "gift-box-festive-essentials",
    category: "gifts",
    brand: "niyamah",
    price: "4200.00",
    salePrice: "3690.00",
    sku: "NIY-GIFT-008",
    stock: 12,
    featured: true,
    bestSeller: false,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A ready-to-send gift set with curated lifestyle pieces.",
    description:
      "A polished gift set made for Eid, weddings, housewarmings, and thoughtful thank-you moments.",
    tags: ["gift", "festive", "bundle"],
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
    metaTitle: "Niyamah - Premium E-Commerce",
    metaDescription:
      "Premium e-commerce experience with curated fashion, home, gifts, and accessories.",
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
    ["Heritage", "heritage", true],
    ["Urban Weave", "urban-weave", false],
    ["Homecraft", "homecraft", false],
  ] as const) {
    brandMap.set(brand[1], await ensureBrand(storeId, brand[0], brand[1], brand[2]));
  }

  const categoryMap = new Map<string, { id: number }>();
  const categorySeed = [
    ["Apparel", "apparel", 1, demoImages.apparel],
    ["Accessories", "accessories", 2, demoImages.accessories],
    ["Bags", "bags", 3, demoImages.lifestyle],
    ["Home & Living", "home-living", 4, demoImages.home],
    ["Gifts", "gifts", 5, demoImages.fashion],
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
          url: demoImages.lifestyle,
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
    where: and(eq(banners.storeId, storeId), eq(banners.title, "Fresh festive arrivals")),
  });
  if (!existingBanner) {
    await db.insert(banners).values([
      {
        storeId,
        title: "Fresh festive arrivals",
        imageUrl: demoImages.hero,
        linkUrl: "/campaigns/eid-style-edit",
        position: "hero",
        status: "active",
        sortOrder: 1,
      },
      {
        storeId,
        title: "Home refresh picks",
        imageUrl: demoImages.home,
        linkUrl: "/category/home-living",
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
    where: and(eq(blogCategories.storeId, storeId), eq(blogCategories.slug, "style-guide")),
  });
  const category =
    existingCategory ??
    (
      await db
        .insert(blogCategories)
        .values({ storeId, name: "Style Guide", slug: "style-guide" })
        .returning()
    )[0];
  if (!category) throw new Error("Could not create blog category.");

  const tagRows = [];
  for (const [name, slug] of [
    ["Styling", "styling"],
    ["Gifting", "gifting"],
    ["Home", "home"],
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
      title: "How to Build a Festive Capsule Wardrobe",
      slug: "festive-capsule-wardrobe",
      excerpt: "A compact guide to mixing statement pieces with everyday essentials.",
      image: demoImages.journal,
      content:
        "Start with breathable basics, add one statement accessory, and keep colors balanced. A capsule wardrobe helps every outfit feel intentional without needing too many pieces.",
    },
    {
      title: "Gift Ideas for Housewarmings",
      slug: "gift-ideas-housewarmings",
      excerpt: "Home-friendly gifts that feel thoughtful, useful, and easy to style.",
      image: demoImages.home,
      content:
        "Candles, cushion covers, and curated gift boxes are easy choices for a new home. Pick textures and neutral tones so the gift works with many interiors.",
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
    await db.insert(reviews).values({
      storeId,
      productId: product.id,
      userId: customerId,
      rating: (idx % 2 === 0 ? 5 : 4) as 4 | 5,
      title: idx % 2 === 0 ? "Beautiful quality" : "Very useful",
      body:
        idx % 2 === 0
          ? "The product looks even better in person and feels thoughtfully made."
          : "Good finish, accurate photos, and quick delivery.",
      status: "APPROVED",
      verifiedPurchase: true,
    });
  }
  console.log("Orders, address, and reviews ready");
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
