"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "../use-users";
import { ROLES } from "@/types/enums";

interface Props {
  userId: string;
  currentRole: string;
  isSuperAdmin: boolean;
}

export function UserRoleSelect({ userId, currentRole, isSuperAdmin }: Props) {
  const [isPending, startTransition] = useTransition();

  // If this is Danielle's account, she cannot be downgraded from Admin.
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
        Super Admin (Locked)
      </span>
    );
  }

  return (
    <select
      disabled={isPending}
      value={currentRole}
      onChange={(e) => {
        startTransition(async () => {
          try {
            await updateUserRole(userId, e.target.value);
            alert("Role updated successfully!");
          } catch (error) {
            alert("Failed to update role");
          }
        });
      }}
      className="text-sm bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
    >
      <option value="Driver (Default)" disabled>
        {currentRole === "Driver (Default)" ? "Driver (Default)" : "Select Role..."}
      </option>
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
