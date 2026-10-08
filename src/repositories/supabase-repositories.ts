import { supabaseAdmin } from "@/lib/supabase-admin";
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

// ─── ROW MAPPERS ─────────────────────────────────────────────────────────────

function mapProject(row: any): Project {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description || "",
    location: row.location || "",
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date || null,
    budgetPhp: Number(row.budget_php || 0),
    spentPhp: Number(row.spent_php || 0),
    clientName: row.client_name || "",
    projectManagerId: row.project_manager_id || null,
    geofence:
      row.geofence_latitude != null
        ? {
            latitude: Number(row.geofence_latitude),
            longitude: Number(row.geofence_longitude),
            radiusKm: Number(row.geofence_radius_km || 5),
          }
        : null,
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    plateNumber: row.plate_number,
    name: row.name,
    type: row.type,
    status: row.status,
    fuelType: row.fuel_type,
    tankCapacityLiters: Number(row.tank_capacity_liters || 0),
    currentFuelLiters: Number(row.current_fuel_liters || 0),
    odometerKm: Number(row.odometer_km || 0),
    engineHours: Number(row.engine_hours || 0),
    make: row.make || "",
    model: row.model || "",
    year: Number(row.year || 0),
    currentProjectId: row.current_project_id || null,
    currentDriverId: row.current_driver_id || null,
    photoUrl: row.photo_url || null,
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEquipment(row: any): EquipmentUnit {
  return {
    id: row.id,
    assetCode: row.asset_code,
    name: row.name,
    type: row.type,
    status: row.status,
    fuelType: row.fuel_type || null,
    tankCapacityLiters:
      row.tank_capacity_liters != null ? Number(row.tank_capacity_liters) : null,
    currentFuelLiters:
      row.current_fuel_liters != null ? Number(row.current_fuel_liters) : null,
    engineHours: Number(row.engine_hours || 0),
    make: row.make || "",
    model: row.model || "",
    year: Number(row.year || 0),
    currentProjectId: row.current_project_id || null,
    photoUrl: row.photo_url || null,
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDriver(row: any): Driver {
  return {
    id: row.id,
    employeeId: row.employee_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    licenseNumber: row.license_number,
    licenseExpiry: row.license_expiry,
    contactNumber: row.contact_number || "",
    email: row.email || null,
    status: row.status,
    currentVehicleId: row.current_vehicle_id || null,
    photoUrl: row.photo_url || null,
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAssignment(row: any): VehicleAssignment {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    projectId: row.project_id,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date || null,
    notes: row.notes || "",
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTrip(row: any): Trip {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    projectId: row.project_id,
    status: row.status,
    origin: row.origin,
    destination: row.destination,
    purpose: row.purpose || "",
    scheduledStart: row.scheduled_start,
    scheduledEnd: row.scheduled_end || null,
    actualStart: row.actual_start || null,
    actualEnd: row.actual_end || null,
    odometerStartKm:
      row.odometer_start_km != null ? Number(row.odometer_start_km) : null,
    odometerEndKm:
      row.odometer_end_km != null ? Number(row.odometer_end_km) : null,
    distanceKm: row.distance_km != null ? Number(row.distance_km) : null,
    fuelUsedLiters:
      row.fuel_used_liters != null ? Number(row.fuel_used_liters) : null,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFuelRequest(row: any): FuelRequest {
  return {
    id: row.id,
    requestNumber: row.request_number,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    projectId: row.project_id,
    status: row.status,
    fuelType: row.fuel_type,
    requestedLiters: Number(row.requested_liters || 0),
    estimatedCostPhp: Number(row.estimated_cost_php || 0),
    purpose: row.purpose || "",
    requestedBy: row.requested_by,
    approvedBy: row.approved_by || null,
    approvedAt: row.approved_at || null,
    rejectionReason: row.rejection_reason || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFuelTransaction(row: any): FuelTransaction {
  return {
    id: row.id,
    transactionNumber: row.transaction_number,
    fuelRequestId: row.fuel_request_id,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    projectId: row.project_id,
    status: row.status,
    fuelType: row.fuel_type,
    liters: Number(row.liters || 0),
    pricePerLiterPhp: Number(row.price_per_liter_php || 0),
    totalCostPhp: Number(row.total_cost_php || 0),
    station: row.station,
    receiptNumber: row.receipt_number || null,
    receiptImageUrl: row.receipt_image_url || null,
    odometerAtFillKm: Number(row.odometer_at_fill_km || 0),
    transactionDate: row.transaction_date,
    verifiedBy: row.verified_by || null,
    verifiedAt: row.verified_at || null,
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMaintenanceTicket(row: any): MaintenanceTicket {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    vehicleId: row.vehicle_id,
    equipmentId: row.equipment_id || null,
    projectId: row.project_id || null,
    status: row.status,
    priority: row.priority,
    type: row.type,
    description: row.description || "",
    scheduledDate: row.scheduled_date,
    completedDate: row.completed_date || null,
    costPhp: Number(row.cost_php || 0),
    vendor: row.vendor || null,
    odometerAtServiceKm:
      row.odometer_at_service_km != null
        ? Number(row.odometer_at_service_km)
        : null,
    engineHoursAtService:
      row.engine_hours_at_service != null
        ? Number(row.engine_hours_at_service)
        : null,
    nextServiceDueKm:
      row.next_service_due_km != null ? Number(row.next_service_due_km) : null,
    nextServiceDueDate: row.next_service_due_date || null,
    nextServiceDueHours:
      row.next_service_due_hours != null
        ? Number(row.next_service_due_hours)
        : null,
    assignedTo: row.assigned_to || null,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAnomaly(row: any): Anomaly {
  return {
    id: row.id,
    ruleCode: row.rule_code,
    severity: row.severity,
    status: row.status,
    description: row.description,
    fuelTransactionId: row.fuel_transaction_id || null,
    vehicleId: row.vehicle_id || null,
    driverId: row.driver_id || null,
    projectId: row.project_id || null,
    detectedAt: row.detected_at,
    reviewedBy: row.reviewed_by || null,
    reviewedAt: row.reviewed_at || null,
    resolutionNotes: row.resolution_notes || null,
    metadata: row.metadata || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAuditLog(row: any): AuditLogEntry {
  return {
    id: row.id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    userId: row.user_id,
    userName: row.user_name,
    changes: row.changes || {},
    ipAddress: row.ip_address || null,
    timestamp: row.timestamp,
  };
}

function isMissingTableError(error: any): boolean {
  return error && (error.code === "PGRST205" || error.message?.includes("schema cache"));
}

// ─── REPOSITORY IMPLEMENTATIONS ──────────────────────────────────────────────

/**
 * SupabaseVehicleRepository
 * 
 * Implements the IVehicleRepository interface to provide full CRUD operations
 * for the `vehicles` table via Supabase. Includes fallback mechanisms to mock
 * repositories in case of missing tables (e.g., during initial setup or tests).
 */
export class SupabaseVehicleRepository implements IVehicleRepository {
  /**
   * Retrieves all non-archived vehicles from the database.
   * 
   * @returns {Promise<Vehicle[]>} A list of active vehicles.
   */
  async getAll(): Promise<Vehicle[]> {
    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .select("*")
      .eq("is_archived", false)
      .order("plate_number");

    if (error) {
      if (isMissingTableError(error)) return mockVehicleRepository.getAll();
      throw new Error(`SupabaseVehicleRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapVehicle);
  }

  async getById(id: string): Promise<Vehicle | null> {
    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockVehicleRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseVehicleRepository.getById: ${error.message}`);
    }
    return data ? mapVehicle(data) : null;
  }

  async create(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> {
    const id = `veh-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      plate_number: vehicle.plateNumber,
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      fuel_type: vehicle.fuelType,
      tank_capacity_liters: vehicle.tankCapacityLiters,
      current_fuel_liters: vehicle.currentFuelLiters,
      odometer_km: vehicle.odometerKm,
      engine_hours: vehicle.engineHours,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      current_project_id: vehicle.currentProjectId,
      current_driver_id: vehicle.currentDriverId,
      photo_url: vehicle.photoUrl,
      is_archived: vehicle.isArchived,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockVehicleRepository.create(vehicle);
      throw new Error(`SupabaseVehicleRepository.create: ${error.message}`);
    }
    return mapVehicle(data);
  }

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.plateNumber !== undefined) row.plate_number = updates.plateNumber;
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.type !== undefined) row.type = updates.type;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.fuelType !== undefined) row.fuel_type = updates.fuelType;
    if (updates.tankCapacityLiters !== undefined) row.tank_capacity_liters = updates.tankCapacityLiters;
    if (updates.currentFuelLiters !== undefined) row.current_fuel_liters = updates.currentFuelLiters;
    if (updates.odometerKm !== undefined) row.odometer_km = updates.odometerKm;
    if (updates.engineHours !== undefined) row.engine_hours = updates.engineHours;
    if (updates.make !== undefined) row.make = updates.make;
    if (updates.model !== undefined) row.model = updates.model;
    if (updates.year !== undefined) row.year = updates.year;
    if (updates.currentProjectId !== undefined) row.current_project_id = updates.currentProjectId;
    if (updates.currentDriverId !== undefined) row.current_driver_id = updates.currentDriverId;
    if (updates.photoUrl !== undefined) row.photo_url = updates.photoUrl;
    if (updates.isArchived !== undefined) row.is_archived = updates.isArchived;

    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockVehicleRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseVehicleRepository.update: ${error.message}`);
    }
    return data ? mapVehicle(data) : null;
  }

  /**
   * Permanently deletes a vehicle and cascades deletes to all dependent
   * related records (anomalies, maintenance tickets, trips, etc.) to 
   * prevent foreign key constraint violations.
   * 
   * @param {string} id - The ID of the vehicle to delete.
   * @returns {Promise<boolean>} True if successful.
   */
  async delete(id: string): Promise<boolean> {
    // Manually cascade deletes to prevent foreign key constraint violations
    await supabaseAdmin.from("anomalies").delete().eq("vehicle_id", id);
    await supabaseAdmin.from("maintenance_tickets").delete().eq("vehicle_id", id);
    await supabaseAdmin.from("fuel_transactions").delete().eq("vehicle_id", id);
    await supabaseAdmin.from("fuel_requests").delete().eq("vehicle_id", id);
    await supabaseAdmin.from("trips").delete().eq("vehicle_id", id);
    await supabaseAdmin.from("vehicle_assignments").delete().eq("vehicle_id", id);

    const { error } = await supabaseAdmin.from("vehicles").delete().eq("id", id);
    if (error) {
      if (isMissingTableError(error)) return mockVehicleRepository.delete(id);
      throw new Error(`SupabaseVehicleRepository.delete: ${error.message}`);
    }
    return true;
  }
}

export class SupabaseEquipmentRepository implements IEquipmentRepository {
  async getAll(): Promise<EquipmentUnit[]> {
    const { data, error } = await supabaseAdmin
      .from("equipment")
      .select("*")
      .eq("is_archived", false)
      .order("asset_code");

    if (error) {
      if (isMissingTableError(error)) return mockEquipmentRepository.getAll();
      throw new Error(`SupabaseEquipmentRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapEquipment);
  }

  async getById(id: string): Promise<EquipmentUnit | null> {
    const { data, error } = await supabaseAdmin
      .from("equipment")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockEquipmentRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseEquipmentRepository.getById: ${error.message}`);
    }
    return data ? mapEquipment(data) : null;
  }

  async create(equipment: Omit<EquipmentUnit, "id" | "createdAt" | "updatedAt">): Promise<EquipmentUnit> {
    const id = `eq-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      asset_code: equipment.assetCode,
      name: equipment.name,
      type: equipment.type,
      status: equipment.status,
      fuel_type: equipment.fuelType,
      tank_capacity_liters: equipment.tankCapacityLiters,
      current_fuel_liters: equipment.currentFuelLiters,
      engine_hours: equipment.engineHours,
      make: equipment.make,
      model: equipment.model,
      year: equipment.year,
      current_project_id: equipment.currentProjectId,
      photo_url: equipment.photoUrl,
      is_archived: equipment.isArchived,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("equipment")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockEquipmentRepository.create(equipment);
      throw new Error(`SupabaseEquipmentRepository.create: ${error.message}`);
    }
    return mapEquipment(data);
  }

  async update(id: string, updates: Partial<EquipmentUnit>): Promise<EquipmentUnit | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.assetCode !== undefined) row.asset_code = updates.assetCode;
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.type !== undefined) row.type = updates.type;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.fuelType !== undefined) row.fuel_type = updates.fuelType;
    if (updates.tankCapacityLiters !== undefined) row.tank_capacity_liters = updates.tankCapacityLiters;
    if (updates.currentFuelLiters !== undefined) row.current_fuel_liters = updates.currentFuelLiters;
    if (updates.engineHours !== undefined) row.engine_hours = updates.engineHours;
    if (updates.make !== undefined) row.make = updates.make;
    if (updates.model !== undefined) row.model = updates.model;
    if (updates.year !== undefined) row.year = updates.year;
    if (updates.currentProjectId !== undefined) row.current_project_id = updates.currentProjectId;
    if (updates.photoUrl !== undefined) row.photo_url = updates.photoUrl;
    if (updates.isArchived !== undefined) row.is_archived = updates.isArchived;

    const { data, error } = await supabaseAdmin
      .from("equipment")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockEquipmentRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseEquipmentRepository.update: ${error.message}`);
    }
    return data ? mapEquipment(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("equipment").delete().eq("id", id);
    if (error) {
      if (isMissingTableError(error)) return mockEquipmentRepository.delete(id);
      throw new Error(`SupabaseEquipmentRepository.delete: ${error.message}`);
    }
    return true;
  }
}

export class SupabaseDriverRepository implements IDriverRepository {
  async getAll(): Promise<Driver[]> {
    const { data, error } = await supabaseAdmin
      .from("drivers")
      .select("*")
      .eq("is_archived", false)
      .order("full_name");

    if (error) {
      if (isMissingTableError(error)) return mockDriverRepository.getAll();
      throw new Error(`SupabaseDriverRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapDriver);
  }

  async getById(id: string): Promise<Driver | null> {
    const { data, error } = await supabaseAdmin
      .from("drivers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockDriverRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseDriverRepository.getById: ${error.message}`);
    }
    return data ? mapDriver(data) : null;
  }

  async create(driver: Omit<Driver, "id" | "createdAt" | "updatedAt">): Promise<Driver> {
    const id = `drv-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      employee_id: driver.employeeId,
      first_name: driver.firstName,
      last_name: driver.lastName,
      full_name: driver.fullName,
      license_number: driver.licenseNumber,
      license_expiry: driver.licenseExpiry,
      contact_number: driver.contactNumber,
      email: driver.email,
      status: driver.status,
      current_vehicle_id: driver.currentVehicleId,
      photo_url: driver.photoUrl,
      is_archived: driver.isArchived,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("drivers")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockDriverRepository.create(driver);
      throw new Error(`SupabaseDriverRepository.create: ${error.message}`);
    }
    return mapDriver(data);
  }

  async update(id: string, updates: Partial<Driver>): Promise<Driver | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.employeeId !== undefined) row.employee_id = updates.employeeId;
    if (updates.firstName !== undefined) row.first_name = updates.firstName;
    if (updates.lastName !== undefined) row.last_name = updates.lastName;
    if (updates.fullName !== undefined) row.full_name = updates.fullName;
    if (updates.licenseNumber !== undefined) row.license_number = updates.licenseNumber;
    if (updates.licenseExpiry !== undefined) row.license_expiry = updates.licenseExpiry;
    if (updates.contactNumber !== undefined) row.contact_number = updates.contactNumber;
    if (updates.email !== undefined) row.email = updates.email;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.currentVehicleId !== undefined) row.current_vehicle_id = updates.currentVehicleId;
    if (updates.photoUrl !== undefined) row.photo_url = updates.photoUrl;
    if (updates.isArchived !== undefined) row.is_archived = updates.isArchived;

    const { data, error } = await supabaseAdmin
      .from("drivers")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockDriverRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseDriverRepository.update: ${error.message}`);
    }
    return data ? mapDriver(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("drivers").delete().eq("id", id);
    if (error) {
      if (isMissingTableError(error)) return mockDriverRepository.delete(id);
      throw new Error(`SupabaseDriverRepository.delete: ${error.message}`);
    }
    return true;
  }
}

export class SupabaseProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("is_archived", false)
      .order("name");

    if (error) {
      if (isMissingTableError(error)) return mockProjectRepository.getAll();
      throw new Error(`SupabaseProjectRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapProject);
  }

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockProjectRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseProjectRepository.getById: ${error.message}`);
    }
    return data ? mapProject(data) : null;
  }

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const id = `proj-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      code: project.code,
      name: project.name,
      description: project.description,
      location: project.location,
      status: project.status,
      start_date: project.startDate,
      end_date: project.endDate,
      budget_php: project.budgetPhp,
      spent_php: project.spentPhp,
      client_name: project.clientName,
      project_manager_id: project.projectManagerId,
      geofence_latitude: project.geofence?.latitude ?? null,
      geofence_longitude: project.geofence?.longitude ?? null,
      geofence_radius_km: project.geofence?.radiusKm ?? null,
      is_archived: project.isArchived,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockProjectRepository.create(project);
      throw new Error(`SupabaseProjectRepository.create: ${error.message}`);
    }
    return mapProject(data);
  }

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.code !== undefined) row.code = updates.code;
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.startDate !== undefined) row.start_date = updates.startDate;
    if (updates.endDate !== undefined) row.end_date = updates.endDate;
    if (updates.budgetPhp !== undefined) row.budget_php = updates.budgetPhp;
    if (updates.spentPhp !== undefined) row.spent_php = updates.spentPhp;
    if (updates.clientName !== undefined) row.client_name = updates.clientName;
    if (updates.projectManagerId !== undefined) row.project_manager_id = updates.projectManagerId;
    if (updates.geofence !== undefined) {
      row.geofence_latitude = updates.geofence?.latitude ?? null;
      row.geofence_longitude = updates.geofence?.longitude ?? null;
      row.geofence_radius_km = updates.geofence?.radiusKm ?? null;
    }
    if (updates.isArchived !== undefined) row.is_archived = updates.isArchived;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockProjectRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseProjectRepository.update: ${error.message}`);
    }
    return data ? mapProject(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    await supabaseAdmin.from("anomalies").delete().eq("project_id", id);
    await supabaseAdmin.from("maintenance_tickets").delete().eq("project_id", id);
    await supabaseAdmin.from("fuel_transactions").delete().eq("project_id", id);
    await supabaseAdmin.from("fuel_requests").delete().eq("project_id", id);
    await supabaseAdmin.from("trips").delete().eq("project_id", id);
    await supabaseAdmin.from("vehicle_assignments").delete().eq("project_id", id);
    await supabaseAdmin.from("equipment").update({ project_id: null }).eq("project_id", id);
    await supabaseAdmin.from("vehicles").update({ current_project_id: null }).eq("current_project_id", id);

    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) {
      if (isMissingTableError(error)) return mockProjectRepository.delete(id);
      throw new Error(`SupabaseProjectRepository.delete: ${error.message}`);
    }
    return true;
  }
}

export class SupabaseAssignmentRepository implements IAssignmentRepository {
  async getAll(): Promise<VehicleAssignment[]> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getAll();
      throw new Error(`SupabaseAssignmentRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapAssignment);
  }

  async getByVehicleId(vehicleId: string): Promise<VehicleAssignment[]> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("start_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getByVehicleId(vehicleId);
      throw new Error(`SupabaseAssignmentRepository.getByVehicleId: ${error.message}`);
    }
    return (data || []).map(mapAssignment);
  }

  async getByDriverId(driverId: string): Promise<VehicleAssignment[]> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .eq("driver_id", driverId)
      .order("start_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getByDriverId(driverId);
      throw new Error(`SupabaseAssignmentRepository.getByDriverId: ${error.message}`);
    }
    return (data || []).map(mapAssignment);
  }

  async getByProjectId(projectId: string): Promise<VehicleAssignment[]> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .eq("project_id", projectId)
      .order("start_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getByProjectId(projectId);
      throw new Error(`SupabaseAssignmentRepository.getByProjectId: ${error.message}`);
    }
    return (data || []).map(mapAssignment);
  }

  async getActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("status", "Active")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getActiveByVehicleId(vehicleId);
      throw new Error(`SupabaseAssignmentRepository.getActiveByVehicleId: ${error.message}`);
    }
    return data ? mapAssignment(data) : null;
  }

  async getActiveByDriverId(driverId: string): Promise<VehicleAssignment | null> {
    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .select("*")
      .eq("driver_id", driverId)
      .eq("status", "Active")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.getActiveByDriverId(driverId);
      throw new Error(`SupabaseAssignmentRepository.getActiveByDriverId: ${error.message}`);
    }
    return data ? mapAssignment(data) : null;
  }

  async create(assignment: Omit<VehicleAssignment, "id" | "createdAt" | "updatedAt">): Promise<VehicleAssignment> {
    const id = `asgn-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      vehicle_id: assignment.vehicleId,
      driver_id: assignment.driverId,
      project_id: assignment.projectId,
      status: assignment.status,
      start_date: assignment.startDate,
      end_date: assignment.endDate,
      notes: assignment.notes,
      created_by: assignment.createdBy,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.create(assignment);
      throw new Error(`SupabaseAssignmentRepository.create: ${error.message}`);
    }
    return mapAssignment(data);
  }

  async update(id: string, updates: Partial<VehicleAssignment>): Promise<VehicleAssignment | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.vehicleId !== undefined) row.vehicle_id = updates.vehicleId;
    if (updates.driverId !== undefined) row.driver_id = updates.driverId;
    if (updates.projectId !== undefined) row.project_id = updates.projectId;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.startDate !== undefined) row.start_date = updates.startDate;
    if (updates.endDate !== undefined) row.end_date = updates.endDate;
    if (updates.notes !== undefined) row.notes = updates.notes;

    const { data, error } = await supabaseAdmin
      .from("vehicle_assignments")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAssignmentRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseAssignmentRepository.update: ${error.message}`);
    }
    return data ? mapAssignment(data) : null;
  }
}

export class SupabaseTripRepository implements ITripRepository {
  async getAll(): Promise<Trip[]> {
    const { data, error } = await supabaseAdmin
      .from("trips")
      .select("*")
      .order("scheduled_start", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockTripRepository.getAll();
      throw new Error(`SupabaseTripRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapTrip);
  }

  async getById(id: string): Promise<Trip | null> {
    const { data, error } = await supabaseAdmin
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockTripRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseTripRepository.getById: ${error.message}`);
    }
    return data ? mapTrip(data) : null;
  }

  async getByVehicleId(vehicleId: string): Promise<Trip[]> {
    const { data, error } = await supabaseAdmin
      .from("trips")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("scheduled_start", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockTripRepository.getByVehicleId(vehicleId);
      throw new Error(`SupabaseTripRepository.getByVehicleId: ${error.message}`);
    }
    return (data || []).map(mapTrip);
  }

  async create(trip: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<Trip> {
    const id = `trip-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      vehicle_id: trip.vehicleId,
      driver_id: trip.driverId,
      project_id: trip.projectId,
      status: trip.status,
      origin: trip.origin,
      destination: trip.destination,
      purpose: trip.purpose,
      scheduled_start: trip.scheduledStart,
      scheduled_end: trip.scheduledEnd,
      actual_start: trip.actualStart,
      actual_end: trip.actualEnd,
      odometer_start_km: trip.odometerStartKm,
      odometer_end_km: trip.odometerEndKm,
      distance_km: trip.distanceKm,
      fuel_used_liters: trip.fuelUsedLiters,
      notes: trip.notes,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("trips")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockTripRepository.create(trip);
      throw new Error(`SupabaseTripRepository.create: ${error.message}`);
    }
    return mapTrip(data);
  }

  async update(id: string, updates: Partial<Trip>): Promise<Trip | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.vehicleId !== undefined) row.vehicle_id = updates.vehicleId;
    if (updates.driverId !== undefined) row.driver_id = updates.driverId;
    if (updates.projectId !== undefined) row.project_id = updates.projectId;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.origin !== undefined) row.origin = updates.origin;
    if (updates.destination !== undefined) row.destination = updates.destination;
    if (updates.purpose !== undefined) row.purpose = updates.purpose;
    if (updates.scheduledStart !== undefined) row.scheduled_start = updates.scheduledStart;
    if (updates.scheduledEnd !== undefined) row.scheduled_end = updates.scheduledEnd;
    if (updates.actualStart !== undefined) row.actual_start = updates.actualStart;
    if (updates.actualEnd !== undefined) row.actual_end = updates.actualEnd;
    if (updates.odometerStartKm !== undefined) row.odometer_start_km = updates.odometerStartKm;
    if (updates.odometerEndKm !== undefined) row.odometer_end_km = updates.odometerEndKm;
    if (updates.distanceKm !== undefined) row.distance_km = updates.distanceKm;
    if (updates.fuelUsedLiters !== undefined) row.fuel_used_liters = updates.fuelUsedLiters;
    if (updates.notes !== undefined) row.notes = updates.notes;

    const { data, error } = await supabaseAdmin
      .from("trips")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockTripRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseTripRepository.update: ${error.message}`);
    }
    return data ? mapTrip(data) : null;
  }
}

export class SupabaseFuelRequestRepository implements IFuelRequestRepository {
  async getAll(): Promise<FuelRequest[]> {
    const { data, error } = await supabaseAdmin
      .from("fuel_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockFuelRequestRepository.getAll();
      throw new Error(`SupabaseFuelRequestRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapFuelRequest);
  }

  async getById(id: string): Promise<FuelRequest | null> {
    const { data, error } = await supabaseAdmin
      .from("fuel_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelRequestRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseFuelRequestRepository.getById: ${error.message}`);
    }
    return data ? mapFuelRequest(data) : null;
  }

  async getByProjectId(projectId: string): Promise<FuelRequest[]> {
    const { data, error } = await supabaseAdmin
      .from("fuel_requests")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockFuelRequestRepository.getByProjectId(projectId);
      throw new Error(`SupabaseFuelRequestRepository.getByProjectId: ${error.message}`);
    }
    return (data || []).map(mapFuelRequest);
  }

  async create(request: Omit<FuelRequest, "id" | "createdAt" | "updatedAt">): Promise<FuelRequest> {
    const id = `freq-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      request_number: request.requestNumber,
      vehicle_id: request.vehicleId,
      driver_id: request.driverId,
      project_id: request.projectId,
      status: request.status,
      fuel_type: request.fuelType,
      requested_liters: request.requestedLiters,
      estimated_cost_php: request.estimatedCostPhp,
      purpose: request.purpose,
      requested_by: request.requestedBy,
      approved_by: request.approvedBy,
      approved_at: request.approvedAt,
      rejection_reason: request.rejectionReason,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("fuel_requests")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelRequestRepository.create(request);
      throw new Error(`SupabaseFuelRequestRepository.create: ${error.message}`);
    }
    return mapFuelRequest(data);
  }

  async update(id: string, updates: Partial<FuelRequest>): Promise<FuelRequest | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status !== undefined) row.status = updates.status;
    if (updates.requestedLiters !== undefined) row.requested_liters = updates.requestedLiters;
    if (updates.estimatedCostPhp !== undefined) row.estimated_cost_php = updates.estimatedCostPhp;
    if (updates.purpose !== undefined) row.purpose = updates.purpose;
    if (updates.approvedBy !== undefined) row.approved_by = updates.approvedBy;
    if (updates.approvedAt !== undefined) row.approved_at = updates.approvedAt;
    if (updates.rejectionReason !== undefined) row.rejection_reason = updates.rejectionReason;

    const { data, error } = await supabaseAdmin
      .from("fuel_requests")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelRequestRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseFuelRequestRepository.update: ${error.message}`);
    }
    return data ? mapFuelRequest(data) : null;
  }
}

