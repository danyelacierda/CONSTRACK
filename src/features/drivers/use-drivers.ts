"use server";

import { driverRepository, assignmentRepository } from "@/repositories";
import type { Driver } from "@/types/domain";

export async function getDriverById(id: string): Promise<Driver | null> {
  return driverRepository.getById(id);
}

export async function createDriver(data: Omit<Driver, "id" | "createdAt" | "updatedAt" | "isArchived">) {
  return driverRepository.create({ ...data, isArchived: false });
}

export async function updateDriver(id: string, updates: Partial<Driver>) {
  return driverRepository.update(id, updates);
}

export async function archiveDriver(id: string) {
  const active = await assignmentRepository.getActiveByDriverId(id);
  if (active) throw new Error("Cannot archive driver with an active assignment");
  return driverRepository.update(id, { isArchived: true, status: "Inactive" });
}
