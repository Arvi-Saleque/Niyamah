import { SYSTEM_ROLES } from "./rbac-catalog";

/**
 * Pure policy rules for managing staff.
 * - No normal endpoint may assign 'owner'.
 * - Owner membership is created only by migration/bootstrap.
 * - Only Owner may assign 'administrator'.
 * - Administrator may assign roles below Administrator.
 * - Administrator may not assign or modify another Administrator.
 * - Manager and lower roles cannot manage staff.
 * - A user cannot change their own role.
 * - A user cannot deactivate or revoke themselves.
 * - An Owner cannot be modified, deactivated, demoted, or removed through normal API.
 */

export function canManageStaff(actorRoleKey: string): boolean {
  return ["owner", "administrator"].includes(actorRoleKey);
}

export function canAssignRole(actorRoleKey: string, targetRoleKey: string): boolean {
  if (!canManageStaff(actorRoleKey)) return false;
  if (targetRoleKey === "owner") return false;
  if (actorRoleKey === "owner") return true;
  // If administrator, cannot assign administrator
  if (actorRoleKey === "administrator" && targetRoleKey === "administrator") return false;
  return true;
}

export function canModifyTarget(
  actorUserId: string,
  actorRoleKey: string,
  targetUserId: string,
  targetRoleKey: string | null
): boolean {
  // Cannot modify self
  if (actorUserId === targetUserId) return false;
  // If target has no role yet (new user), only check if actor can manage
  if (!targetRoleKey) return canManageStaff(actorRoleKey);
  // Target is owner -> untouchable
  if (targetRoleKey === "owner") return false;
  
  if (actorRoleKey === "owner") return true;
  // If actor is administrator, cannot modify another administrator
  if (actorRoleKey === "administrator" && targetRoleKey === "administrator") return false;
  
  return canManageStaff(actorRoleKey);
}

export function getAssignableRoles(actorRoleKey: string) {
  return SYSTEM_ROLES.filter(r => canAssignRole(actorRoleKey, r.key));
}