export class SupabaseFuelTransactionRepository implements IFuelTransactionRepository {
  async getAll(): Promise<FuelTransaction[]> {
    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.getAll();
      throw new Error(`SupabaseFuelTransactionRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapFuelTransaction);
  }

  async getById(id: string): Promise<FuelTransaction | null> {
    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseFuelTransactionRepository.getById: ${error.message}`);
    }
    return data ? mapFuelTransaction(data) : null;
  }

  async getByVehicleId(vehicleId: string): Promise<FuelTransaction[]> {
    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("transaction_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.getByVehicleId(vehicleId);
      throw new Error(`SupabaseFuelTransactionRepository.getByVehicleId: ${error.message}`);
    }
    return (data || []).map(mapFuelTransaction);
  }

  async getByProjectId(projectId: string): Promise<FuelTransaction[]> {
    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .select("*")
      .eq("project_id", projectId)
      .order("transaction_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.getByProjectId(projectId);
      throw new Error(`SupabaseFuelTransactionRepository.getByProjectId: ${error.message}`);
    }
    return (data || []).map(mapFuelTransaction);
  }

  async create(transaction: Omit<FuelTransaction, "id" | "createdAt" | "updatedAt">): Promise<FuelTransaction> {
    const id = `ftrx-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      transaction_number: transaction.transactionNumber,
      fuel_request_id: transaction.fuelRequestId,
      vehicle_id: transaction.vehicleId,
      driver_id: transaction.driverId,
      project_id: transaction.projectId,
      status: transaction.status,
      fuel_type: transaction.fuelType,
      liters: transaction.liters,
      price_per_liter_php: transaction.pricePerLiterPhp,
      total_cost_php: transaction.totalCostPhp,
      station: transaction.station,
      receipt_number: transaction.receiptNumber,
      receipt_image_url: transaction.receiptImageUrl,
      odometer_at_fill_km: transaction.odometerAtFillKm,
      transaction_date: transaction.transactionDate,
      verified_by: transaction.verifiedBy,
      verified_at: transaction.verifiedAt,
      latitude: transaction.latitude,
      longitude: transaction.longitude,
      notes: transaction.notes,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.create(transaction);
      throw new Error(`SupabaseFuelTransactionRepository.create: ${error.message}`);
    }
    return mapFuelTransaction(data);
  }

  async update(id: string, updates: Partial<FuelTransaction>): Promise<FuelTransaction | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status !== undefined) row.status = updates.status;
    if (updates.liters !== undefined) row.liters = updates.liters;
    if (updates.pricePerLiterPhp !== undefined) row.price_per_liter_php = updates.pricePerLiterPhp;
    if (updates.totalCostPhp !== undefined) row.total_cost_php = updates.totalCostPhp;
    if (updates.receiptNumber !== undefined) row.receipt_number = updates.receiptNumber;
    if (updates.receiptImageUrl !== undefined) row.receipt_image_url = updates.receiptImageUrl;
    if (updates.verifiedBy !== undefined) row.verified_by = updates.verifiedBy;
    if (updates.verifiedAt !== undefined) row.verified_at = updates.verifiedAt;
    if (updates.notes !== undefined) row.notes = updates.notes;

    const { data, error } = await supabaseAdmin
      .from("fuel_transactions")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockFuelTransactionRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseFuelTransactionRepository.update: ${error.message}`);
    }
    return data ? mapFuelTransaction(data) : null;
  }
}

