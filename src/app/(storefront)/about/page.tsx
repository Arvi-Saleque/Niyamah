import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Niyamah",
  description:
    "Discover the story, mission, and craftsmanship behind Niyamah's modest fashion.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        About Niyamah
      </h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">
        Modest, modern, and meaningful. Niyamah is a Bangladeshi fashion house
        crafting timeless wardrobe staples that honor tradition while embracing
        contemporary design.
      </p>

      <section className="mt-10 space-y-4 text-[var(--color-text-secondary)]">
        <h2
          className="text-xl font-medium text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our promise
        </h2>
        <p>
          Every piece is responsibly sourced, carefully tailored, and quality
          checked before reaching your door. We believe modest fashion can be
          both modern and effortless.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[var(--color-text-secondary)]">
        <h2
          className="text-xl font-medium text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sustainability
        </h2>
        <p>
          We work with small-batch ateliers across Bangladesh to minimise waste
          and support local artisans. Our packaging is fully recyclable.
        </p>
      </section>
    </div>
  );
}
