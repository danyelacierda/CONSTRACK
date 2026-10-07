import {
  supabaseVehicleRepository,
  supabaseEquipmentRepository,
  supabaseDriverRepository,
  supabaseProjectRepository,
  supabaseAssignmentRepository,
  supabaseTripRepository,
  supabaseFuelRequestRepository,
  supabaseFuelTransactionRepository,
  supabaseMaintenanceRepository,
  supabaseAnomalyRepository,
  supabaseAuditLogRepository,
} from "./supabase-repositories";
import type {
  IVehicleRepository,
  IEquipmentRepository,
  IDriverRepository,
  IProjectRepository,
  IAssignmentRepository,
  ITripRepository,
  IFuelRequestRepository,
  IFuelTransactionRepository,
  IMaintenanceRepository,
  IAnomalyRepository,
  IAuditLogRepository,
} from "./interfaces";

// Re-export repository interfaces
export * from "./interfaces";

// Composition root: Exporting Supabase repository implementations under domain-agnostic names.
// Every page, component, and server action imports from @/repositories.
export const vehicleRepository: IVehicleRepository = supabaseVehicleRepository;
export const equipmentRepository: IEquipmentRepository = supabaseEquipmentRepository;
export const driverRepository: IDriverRepository = supabaseDriverRepository;
export const projectRepository: IProjectRepository = supabaseProjectRepository;
export const assignmentRepository: IAssignmentRepository = supabaseAssignmentRepository;
export const tripRepository: ITripRepository = supabaseTripRepository;
export const fuelRequestRepository: IFuelRequestRepository = supabaseFuelRequestRepository;
export const fuelTransactionRepository: IFuelTransactionRepository = supabaseFuelTransactionRepository;
export const maintenanceRepository: IMaintenanceRepository = supabaseMaintenanceRepository;
export const anomalyRepository: IAnomalyRepository = supabaseAnomalyRepository;
export const auditLogRepository: IAuditLogRepository = supabaseAuditLogRepository;
