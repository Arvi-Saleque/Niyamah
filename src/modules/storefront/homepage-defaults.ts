/**
 * Client-safe: types + default values only — NO database or Node.js imports.
 * Storefront components import from here. Server-only DB logic lives in homepage-content.ts.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface HeroSlideData {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  badge?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  rightGradient: string;
  decoration: string;
  popularLinks?: { label: string; href: string }[];
}

export interface TickerItem {
  icon: string;
  text: string;
}

export interface DiscoveryData {
  eyebrow: string;
  title: string;
  subtitle: string;
  placeholder: string;
  trending: string[];
}

export interface NeedTileData {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  tone?: "default" | "accent" | "danger";
}

export interface NeedsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  tiles: NeedTileData[];
}

export interface TrustItemData {
  id: string;
  icon: string;
  title: string;
  short: string;
  details: string;
}

export interface TrustData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: TrustItemData[];
}

export interface EditorialCardData {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  gradient: string;
  decoration: string;
  isDark?: boolean;
}

export interface EditorialData {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: EditorialCardData[];
}

export interface TestimonialData {
  id: string;
  name: string;
  rating: number;
  body: string;
  location?: string;
}

export interface TestimonialsData {
  items: TestimonialData[];
}

export interface WhatsAppData {
  phoneNumber: string;
  defaultMessage: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  enabled: boolean;
}

export interface FlashSaleData {
  enabled: boolean;
  title: string;
  hoursFromNow: number;
}

export type HomepageContent = {
  hero: HeroSlideData[];
  ticker: { items: TickerItem[] };
  discovery: DiscoveryData;
  needs: NeedsData;
  trust: TrustData;
  editorial: EditorialData;
  testimonials: TestimonialsData;
  whatsapp: WhatsAppData;
  flashSale: FlashSaleData;
};

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

export const HOMEPAGE_DEFAULTS = {
  hero: [
    {
      id: "signature",
      eyebrow: "New Collection · 2026",
      title: "Niyamah",
      highlight: "Signature",
      subtitle:
        "Soft, elegant, curated essentials for modern lifestyle — handpicked from the best of Bangladesh.",
      badge: "New Drop",
      ctaPrimary: { label: "Shop Collection", href: "/products" },
      ctaSecondary: { label: "View Offers", href: "/products?intent=offer" },
      rightGradient: "from-[#e8d5a8] via-[#d4ba85] to-[#b8893d]",
      decoration: "NEW",
      popularLinks: [
        { label: "Women", href: "/category/apparel?gender=women" },
        { label: "Gifts", href: "/products?intent=gift" },
        { label: "Home", href: "/category/home-living" },
        { label: "New Drop", href: "/products?intent=new" },
      ],
    },
    {
      id: "eid",
      eyebrow: "Limited Time",
      title: "Eid Premium",
      highlight: "Drop",
      subtitle:
        "Up to 30% off our most-loved festive picks — refined craftsmanship for every celebration.",
      badge: "Up to 30% off",
      ctaPrimary: { label: "Explore Eid Drop", href: "/products?intent=eid" },
      ctaSecondary: { label: "Gift Ideas", href: "/products?intent=gift" },
      rightGradient: "from-[#1a1814] via-[#3a342a] to-[#7d5b22]",
      decoration: "EID",
      popularLinks: [
        { label: "Festive Wear", href: "/category/apparel" },
        { label: "Premium", href: "/products?premium=1" },
        { label: "Gifts under ৳1500", href: "/products?max=1500" },
      ],
    },
    {
      id: "essentials",
      eyebrow: "The Edit",
      title: "Everyday",
      highlight: "Essentials",
      subtitle:
        "Pieces that earn their place in your wardrobe. Soft fabrics, honest prices, made to last.",
      ctaPrimary: { label: "Shop Essentials", href: "/category/apparel" },
      ctaSecondary: { label: "Best Sellers", href: "/products?sort=popular" },
      rightGradient: "from-[#f3efe6] via-[#ebe5d6] to-[#c9c0a8]",
      decoration: "EDIT",
      popularLinks: [
        { label: "Daily Wear", href: "/products?intent=daily" },
        { label: "Office", href: "/products?intent=office" },
        { label: "Under ৳999", href: "/products?max=999" },
      ],
    },
  ] satisfies HeroSlideData[],

  ticker: {
    items: [
      { icon: "truck", text: "Free delivery on orders over ৳2,000" },
      { icon: "card", text: "Cash on Delivery available nationwide" },
      { icon: "refresh", text: "7-day hassle-free returns" },
      { icon: "message", text: "WhatsApp support 9 AM – 11 PM" },
      { icon: "shield", text: "100% secure checkout" },
    ] satisfies TickerItem[],
  },

  discovery: {
    eyebrow: "Discover",
    title: "What are you looking for today?",
    subtitle: "Search across 1,000+ products — apparel, gifts, home & more.",
    placeholder: "Search dress, gift, skincare, decor…",
    trending: [
      "Eid outfit",
      "Gift under ৳1000",
      "New arrivals",
      "Premium picks",
      "Home decor",
      "Best sellers",
    ],
  } satisfies DiscoveryData,

  needs: {
    eyebrow: "Smart Shopping",
    title: "Shop by Need",
    subtitle: "Don't know the category? Pick the moment.",
    tiles: [
      { label: "For Daily Use", href: "/products?intent=daily", icon: "bag" },
      { label: "For Eid", href: "/products?intent=eid", icon: "sparkles", tone: "accent", badge: "Hot" },
      { label: "Gift Ideas", href: "/products?intent=gift", icon: "gift" },
      { label: "For Office", href: "/products?intent=office", icon: "briefcase" },
      { label: "For Home", href: "/products?intent=home", icon: "home" },
      { label: "Under ৳999", href: "/products?max=999", icon: "tag", tone: "danger", badge: "Save" },
      { label: "Premium Picks", href: "/products?premium=1", icon: "crown", tone: "accent" },
      { label: "Loved by All", href: "/products?sort=rating", icon: "heart" },
    ],
  } satisfies NeedsData,

  trust: {
    eyebrow: "Why Niyamah",
    title: "Promises We Keep",
    subtitle: "Tap any badge for the full story.",
    items: [
      {
        id: "cod",
        icon: "card",
        title: "Cash on Delivery",
        short: "Pay when it arrives",
        details:
          "Pay in cash to the delivery agent on arrival. Available across all 64 districts of Bangladesh. Inspect your product before you pay — peace of mind, every order.",
      },
      {
        id: "delivery",
        icon: "truck",
        title: "Fast Delivery",
        short: "1–3 days nationwide",
        details:
          "Same-day delivery inside Dhaka for orders placed before 2 PM. 1–2 days for major cities (Chattogram, Sylhet, Khulna). 2–3 days for all other districts. Free shipping on orders above ৳2,000.",
      },
      {
        id: "returns",
        icon: "refresh",
        title: "7-Day Returns",
        short: "Easy & hassle-free",
        details:
          "Not happy? Return any item within 7 days of delivery — no questions asked. We'll arrange free pickup and refund within 48 hours of receiving the return.",
      },
      {
        id: "secure",
        icon: "shield",
        title: "Secure Checkout",
        short: "100% protected",
        details:
          "Bank-grade SSL encryption protects every transaction. We never store your card or banking details. All payments processed through PCI-DSS compliant gateways.",
      },
      {
        id: "support",
        icon: "message",
        title: "WhatsApp Support",
        short: "Chat anytime",
        details:
          "Need help? Reach our team on WhatsApp 9 AM – 11 PM, every day. Order updates, product questions, returns — all handled in minutes, not days.",
      },
      {
        id: "verified",
        icon: "star",
        title: "Verified Reviews",
        short: "Real buyers, real ratings",
        details:
          "Every review on Niyamah is from a verified buyer. We never edit, hide, or pay for reviews. What you see is what real customers experienced.",
      },
    ],
  } satisfies TrustData,

  editorial: {
    eyebrow: "The Niyamah Edit",
    title: "Curated Collections",
    subtitle: "More than products — stories you wear, gifts you give, moments you keep.",
    cards: [
      {
        eyebrow: "The Edit",
        title: "Everyday Essentials",
        description:
          "Soft, breathable, made to last. Pieces that earn their place in your wardrobe — every single day.",
        href: "/category/apparel",
        cta: "Shop Essentials",
        gradient: "from-[#f3efe6] via-[#ebe5d6] to-[#e2dccc]",
        decoration: "ESSENTIALS",
      },
      {
        eyebrow: "Wrap & Send",
        title: "Gift Collection",
        description:
          "Thoughtful choices, beautifully packaged. Curated gifts for birthdays, weddings, and every reason in between.",
        href: "/products?intent=gift",
        cta: "Find a Gift",
        gradient: "from-[#e8d5a8] via-[#d4ba85] to-[#b8893d]",
        decoration: "GIFT",
      },
      {
        eyebrow: "Top Shelf",
        title: "Premium Picks",
        description:
          "When good isn't good enough. Our finest craftsmanship, finest fabrics, finest finishes — for moments that matter.",
        href: "/products?premium=1",
        cta: "Explore Premium",
        gradient: "from-[#1a1814] via-[#3a342a] to-[#7d5b22]",
        decoration: "PREMIUM",
        isDark: true,
      },
    ],
  } satisfies EditorialData,

  testimonials: {
    items: [
      {
        id: "t1",
        name: "Ayesha Rahman",
        rating: 5,
        body: "Beautiful packaging and the fabric quality is top-notch. Cash on delivery worked smoothly in Dhaka.",
        location: "Dhaka",
      },
      {
        id: "t2",
        name: "Tanvir Hossain",
        rating: 5,
        body: "Niyamah's craftsmanship truly stands out. Will definitely order again — the gift box was exceptional.",
        location: "Chattogram",
      },
      {
        id: "t3",
        name: "Sumaiya Islam",
        rating: 4,
        body: "Quick delivery and the product matched the photos exactly. Highly recommend Niyamah!",
        location: "Sylhet",
      },
    ],
  } satisfies TestimonialsData,

  whatsapp: {
    phoneNumber: "8801700000000",
    defaultMessage: "Hi Niyamah! I have a question about a product.",
    ctaTitle: "Need help before ordering?",
    ctaSubtitle:
      "Chat with us on WhatsApp — ask product questions, share your cart, or confirm a Cash-on-Delivery order in seconds.",
    ctaPrimaryLabel: "Chat Now",
    ctaSecondaryLabel: "Contact Us",
    ctaSecondaryHref: "/contact",
    enabled: true,
  } satisfies WhatsAppData,

  flashSale: {
    enabled: true,
    title: "Flash Sale · Ending Soon",
    hoursFromNow: 48,
  } satisfies FlashSaleData,
} as const;

export type HomepageBlockKey = keyof typeof HOMEPAGE_DEFAULTS;
export const HOMEPAGE_BLOCK_KEYS = Object.keys(HOMEPAGE_DEFAULTS) as HomepageBlockKey[];
