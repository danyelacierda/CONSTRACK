"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";

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
};

export function AppSidebar() {
  const pathname = usePathname();

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
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Operations
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.filter((item) => !item.section || item.section === "operations").map((item) => {
              const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

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

        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Oversight & Accountability
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.filter((item) => item.section === "oversight").map((item) => {
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

        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Administration
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.filter((item) => item.section === "admin").map((item) => {
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
      </div>

      {/* Role & Context Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-xs text-foreground font-mono">
            AC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">ABC Construction</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" /> Admin View
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
