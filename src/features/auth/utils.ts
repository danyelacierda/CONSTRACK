import { Role, ROLES } from "@/types/enums";

export function mapClerkRole(orgRole?: string | null, metadataRole?: string | null, userEmail?: string | null): Role {
  // 1. Direct metadata role override (assigned by Admin in the system)
  if (metadataRole && (ROLES as readonly string[]).includes(metadataRole)) {
    return metadataRole as Role;
  }

  // 2. Default initial assignments based on email
  const isSuperAdmin = userEmail === "danielle_acierda@urios.edu.ph" || userEmail === "danielle.acierda@urios.edu.ph";
  
  if (isSuperAdmin) {
    return "Admin";
  }

  // Everyone else defaults to Driver initially if they have no explicit metadataRole
  return "Driver";
}
