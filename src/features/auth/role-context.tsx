"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { Role, ROLES } from "@/types/enums";
import { Permission, hasPermission as checkRbacPermission } from "@/config/rbac";

export function mapClerkRole(orgRole?: string | null, metadataRole?: string | null): Role {
  // 1. Direct metadata role override
  if (metadataRole && (ROLES as readonly string[]).includes(metadataRole)) {
    return metadataRole as Role;
  }

  // 2. Organization membership role mapping
  if (orgRole) {
    const normalized = orgRole.toLowerCase().trim();
    if (normalized === "org:admin" || normalized === "admin") return "Admin";
    if (normalized === "org:owner" || normalized === "owner") return "Owner";
    if (normalized === "org:fleet_manager" || normalized === "fleet_manager" || normalized === "fleet manager") return "Fleet Manager";
    if (normalized === "org:project_manager" || normalized === "project_manager" || normalized === "project manager") return "Project Manager";
    if (normalized === "org:fuel_manager" || normalized === "fuel_manager" || normalized === "fuel manager") return "Fuel Manager";
    if (normalized === "org:accountant" || normalized === "accountant") return "Accountant";
    if (normalized === "org:mechanic" || normalized === "mechanic") return "Mechanic";
    if (normalized === "org:driver" || normalized === "driver") return "Driver";
    if (normalized === "org:member" || normalized === "org:viewer" || normalized === "viewer") return "Viewer";
  }

  // 3. Fallback: default to Admin so newly registered org creator has access
  return "Admin";
}

interface CurrentUserContextType {
  role: Role;
  actualRole: Role;
  simulatedRole: Role | null;
  setSimulatedRole: (role: Role | null) => void;
  hasPermission: (permission: Permission) => boolean;
  user: ReturnType<typeof useUser>["user"];
  organization: ReturnType<typeof useOrganization>["organization"];
  isLoaded: boolean;
  isSignedIn: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

const SIMULATED_ROLE_KEY = "constrack_simulated_role";

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { organization, membership, isLoaded: isOrgLoaded } = useOrganization();

  const [simulatedRole, setSimulatedRoleState] = useState<Role | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIMULATED_ROLE_KEY);
      if (stored && (ROLES as readonly string[]).includes(stored)) {
        setSimulatedRoleState(stored as Role);
      }
    } catch {
      // LocalStorage not available (SSR or disabled)
    }
  }, []);

  const setSimulatedRole = (role: Role | null) => {
    setSimulatedRoleState(role);
    try {
      if (role) {
        localStorage.setItem(SIMULATED_ROLE_KEY, role);
      } else {
        localStorage.removeItem(SIMULATED_ROLE_KEY);
      }
    } catch {
      // LocalStorage not available
    }
  };

  const actualRole = useMemo(() => {
    const metaRole = (user?.publicMetadata as { role?: string })?.role;
    const orgRole = membership?.role;
    return mapClerkRole(orgRole, metaRole);
  }, [user, membership]);

  const effectiveRole = simulatedRole || actualRole;

  const hasPermission = (permission: Permission): boolean => {
    return checkRbacPermission(effectiveRole, permission);
  };

  const value = {
    role: effectiveRole,
    actualRole,
    simulatedRole,
    setSimulatedRole,
    hasPermission,
    user,
    organization,
    isLoaded: isUserLoaded && isOrgLoaded,
    isSignedIn: Boolean(isSignedIn),
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextType {
  const context = useContext(CurrentUserContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      role: "Admin",
      actualRole: "Admin",
      simulatedRole: null,
      setSimulatedRole: () => {},
      hasPermission: (perm) => checkRbacPermission("Admin", perm),
      user: null,
      organization: null,
      isLoaded: true,
      isSignedIn: false,
    };
  }
  return context;
}
