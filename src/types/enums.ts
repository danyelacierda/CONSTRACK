// ─── Vehicle Status ─────────────────────────────────────────────
export const VEHICLE_STATUSES = [
  'Active',
  'Under Maintenance',
  'Idle',
  'Decommissioned',
] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

// ─── Equipment Status ───────────────────────────────────────────
export const EQUIPMENT_STATUSES = [
  'Active',
  'Under Maintenance',
  'Idle',
  'Decommissioned',
] as const;
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

// ─── Driver Status ──────────────────────────────────────────────
export const DRIVER_STATUSES = [
  'Active',
  'On Leave',
  'Inactive',
  'Suspended',
] as const;
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

// ─── Project Status ─────────────────────────────────────────────
export const PROJECT_STATUSES = [
  'Planning',
  'Active',
  'On Hold',
  'Completed',
  'Cancelled',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// ─── Assignment Status ──────────────────────────────────────────
export const ASSIGNMENT_STATUSES = [
  'Active',
  'Completed',
  'Cancelled',
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

// ─── Trip Status ────────────────────────────────────────────────
export const TRIP_STATUSES = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

// ─── Fuel Request Status ────────────────────────────────────────
export const FUEL_REQUEST_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Purchased',
  'Receipt Uploaded',
  'Verified',
  'Flagged',
] as const;
export type FuelRequestStatus = (typeof FUEL_REQUEST_STATUSES)[number];

// ─── Fuel Transaction Status ────────────────────────────────────
export const FUEL_TRANSACTION_STATUSES = [
  'Pending',
  'Completed',
  'Cancelled',
  'Under Review',
] as const;
export type FuelTransactionStatus = (typeof FUEL_TRANSACTION_STATUSES)[number];

// ─── Maintenance Status ─────────────────────────────────────────
export const MAINTENANCE_STATUSES = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Overdue',
  'Cancelled',
] as const;
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

// ─── Maintenance Priority ───────────────────────────────────────
export const MAINTENANCE_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Critical',
] as const;
export type MaintenancePriority = (typeof MAINTENANCE_PRIORITIES)[number];

// ─── Anomaly Status ─────────────────────────────────────────────
// NOTE: These statuses are deliberately non-accusatory.
// An anomaly "requires review" — it never implies guilt or theft.
export const ANOMALY_STATUSES = [
  'Open',
  'Under Review',
  'Dismissed',
  'Confirmed Issue',
  'Resolved',
] as const;
export type AnomalyStatus = (typeof ANOMALY_STATUSES)[number];

// ─── Anomaly Severity ───────────────────────────────────────────
export const ANOMALY_SEVERITIES = [
  'Low',
  'Medium',
  'High',
  'Critical',
] as const;
export type AnomalySeverity = (typeof ANOMALY_SEVERITIES)[number];

// ─── Anomaly Rule Codes ─────────────────────────────────────────
// Each code maps to a pure-function rule in src/services/anomaly-engine.ts.
// All 12 rules from the architecture doc Section 24.
export const ANOMALY_RULE_CODES = [
  'FUEL_EXCEEDS_APPROVAL',
  'INACTIVE_VEHICLE_FUEL',
  'MISSING_RECEIPT',
  'UNASSIGNED_DRIVER_FUEL',
  'FUEL_WITHOUT_TRIP',
  'FUEL_OUTSIDE_PROJECT',
  'DUPLICATE_RECEIPT',
  'ODOMETER_DECREASE',
  'ODOMETER_JUMP',
  'FUEL_PURCHASES_TOO_CLOSE',
  'OUTSIDE_GEOFENCE_FUEL',
  'EXCESSIVE_FUEL_CONSUMPTION',
] as const;
export type AnomalyRuleCode = (typeof ANOMALY_RULE_CODES)[number];

// ─── Fuel Type ──────────────────────────────────────────────────
export const FUEL_TYPES = [
  'Diesel',
  'Gasoline',
  'Premium',
] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

// ─── Vehicle Type ───────────────────────────────────────────────
export const VEHICLE_TYPES = [
  'Dump Truck',
  'Transit Mixer',
  'Flatbed',
  'Utility Vehicle',
  'Pickup',
  'Crane Truck',
  'Water Tanker',
] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

// ─── Equipment Type ─────────────────────────────────────────────
export const EQUIPMENT_TYPES = [
  'Excavator',
  'Backhoe',
  'Loader',
  'Bulldozer',
  'Compactor',
  'Generator',
  'Pump',
  'Scaffolding',
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

// ─── User Roles (RBAC) ─────────────────────────────────────────
// Maps to Architecture Doc RBAC matrix — 9 distinct roles.
export const ROLES = [
  'Admin',
  'Fleet Manager',
  'Driver',
] as const;
export type Role = (typeof ROLES)[number];

// ─── Audit Action Types ─────────────────────────────────────────
export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ARCHIVE',
  'APPROVE',
  'REJECT',
  'VERIFY',
  'ASSIGN',
  'UNASSIGN',
  'STATUS_CHANGE',
  'LOGIN',
  'LOGOUT',
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
