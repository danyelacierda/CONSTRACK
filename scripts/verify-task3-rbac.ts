import { ROLES, Role } from "../src/types/enums";
import { ROLE_PERMISSIONS, hasPermission, Permission } from "../src/config/rbac";
import { NAV_ITEMS } from "../src/config/nav";
import { mapClerkRole } from "../src/features/auth/role-context";
import { TEST_USERS } from "../src/config/test-users";

console.log("================================================================================");
console.log("CONSTRACK TASK 3 — RBAC & CLERK ROLE ENFORCEMENT VERIFICATION");
console.log("================================================================================\n");

// 1. Verify all 9 roles exist in TEST_USERS
console.log("--- 1. VERIFYING TEST USERS FOR ALL 9 ROLES ---");
for (const role of ROLES) {
  const user = TEST_USERS[role];
  if (!user) {
    console.error(`❌ Missing test user for role: ${role}`);
    process.exit(1);
  }
  console.log(`✓ Role [${role}]: ${user.name} <${user.email}> (${user.permissions.length} permissions)`);
}

// 2. Verify Clerk Role Mapping
console.log("\n--- 2. VERIFYING CLERK ROLE MAPPING ---");
const testMappings: Array<{ orgRole?: string; metaRole?: string; expected: Role }> = [
  { orgRole: "org:owner", expected: "Owner" },
  { orgRole: "org:admin", expected: "Admin" },
  { orgRole: "org:fleet_manager", expected: "Fleet Manager" },
  { orgRole: "org:project_manager", expected: "Project Manager" },
  { orgRole: "org:fuel_manager", expected: "Fuel Manager" },
  { orgRole: "org:accountant", expected: "Accountant" },
  { orgRole: "org:mechanic", expected: "Mechanic" },
  { orgRole: "org:driver", expected: "Driver" },
  { orgRole: "org:member", expected: "Viewer" },
  { metaRole: "Fleet Manager", expected: "Fleet Manager" },
  { metaRole: "Mechanic", expected: "Mechanic" },
];

for (const m of testMappings) {
  const resolved = mapClerkRole(m.orgRole, m.metaRole);
  if (resolved !== m.expected) {
    console.error(`❌ Role mapping failed for ${JSON.stringify(m)}: got ${resolved}, expected ${m.expected}`);
    process.exit(1);
  }
  console.log(`✓ Mapped orgRole='${m.orgRole || ""}' metaRole='${m.metaRole || ""}' -> '${resolved}'`);
}

// 3. Verify Sidebar Navigation Filtering (at least 2 distinct roles)
console.log("\n--- 3. VERIFYING SIDEBAR NAVIGATION FILTERING ---");

function getVisibleNav(role: Role) {
  return NAV_ITEMS.filter((item) => !item.permission || hasPermission(role, item.permission));
}

function getHiddenNav(role: Role) {
  return NAV_ITEMS.filter((item) => item.permission && !hasPermission(role, item.permission));
}

// Role A: Driver
const driverVisible = getVisibleNav("Driver").map((i) => i.title);
const driverHidden = getHiddenNav("Driver").map((i) => i.title);
console.log(`\n[Driver View]`);
console.log(`  Visible nav items (${driverVisible.length}): ${driverVisible.join(", ")}`);
console.log(`  Hidden nav items  (${driverHidden.length}):  ${driverHidden.join(", ")}`);

// Role B: Mechanic
const mechanicVisible = getVisibleNav("Mechanic").map((i) => i.title);
const mechanicHidden = getHiddenNav("Mechanic").map((i) => i.title);
console.log(`\n[Mechanic View]`);
console.log(`  Visible nav items (${mechanicVisible.length}): ${mechanicVisible.join(", ")}`);
console.log(`  Hidden nav items  (${mechanicHidden.length}):  ${mechanicHidden.join(", ")}`);

// Role C: Owner (all visible)
const ownerVisible = getVisibleNav("Owner").map((i) => i.title);
console.log(`\n[Owner View]`);
console.log(`  Visible nav items (${ownerVisible.length}): ${ownerVisible.join(", ")}`);

// Assertions for DoD:
if (driverHidden.length === 0 || !driverHidden.includes("Projects") || !driverHidden.includes("Drivers")) {
  console.error("❌ Driver nav filtering failed!");
  process.exit(1);
}
if (mechanicHidden.length === 0 || !mechanicHidden.includes("Fuel Requests") || !mechanicHidden.includes("Projects")) {
  console.error("❌ Mechanic nav filtering failed!");
  process.exit(1);
}

// 4. Trace "Should Be Blocked" Scenarios
console.log("\n--- 4. TRACING 'SHOULD BE BLOCKED' SCENARIOS ---");

interface BlockedTestScenario {
  role: Role;
  permission: Permission;
  route: string;
  shouldAllow: boolean;
}

const scenarios: BlockedTestScenario[] = [
  { role: "Driver", permission: "projects:read", route: "/projects", shouldAllow: false },
  { role: "Driver", permission: "drivers:read", route: "/drivers", shouldAllow: false },
  { role: "Driver", permission: "anomalies:read", route: "/fuel/anomalies", shouldAllow: false },
  { role: "Driver", permission: "fuel:read", route: "/fuel/requests", shouldAllow: false },
  { role: "Mechanic", permission: "fuel:read", route: "/fuel/requests", shouldAllow: false },
  { role: "Mechanic", permission: "projects:read", route: "/projects", shouldAllow: false },
  { role: "Viewer", permission: "fuel:approve", route: "/fuel/approve-action", shouldAllow: false },
  { role: "Owner", permission: "projects:read", route: "/projects", shouldAllow: true },
  { role: "Admin", permission: "drivers:read", route: "/drivers", shouldAllow: true },
  { role: "Fleet Manager", permission: "fleet:read", route: "/fleet", shouldAllow: true },
];

for (const sc of scenarios) {
  const allowed = hasPermission(sc.role, sc.permission);
  const status = allowed === sc.shouldAllow ? "PASS" : "FAIL";
  const outcome = allowed ? "ALLOWED (Render Page)" : "BLOCKED (Render 403 Access Denied)";
  console.log(`[${status}] Role '${sc.role}' accessing '${sc.route}' (${sc.permission}) -> ${outcome}`);
  if (allowed !== sc.shouldAllow) {
    console.error(`❌ Scenario failed for ${sc.role} on ${sc.route}`);
    process.exit(1);
  }
}

console.log("\n================================================================================");
console.log("✅ ALL RBAC & ROLE ENFORCEMENT VERIFICATION CHECKS PASSED CLEANLY!");
console.log("================================================================================");
