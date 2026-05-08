import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { releaseReservedStock } from "@/inngest/functions/release-reserved-stock";
import { abandonedCartReminder } from "@/inngest/functions/abandoned-cart";
import { metaCapiPurchase } from "@/inngest/functions/meta-capi";
import { orderStatusEmail } from "@/inngest/functions/order-status-email";
import { highRiskOrderAlert } from "@/inngest/functions/high-risk-order-alert";
import { lowStockAlert } from "@/inngest/functions/low-stock-alert";
import { refundApproved } from "@/inngest/functions/refund-approved";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    releaseReservedStock,
    abandonedCartReminder,
    metaCapiPurchase,
    orderStatusEmail,
    highRiskOrderAlert,
    lowStockAlert,
    refundApproved,
  ],
});