export class SupabaseMaintenanceRepository implements IMaintenanceRepository {
  async getAll(): Promise<MaintenanceTicket[]> {
    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .select("*")
      .order("scheduled_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.getAll();
      throw new Error(`SupabaseMaintenanceRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapMaintenanceTicket);
  }

  async getById(id: string): Promise<MaintenanceTicket | null> {
    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseMaintenanceRepository.getById: ${error.message}`);
    }
    return data ? mapMaintenanceTicket(data) : null;
  }

  async getByVehicleId(vehicleId: string): Promise<MaintenanceTicket[]> {
    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("scheduled_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.getByVehicleId(vehicleId);
      throw new Error(`SupabaseMaintenanceRepository.getByVehicleId: ${error.message}`);
    }
    return (data || []).map(mapMaintenanceTicket);
  }

  async getByProjectId(projectId: string): Promise<MaintenanceTicket[]> {
    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .select("*")
      .eq("project_id", projectId)
      .order("scheduled_date", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.getByProjectId(projectId);
      throw new Error(`SupabaseMaintenanceRepository.getByProjectId: ${error.message}`);
    }
    return (data || []).map(mapMaintenanceTicket);
  }

  async create(ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "updatedAt">): Promise<MaintenanceTicket> {
    const id = `maint-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      ticket_number: ticket.ticketNumber,
      vehicle_id: ticket.vehicleId,
      equipment_id: ticket.equipmentId,
      project_id: ticket.projectId,
      status: ticket.status,
      priority: ticket.priority,
      type: ticket.type,
      description: ticket.description,
      scheduled_date: ticket.scheduledDate,
      completed_date: ticket.completedDate,
      cost_php: ticket.costPhp,
      vendor: ticket.vendor,
      odometer_at_service_km: ticket.odometerAtServiceKm,
      engine_hours_at_service: ticket.engineHoursAtService,
      next_service_due_km: ticket.nextServiceDueKm,
      next_service_due_date: ticket.nextServiceDueDate,
      next_service_due_hours: ticket.nextServiceDueHours,
      assigned_to: ticket.assignedTo,
      notes: ticket.notes,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.create(ticket);
      throw new Error(`SupabaseMaintenanceRepository.create: ${error.message}`);
    }
    return mapMaintenanceTicket(data);
  }

  async update(id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status !== undefined) row.status = updates.status;
    if (updates.priority !== undefined) row.priority = updates.priority;
    if (updates.type !== undefined) row.type = updates.type;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.scheduledDate !== undefined) row.scheduled_date = updates.scheduledDate;
    if (updates.completedDate !== undefined) row.completed_date = updates.completedDate;
    if (updates.costPhp !== undefined) row.cost_php = updates.costPhp;
    if (updates.vendor !== undefined) row.vendor = updates.vendor;
    if (updates.odometerAtServiceKm !== undefined) row.odometer_at_service_km = updates.odometerAtServiceKm;
    if (updates.engineHoursAtService !== undefined) row.engine_hours_at_service = updates.engineHoursAtService;
    if (updates.nextServiceDueKm !== undefined) row.next_service_due_km = updates.nextServiceDueKm;
    if (updates.nextServiceDueDate !== undefined) row.next_service_due_date = updates.nextServiceDueDate;
    if (updates.nextServiceDueHours !== undefined) row.next_service_due_hours = updates.nextServiceDueHours;
    if (updates.assignedTo !== undefined) row.assigned_to = updates.assignedTo;
    if (updates.notes !== undefined) row.notes = updates.notes;

    const { data, error } = await supabaseAdmin
      .from("maintenance_tickets")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockMaintenanceRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseMaintenanceRepository.update: ${error.message}`);
    }
    return data ? mapMaintenanceTicket(data) : null;
  }
}

