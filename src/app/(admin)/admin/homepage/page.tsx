import { HomepageManager } from "@/components/admin/homepage-manager";

export const metadata = { title: "Homepage · Admin" };

export default function AdminHomepagePage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Homepage Content</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Edit every block on the storefront homepage. Changes go live within 5
          minutes (storefront cache).
        </p>
      </header>
      <HomepageManager />
    </div>
  );
}
