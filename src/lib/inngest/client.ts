import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "niyamah",
  name: "Niyamah",
});

/**
 * Inngest event registry — keep this file as the single source of truth so
 * downstream functions can use a typed `name` field.
 */
export type InngestEvents = {
  "checkout/inventory.reserved": { data: { orderId: number } };
  "marketing/cart.abandoned": { data: { cartId: number; userId: string | null } };
  "marketing/newsletter.subscribed": { data: { email: string } };
  "cart/updated": { data: { cartId: number; userId: string | null } };
  "commerce/order.created": {
    data: {
      orderId: number;
      total: number;
      currency: string;
      email?: string;
      phone?: string;
      items?: Array<{ id: number; quantity: number; price: number }>;
    };
  };
  "commerce/order.high-risk": {
    data: {
      orderId: number;
      score: number;
      reasons: string[];
      total: number;
      paymentMethod: string;
    };
  };
  "commerce/order.status-changed": {
    data: {
      orderId: number;
      newStatus: string;
      note?: string | null;
      recipientEmail?: string | null;
    };
  };
  "commerce/return.requested": {
    data: {
      returnRequestId: number;
      orderId: number;
      userId: string | null;
    };
  };
  "commerce/refund.approved": {
    data: {
      returnRequestId: number;
      orderId: number;
      refundAmount: number;
      currency: string;
      recipientEmail?: string | null;
    };
  };
};
