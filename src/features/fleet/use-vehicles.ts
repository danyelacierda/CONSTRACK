"use server";

import type { Vehicle } from "@/types/domain";
import { vehicleRepository, assignmentRepository } from "@/repositories";

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicleRepository.getAll();
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return vehicleRepository.getById(id);
}

export async function createVehicle(data: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "isArchived">) {
  return vehicleRepository.create({ ...data, isArchived: false });
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  return vehicleRepository.update(id, updates);
}

export async function archiveVehicle(id: string) {
  const active = await assignmentRepository.getActiveByVehicleId(id);
  if (active) throw new Error("Cannot archive vehicle with an active assignment");
  return vehicleRepository.update(id, { isArchived: true, status: "Decommissioned" });
}

export async function deleteVehicle(id: string) {
  const active = await assignmentRepository.getActiveByVehicleId(id);
  if (active) throw new Error("Cannot delete vehicle with an active assignment");
  return vehicleRepository.delete(id);
}
