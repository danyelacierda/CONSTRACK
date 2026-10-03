import React from "react";
import { Badge } from "@/components/ui/badge";
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
} from "@/types/enums";

type DomainStatus =
  | VehicleStatus
  | EquipmentStatus
  | DriverStatus
  | ProjectStatus
  | AssignmentStatus
  | TripStatus
  | FuelRequestStatus
  | FuelTransactionStatus
  | MaintenanceStatus
  | MaintenancePriority
  | AnomalyStatus
  | AnomalySeverity
  | string;

interface StatusBadgeProps {
  status: DomainStatus;
  className?: string;
}

type BadgeVariant = "good" | "warn" | "critical" | "info" | "idle" | "default" | "secondary";

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: BadgeVariant = "default";

  switch (status) {
    // Good / Active / Verified / Completed
    case "Active":
    case "Verified":
    case "Resolved":
      variant = "good";
      break;

    // Warning / Pending / Under Review / In Progress
    case "Under Maintenance":
    case "Pending Approval":
    case "Receipt Uploaded":
    case "Under Review":
    case "In Progress":
    case "On Hold":
    case "High":
      variant = "warn";
      break;

    // Critical / Overdue / Rejected / Flagged / Open Anomaly
    case "Decommissioned":
    case "Suspended":
    case "Rejected":
    case "Flagged":
    case "Overdue":
    case "Critical":
    case "Open":
    case "Confirmed Issue":
      variant = "critical";
      break;

    // Info / Scheduled / Approved / Medium
    case "Approved":
    case "Purchased":
    case "Scheduled":
    case "Planning":
    case "Medium":
      variant = "info";
      break;

    // Idle / Draft / Completed / Cancelled / Inactive / Low
    case "Idle":
    case "Draft":
    case "Completed":
    case "Cancelled":
    case "On Leave":
    case "Inactive":
    case "Dismissed":
    case "Low":
      variant = "idle";
      break;

    default:
      variant = "secondary";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
