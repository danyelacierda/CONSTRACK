"use client";

import { useState, useEffect, useCallback } from "react";
import type { Vehicle } from "@/types/domain";
import { vehicleRepository, assignmentRepository } from "@/repositories";

export interface UseVehiclesResult {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Feature hook for vehicle inventory management.
 * Wraps vehicleRepository to isolate UI components from data access specifics.
 */
export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehicleRepository.getAll();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load vehicles"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles,
  };
}

/**
 * Server-compatible data loader for vehicles
 */
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
