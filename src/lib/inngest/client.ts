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
};
