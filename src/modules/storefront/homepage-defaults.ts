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
  productName?: string;
  cardName?: string;
  subheading?: string;
  productImage?: string;
  productImageAlt?: string;
  infoItems?: { label: string; value: string }[];
  colors?: {
    purple: string;
    lightBlue: string;
    green: string;
    infoGreen: string;
    white: string;
    orange: string;
    accent: string;
    shadow: string;
  };
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
  purchasedItem?: string;
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
      id: "barakah",
      eyebrow: "Premium Islamic Essentials",
      title: "Bring Barakah",
      highlight: "Into Daily Life",
      subheading: "Color-coded Quran",
      subtitle:
        "Shop authentic Quran, prayer essentials, tasbih, and Islamic gifts with Cash on Delivery and trusted support across Bangladesh.",
      badge: "COD Available",
      ctaPrimary: { label: "Shop Quran Collection", href: "/category/quran" },
      ctaSecondary: { label: "Explore Gift Boxes", href: "/category/gift-box" },
      productName: "Premium Quran",
      cardName: "Quran",
      productImage: "/logo.png",
      productImageAlt: "Niyamah product feature",
      infoItems: [
        { label: "Delivery", value: "1-3 days" },
        { label: "Payment", value: "COD" },
        { label: "Return", value: "7 days" },
      ],
      colors: {
        purple: "#123d2d",
        lightBlue: "#f1ead9",
        green: "#0b4a34",
        infoGreen: "#073827",
        white: "#f1ead9",
        orange: "#f1ead9",
        accent: "#c6a05d",
        shadow: "rgba(4, 36, 25, 0.22)",
      },
      rightGradient: "from-[#EAF4D5] via-[#FAF7EE] to-[#EFE6D2]",
      decoration: "Quran",
      popularLinks: [
        { label: "Quran", href: "/category/quran" },
        { label: "Bengali Quran", href: "/category/bengali-quran" },
        { label: "Gift Box", href: "/category/gift-box" },
        { label: "Prayer Mat", href: "/category/prayer-mat" },
      ],
    },
    {
      id: "gift",
      eyebrow: "Meaningful Islamic Gifts",
      title: "Gift Boxes",
      highlight: "Made with Love",
      subheading: "Ready to gift",
      subtitle:
        "Curated Quran, tasbih, and prayer essentials packaged beautifully \u2014 a thoughtful gift for parents, teachers, and loved ones.",
      badge: "Gift Ready",
      ctaPrimary: { label: "Shop Gift Boxes", href: "/category/gift-box" },
      ctaSecondary: { label: "Build a Gift", href: "#gift-builder" },
      productName: "Islamic Gift Box",
      cardName: "Gift Box",
      productImage: "/logo.png",
      productImageAlt: "Niyamah gift box feature",
      infoItems: [
        { label: "Packaging", value: "Gift ready" },
        { label: "Support", value: "WhatsApp" },
        { label: "Delivery", value: "Nationwide" },
      ],
      colors: {
        purple: "#123d2d",
        lightBlue: "#f1ead9",
        green: "#0d5138",
        infoGreen: "#073827",
        white: "#f1ead9",
        orange: "#f1ead9",
        accent: "#c6a05d",
        shadow: "rgba(4, 36, 25, 0.22)",
      },
      rightGradient: "from-[#EAF4D5] via-[#FAF7EE] to-[#EFE6D2]",
      decoration: "Gift",
      popularLinks: [
        { label: "For Parents", href: "/products?intent=parents" },
        { label: "For Teachers", href: "/products?intent=teacher" },
        { label: "Under \u09f31000", href: "/products?max=1000" },
      ],
    },
    {
      id: "prayer",
      eyebrow: "Daily Worship Essentials",
      title: "Prayer Mats",
      highlight: "& Tasbih",
      subheading: "Daily worship essentials",
      subtitle:
        "Soft prayer mats, premium tasbih, and worship essentials selected for everyday use \u2014 with Cash on Delivery and easy returns.",
      ctaPrimary: { label: "Shop Prayer Mats", href: "/category/prayer-mat" },
      ctaSecondary: { label: "Shop Tasbih", href: "/category/tasbih" },
      productName: "Prayer Essentials",
      cardName: "Prayer",
      productImage: "/logo.png",
      productImageAlt: "Niyamah prayer essentials feature",
      infoItems: [
        { label: "Use", value: "Daily" },
        { label: "Quality", value: "Selected" },
        { label: "Help", value: "Live chat" },
      ],
      colors: {
        purple: "#123d2d",
        lightBlue: "#f1ead9",
        green: "#0b4a34",
        infoGreen: "#073827",
        white: "#f1ead9",
        orange: "#f1ead9",
        accent: "#c6a05d",
        shadow: "rgba(4, 36, 25, 0.22)",
      },
      rightGradient: "from-[#EAF4D5] via-[#FAF7EE] to-[#EFE6D2]",
      decoration: "Prayer",
      popularLinks: [
        { label: "Premium Tasbih", href: "/category/tasbih" },
        { label: "Travel Mat", href: "/category/prayer-mat" },
        { label: "Quran Stand", href: "/products?q=quran-stand" },
      ],
    },
  ] satisfies HeroSlideData[],

  ticker: {
    items: [
      { icon: "card", text: "Cash on Delivery available across Bangladesh" },
      { icon: "message", text: "Hotline: 01760-982072 \u00b7 WhatsApp Order Support" },
      { icon: "truck", text: "Fast delivery in 1\u20133 days nationwide" },
      { icon: "refresh", text: "7-day easy return policy" },
      { icon: "shield", text: "Verified Quran & Islamic products" },
    ] satisfies TickerItem[],
  },

  discovery: {
    eyebrow: "Quick Finder",
    title: "What are you looking for?",
    subtitle: "Search Quran, gift boxes, tasbih, prayer mats, and Islamic essentials.",
    placeholder: "Search Quran, tasbih, prayer mat, gift box\u2026",
    trending: [
      "Color-coded Quran",
      "Bengali Quran",
      "Gift for parents",
      "Tasbih",
      "Prayer mat",
      "Under \u09f31000",
    ],
  } satisfies DiscoveryData,

  needs: {
    eyebrow: "Peaceful Shopping",
    title: "Shop by Worship Need",
    subtitle: "Find what you need for recitation, prayer, gifting, and daily remembrance.",
    tiles: [
      { label: "For Quran Recitation", href: "/category/quran", icon: "book", tone: "accent", badge: "Popular" },
      { label: "For Prayer", href: "/category/prayer-mat", icon: "sparkles" },
      { label: "For Dhikr", href: "/category/tasbih", icon: "heart" },
      { label: "Islamic Gifts", href: "/category/gift-box", icon: "gift", tone: "accent", badge: "Gift" },
      { label: "For Family", href: "/products?intent=family", icon: "home" },
      { label: "Under \u09f31000", href: "/products?max=1000", icon: "tag", tone: "danger", badge: "Value" },
      { label: "Bengali Quran", href: "/category/bengali-quran", icon: "book" },
      { label: "All Products", href: "/products", icon: "bag" },
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
          "Pay in cash to the delivery agent on arrival. Available across all 64 districts of Bangladesh. Inspect your Quran or gift box before you pay \u2014 peace of mind, every order.",
      },
      {
        id: "delivery",
        icon: "truck",
        title: "Fast Delivery",
        short: "1\u20133 days nationwide",
        details:
          "Same-day delivery inside Dhaka for orders placed before 2 PM. 1\u20132 days for major cities (Chattogram, Sylhet, Khulna). 2\u20133 days for all other districts. Free shipping on orders above \u09f32,000.",
      },
      {
        id: "returns",
        icon: "refresh",
        title: "7-Day Returns",
        short: "Easy & hassle-free",
        details:
          "Not happy with your Quran or gift? Return any item within 7 days of delivery \u2014 no questions asked. We arrange free pickup and refund within 48 hours of receiving the return.",
      },
      {
        id: "secure",
        icon: "shield",
        title: "Verified Products",
        short: "Authentic & inspected",
        details:
          "Every Quran, tasbih, and gift box is sourced and inspected by our team. We do not sell counterfeit or low-quality Islamic products. What you order is what you receive.",
      },
      {
        id: "support",
        icon: "message",
        title: "WhatsApp Support",
        short: "Chat anytime",
        details:
          "Need help? Reach our team on WhatsApp 9 AM \u2013 11 PM, every day. Order updates, product questions, returns \u2014 all handled in minutes, not days.",
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
    title: "Curated Islamic Collections",
    subtitle: "Quran, prayer essentials, and meaningful gifts \u2014 chosen with care.",
    cards: [
      {
        eyebrow: "Daily Recitation",
        title: "Premium Quran",
        description:
          "Color-coded Quran, Bengali translation, and easy-reading editions for daily recitation at home.",
        href: "/category/quran",
        cta: "Shop Quran",
        gradient: "from-[#EAF4D5] via-[#FAF7EE] to-[#EFE6D2]",
        decoration: "QURAN",
      },
      {
        eyebrow: "Wrap & Send",
        title: "Islamic Gift Boxes",
        description:
          "Thoughtfully curated gift boxes with Quran, tasbih, and prayer essentials \u2014 ready to be gifted.",
        href: "/category/gift-box",
        cta: "Shop Gift Boxes",
        gradient: "from-[#EAF4D5] via-[#FAF7EE] to-[#EFE6D2]",
        decoration: "GIFT",
      },
      {
        eyebrow: "Daily Worship",
        title: "Prayer & Dhikr",
        description:
          "Soft prayer mats, premium tasbih, and worship essentials for daily prayer and remembrance.",
        href: "/category/prayer-mat",
        cta: "Shop Prayer Essentials",
        gradient: "from-[#043D25] via-[#0A4D2E] to-[#11160F]",
        decoration: "PRAYER",
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
        body: "The color-coded Quran arrived beautifully packaged. Cash on Delivery worked smoothly in Dhaka and the print quality is excellent.",
        location: "Dhaka",
        purchasedItem: "Color-Coded Quran",
      },
      {
        id: "t2",
        name: "Tanvir Hossain",
        rating: 5,
        body: "Gifted the premium gift box to my parents — the tasbih, prayer mat, and Quran were perfectly chosen. Will order again, in sha Allah.",
        location: "Chattogram",
        purchasedItem: "Islamic Gift Box",
      },
      {
        id: "t3",
        name: "Sumaiya Islam",
        rating: 5,
        body: "Quick delivery and the Bengali Quran translation matched exactly what was described. Highly recommend Niyamah for Islamic essentials.",
        location: "Sylhet",
        purchasedItem: "Bengali Quran",
      },
    ],
  } satisfies TestimonialsData,

  whatsapp: {
    phoneNumber: "8801760982072",
    defaultMessage: "Assalamu Alaikum Niyamah \u2014 I have a question about a product.",
    ctaTitle: "Need help before ordering?",
    ctaSubtitle:
      "Ask about Quran size, gift box details, delivery charge, or Cash-on-Delivery on WhatsApp \u2014 we usually reply within minutes.",
    ctaPrimaryLabel: "Chat on WhatsApp",
    ctaSecondaryLabel: "Track Order",
    ctaSecondaryHref: "/account/orders",
    enabled: true,
  } satisfies WhatsAppData,

  flashSale: {
    enabled: true,
    title: "Featured Quran & Gift Box Collection",
    hoursFromNow: 48,
  } satisfies FlashSaleData,
} as const;

export type HomepageBlockKey = keyof typeof HOMEPAGE_DEFAULTS;
export const HOMEPAGE_BLOCK_KEYS = Object.keys(HOMEPAGE_DEFAULTS) as HomepageBlockKey[];
