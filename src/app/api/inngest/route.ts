import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { releaseReservedStock } from "@/inngest/functions/release-reserved-stock";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [releaseReservedStock],
});
