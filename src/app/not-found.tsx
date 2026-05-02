import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
      {/* Decorative number */}
      <div className="relative mb-8 select-none">
        <span
          className="text-[180px] font-bold leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-heading)",
            background: "linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 50%, var(--color-accent-dark) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </span>
        {/* Subtle circle behind */}
        <div
          className="absolute inset-0 -z-10 mx-auto rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Message */}
      <h1
        className="mb-3 text-3xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Page Not Found
      </h1>
      <p className="mb-10 max-w-md text-base text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-text-inverse)] shadow-sm transition-colors hover:bg-[var(--color-accent)]"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border-strong)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-accent)]"
        >
          <Search className="h-4 w-4" />
          Browse Products
        </Link>
      </div>

      {/* Helpful links */}
      <div className="mt-14 border-t border-[var(--color-border)] pt-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
          You might be looking for
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Apparel", href: "/category/apparel" },
            { label: "Accessories", href: "/category/accessories" },
            { label: "Home & Living", href: "/category/home-living" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
            { label: "FAQ", href: "/faq" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Brand mark */}
      <p
        className="mt-12 text-sm font-medium text-[var(--color-accent)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Niyamah
      </p>
    </div>
  );
}
