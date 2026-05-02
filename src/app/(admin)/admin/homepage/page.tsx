import { HomepageManager } from "@/components/admin/homepage-manager";

export const metadata = { title: "Homepage Admin" };

export default function AdminHomepagePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
            Storefront CMS
          </p>
          <h1 className="mt-2 text-3xl font-bold">Homepage Admin</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            A simple visual editor for the homepage. Change the words, links,
            offers, support copy, and trust messages without touching code.
            Saved changes appear on the storefront after the 5 minute cache refresh.
          </p>
        </div>
      </header>
      <HomepageManager />
    </div>
  );
}
