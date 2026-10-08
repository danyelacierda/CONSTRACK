import { Role } from "@/types/enums";

export type Permission =
  | "fleet:read"
  | "fleet:create"
  | "fleet:update"
  | "fleet:delete"
  | "drivers:read"
  | "drivers:create"
  | "drivers:update"
  | "drivers:delete"
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "fuel:read"
  | "fuel:request"
  | "fuel:approve"
  | "fuel:purchase"
  | "fuel:verify"
  | "maintenance:read"
  | "maintenance:create"
  | "maintenance:update"
  | "maintenance:complete"
  | "anomalies:read"
  | "anomalies:review"
  | "anomalies:resolve"
  | "audit:read"
  | "reports:read"
  | "reports:export"
  | "system:settings";

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  Admin: [
    "fleet:read", "fleet:create", "fleet:update", "fleet:delete",
    "drivers:read", "drivers:create", "drivers:update", "drivers:delete",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "fuel:read", "fuel:request", "fuel:approve", "fuel:purchase", "fuel:verify",
    "maintenance:read", "maintenance:create", "maintenance:update", "maintenance:complete",
    "anomalies:read", "anomalies:review", "anomalies:resolve",
    "audit:read",
    "reports:read", "reports:export",
    "system:settings",
  ],
  "Fleet Manager": [
    "fleet:read", "fleet:create", "fleet:update",
    "drivers:read", "drivers:create", "drivers:update",
    "projects:read",
    "fuel:read", "fuel:request",
    "maintenance:read", "maintenance:create", "maintenance:update",
    "anomalies:read", "anomalies:review",
    "reports:read", "reports:export",
  ],
  Driver: [
    "fleet:read",
    "fuel:request",
    "maintenance:read", "maintenance:create",
  ],
};

/**
 * Checks if the given roles grant a specific permission.
 */
export function hasPermission(
  userRoles: string | string[] | null | undefined,
  permission: Permission
): boolean {
  if (!userRoles) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  
  // Create a case-insensitive map of roles
  const normalizedPermissions = Object.entries(ROLE_PERMISSIONS).reduce((acc, [key, perms]) => {
    acc[key.toLowerCase()] = perms;
    return acc;
  }, {} as Record<string, readonly Permission[]>);

  return roles.some((role) => {
    const permissions = normalizedPermissions[role.toLowerCase()];
    return permissions ? permissions.includes(permission) : false;
  });
}
