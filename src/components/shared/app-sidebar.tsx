"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Truck,
  HardHat,
  FolderKanban,
  Users,
  Fuel,
  AlertTriangle,
  Wrench,
  MapPin,
  BarChart3,
  ShieldCheck,
  Shield,
  Activity,
  UserCheck,
} from "lucide-react";
import { NAV_ITEMS } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/role-context";
import { ROLES, Role } from "@/types/enums";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Truck,
  HardHat,
  FolderKanban,
  Users,
  Fuel,
  AlertTriangle,
  Wrench,
  MapPin,
  BarChart3,
  ShieldCheck,
  UserCheck,
};

export function AppSidebar() {
  const pathname = usePathname();
  const { role, actualRole, simulatedRole, setSimulatedRole, hasPermission, user } = useCurrentUser();

  const operationsItems = NAV_ITEMS.filter(
    (item) =>
      (!item.section || item.section === "operations") &&
      (!item.permission || hasPermission(item.permission))
  );

  const oversightItems = NAV_ITEMS.filter(
    (item) =>
      item.section === "oversight" &&
      (!item.permission || hasPermission(item.permission))
  );

  const adminItems = NAV_ITEMS.filter(
    (item) =>
      item.section === "admin" &&
      (!item.permission || hasPermission(item.permission))
  );

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 border-b border-border flex items-center px-6 gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold tracking-wider text-base text-foreground font-mono">
            CONS<span className="text-primary">TRACK</span>
          </span>
          <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">
            Fleet & Fuel Control
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {operationsItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Operations
            </div>
            <nav className="space-y-1">
              {operationsItems.map((item) => {
                const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {oversightItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Oversight & Accountability
            </div>
            <nav className="space-y-1">
              {oversightItems.map((item) => {
                const Icon = ICON_MAP[item.iconName] || AlertTriangle;
                const isActive = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span>{item.title}</span>
                    </div>
                    {item.href === "/fuel/anomalies" && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {adminItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Administration
            </div>
            <nav className="space-y-1">
              {adminItems.map((item) => {
                const Icon = ICON_MAP[item.iconName] || ShieldCheck;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Role & Context Footer with Clerk Integration & Role Switcher */}
      <div className="p-4 border-t border-border bg-muted/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-full border border-border",
                },
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Authorized User"}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" />
              <span>{role}</span>
              {simulatedRole && (
                <span className="text-[10px] text-amber-500 font-mono">(simulated)</span>
              )}
            </p>
          </div>
        </div>

        {/* Live RBAC Role Testing Switcher - ONLY FOR ADMIN */}
        {actualRole === "Admin" && (
          <div className="pt-2 border-t border-border/50">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
              Test Role Simulation
            </label>
            <select
              value={simulatedRole || ""}
              onChange={(e) => {
                const val = e.target.value;
                setSimulatedRole(val ? (val as Role) : null);
              }}
              className="w-full text-xs font-mono bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Clerk Default ({actualRole})</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}
