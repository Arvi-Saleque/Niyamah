import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess } from "@/lib/utils/api-response";
import { getAllHomepageBlocksAdmin } from "@/modules/storefront/homepage-content";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const blocks = await getAllHomepageBlocksAdmin();
  return apiSuccess(blocks);
}
