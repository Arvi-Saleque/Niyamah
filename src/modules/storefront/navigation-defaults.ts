/**
 * Client-safe: types + default values only — NO database or Node.js imports.
 * Both the storefront site-header and the admin navigation editor import from here.
 * Server-only DB logic lives in `navigation-content.ts`.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

/** Used by the `feature-columns` template (one column = image + heading + sub-links). */
export interface NavFeatureColumn {
  /** Cloudinary URL. Optional — falls back to gradient placeholder. */
  image?: string;
  /** Optional gradient classes used when no image is set, e.g. "from-[#f5f1e7] to-[#e4eadc]". */
  tone?: string;
  title: string;
  href: string;
  links: NavLink[];
}

/** Used by the `mega-list` template (one column = title + flat link list, no images). */
export interface NavListColumn {
  title: string;
  href: string;
  links: NavLink[];
}

/** Used by the `image-tiles` template (one tile = square image + label below). */
export interface NavTile {
  image?: string;
  tone?: string;
  label: string;
  href: string;
}

interface NavPanelBase {
  /** Stable id used for React keys and admin reordering. */
  id: string;
  /** Top-level menu label (e.g. "NEW", "Women", "Gifts"). */
  label: string;
  /** Where the top-level label links to. */
  href: string;
  /**
   * `pinned: true` means admin cannot delete or reorder this panel out of position 1.
   * Reserved for the "NEW" slot.
   */
  pinned?: boolean;
}

export type NavPanel =
  | (NavPanelBase & { template: "feature-columns"; columns: NavFeatureColumn[] })
  | (NavPanelBase & { template: "mega-list"; columns: NavListColumn[] })
  | (NavPanelBase & { template: "image-tiles"; tiles: NavTile[] });

export type NavTemplate = NavPanel["template"];

export interface NavigationData {
  panels: NavPanel[];
}

export const NAVIGATION_BLOCK_KEY = "navigationMenu" as const;

// ─────────────────────────────────────────────
// Defaults — copied from the previous hardcoded NAV_PANELS in site-header.tsx
// ─────────────────────────────────────────────

