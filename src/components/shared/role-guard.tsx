"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Permission } from "@/config/rbac";
import { useCurrentUser } from "@/features/auth/role-context";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ permission, children, fallback }: RoleGuardProps) {
  const { hasPermission, role, isLoaded } = useCurrentUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const allowed = hasPermission(permission);

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="max-w-xl mx-auto my-12 p-8 border border-destructive/30 rounded-xl bg-card/60 backdrop-blur text-center space-y-5 shadow-lg">
        <div className="h-14 w-14 rounded-full bg-destructive/10 border border-destructive/30 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Access Restricted (403)
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Your current assigned role (
            <span className="font-semibold text-primary font-mono">{role}</span>
            ) does not have the required authorization{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">
              {permission}
            </code>{" "}
            to access this operational module.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
