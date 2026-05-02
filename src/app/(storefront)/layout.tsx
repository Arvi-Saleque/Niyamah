import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { TopBar } from "@/components/storefront/top-bar";
import { WhatsAppFloat } from "@/components/storefront/whatsapp-float";
import { getHomepageContent } from "@/modules/storefront/homepage-content";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getHomepageContent();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <TopBar
        phone="01760-982072"
        items={[
          { icon: "card", text: "Cash on Delivery Available" },
          { icon: "message", text: "Hotline: 01760-982072" },
          { icon: "truck", text: "Fast Delivery in Bangladesh" },
          { icon: "message", text: "WhatsApp Order Support" },
        ]}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {content.whatsapp.enabled && (
        <WhatsAppFloat
          phoneNumber={content.whatsapp.phoneNumber}
          message={content.whatsapp.defaultMessage}
        />
      )}
    </div>
  );
}
