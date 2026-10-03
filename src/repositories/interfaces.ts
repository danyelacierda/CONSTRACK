import type {
  Vehicle,
  EquipmentUnit,
  Driver,
  Project,
  VehicleAssignment,
  Trip,
  FuelRequest,
  FuelTransaction,
  MaintenanceTicket,
  Anomaly,
  AuditLogEntry,
} from "@/types/domain";

export interface IVehicleRepository {
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle>;
  update(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
}

export interface IEquipmentRepository {
  getAll(): Promise<EquipmentUnit[]>;
  getById(id: string): Promise<EquipmentUnit | null>;
  create(equipment: Omit<EquipmentUnit, "id" | "createdAt" | "updatedAt">): Promise<EquipmentUnit>;
  update(id: string, updates: Partial<EquipmentUnit>): Promise<EquipmentUnit | null>;
  delete(id: string): Promise<boolean>;
}

export interface IDriverRepository {
  getAll(): Promise<Driver[]>;
  getById(id: string): Promise<Driver | null>;
  create(driver: Omit<Driver, "id" | "createdAt" | "updatedAt">): Promise<Driver>;
  update(id: string, updates: Partial<Driver>): Promise<Driver | null>;
  delete(id: string): Promise<boolean>;
}

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project>;
  update(id: string, updates: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

export interface IAssignmentRepository {
  getAll(): Promise<VehicleAssignment[]>;
  getByVehicleId(vehicleId: string): Promise<VehicleAssignment[]>;
  getByDriverId(driverId: string): Promise<VehicleAssignment[]>;
  getByProjectId(projectId: string): Promise<VehicleAssignment[]>;
  getActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null>;
  getActiveByDriverId(driverId: string): Promise<VehicleAssignment | null>;
  create(assignment: Omit<VehicleAssignment, "id" | "createdAt" | "updatedAt">): Promise<VehicleAssignment>;
  update(id: string, updates: Partial<VehicleAssignment>): Promise<VehicleAssignment | null>;
}

export interface ITripRepository {
  getAll(): Promise<Trip[]>;
  getById(id: string): Promise<Trip | null>;
  getByVehicleId(vehicleId: string): Promise<Trip[]>;
  create(trip: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<Trip>;
  update(id: string, updates: Partial<Trip>): Promise<Trip | null>;
}

export interface IFuelRequestRepository {
  getAll(): Promise<FuelRequest[]>;
  getById(id: string): Promise<FuelRequest | null>;
  getByProjectId(projectId: string): Promise<FuelRequest[]>;
  create(request: Omit<FuelRequest, "id" | "createdAt" | "updatedAt">): Promise<FuelRequest>;
  update(id: string, updates: Partial<FuelRequest>): Promise<FuelRequest | null>;
}

export interface IFuelTransactionRepository {
  getAll(): Promise<FuelTransaction[]>;
  getById(id: string): Promise<FuelTransaction | null>;
  getByVehicleId(vehicleId: string): Promise<FuelTransaction[]>;
  getByProjectId(projectId: string): Promise<FuelTransaction[]>;
  create(transaction: Omit<FuelTransaction, "id" | "createdAt" | "updatedAt">): Promise<FuelTransaction>;
  update(id: string, updates: Partial<FuelTransaction>): Promise<FuelTransaction | null>;
}

export interface IMaintenanceRepository {
  getAll(): Promise<MaintenanceTicket[]>;
  getById(id: string): Promise<MaintenanceTicket | null>;
  getByVehicleId(vehicleId: string): Promise<MaintenanceTicket[]>;
  getByProjectId(projectId: string): Promise<MaintenanceTicket[]>;
  create(ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "updatedAt">): Promise<MaintenanceTicket>;
  update(id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket | null>;
}

export interface IAnomalyRepository {
  getAll(): Promise<Anomaly[]>;
  getById(id: string): Promise<Anomaly | null>;
  getOpenAnomalies(): Promise<Anomaly[]>;
  create(anomaly: Omit<Anomaly, "id" | "createdAt" | "updatedAt">): Promise<Anomaly>;
  update(id: string, updates: Partial<Anomaly>): Promise<Anomaly | null>;
}

export interface IAuditLogRepository {
  getAll(): Promise<AuditLogEntry[]>;
  create(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry>;
}
