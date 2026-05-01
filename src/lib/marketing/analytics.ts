/**
 * Client-side analytics helpers.
 * Renders provider script tags only when env vars are present; safe no-op otherwise.
 */

export const analyticsConfig = {
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
};

export interface CommerceEvent {
  event: string;
  ecommerce?: {
    currency?: string;
    value?: number;
    items?: Array<{
      item_id: string | number;
      item_name: string;
      price?: number;
      quantity?: number;
      item_brand?: string;
      item_category?: string;
    }>;
    transaction_id?: string;
  };
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function pushDataLayer(event: CommerceEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

export const analytics = {
  viewItem(item: { id: number | string; name: string; price: number; brand?: string; category?: string }) {
    pushDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            ...(item.brand && { item_brand: item.brand }),
            ...(item.category && { item_category: item.category }),
          },
        ],
      },
    });
    trackPixel("ViewContent", {
      content_ids: [String(item.id)],
      content_name: item.name,
      content_type: "product",
      value: item.price,
      currency: "BDT",
    });
  },
  addToCart(item: { id: number | string; name: string; price: number; quantity: number }) {
    pushDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: item.price * item.quantity,
        items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
      },
    });
    trackPixel("AddToCart", {
      content_ids: [String(item.id)],
      value: item.price * item.quantity,
      currency: "BDT",
    });
  },
  beginCheckout(value: number, items: Array<{ id: number | string; name: string; price: number; quantity: number }>) {
    pushDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value,
        items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
      },
    });
    trackPixel("InitiateCheckout", { value, currency: "BDT" });
  },
  purchase(orderId: string | number, value: number, items: Array<{ id: number | string; name: string; price: number; quantity: number }>) {
    pushDataLayer({
      event: "purchase",
      ecommerce: {
        currency: "BDT",
        value,
        transaction_id: String(orderId),
        items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
      },
    });
    trackPixel("Purchase", { value, currency: "BDT" });
  },
};
