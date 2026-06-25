import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { storeUsers, users, roles } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { z } from "zod";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { recordAudit } from "@/lib/audit/record";
import { canAssignRole, getAssignableRoles } from "@/modules/auth/domain/staff-access-policy";
import { SYSTEM_ROLES } from "@/modules/auth/domain/rbac-catalog";

function mapLegacyRole(roleKey: string): "superadmin" | "admin" | "manager" | "staff" {
  if (roleKey === "owner") return "superadmin";
  if (roleKey === "administrator") return "admin";
  if (roleKey === "manager") return "manager";
  return "staff";
}

export async function GET(_req: NextRequest) {
  const guard = await requirePermission("staff.view");
  if ("error" in guard) return guard.error;

  const staffList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isActive: storeUsers.isActive,
      roleId: roles.id,
      roleName: roles.name,
      roleKey: roles.key,
      createdAt: storeUsers.createdAt,
    })
    .from(storeUsers)
    .innerJoin(users, eq(storeUsers.userId, users.id))
    .innerJoin(roles, eq(storeUsers.roleId, roles.id))
    .where(and(eq(storeUsers.storeId, DEFAULT_STORE_ID), ne(roles.key, "customer")));

  const assignableRoles = getAssignableRoles(guard.ctx.roleKey);

  return apiSuccess({
    staff: staffList.map(s => ({
      ...s,
      isCurrentUser: s.id === guard.ctx.userId,
      isOwner: s.roleKey === "owner",
    })),
    assignableRoles
  });
}

const addSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  roleKey: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const guard = await requirePermission("staff.manage");
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }

  const { email, roleKey } = parsed.data;

  // Validate policy
  if (!canAssignRole(guard.ctx.roleKey, roleKey)) {
    return apiError("FORBIDDEN", "You do not have permission to assign this role.", 403);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return apiError("NOT_FOUND", "User with this email not found.", 404);
  }

  const roleDef = SYSTEM_ROLES.find(r => r.key === roleKey);
  if (!roleDef) {
    return apiError("VALIDATION_ERROR", "Invalid role key.", 422);
  }

  const role = await db.query.roles.findFirst({
    where: and(eq(roles.storeId, DEFAULT_STORE_ID), eq(roles.key, roleKey)),
  });

  if (!role) {
    return apiError("NOT_FOUND", "Role not found in database.", 404);
  }

  const legacyRole = mapLegacyRole(roleKey);

  // Transaction for atomic update of store_users and users.role
  const created = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(storeUsers)
      .values({
        storeId: DEFAULT_STORE_ID,
        userId: user.id,
        roleId: role.id,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: [storeUsers.storeId, storeUsers.userId],
        set: {
          roleId: role.id,
          isActive: true,
          updatedAt: new Date(),
        },
      })
      .returning();

    await tx.update(users).set({ role: legacyRole }).where(eq(users.id, user.id));
    return inserted;
  });

  recordAudit({
    actorId: guard.ctx.userId,
    action: "staff.member.added",
    entityType: "user",
    entityId: user.id,
    after: { roleId: role.id, roleKey },
  }).catch(() => {});

  return apiSuccess(created);
}
