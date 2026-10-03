/**
 * Server-side data loaders for the Fleet feature.
 * These functions encapsulate repository access so page components
 * never import from @/repositories directly.
 */
import { vehicleRepository, driverRepository, projectRepository } from "@/repositories";
import type { Vehicle, Driver, Project } from "@/types/domain";

/** Fetch all vehicles */
export async function getVehicles(): Promise<Vehicle[]> {
  return vehicleRepository.getAll();
}

/** Fetch a single vehicle by ID */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return vehicleRepository.getById(id);
}

/** Fetch all drivers (needed for fleet display: driver name resolution) */
export async function getDrivers(): Promise<Driver[]> {
  return driverRepository.getAll();
}

/** Fetch all projects (needed for fleet display: project name resolution) */
export async function getProjects(): Promise<Project[]> {
  return projectRepository.getAll();
}

/** Combined loader for the fleet page */
export async function getFleetPageData() {
  const [vehicles, drivers, projects] = await Promise.all([
    vehicleRepository.getAll(),
    driverRepository.getAll(),
    projectRepository.getAll(),
  ]);

  return {
    vehicles,
    driverMap: new Map(drivers.map((d) => [d.id, d.fullName])),
    projectMap: new Map(projects.map((p) => [p.id, p.name])),
  };
}
