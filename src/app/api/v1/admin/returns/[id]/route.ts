import type { NextRequest } from "next/server";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import {
  approveReturnUseCase,
  rejectReturnUseCase,
  RefundError,
} from "@/modules/commerce/application/process-refund.usecase";
import { returnRequestResolveSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { recordAudit } from "@/lib/audit/record";

/**
 * GET /api/v1/admin/returns/[id]
 * Fetch a single return request.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requirePermission("returns.view");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const reqId = Number(id);
  if (!Number.isInteger(reqId) || reqId < 1) {
    return apiError("INVALID_ID", "Invalid request id.", 400);
  }

  const row = await returnRepository.findById(reqId);
  if (!row) return apiError("NOT_FOUND", "Return request not found.", 404);
  return apiSuccess(row);
}

/**
 * PATCH /api/v1/admin/returns/[id]
 * Approve or reject a return request. Approving triggers refund flow.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requirePermission("returns.manage");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const reqId = Number(id);
  if (!Number.isInteger(reqId) || reqId < 1) {
    return apiError("INVALID_ID", "Invalid request id.", 400);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  const parsed = returnRequestResolveSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }

  try {
    const updated =
      parsed.data.status === "APPROVED"
        ? await approveReturnUseCase({
            returnRequestId: reqId,
            adminId: guard.ctx.userId,
            adminNote: parsed.data.adminNote ?? null,
            refundAmount: parsed.data.refundAmount as number,
          })
        : await rejectReturnUseCase({
            returnRequestId: reqId,
            adminId: guard.ctx.userId,
            adminNote: parsed.data.adminNote ?? null,
          });
    recordAudit({
      actorId: guard.ctx.userId,
      action: `return.${parsed.data.status.toLowerCase()}`,
      entityType: "return_request",
      entityId: reqId,
      after: parsed.data,
    }).catch(() => {});
    return apiSuccess(updated);
  } catch (err) {
    if (err instanceof RefundError) {
      return apiError(err.code, err.message, err.status);
    }
    console.error("[admin/returns] PATCH failed", err);
    return apiError("INTERNAL_ERROR", "Failed to process return.", 500);
  }
}
