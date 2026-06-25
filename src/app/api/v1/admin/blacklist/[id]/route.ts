import type { NextRequest } from "next/server";
import { blacklistRepository } from "@/modules/commerce/infrastructure/blacklist.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { recordAudit } from "@/lib/audit/record";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requirePermission("blacklist.manage");
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return apiError("INVALID_ID", "Invalid id.", 400);
  const removed = await blacklistRepository.remove(id);
  if (!removed) return apiError("NOT_FOUND", "Entry not found.", 404);
  recordAudit({
    actorId: guard.ctx.userId,
    action: "blacklist.remove",
    entityType: "blacklist",
    entityId: id,
    before: removed,
  }).catch(() => {});
  return apiSuccess({ ok: true });
}