export const NAVIGATION_DEFAULTS: NavigationData = {
  panels: [
    {
      id: "new",
      label: "NEW",
      href: "/products?sort=new",
      template: "feature-columns",
      pinned: true,
      columns: [
        {
          title: "New Arrivals",
          href: "/products?sort=new",
          tone: "from-[#f5f1e7] via-[#e7eadf] to-[#f8f5ef]",
          links: [
            { label: "Quran", href: "/category/quran" },
            { label: "Gift boxes", href: "/category/gift-box" },
            { label: "Prayer mats", href: "/category/prayer-mat" },
            { label: "Tasbih", href: "/category/tasbih" },
          ],
        },
        {
          title: "Ramadan Edit",
          href: "/campaigns/ramadan",
          tone: "from-[#eaf6dd] via-[#f7f1e5] to-white",
          links: [
            { label: "Daily recitation", href: "/search?q=daily%20quran" },
            { label: "Family gifts", href: "/search?q=family%20gift" },
            { label: "Bundles", href: "/search?q=bundle" },
          ],
        },
        {
          title: "Premium Sets",
          href: "/category/gift-box",
          tone: "from-[#f3efe7] via-[#dfe8d8] to-[#faf7ee]",
          links: [
            { label: "For parents", href: "/search?q=gift%20for%20parents" },
            { label: "For teachers", href: "/search?q=gift%20for%20teachers" },
            { label: "For weddings", href: "/search?q=wedding%20gift" },
          ],
        },
        {
          title: "Learning Guides",
          href: "/blog",
          tone: "from-[#f7f7f7] via-[#e8eee5] to-[#f9f5ec]",
          links: [
            { label: "Quran guide", href: "/blog" },
            { label: "Gift guide", href: "/blog" },
            { label: "Care guide", href: "/blog" },
          ],
        },
      ],
    },
    {
      id: "quran",
      label: "Quran",
      href: "/category/quran",
      template: "mega-list",
      columns: [
        {
          title: "By Translation",
          href: "/category/quran",
          links: [
            { label: "Bengali Quran", href: "/category/bengali-quran" },
            { label: "English Quran", href: "/category/english-quran" },
            { label: "Arabic Quran", href: "/category/arabic-quran" },
            { label: "Word by Word", href: "/search?q=word%20by%20word%20quran" },
          ],
        },
        {
          title: "By Use",
          href: "/category/quran",
          links: [
            { label: "Daily recitation", href: "/search?q=daily%20quran" },
            { label: "For beginners", href: "/search?q=beginner%20quran" },
            { label: "For children", href: "/search?q=children%20quran" },
            { label: "Color coded", href: "/search?q=color%20coded%20quran" },
          ],
        },
        {
          title: "Format",
          href: "/products",
          links: [
            { label: "Pocket size", href: "/search?q=pocket%20quran" },
            { label: "Large print", href: "/search?q=large%20print%20quran" },
            { label: "Hardcover", href: "/search?q=hardcover%20quran" },
            { label: "Gift edition", href: "/search?q=gift%20quran" },
          ],
        },
        {
          title: "Highlights",
          href: "/products",
          links: [
            { label: "Best sellers", href: "/products?sort=best" },
            { label: "New arrivals", href: "/products?sort=new" },
            { label: "Under Tk 1000", href: "/search?q=quran%20under%201000" },
            { label: "View all", href: "/category/quran" },
          ],
        },
      ],
    },
    {
      id: "prayer",
      label: "Prayer",
      href: "/category/prayer-mat",
      template: "mega-list",
      columns: [
        {
          title: "Prayer Mats",
          href: "/category/prayer-mat",
          links: [
            { label: "View all", href: "/category/prayer-mat" },
            { label: "Travel mats", href: "/search?q=travel%20prayer%20mat" },
            { label: "Premium mats", href: "/search?q=premium%20prayer%20mat" },
            { label: "Gift mats", href: "/search?q=gift%20prayer%20mat" },
          ],
        },
        {
          title: "Dhikr",
          href: "/category/tasbih",
          links: [
            { label: "Tasbih", href: "/category/tasbih" },
            { label: "Digital counters", href: "/search?q=digital%20tasbih" },
            { label: "Stone beads", href: "/search?q=stone%20tasbih" },
            { label: "Gift tasbih", href: "/search?q=gift%20tasbih" },
          ],
        },
        {
          title: "Essentials",
          href: "/products",
          links: [
            { label: "Prayer caps", href: "/search?q=prayer%20cap" },
            { label: "Attar", href: "/search?q=attar" },
            { label: "Books", href: "/search?q=islamic%20books" },
            { label: "Bundles", href: "/search?q=prayer%20bundle" },
          ],
        },
      ],
    },
    {
      id: "gifts",
      label: "Gifts",
      href: "/category/gift-box",
      template: "image-tiles",
      tiles: [
        {
          label: "For Parents",
          href: "/search?q=gift%20for%20parents",
          tone: "from-[#f8f5ef] to-[#e7eadf]",
        },
        {
          label: "For Her",
          href: "/search?q=islamic%20gift%20for%20her",
          tone: "from-[#f2ebe3] to-[#e4eadc]",
        },
        {
          label: "For Him",
          href: "/search?q=islamic%20gift%20for%20him",
          tone: "from-[#e9eee2] to-[#f7f1e8]",
        },
        {
          label: "Wedding",
          href: "/search?q=islamic%20wedding%20gift",
          tone: "from-[#faf7ee] to-[#e7eadf]",
        },
      ],
    },
    {
      id: "books",
      label: "Books",
      href: "/category/books",
      template: "mega-list",
      columns: [
        {
          title: "Learning",
          href: "/category/books",
          links: [
            { label: "Hadith", href: "/search?q=hadith" },
            { label: "Dua books", href: "/search?q=dua%20book" },
            { label: "Seerah", href: "/search?q=seerah" },
            { label: "Children's books", href: "/search?q=islamic%20children%20books" },
          ],
        },
        {
          title: "Guides",
          href: "/blog",
          links: [
            { label: "Quran buying guide", href: "/blog" },
            { label: "Gift guide", href: "/blog" },
            { label: "Prayer essentials", href: "/blog" },
            { label: "Care guide", href: "/blog" },
          ],
        },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact",
      template: "image-tiles",
      tiles: [
        {
          label: "WhatsApp",
          href: "https://wa.me/8801760982072",
          tone: "from-[#e8f0e2] to-[#f8f5ef]",
        },
        {
          label: "Track Order",
          href: "/account/orders",
          tone: "from-[#f7f4ee] to-[#e9eee2]",
        },
        {
          label: "FAQ",
          href: "/faq",
          tone: "from-white to-[#faf7ee]",
        },
      ],
    },
  ],
};
