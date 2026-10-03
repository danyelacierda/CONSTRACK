import { Permission } from "./rbac";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  permission?: Permission;
  badge?: string;
  section?: "operations" | "oversight" | "admin";
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    iconName: "LayoutDashboard",
  },
  {
    title: "Fleet",
    href: "/fleet",
    iconName: "Truck",
    permission: "fleet:read",
    section: "operations",
  },
  {
    title: "Projects",
    href: "/projects",
    iconName: "FolderKanban",
    permission: "projects:read",
    section: "operations",
  },
  {
    title: "Drivers",
    href: "/drivers",
    iconName: "Users",
    permission: "drivers:read",
    section: "operations",
  },
  {
    title: "Fuel Requests",
    href: "/fuel/requests",
    iconName: "Fuel",
    permission: "fuel:read",
    section: "operations",
  },
  {
    title: "Anomaly Review",
    href: "/fuel/anomalies",
    iconName: "AlertTriangle",
    permission: "anomalies:read",
    section: "oversight",
  },
  {
    title: "Equipment",
    href: "/equipment",
    iconName: "HardHat",
    permission: "fleet:read",
    section: "operations",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    iconName: "Wrench",
    permission: "maintenance:read",
    section: "operations",
  },
  {
    title: "Trips",
    href: "/trips",
    iconName: "MapPin",
    permission: "fleet:read",
    section: "operations",
  },
  {
    title: "Reports",
    href: "/reports",
    iconName: "BarChart3",
    permission: "reports:read",
    section: "oversight",
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    iconName: "ShieldCheck",
    permission: "audit:read",
    section: "admin",
  },
];
