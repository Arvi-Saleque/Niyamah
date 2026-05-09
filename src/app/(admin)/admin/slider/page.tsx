import { HomepageManager } from "@/components/admin/homepage-manager";

export const metadata = { title: "Slider Admin" };

export default function AdminSliderPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
            Storefront CMS
          </p>
          <h1 className="mt-2 text-3xl font-bold">Homepage Slider</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            Edit the first-screen product slider: cards, product name, image,
            copy, big overlay text, bottom facts, links, and colors.
          </p>
        </div>
      </header>
      <HomepageManager initialBlock="hero" />
    </div>
  );
}
