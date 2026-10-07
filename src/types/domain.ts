import type {
  VehicleStatus,
  EquipmentStatus,
  DriverStatus,
  ProjectStatus,
  AssignmentStatus,
  TripStatus,
  FuelRequestStatus,
  FuelTransactionStatus,
  MaintenanceStatus,
  MaintenancePriority,
  AnomalyStatus,
  AnomalySeverity,
  AnomalyRuleCode,
  FuelType,
  VehicleType,
  EquipmentType,
  Role,
  AuditAction,
} from './enums';

// ─── Vehicle ────────────────────────────────────────────────────
export interface Vehicle {
  id: string;
  plateNumber: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  fuelType: FuelType;
  tankCapacityLiters: number;
  currentFuelLiters: number;
  odometerKm: number;
  engineHours: number;
  make: string;
  model: string;
  year: number;
  currentProjectId: string | null;
  currentDriverId: string | null;
  photoUrl: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Equipment Unit ─────────────────────────────────────────────
export interface EquipmentUnit {
  id: string;
  assetCode: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  fuelType: FuelType | null;
  tankCapacityLiters: number | null;
  currentFuelLiters: number | null;
  engineHours: number;
  make: string;
  model: string;
  year: number;
  currentProjectId: string | null;
  photoUrl: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Driver ─────────────────────────────────────────────────────
export interface Driver {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  licenseNumber: string;
  licenseExpiry: string;
  contactNumber: string;
  email: string | null;
  status: DriverStatus;
  currentVehicleId: string | null;
  photoUrl: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Project ────────────────────────────────────────────────────
export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string | null;
  budgetPhp: number;
  spentPhp: number;
  clientName: string;
  projectManagerId: string | null;
  /** Geofence center point for anomaly detection */
  geofence: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  } | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Vehicle Assignment ─────────────────────────────────────────
export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  projectId: string;
  status: AssignmentStatus;
  startDate: string;
  endDate: string | null;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Trip ───────────────────────────────────────────────────────
export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  projectId: string;
  status: TripStatus;
  origin: string;
  destination: string;
  purpose: string;
  scheduledStart: string;
  scheduledEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  odometerStartKm: number | null;
  odometerEndKm: number | null;
  distanceKm: number | null;
  fuelUsedLiters: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Fuel Request ───────────────────────────────────────────────
export interface FuelRequest {
  id: string;
  requestNumber: string;
  vehicleId: string;
  driverId: string;
  projectId: string;
  status: FuelRequestStatus;
  fuelType: FuelType;
  requestedLiters: number;
  estimatedCostPhp: number;
  purpose: string;
  requestedBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Fuel Transaction ───────────────────────────────────────────
export interface FuelTransaction {
  id: string;
  transactionNumber: string;
  fuelRequestId: string;
  vehicleId: string;
  driverId: string;
  projectId: string;
  status: FuelTransactionStatus;
  fuelType: FuelType;
  liters: number;
  pricePerLiterPhp: number;
  totalCostPhp: number;
  station: string;
  receiptNumber: string | null;
  receiptImageUrl: string | null;
  odometerAtFillKm: number;
  transactionDate: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  /** Latitude of fuel purchase location (for geofence anomaly check) */
  latitude: number | null;
  /** Longitude of fuel purchase location (for geofence anomaly check) */
  longitude: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Maintenance Ticket ─────────────────────────────────────────
export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  vehicleId: string;
  equipmentId: string | null;
  projectId: string | null;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  type: string;
  description: string;
  scheduledDate: string;
  completedDate: string | null;
  costPhp: number;
  vendor: string | null;
  odometerAtServiceKm: number | null;
  engineHoursAtService: number | null;
  nextServiceDueKm: number | null;
  nextServiceDueDate: string | null;
  nextServiceDueHours: number | null;
  assignedTo: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Anomaly ────────────────────────────────────────────────────
// NOTE: An anomaly is a "discrepancy that requires review."
// It must NEVER imply guilt, theft, or wrongdoing.
export interface Anomaly {
  id: string;
  ruleCode: AnomalyRuleCode;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  /** Non-accusatory description of the discrepancy */
  description: string;
  fuelTransactionId: string | null;
  vehicleId: string | null;
  driverId: string | null;
  projectId: string | null;
  detectedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolutionNotes: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit Log Entry ────────────────────────────────────────────
export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  changes: Record<string, unknown>;
  ipAddress: string | null;
  timestamp: string;
}

// ─── Computed / View-Model Types ────────────────────────────────

export interface ProjectCostSummary {
  projectId: string;
  projectName: string;
  budgetPhp: number;
  fuelCostPhp: number;
  maintenanceCostPhp: number;
  totalSpentPhp: number;
  remainingPhp: number;
  utilizationPercent: number;
}

export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  underMaintenance: number;
  idleVehicles: number;
  decommissioned: number;
}

export interface MaintenanceUrgency {
  ticketId: string;
  vehicleId: string;
  type: string;
  urgencyLevel: 'due-now' | 'due-soon' | 'upcoming' | 'overdue';
  reason: string;
  daysUntilDue: number | null;
  kmUntilDue: number | null;
  hoursUntilDue: number | null;
}
