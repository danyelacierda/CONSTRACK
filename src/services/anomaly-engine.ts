import type {
  FuelTransaction,
  FuelRequest,
  Vehicle,
  Driver,
  VehicleAssignment,
  Trip,
  Project,
  Anomaly,
} from "@/types/domain";
import type { AnomalyRuleCode, AnomalySeverity } from "@/types/enums";

export interface AnomalyEvaluationContext {
  transaction: FuelTransaction;
  request?: FuelRequest | null;
  vehicle?: Vehicle | null;
  driver?: Driver | null;
  activeAssignment?: VehicleAssignment | null;
  project?: Project | null;
  recentTrips?: Trip[];
  recentTransactionsForVehicle?: FuelTransaction[];
  allTransactions?: FuelTransaction[];
}

export interface AnomalyRuleResult {
  triggered: boolean;
  ruleCode: AnomalyRuleCode;
  severity: AnomalySeverity;
  description: string;
  metadata?: Record<string, unknown>;
}

/**
 * Rule 1: FUEL_EXCEEDS_APPROVAL
 * Checks if the purchased liters exceed the approved request quantity by more than the allowed tolerance (e.g. 5%).
 * Architecture Doc Rule: Discrepancy between approved allocation and pump purchase requires human review.
 */
export function checkFuelExceedsApproval(
  transaction: FuelTransaction,
  request?: FuelRequest | null
): AnomalyRuleResult {
  if (!request) {
    return {
      triggered: false,
      ruleCode: "FUEL_EXCEEDS_APPROVAL",
      severity: "Medium",
      description: "No linked fuel request provided for verification.",
    };
  }

  const variance = transaction.liters - request.requestedLiters;
  // Allow a tiny 1-liter margin for rounding at the pump
  const isTriggered = variance > 1;

  return {
    triggered: isTriggered,
    ruleCode: "FUEL_EXCEEDS_APPROVAL",
    severity: variance > 20 ? "High" : "Medium",
    description: isTriggered
      ? `Transaction volume (${transaction.liters.toFixed(1)} L) exceeds approved request ${request.requestNumber} (${request.requestedLiters.toFixed(1)} L) by ${variance.toFixed(1)} L. Review required.`
      : "Fuel volume is within approved limit.",
    metadata: {
      requestedLiters: request.requestedLiters,
      actualLiters: transaction.liters,
      varianceLiters: variance,
    },
  };
}

/**
 * Rule 2: INACTIVE_VEHICLE_FUEL
 * Flags fuel purchase attributed to a vehicle marked as Idle, Under Maintenance, or Decommissioned.
 * Architecture Doc Rule: Fueling an inactive asset indicates potential recording error or unusual activity.
 */
export function checkInactiveVehicleFuel(
  transaction: FuelTransaction,
  vehicle?: Vehicle | null
): AnomalyRuleResult {
  if (!vehicle) {
    return {
      triggered: false,
      ruleCode: "INACTIVE_VEHICLE_FUEL",
      severity: "High",
      description: "Vehicle record unavailable.",
    };
  }

  const isInactive = vehicle.status !== "Active";

  return {
    triggered: isInactive,
    ruleCode: "INACTIVE_VEHICLE_FUEL",
    severity: vehicle.status === "Decommissioned" ? "Critical" : "High",
    description: isInactive
      ? `Fuel transaction recorded for vehicle ${vehicle.plateNumber} (${vehicle.name}) which is currently marked as '${vehicle.status}'. Review required.`
      : "Vehicle status is active.",
    metadata: {
      vehicleStatus: vehicle.status,
      vehicleId: vehicle.id,
      plateNumber: vehicle.plateNumber,
    },
  };
}

/**
 * Rule 3: MISSING_RECEIPT
 * Flags transactions that have no receipt image or document attached after completion.
 * Architecture Doc Rule: Verifiable digital audit trail mandates receipt attachment for accountability.
 */
export function checkMissingReceipt(
  transaction: FuelTransaction
): AnomalyRuleResult {
  const hasNoReceipt = !transaction.receiptImageUrl || transaction.receiptImageUrl.trim() === "";

  return {
    triggered: hasNoReceipt,
    ruleCode: "MISSING_RECEIPT",
    severity: "Low",
    description: hasNoReceipt
      ? `Transaction ${transaction.transactionNumber} has no receipt image attached for fuel purchase of ₱${transaction.totalCostPhp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}. Review and document upload required.`
      : "Receipt document is attached.",
    metadata: {
      totalCostPhp: transaction.totalCostPhp,
      receiptNumber: transaction.receiptNumber,
    },
  };
}

/**
 * Rule 4: UNASSIGNED_DRIVER_FUEL
 * Flags fuel transactions where the purchasing driver is not currently assigned to the fueled vehicle.
 * Architecture Doc Rule: Custody accountability requires authorized assignment matching.
 */
export function checkUnassignedDriverFuel(
  transaction: FuelTransaction,
  activeAssignment?: VehicleAssignment | null
): AnomalyRuleResult {
  if (!activeAssignment) {
    return {
      triggered: true,
      ruleCode: "UNASSIGNED_DRIVER_FUEL",
      severity: "Medium",
      description: `Fuel purchase recorded for vehicle with no active driver assignment on record. Custody review required.`,
      metadata: {
        driverId: transaction.driverId,
        vehicleId: transaction.vehicleId,
      },
    };
  }

  const isMismatched = activeAssignment.driverId !== transaction.driverId;

  return {
    triggered: isMismatched,
    ruleCode: "UNASSIGNED_DRIVER_FUEL",
    severity: "Medium",
    description: isMismatched
      ? `Fuel purchase recorded by driver ${transaction.driverId}, but active vehicle assignment is assigned to driver ${activeAssignment.driverId}. Review required.`
      : "Driver matches active assignment.",
    metadata: {
      transactionDriverId: transaction.driverId,
      assignedDriverId: activeAssignment.driverId,
    },
  };
}

/**
 * Master evaluation function that executes the anomaly rules against a fuel transaction.
 * In Task 1, all 12 rules will be evaluated here.
 */
export function evaluateFuelTransaction(context: AnomalyEvaluationContext): AnomalyRuleResult[] {
  const results: AnomalyRuleResult[] = [];

  // Rule 1: Exceeds approval
  const r1 = checkFuelExceedsApproval(context.transaction, context.request);
  if (r1.triggered) results.push(r1);

  // Rule 2: Inactive vehicle
  const r2 = checkInactiveVehicleFuel(context.transaction, context.vehicle);
  if (r2.triggered) results.push(r2);

  // Rule 3: Missing receipt
  const r3 = checkMissingReceipt(context.transaction);
  if (r3.triggered) results.push(r3);

  // Rule 4: Unassigned driver
  const r4 = checkUnassignedDriverFuel(context.transaction, context.activeAssignment);
  if (r4.triggered) results.push(r4);

  return results;
}
