import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { TopBar } from "@/components/storefront/top-bar";
import { MegaMenu } from "@/components/storefront/mega-menu";
import { WhatsAppFloat } from "@/components/storefront/whatsapp-float";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <TopBar />
      <SiteHeader />
      <MegaMenu />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
