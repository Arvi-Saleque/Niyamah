import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Niyamah — Premium E-Commerce",
    template: "%s | Niyamah",
  },
  description: "Premium e-commerce experience — curated products, fast delivery, trusted quality.",
  keywords: ["ecommerce", "online shopping", "bangladesh", "premium products"],
  authors: [{ name: "Niyamah" }],
  creator: "Niyamah",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Niyamah",
    title: "Niyamah — Premium E-Commerce",
    description:
      "Premium e-commerce experience — curated products, fast delivery, trusted quality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niyamah — Premium E-Commerce",
    description:
      "Premium e-commerce experience — curated products, fast delivery, trusted quality.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
