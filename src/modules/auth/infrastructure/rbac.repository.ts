import { db } from "@/lib/db";
import { roles, permissions, rolePermissions, storeUsers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export type AdminAccessContext = {
  userId: string;
  email: string;
  name: string;
  roleKey: string;
  roleName: string;
  permissions: Set<string>;
  isOwner: boolean;
};

export class RbacRepository {
  static async getAdminAccessContext(userId: string): Promise<AdminAccessContext | null> {
    const userRole = await db
      .select({
        roleId: roles.id,
        roleKey: roles.key,
        roleName: roles.name,
        email: users.email,
        name: users.name,
      })
      .from(storeUsers)
      .innerJoin(roles, eq(storeUsers.roleId, roles.id))
      .innerJoin(users, eq(storeUsers.userId, users.id))
      .where(
        and(
          eq(storeUsers.userId, userId),
          eq(storeUsers.storeId, DEFAULT_STORE_ID),
          eq(storeUsers.isActive, true)
        )
      )
      .limit(1)
      .then((res) => res[0]);

    if (!userRole) return null;

    const perms = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, userRole.roleId));

    const permissionSet = new Set(perms.map((p) => p.key));

    return {
      userId,
      email: userRole.email,
      name: userRole.name || userRole.email.split("@")[0] || "",
      roleKey: userRole.roleKey,
      roleName: userRole.roleName,
      permissions: permissionSet,
      isOwner: userRole.roleKey === "owner",
    };
  }
}