export class SupabaseAnomalyRepository implements IAnomalyRepository {
  async getAll(): Promise<Anomaly[]> {
    const { data, error } = await supabaseAdmin
      .from("anomalies")
      .select("*")
      .order("detected_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAnomalyRepository.getAll();
      throw new Error(`SupabaseAnomalyRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapAnomaly);
  }

  async getById(id: string): Promise<Anomaly | null> {
    const { data, error } = await supabaseAdmin
      .from("anomalies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAnomalyRepository.getById(id);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseAnomalyRepository.getById: ${error.message}`);
    }
    return data ? mapAnomaly(data) : null;
  }

  async getOpenAnomalies(): Promise<Anomaly[]> {
    const { data, error } = await supabaseAdmin
      .from("anomalies")
      .select("*")
      .in("status", ["Open", "Under Review"])
      .order("detected_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAnomalyRepository.getOpenAnomalies();
      throw new Error(`SupabaseAnomalyRepository.getOpenAnomalies: ${error.message}`);
    }
    return (data || []).map(mapAnomaly);
  }

  async create(anomaly: Omit<Anomaly, "id" | "createdAt" | "updatedAt">): Promise<Anomaly> {
    const id = `anom-${Date.now()}`;
    const now = new Date().toISOString();
    const row = {
      id,
      rule_code: anomaly.ruleCode,
      severity: anomaly.severity,
      status: anomaly.status,
      description: anomaly.description,
      fuel_transaction_id: anomaly.fuelTransactionId,
      vehicle_id: anomaly.vehicleId,
      driver_id: anomaly.driverId,
      project_id: anomaly.projectId,
      detected_at: anomaly.detectedAt,
      reviewed_by: anomaly.reviewedBy,
      reviewed_at: anomaly.reviewedAt,
      resolution_notes: anomaly.resolutionNotes,
      metadata: anomaly.metadata || {},
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from("anomalies")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAnomalyRepository.create(anomaly);
      throw new Error(`SupabaseAnomalyRepository.create: ${error.message}`);
    }
    return mapAnomaly(data);
  }

