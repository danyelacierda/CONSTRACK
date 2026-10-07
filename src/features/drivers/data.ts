/**
 * Server-side data loaders for the Drivers feature.
 */
import { driverRepository, vehicleRepository } from "@/repositories";
import type { Driver, Vehicle } from "@/types/domain";

/** Fetch all drivers */
export async function getDrivers(): Promise<Driver[]> {
  return driverRepository.getAll();
}

/** Combined loader for the drivers page */
export async function getDriversPageData() {
  const [drivers, vehicles] = await Promise.all([
    driverRepository.getAll(),
    vehicleRepository.getAll(),
  ]);

  return {
    drivers,
    vehicleMap: new Map(vehicles.map((v) => [v.id, `${v.plateNumber} (${v.name})`])),
  };
}
