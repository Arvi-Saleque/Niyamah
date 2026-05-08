import type { NextRequest } from "next/server";
import { blacklistRepository } from "@/modules/commerce/infrastructure/blacklist.repository";
import { blacklistAddSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";
import { recordAudit } from "@/lib/audit/record";

/**
 * GET  /api/v1/admin/blacklist        — list blocked customers
 * POST /api/v1/admin/blacklist        — add a phone/email to the blacklist
 */
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const items = await blacklistRepository.list();
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = blacklistAddSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await blacklistRepository.create(parsed.data, guard.ctx.userId);
  if (!row) return apiError("CREATE_FAILED", "Unable to create blacklist entry.", 500);
  recordAudit({
    actorId: guard.ctx.userId,
    action: "blacklist.add",
    entityType: "blacklist",
    entityId: row.id,
    after: row,
  }).catch(() => {});
  return apiSuccess(row, 201);
}
