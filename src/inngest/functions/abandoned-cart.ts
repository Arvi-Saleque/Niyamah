import { eq } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { carts, cartItems, users } from "@/lib/db/schema";

/**
 * Abandoned-cart reminder.
 * Triggered by `cart/updated` event. After a 24h delay, if the cart still has
 * items AND the cart's updatedAt has not advanced (no further activity), send
 * a reminder email to the cart owner (registered users only).
 *
 * Dispatch best-effort from cart-add API; cart updates re-issue the event,
 * which uses Inngest's idempotency on cartId to debounce.
 */
export const abandonedCartReminder = inngest.createFunction(
  {
    id: "abandoned-cart-reminder",
    name: "Abandoned cart reminder",
    // Debounce: at most one in-flight per cart at a time
    debounce: { key: "event.data.cartId", period: "1h" },
    triggers: [{ event: "cart/updated" }],
  },
  async ({ event, step }) => {
    const cartId = event.data.cartId as number;
    const initialUpdatedAt = event.data.updatedAt as string;

    await step.sleep("wait-24h", "24h");

    const result = await step.run("check-and-notify", async () => {
      const [cart] = await db
        .select()
        .from(carts)
        .where(eq(carts.id, cartId))
        .limit(1);
      if (!cart) return { skipped: "cart_deleted" };
      if (!cart.userId) return { skipped: "guest_cart" };

      // Cart updated again after the trigger event — user is still active
      if (cart.updatedAt.toISOString() !== initialUpdatedAt) {
        return { skipped: "cart_modified_since" };
      }

      const items = await db
        .select({ id: cartItems.id })
        .from(cartItems)
        .where(eq(cartItems.cartId, cartId));
      if (items.length === 0) return { skipped: "cart_empty" };

      const [user] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, cart.userId))
        .limit(1);
      if (!user?.email) return { skipped: "no_email" };

      // Best-effort email — Resend already wired in lib/resend
      try {
        const { sendGenericEmail } = await import("@/lib/resend");
        await sendGenericEmail({
          to: user.email,
          subject: "You left items in your cart",
          html: `<p>Hi ${user.name ?? "there"},</p><p>You still have ${items.length} item(s) in your cart at Niyamah. Complete your purchase before they sell out.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/cart">Return to cart</a></p>`,
        });
      } catch (err) {
        console.error("Abandoned-cart email failed", err);
        return { sent: false, reason: "email_failed" };
      }

      return { sent: true, items: items.length };
    });

    return result;
  },
);