  async update(id: string, updates: Partial<Anomaly>): Promise<Anomaly | null> {
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status !== undefined) row.status = updates.status;
    if (updates.reviewedBy !== undefined) row.reviewed_by = updates.reviewedBy;
    if (updates.reviewedAt !== undefined) row.reviewed_at = updates.reviewedAt;
    if (updates.resolutionNotes !== undefined) row.resolution_notes = updates.resolutionNotes;
    if (updates.metadata !== undefined) row.metadata = updates.metadata;

    const { data, error } = await supabaseAdmin
      .from("anomalies")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAnomalyRepository.update(id, updates);
      if (error.code === "PGRST116") return null;
      throw new Error(`SupabaseAnomalyRepository.update: ${error.message}`);
    }
    return data ? mapAnomaly(data) : null;
  }
}

export class SupabaseAuditLogRepository implements IAuditLogRepository {
  async getAll(): Promise<AuditLogEntry[]> {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return mockAuditLogRepository.getAll();
      throw new Error(`SupabaseAuditLogRepository.getAll: ${error.message}`);
    }
    return (data || []).map(mapAuditLog);
  }

  async create(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    const id = `audit-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const row = {
      id,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      user_id: entry.userId,
      user_name: entry.userName,
      changes: entry.changes || {},
      ip_address: entry.ipAddress || null,
      timestamp,
    };

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) return mockAuditLogRepository.create(entry);
      throw new Error(`SupabaseAuditLogRepository.create: ${error.message}`);
    }
    return mapAuditLog(data);
  }
}

// Singletons for export
export const supabaseVehicleRepository = new SupabaseVehicleRepository();
export const supabaseEquipmentRepository = new SupabaseEquipmentRepository();
export const supabaseDriverRepository = new SupabaseDriverRepository();
export const supabaseProjectRepository = new SupabaseProjectRepository();
export const supabaseAssignmentRepository = new SupabaseAssignmentRepository();
export const supabaseTripRepository = new SupabaseTripRepository();
export const supabaseFuelRequestRepository = new SupabaseFuelRequestRepository();
export const supabaseFuelTransactionRepository = new SupabaseFuelTransactionRepository();
export const supabaseMaintenanceRepository = new SupabaseMaintenanceRepository();
export const supabaseAnomalyRepository = new SupabaseAnomalyRepository();
export const supabaseAuditLogRepository = new SupabaseAuditLogRepository();
