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
  Owner: {
    id: "usr_test_owner",
    email: "owner@constrack.ph",
    name: "Danielle Acierda (Owner)",
    role: "Owner",
    description: "Company owner with unrestricted access across operations, finances, and audit.",
    permissions: ROLE_PERMISSIONS["Owner"],
  },
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
  "Project Manager": {
    id: "usr_test_proj_mgr",
    email: "project.mgr@constrack.ph",
    name: "Maria Santos (Project Mgr)",
    role: "Project Manager",
    description: "Project management, site assignment, and fuel request approval.",
    permissions: ROLE_PERMISSIONS["Project Manager"],
  },
  "Fuel Manager": {
    id: "usr_test_fuel_mgr",
    email: "fuel.mgr@constrack.ph",
    name: "Jose Cruz (Fuel Mgr)",
    role: "Fuel Manager",
    description: "Fuel workflow management: approval, purchase logging, verification, and anomaly review.",
    permissions: ROLE_PERMISSIONS["Fuel Manager"],
  },
  Accountant: {
    id: "usr_test_accountant",
    email: "accountant@constrack.ph",
    name: "Teresa Diaz (Accountant)",
    role: "Accountant",
    description: "Financial review, cost center auditing, receipt verification, and reports.",
    permissions: ROLE_PERMISSIONS["Accountant"],
  },
  Mechanic: {
    id: "usr_test_mechanic",
    email: "mechanic@constrack.ph",
    name: "Eduardo Dalisay (Mechanic)",
    role: "Mechanic",
    description: "Maintenance ticket creation, updating, and service completion.",
    permissions: ROLE_PERMISSIONS["Mechanic"],
  },
  Driver: {
    id: "usr_test_driver",
    email: "driver@constrack.ph",
    name: "Juan Dela Cruz (Driver)",
    role: "Driver",
    description: "Vehicle operation and fuel request submission.",
    permissions: ROLE_PERMISSIONS["Driver"],
  },
  Viewer: {
    id: "usr_test_viewer",
    email: "viewer@constrack.ph",
    name: "Auditor View (Guest)",
    role: "Viewer",
    description: "Read-only access for external observers and stakeholders.",
    permissions: ROLE_PERMISSIONS["Viewer"],
  },
};
