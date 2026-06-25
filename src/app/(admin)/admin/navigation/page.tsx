import { NavigationManager } from "@/components/admin/navigation-manager";
import { getNavigationAdmin } from "@/modules/storefront/navigation-content";

export const metadata = { title: "Navigation Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const { data, isCustomized, updatedAt } = await getNavigationAdmin();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-accent-dark)] uppercase">
            Storefront CMS
          </p>
          <h1 className="mt-2 text-3xl font-bold">Navigation Menu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            Build the storefront mega-menu. Each top-level item picks a template:
            <span className="font-semibold"> Feature columns</span> (image + heading + sub-links,
            like NEW),
            <span className="font-semibold"> Mega list</span> (heading + flat link list, like
            Men/Women), or
            <span className="font-semibold"> Image tiles</span> (square image grid, like Art of
            Living). The first slot (NEW) is pinned and always visible.
          </p>
        </div>
        {isCustomized && updatedAt && (
          <div className="text-muted-foreground text-right text-xs">
            <div>Customised</div>
            <div>Last saved {new Date(updatedAt).toLocaleString()}</div>
          </div>
        )}
      </header>

      <NavigationManager initial={data} />
    </div>
  );
}
