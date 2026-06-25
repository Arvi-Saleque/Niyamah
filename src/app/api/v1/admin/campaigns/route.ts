import type { NextRequest } from "next/server";
import {
  campaignRepository,
  CampaignError,
} from "@/modules/marketing/infrastructure/campaign.repository";
import { campaignCreateSchema } from "@/lib/validations/marketing";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

export async function GET(req: NextRequest) {
  const guard = await requirePermission("campaigns.view");
  if ("error" in guard) return guard.error;
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") ?? undefined;
  const page = Number(sp.get("page") ?? "1");
  const limit = Number(sp.get("limit") ?? "20");
  if (!Number.isInteger(page) || page < 1) return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);
  const opts = status ? { page, limit, status } : { page, limit };
  const result = await campaignRepository.list(opts);
  return apiSuccess({ items: result.items }, 200, { page: result.page, limit: result.limit });
}

export async function POST(req: NextRequest) {
  const guard = await requirePermission("campaigns.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = campaignCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  try {
    const created = await campaignRepository.create(parsed.data, guard.ctx.userId);
    return apiSuccess(created, 201);
  } catch (err) {
    if (err instanceof CampaignError) return apiError(err.code, err.message, 409);
    throw err;
  }
}
