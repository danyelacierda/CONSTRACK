import { auth } from "@clerk/nextjs/server";
import { Role } from "@/types/enums";
import { Permission, hasPermission } from "@/config/rbac";
import { mapClerkRole } from "./role-context";

/**
 * Retrieves the current authenticated user's role on the server.
 */
export async function getServerUserRole(): Promise<{
  userId: string | null;
  orgId: string | null;
  role: Role;
}> {
  const { userId, orgId, orgRole, sessionClaims } = await auth();
  const metadataRole = (sessionClaims?.publicMetadata as { role?: string })?.role;
  const role = mapClerkRole(orgRole, metadataRole);
  return { userId, orgId: orgId ?? null, role };
}

/**
 * Checks if the current authenticated user has a specific permission on the server.
 */
export async function checkServerPermission(permission: Permission): Promise<boolean> {
  const { role } = await getServerUserRole();
  return hasPermission(role, permission);
}
