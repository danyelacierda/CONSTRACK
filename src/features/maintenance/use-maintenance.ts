"use server";

import { maintenanceRepository } from "@/repositories";
import type { MaintenanceTicket } from "@/types/domain";
import { revalidatePath } from "next/cache";

export async function createMaintenanceTicket(data: Omit<MaintenanceTicket, "id" | "createdAt" | "updatedAt">) {
  const result = await maintenanceRepository.create(data);
  revalidatePath("/maintenance");
  revalidatePath("/fleet");
  return result;
}
