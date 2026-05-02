import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { TopBar } from "@/components/storefront/top-bar";
import { MegaMenu } from "@/components/storefront/mega-menu";
import { WhatsAppFloat } from "@/components/storefront/whatsapp-float";
import { LiveShoppingProof } from "@/components/storefront/live-shopping-proof";
import { AssistantDrawer } from "@/components/storefront/assistant-drawer";
import { getHomepageContent } from "@/modules/storefront/homepage-content";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getHomepageContent();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <TopBar items={content.ticker.items} />
      <SiteHeader />
      <MegaMenu />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {content.whatsapp.enabled && (
        <>
          <WhatsAppFloat
            phoneNumber={content.whatsapp.phoneNumber}
            message={content.whatsapp.defaultMessage}
          />
          <AssistantDrawer whatsappPhone={content.whatsapp.phoneNumber} />
        </>
      )}
      <LiveShoppingProof />
    </div>
  );
}
