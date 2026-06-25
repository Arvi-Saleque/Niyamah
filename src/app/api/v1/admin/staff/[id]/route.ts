import type { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { storeUsers, roles, users } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { recordAudit } from "@/lib/audit/record";
import { canModifyTarget, canAssignRole } from "@/modules/auth/domain/staff-access-policy";
import { SYSTEM_ROLES } from "@/modules/auth/domain/rbac-catalog";

function mapLegacyRole(roleKey: string | null): "superadmin" | "admin" | "manager" | "staff" | "customer" {
  if (!roleKey) return "customer";
  if (roleKey === "owner") return "superadmin";
  if (roleKey === "administrator") return "admin";
  if (roleKey === "manager") return "manager";
  return "staff";
}

interface Ctx {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  roleKey: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requirePermission("staff.manage");
  if ("error" in guard) return guard.error;
  
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }

  const { roleKey, isActive } = parsed.data;

  const targetUser = await db
    .select({ roleKey: roles.key })
    .from(storeUsers)
    .innerJoin(roles, eq(storeUsers.roleId, roles.id))
    .where(and(eq(storeUsers.userId, id), eq(storeUsers.storeId, DEFAULT_STORE_ID)))
    .limit(1)
    .then((res) => res[0]);

  if (!targetUser) return apiError("NOT_FOUND", "Staff not found.", 404);

  if (!canModifyTarget(guard.ctx.userId, guard.ctx.roleKey, id, targetUser.roleKey)) {
    return apiError("FORBIDDEN", "Cannot modify this staff member.", 403);
  }

  if (roleKey && !canAssignRole(guard.ctx.roleKey, roleKey)) {
    return apiError("FORBIDDEN", "You do not have permission to assign this role.", 403);
  }

  if (roleKey && !SYSTEM_ROLES.find(r => r.key === roleKey)) {
    return apiError("VALIDATION_ERROR", "Unknown role key.", 422);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  let newRoleKey = targetUser.roleKey;

  if (roleKey) {
    const role = await db.query.roles.findFirst({
      where: and(eq(roles.storeId, DEFAULT_STORE_ID), eq(roles.key, roleKey)),
    });
    if (!role) return apiError("NOT_FOUND", "Role not found in database.", 404);
    updateData.roleId = role.id;
    newRoleKey = roleKey;
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }
  
  const newLegacyRole = isActive === false ? "customer" : mapLegacyRole(newRoleKey);

  const updated = await db.transaction(async (tx) => {
    const [res] = await tx
      .update(storeUsers)
      .set(updateData)
      .where(and(eq(storeUsers.userId, id), eq(storeUsers.storeId, DEFAULT_STORE_ID)))
      .returning();
      
    await tx.update(users).set({ role: newLegacyRole }).where(eq(users.id, id));
    return res;
  });

  const audits = [];
  if (roleKey) audits.push({ action: "staff.role.changed" });
  if (isActive === true) audits.push({ action: "staff.access.activated" });
  if (isActive === false) audits.push({ action: "staff.access.deactivated" });

  for (const a of audits) {
    recordAudit({
      actorId: guard.ctx.userId,
      action: a.action,
      entityType: "user",
      entityId: id,
      after: parsed.data,
    }).catch(() => {});
  }

  return apiSuccess(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = await requirePermission("staff.manage");
  if ("error" in guard) return guard.error;

  const { id } = await params;

  const targetUser = await db
    .select({ roleKey: roles.key })
    .from(storeUsers)
    .innerJoin(roles, eq(storeUsers.roleId, roles.id))
    .where(and(eq(storeUsers.userId, id), eq(storeUsers.storeId, DEFAULT_STORE_ID)))
    .limit(1)
    .then((res) => res[0]);

  if (!targetUser) return apiError("NOT_FOUND", "Staff not found.", 404);

  if (!canModifyTarget(guard.ctx.userId, guard.ctx.roleKey, id, targetUser.roleKey)) {
    return apiError("FORBIDDEN", "Cannot revoke this staff member.", 403);
  }

  // Transaction to delete store_users and update users.role to customer
  await db.transaction(async (tx) => {
    await tx.delete(storeUsers).where(and(eq(storeUsers.userId, id), eq(storeUsers.storeId, DEFAULT_STORE_ID)));
    await tx.update(users).set({ role: "customer" }).where(eq(users.id, id));
  });

  recordAudit({
    actorId: guard.ctx.userId,
    action: "staff.member.revoked",
    entityType: "user",
    entityId: id,
  }).catch(() => {});

  return apiSuccess({ success: true });
}
