import type { NextRequest } from "next/server";
import { campaignRepository } from "@/modules/marketing/infrastructure/campaign.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const data = await campaignRepository.findBySlugWithProducts(slug);
  if (!data) return apiError("NOT_FOUND", "Campaign not found.", 404);
  // Hide non-active campaigns from public
  if (data.campaign.status !== "active" && data.campaign.status !== "ended")
    return apiError("NOT_FOUND", "Campaign not found.", 404);
  return apiSuccess(data);
}
