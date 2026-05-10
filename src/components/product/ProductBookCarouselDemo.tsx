"use client";

import { ProductBookCarousel, type Product } from "./ProductBookCarousel";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Leather-Bound Quran",
    slug: "premium-leather-quran",
    category: "Quran",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=80",
    tagline:
      "Hand-stitched leather cover with gilded edges — a heirloom-quality companion.",
    price: 4500,
    oldPrice: 6000,
    currency: "BDT",
    rating: 4.9,
    reviewCount: 248,
    stockStatus: "In Stock",
    isNew: true,
    features: ["Genuine Leather", "Gilded Edges", "Arabic + Bangla"],
    themeColor: "#0f5132",
  },
  {
    id: "2",
    name: "Crystal Tasbih — 99 Beads",
    slug: "crystal-tasbih-99",
    category: "Tasbih",
    image:
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1400&q=80",
    tagline: "Hand-strung crystal beads with sterling silver counter.",
    price: 1200,
    currency: "BDT",
    rating: 4.7,
    reviewCount: 134,
    stockStatus: "Limited Stock",
    features: ["Cut Crystal", "Silver Counter", "Velvet Pouch"],
    themeColor: "#1e3a8a",
  },
  {
    id: "3",
    name: "Velvet Prayer Mat — Royal Edition",
    slug: "velvet-prayer-mat",
    category: "Prayer Mat",
    image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=1400&q=80",
    tagline: "Ultra-soft Turkish velvet with memory foam padding.",
    price: 2800,
    oldPrice: 3500,
    currency: "BDT",
    rating: 4.8,
    reviewCount: 312,
    stockStatus: "In Stock",
    features: ["Memory Foam", "Anti-Slip", "Washable"],
    themeColor: "#7c2d12",
  },
  {
    id: "4",
    name: "Eid Gift Box — Deluxe",
    slug: "eid-gift-box-deluxe",
    category: "Gift Box",
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=80",
    tagline: "Curated keepsake set: Quran, tasbih, attar, and prayer mat.",
    price: 6500,
    oldPrice: 8000,
    currency: "BDT",
    rating: 5.0,
    reviewCount: 89,
    stockStatus: "Pre Order",
    isFeatured: true,
    features: ["Curated Set", "Premium Box", "Free Card"],
    themeColor: "#581c87",
  },
  {
    id: "5",
    name: "Oud Royale Attar — 12ml",
    slug: "oud-royale-attar",
    category: "Attar",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80",
    tagline: "Aged Cambodian oud blended with rose and saffron.",
    price: 3200,
    currency: "BDT",
    rating: 4.6,
    reviewCount: 76,
    stockStatus: "Out of Stock",
    features: ["Aged Oud", "Long Lasting", "Crystal Bottle"],
    themeColor: "#92400e",
  },
];

export function ProductBookCarouselDemo() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProductBookCarousel
        products={sampleProducts}
        title="Featured Collection"
        subtitle="Turn the page on our hand-picked editorial selection."
        onAddToCart={(p) => console.log("add", p.id)}
        onViewDetails={(p) => console.log("view", p.slug)}
        onWishlist={(p) => console.log("wishlist", p.id)}
      />
    </div>
  );
}

export default ProductBookCarouselDemo;
