import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { getNavigationContent } from "@/modules/storefront/navigation-content";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getNavigationContent();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <SiteHeader panels={navigation.panels} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
