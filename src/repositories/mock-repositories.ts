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
import {
  INITIAL_VEHICLES,
  INITIAL_EQUIPMENT,
  INITIAL_DRIVERS,
  INITIAL_PROJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TRIPS,
  INITIAL_FUEL_REQUESTS,
  INITIAL_FUEL_TRANSACTIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_ANOMALIES,
  INITIAL_AUDIT_LOGS,
} from "./mock-data";

// In-memory data store seeded from mock data
class MockVehicleRepository implements IVehicleRepository {
  private items: Vehicle[] = [...INITIAL_VEHICLES];

  async getAll(): Promise<Vehicle[]> {
    return this.items.filter((item) => !item.isArchived);
  }

  async getById(id: string): Promise<Vehicle | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async create(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> {
    const newItem: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items[index].isArchived = true;
    this.items[index].updatedAt = new Date().toISOString();
    return true;
  }
}

class MockEquipmentRepository implements IEquipmentRepository {
  private items: EquipmentUnit[] = [...INITIAL_EQUIPMENT];

  async getAll(): Promise<EquipmentUnit[]> {
    return this.items.filter((item) => !item.isArchived);
  }

  async getById(id: string): Promise<EquipmentUnit | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async create(equipment: Omit<EquipmentUnit, "id" | "createdAt" | "updatedAt">): Promise<EquipmentUnit> {
    const newItem: EquipmentUnit = {
      ...equipment,
      id: `eq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<EquipmentUnit>): Promise<EquipmentUnit | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items[index].isArchived = true;
    this.items[index].updatedAt = new Date().toISOString();
    return true;
  }
}

class MockDriverRepository implements IDriverRepository {
  private items: Driver[] = [...INITIAL_DRIVERS];

  async getAll(): Promise<Driver[]> {
    return this.items.filter((item) => !item.isArchived);
  }

  async getById(id: string): Promise<Driver | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async create(driver: Omit<Driver, "id" | "createdAt" | "updatedAt">): Promise<Driver> {
    const newItem: Driver = {
      ...driver,
      id: `drv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<Driver>): Promise<Driver | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items[index].isArchived = true;
    this.items[index].updatedAt = new Date().toISOString();
    return true;
  }
}

class MockProjectRepository implements IProjectRepository {
  private items: Project[] = [...INITIAL_PROJECTS];

  async getAll(): Promise<Project[]> {
    return this.items.filter((item) => !item.isArchived);
  }

  async getById(id: string): Promise<Project | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const newItem: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items[index].isArchived = true;
    this.items[index].updatedAt = new Date().toISOString();
    return true;
  }
}

class MockAssignmentRepository implements IAssignmentRepository {
  private items: VehicleAssignment[] = [...INITIAL_ASSIGNMENTS];

  async getAll(): Promise<VehicleAssignment[]> {
    return this.items;
  }

  async getByVehicleId(vehicleId: string): Promise<VehicleAssignment[]> {
    return this.items.filter((item) => item.vehicleId === vehicleId);
  }

  async getByDriverId(driverId: string): Promise<VehicleAssignment[]> {
    return this.items.filter((item) => item.driverId === driverId);
  }

  async getByProjectId(projectId: string): Promise<VehicleAssignment[]> {
    return this.items.filter((item) => item.projectId === projectId);
  }

  async getActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null> {
    return this.items.find((item) => item.vehicleId === vehicleId && item.status === "Active") || null;
  }

  async getActiveByDriverId(driverId: string): Promise<VehicleAssignment | null> {
    return this.items.find((item) => item.driverId === driverId && item.status === "Active") || null;
  }

