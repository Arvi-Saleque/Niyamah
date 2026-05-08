import type { NextRequest } from "next/server";
import { statsRepository } from "@/modules/commerce/infrastructure/stats.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * GET /api/v1/admin/stats/revenue?period=7d|30d|90d
 * Daily revenue series for the requested window.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const period = req.nextUrl.searchParams.get("period") ?? "30d";
  const days = PERIOD_DAYS[period];
  if (!days) {
    return apiError(
      "INVALID_PERIOD",
      "period must be one of: 7d, 30d, 90d.",
      400,
    );
  }

  const series = await statsRepository.revenueTrend(days);
  return apiSuccess({ period, series });
}
