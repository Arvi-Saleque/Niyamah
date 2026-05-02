"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

export interface MegaMenuCategory {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MegaMenuProps {
  categories?: MegaMenuCategory[];
  className?: string;
}

const DEFAULT_CATEGORIES: MegaMenuCategory[] = [
  { label: "All Products", href: "/products" },
  {
    label: "Apparel",
    href: "/category/apparel",
    children: [
      { label: "Men", href: "/category/apparel?gender=men" },
      { label: "Women", href: "/category/apparel?gender=women" },
      { label: "Kids", href: "/category/apparel?gender=kids" },
    ],
  },
  {
    label: "Accessories",
    href: "/category/accessories",
    children: [
      { label: "Bags", href: "/category/accessories?type=bags" },
      { label: "Jewellery", href: "/category/accessories?type=jewellery" },
      { label: "Watches", href: "/category/accessories?type=watches" },
    ],
  },
  {
    label: "Home & Living",
    href: "/category/home-living",
    children: [
      { label: "Decor", href: "/category/home-living?type=decor" },
      { label: "Kitchen", href: "/category/home-living?type=kitchen" },
      { label: "Bedding", href: "/category/home-living?type=bedding" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

/** Desktop horizontal nav bar with hover-triggered dropdown columns. */
export function MegaMenu({ categories = DEFAULT_CATEGORIES, className }: MegaMenuProps) {
  return (
    <nav
      className={cn(
        "hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] md:block",
        className,
      )}
    >
      <Container>
        <ul className="flex items-center gap-0">
          {categories.map((cat) => (
            <li key={cat.href} className="group relative">
              <Link
                href={cat.href}
                className="flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
              >
                {cat.label}
                {cat.children && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
              </Link>

              {/* Dropdown */}
              {cat.children && (
                <div className="invisible absolute left-0 top-full z-50 min-w-[180px] rounded-b-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {cat.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
