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
  | "reports:export";

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  Owner: [
    "fleet:read", "fleet:create", "fleet:update", "fleet:delete",
    "drivers:read", "drivers:create", "drivers:update", "drivers:delete",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "fuel:read", "fuel:request", "fuel:approve", "fuel:purchase", "fuel:verify",
    "maintenance:read", "maintenance:create", "maintenance:update", "maintenance:complete",
    "anomalies:read", "anomalies:review", "anomalies:resolve",
    "audit:read",
    "reports:read", "reports:export",
  ],
  Admin: [
    "fleet:read", "fleet:create", "fleet:update", "fleet:delete",
    "drivers:read", "drivers:create", "drivers:update", "drivers:delete",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "fuel:read", "fuel:request", "fuel:approve", "fuel:purchase", "fuel:verify",
    "maintenance:read", "maintenance:create", "maintenance:update", "maintenance:complete",
    "anomalies:read", "anomalies:review", "anomalies:resolve",
    "audit:read",
    "reports:read", "reports:export",
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
  "Project Manager": [
    "fleet:read",
    "drivers:read",
    "projects:read", "projects:create", "projects:update",
    "fuel:read", "fuel:request", "fuel:approve",
    "maintenance:read",
    "anomalies:read",
    "reports:read",
  ],
  "Fuel Manager": [
    "fleet:read",
    "drivers:read",
    "projects:read",
    "fuel:read", "fuel:request", "fuel:approve", "fuel:purchase", "fuel:verify",
    "anomalies:read", "anomalies:review", "anomalies:resolve",
    "reports:read", "reports:export",
  ],
  Accountant: [
    "fleet:read",
    "projects:read",
    "fuel:read", "fuel:verify",
    "maintenance:read",
    "anomalies:read",
    "audit:read",
    "reports:read", "reports:export",
  ],
  Mechanic: [
    "fleet:read",
    "maintenance:read", "maintenance:create", "maintenance:update", "maintenance:complete",
  ],
  Driver: [
    "fleet:read",
    "fuel:request",
  ],
  Viewer: [
    "fleet:read",
    "projects:read",
    "fuel:read",
    "maintenance:read",
    "reports:read",
  ],
};

/**
 * Checks if the given roles grant a specific permission.
 */
export function hasPermission(
  userRoles: Role | Role[] | null | undefined,
  permission: Permission
): boolean {
  if (!userRoles) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission) : false;
  });
}
