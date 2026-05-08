import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { recordAudit } from "@/lib/audit/record";

interface Ctx {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  role: z.enum(["superadmin", "admin", "manager", "staff", "customer"]),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const [updated] = await db
    .update(users)
    .set({ role: parsed.data.role, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  if (!updated) return apiError("NOT_FOUND", "User not found.", 404);
  recordAudit({
    actorId: guard.ctx.userId,
    action: "staff.role.update",
    entityType: "user",
    entityId: id,
    after: { role: parsed.data.role },
  }).catch(() => {});
  return apiSuccess(updated);
}
