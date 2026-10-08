"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { checkServerPermission } from "./server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const hasAccess = await checkServerPermission("system:settings");
  if (!hasAccess) throw new Error("Unauthorized");

  const clerk = await clerkClient();
  const usersResponse = await clerk.users.getUserList({
    limit: 100,
  });

  return usersResponse.data.map((user) => {
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: (user.publicMetadata as { role?: string })?.role || "Driver (Default)",
    };
  });
}

export async function updateUserRole(userId: string, role: string) {
  const hasAccess = await checkServerPermission("system:settings");
  if (!hasAccess) throw new Error("Unauthorized");

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  revalidatePath("/users");
}
