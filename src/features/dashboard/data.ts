/**
 * Server-side data loaders for the Dashboard feature.
 * Aggregates data from multiple repositories for KPI computation.
 */
import {
  vehicleRepository,
  fuelTransactionRepository,
  anomalyRepository,
  maintenanceRepository,
  projectRepository,
} from "@/repositories";
import type {
  Vehicle,
  FuelTransaction,
  Anomaly,
  MaintenanceTicket,
  Project,
} from "@/types/domain";

export interface DashboardPageData {
  vehicles: Vehicle[];
  transactions: FuelTransaction[];
  anomalies: Anomaly[];
  maintenanceTickets: MaintenanceTicket[];
  projects: Project[];
}

/** Combined loader for the dashboard page */
export async function getDashboardPageData(): Promise<DashboardPageData> {
  const [vehicles, transactions, anomalies, maintenanceTickets, projects] = await Promise.all([
    vehicleRepository.getAll(),
    fuelTransactionRepository.getAll(),
    anomalyRepository.getOpenAnomalies(),
    maintenanceRepository.getAll(),
    projectRepository.getAll(),
  ]);

  return { vehicles, transactions, anomalies, maintenanceTickets, projects };
}
