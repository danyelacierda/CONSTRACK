import { Role } from "@/types/enums";
import { Permission, ROLE_PERMISSIONS } from "./rbac";

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  description: string;
  permissions: readonly Permission[];
}

/**
 * 9 Standard test user profiles corresponding to each of the 9 CONSTRACK roles.
 * Used for testing RBAC matrix enforcement, sidebar filtering, and route protection.
 */
export const TEST_USERS: Record<Role, TestUser> = {
  Admin: {
    id: "usr_test_admin",
    email: "admin@constrack.ph",
    name: "Alex Ramos (Admin)",
    role: "Admin",
    description: "System administrator with full operational and system management access.",
    permissions: ROLE_PERMISSIONS["Admin"],
  },
  "Fleet Manager": {
    id: "usr_test_fleet_mgr",
    email: "fleet.mgr@constrack.ph",
    name: "Carlos Mendoza (Fleet Mgr)",
    role: "Fleet Manager",
    description: "Fleet oversight, vehicle maintenance, and driver roster management.",
    permissions: ROLE_PERMISSIONS["Fleet Manager"],
  },
  Driver: {
    id: "usr_test_driver",
    email: "driver@constrack.ph",
    name: "Juan Dela Cruz (Driver)",
    role: "Driver",
    description: "Vehicle operation, fuel request submission, and issue reporting.",
    permissions: ROLE_PERMISSIONS["Driver"],
  },
};
