/**
 * Server-side data loaders for the Fuel feature.
 * Covers fuel requests, fuel transactions, and related lookups.
 */
import {
  fuelRequestRepository,
  fuelTransactionRepository,
  vehicleRepository,
  driverRepository,
  projectRepository,
} from "@/repositories";
import type { FuelRequest, FuelTransaction } from "@/types/domain";

/** Fetch all fuel requests */
export async function getFuelRequests(): Promise<FuelRequest[]> {
  return fuelRequestRepository.getAll();
}

/** Fetch all fuel transactions */
export async function getFuelTransactions(): Promise<FuelTransaction[]> {
  return fuelTransactionRepository.getAll();
}

/** Combined loader for the fuel requests page */
export async function getFuelRequestsPageData() {
  const [requests, vehicles, drivers, projects] = await Promise.all([
    fuelRequestRepository.getAll(),
    vehicleRepository.getAll(),
    driverRepository.getAll(),
    projectRepository.getAll(),
  ]);

  return {
    requests,
    vehicleMap: new Map(vehicles.map((v) => [v.id, v.plateNumber])),
    driverMap: new Map(drivers.map((d) => [d.id, d.fullName])),
    projectMap: new Map(projects.map((p) => [p.id, p.name])),
  };
}
