import {
  mockVehicleRepository,
  mockEquipmentRepository,
  mockDriverRepository,
  mockProjectRepository,
  mockAssignmentRepository,
  mockTripRepository,
  mockFuelRequestRepository,
  mockFuelTransactionRepository,
  mockMaintenanceRepository,
  mockAnomalyRepository,
  mockAuditLogRepository,
} from "./mock-repositories";
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

// Composition root: Exporting repositories under domain-agnostic names.
// In Task 3.5, these will point to Supabase implementations without changing callers.
export const vehicleRepository: IVehicleRepository = mockVehicleRepository;
export const equipmentRepository: IEquipmentRepository = mockEquipmentRepository;
export const driverRepository: IDriverRepository = mockDriverRepository;
export const projectRepository: IProjectRepository = mockProjectRepository;
export const assignmentRepository: IAssignmentRepository = mockAssignmentRepository;
export const tripRepository: ITripRepository = mockTripRepository;
export const fuelRequestRepository: IFuelRequestRepository = mockFuelRequestRepository;
export const fuelTransactionRepository: IFuelTransactionRepository = mockFuelTransactionRepository;
export const maintenanceRepository: IMaintenanceRepository = mockMaintenanceRepository;
export const anomalyRepository: IAnomalyRepository = mockAnomalyRepository;
export const auditLogRepository: IAuditLogRepository = mockAuditLogRepository;
