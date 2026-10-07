/**
 * Server-side data loaders for the Anomaly/Discrepancy feature.
 */
import { anomalyRepository, vehicleRepository } from "@/repositories";
import type { Anomaly, Vehicle } from "@/types/domain";

/** Fetch all anomalies */
export async function getAnomalies(): Promise<Anomaly[]> {
  return anomalyRepository.getAll();
}

/** Fetch open anomalies only */
export async function getOpenAnomalies(): Promise<Anomaly[]> {
  return anomalyRepository.getOpenAnomalies();
}

/** Combined loader for the anomaly review page */
export async function getAnomaliesPageData() {
  const [anomalies, vehicles] = await Promise.all([
    anomalyRepository.getAll(),
    vehicleRepository.getAll(),
  ]);

  return {
    anomalies,
    vehicleMap: new Map(vehicles.map((v) => [v.id, `${v.plateNumber} (${v.name})`])),
  };
}
