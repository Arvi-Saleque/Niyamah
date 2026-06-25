import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess } from "@/lib/utils/api-response";
import { getAllHomepageBlocksAdmin } from "@/modules/storefront/homepage-content";

export async function GET() {
  const guard = await requirePermission("homepage.view");
  if ("error" in guard) return guard.error;
  const blocks = await getAllHomepageBlocksAdmin();
  return apiSuccess(blocks);
}