  async create(assignment: Omit<VehicleAssignment, "id" | "createdAt" | "updatedAt">): Promise<VehicleAssignment> {
    const newItem: VehicleAssignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<VehicleAssignment>): Promise<VehicleAssignment | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockTripRepository implements ITripRepository {
  private items: Trip[] = [...INITIAL_TRIPS];

  async getAll(): Promise<Trip[]> {
    return this.items;
  }

  async getById(id: string): Promise<Trip | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getByVehicleId(vehicleId: string): Promise<Trip[]> {
    return this.items.filter((item) => item.vehicleId === vehicleId);
  }

  async create(trip: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<Trip> {
    const newItem: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<Trip>): Promise<Trip | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockFuelRequestRepository implements IFuelRequestRepository {
  private items: FuelRequest[] = [...INITIAL_FUEL_REQUESTS];

  async getAll(): Promise<FuelRequest[]> {
    return this.items;
  }

  async getById(id: string): Promise<FuelRequest | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getByProjectId(projectId: string): Promise<FuelRequest[]> {
    return this.items.filter((item) => item.projectId === projectId);
  }

  async create(request: Omit<FuelRequest, "id" | "createdAt" | "updatedAt">): Promise<FuelRequest> {
    const newItem: FuelRequest = {
      ...request,
      id: `freq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<FuelRequest>): Promise<FuelRequest | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockFuelTransactionRepository implements IFuelTransactionRepository {
  private items: FuelTransaction[] = [...INITIAL_FUEL_TRANSACTIONS];

  async getAll(): Promise<FuelTransaction[]> {
    return this.items;
  }

  async getById(id: string): Promise<FuelTransaction | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getByVehicleId(vehicleId: string): Promise<FuelTransaction[]> {
    return this.items.filter((item) => item.vehicleId === vehicleId);
  }

  async getByProjectId(projectId: string): Promise<FuelTransaction[]> {
    return this.items.filter((item) => item.projectId === projectId);
  }

  async create(transaction: Omit<FuelTransaction, "id" | "createdAt" | "updatedAt">): Promise<FuelTransaction> {
    const newItem: FuelTransaction = {
      ...transaction,
      id: `ftx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<FuelTransaction>): Promise<FuelTransaction | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockMaintenanceRepository implements IMaintenanceRepository {
  private items: MaintenanceTicket[] = [...INITIAL_MAINTENANCE_TICKETS];

  async getAll(): Promise<MaintenanceTicket[]> {
    return this.items;
  }

  async getById(id: string): Promise<MaintenanceTicket | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getByVehicleId(vehicleId: string): Promise<MaintenanceTicket[]> {
    return this.items.filter((item) => item.vehicleId === vehicleId);
  }

  async getByProjectId(projectId: string): Promise<MaintenanceTicket[]> {
    return this.items.filter((item) => item.projectId === projectId);
  }

  async create(ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "updatedAt">): Promise<MaintenanceTicket> {
    const newItem: MaintenanceTicket = {
      ...ticket,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockAnomalyRepository implements IAnomalyRepository {
  private items: Anomaly[] = [...INITIAL_ANOMALIES];

  async getAll(): Promise<Anomaly[]> {
    return this.items;
  }

  async getById(id: string): Promise<Anomaly | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getOpenAnomalies(): Promise<Anomaly[]> {
    return this.items.filter((item) => item.status === "Open" || item.status === "Under Review");
  }

  async create(anomaly: Omit<Anomaly, "id" | "createdAt" | "updatedAt">): Promise<Anomaly> {
    const newItem: Anomaly = {
      ...anomaly,
      id: `anom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<Anomaly>): Promise<Anomaly | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }
}

class MockAuditLogRepository implements IAuditLogRepository {
  private items: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  async getAll(): Promise<AuditLogEntry[]> {
    return this.items;
  }

  async create(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    const newItem: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }
}

export const mockVehicleRepository = new MockVehicleRepository();
export const mockEquipmentRepository = new MockEquipmentRepository();
export const mockDriverRepository = new MockDriverRepository();
export const mockProjectRepository = new MockProjectRepository();
export const mockAssignmentRepository = new MockAssignmentRepository();
export const mockTripRepository = new MockTripRepository();
export const mockFuelRequestRepository = new MockFuelRequestRepository();
export const mockFuelTransactionRepository = new MockFuelTransactionRepository();
export const mockMaintenanceRepository = new MockMaintenanceRepository();
export const mockAnomalyRepository = new MockAnomalyRepository();
export const mockAuditLogRepository = new MockAuditLogRepository();
