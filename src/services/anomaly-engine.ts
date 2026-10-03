import type {
  FuelTransaction,
  FuelRequest,
  Vehicle,
  Driver,
  VehicleAssignment,
  Trip,
  Project,
} from "@/types/domain";
import type { AnomalyRuleCode, AnomalySeverity } from "@/types/enums";
import { isOdometerDecrease } from "@/schemas/vehicle";

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
  previousTransaction?: FuelTransaction | null;
}

export interface AnomalyRuleResult {
  triggered: boolean;
  ruleCode: AnomalyRuleCode;
  severity: AnomalySeverity;
  description: string;
  metadata?: Record<string, unknown>;
}

/** Configurable threshold constants for anomaly checks */
export const ANOMALY_THRESHOLDS = {
  /** Maximum plausible average speed in km/h for heavy construction fleet vehicles */
  MAX_PLAUSIBLE_KM_PER_HOUR: 110,
  /** Maximum time window in hours to consider two fuel purchases "too close" */
  PURCHASES_TOO_CLOSE_HOURS: 4,
  /** Time window in hours surrounding a fuel transaction to search for an active trip */
  SURROUNDING_TRIP_HOURS: 24,
  /** Minimum plausible fuel efficiency in km/L for heavy trucks (below this requires review) */
  MIN_PLAUSIBLE_KM_PER_LITER: 0.8,
} as const;

/**
 * Pure Haversine formula to compute distance between two GPS coordinates in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 1: FUEL_EXCEEDS_APPROVAL
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 1: FUEL_EXCEEDS_APPROVAL
 * Checks if the purchased liters exceed the approved request quantity.
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

// ─────────────────────────────────────────────────────────────────────────────
// RULE 2: INACTIVE_VEHICLE_FUEL
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// RULE 3: MISSING_RECEIPT
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// RULE 4: UNASSIGNED_DRIVER_FUEL
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// RULE 5: FUEL_WITHOUT_TRIP
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 5: FUEL_WITHOUT_TRIP
 * Flags fuel transactions where no recorded trip exists for the vehicle within the surrounding time window.
 * Architecture Doc Rule Section 24: Fuel consumption must correspond to authorized vehicle movement.
 */
export function checkFuelWithoutTrip(
  transaction: FuelTransaction,
  recentTrips?: Trip[]
): AnomalyRuleResult {
  if (!recentTrips || recentTrips.length === 0) {
    return {
      triggered: true,
      ruleCode: "FUEL_WITHOUT_TRIP",
      severity: "Medium",
      description: `Fuel transaction ${transaction.transactionNumber} recorded, but no corresponding trip is logged for this vehicle within the surrounding ${ANOMALY_THRESHOLDS.SURROUNDING_TRIP_HOURS}-hour window. Operational review required.`,
      metadata: {
        transactionDate: transaction.transactionDate,
        windowHours: ANOMALY_THRESHOLDS.SURROUNDING_TRIP_HOURS,
      },
    };
  }

  const txnTime = new Date(transaction.transactionDate).getTime();
  const windowMs = ANOMALY_THRESHOLDS.SURROUNDING_TRIP_HOURS * 60 * 60 * 1000;

  // Check if any trip overlaps with the surrounding window
  const hasMatchingTrip = recentTrips.some((trip) => {
    if (trip.vehicleId !== transaction.vehicleId) return false;
    const tripStart = new Date(trip.scheduledStart || trip.actualStart || trip.createdAt).getTime();
    return Math.abs(txnTime - tripStart) <= windowMs;
  });

  return {
    triggered: !hasMatchingTrip,
    ruleCode: "FUEL_WITHOUT_TRIP",
    severity: "Medium",
    description: !hasMatchingTrip
      ? `Fuel transaction ${transaction.transactionNumber} has no corresponding trip logged within the surrounding ${ANOMALY_THRESHOLDS.SURROUNDING_TRIP_HOURS} hours. Trip logging reconciliation required.`
      : "Corresponding trip logged within operating window.",
    metadata: {
      transactionDate: transaction.transactionDate,
      hasMatchingTrip,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 6: FUEL_OUTSIDE_PROJECT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 6: FUEL_OUTSIDE_PROJECT
 * Flags fuel transactions whose project allocation differs from the vehicle's assigned project.
 * Architecture Doc Rule Section 24: Cost allocation integrity requires project alignment.
 */
export function checkFuelOutsideProject(
  transaction: FuelTransaction,
  vehicle?: Vehicle | null,
  activeAssignment?: VehicleAssignment | null
): AnomalyRuleResult {
  const currentAssignedProject = activeAssignment?.projectId || vehicle?.currentProjectId;

  if (!currentAssignedProject) {
    return {
      triggered: false,
      ruleCode: "FUEL_OUTSIDE_PROJECT",
      severity: "Low",
      description: "Vehicle has no current project assignment to compare against.",
    };
  }

  const isMismatched = transaction.projectId !== currentAssignedProject;

  return {
    triggered: isMismatched,
    ruleCode: "FUEL_OUTSIDE_PROJECT",
    severity: "Medium",
    description: isMismatched
      ? `Fuel transaction allocated to project '${transaction.projectId}', but vehicle is currently assigned to project '${currentAssignedProject}'. Cross-project cost allocation review required.`
      : "Transaction project matches vehicle assignment.",
    metadata: {
      transactionProjectId: transaction.projectId,
      assignedProjectId: currentAssignedProject,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 7: DUPLICATE_RECEIPT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 7: DUPLICATE_RECEIPT
 * Flags transactions where the receipt number, station, date, and amount match another transaction.
 * Architecture Doc Rule Section 24: Duplicate expense recording check.
 */
export function checkDuplicateReceipt(
  transaction: FuelTransaction,
  allTransactions?: FuelTransaction[]
): AnomalyRuleResult {
  if (!allTransactions || allTransactions.length <= 1) {
    return {
      triggered: false,
      ruleCode: "DUPLICATE_RECEIPT",
      severity: "High",
      description: "No other transactions available to check for duplicates.",
    };
  }

  const duplicate = allTransactions.find((other) => {
    if (other.id === transaction.id) return false;

    // Check 1: Same official receipt number from same station
    const hasReceiptNumberMatch =
      transaction.receiptNumber &&
      other.receiptNumber &&
      transaction.receiptNumber.trim().toLowerCase() === other.receiptNumber.trim().toLowerCase() &&
      transaction.station.trim().toLowerCase() === other.station.trim().toLowerCase();

    // Check 2: Same vehicle, same station, same date, and identical cost
    const isExactMatch =
      other.vehicleId === transaction.vehicleId &&
      other.station.trim().toLowerCase() === transaction.station.trim().toLowerCase() &&
      other.transactionDate.substring(0, 10) === transaction.transactionDate.substring(0, 10) &&
      Math.abs(other.totalCostPhp - transaction.totalCostPhp) < 0.01;

    return hasReceiptNumberMatch || isExactMatch;
  });

  return {
    triggered: !!duplicate,
    ruleCode: "DUPLICATE_RECEIPT",
    severity: "High",
    description: duplicate
      ? `Receipt details match transaction ${duplicate.transactionNumber} (Station: ${duplicate.station}, ₱${duplicate.totalCostPhp.toLocaleString("en-PH")}). Verification required to rule out duplicate entry.`
      : "Receipt appears unique across records.",
    metadata: {
      duplicateTransactionId: duplicate?.id,
      duplicateTransactionNumber: duplicate?.transactionNumber,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 8: ODOMETER_DECREASE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 8: ODOMETER_DECREASE
 * Flags new odometer reading below the last recorded odometer reading without an explicit correction flag.
 * Architecture Doc Rule Section 24: Reuses isOdometerDecrease helper from vehicle schema.
 */
export function checkOdometerDecrease(
  transaction: FuelTransaction,
  vehicle?: Vehicle | null,
  previousTransaction?: FuelTransaction | null
): AnomalyRuleResult {
  // Resolve previous reference odometer:
  // If previousTransaction is explicitly provided, compare against it.
  // If previousTransaction is omitted (undefined), fall back to vehicle.odometerKm for live new entries.
  // If previousTransaction is null (explicitly indicating no prior transaction on record), return not triggered.
  let previousKm: number | null = null;
  if (previousTransaction) {
    previousKm = previousTransaction.odometerAtFillKm;
  } else if (previousTransaction === undefined && vehicle) {
    previousKm = vehicle.odometerKm;
  }

  if (previousKm === null || previousKm === undefined) {
    return {
      triggered: false,
      ruleCode: "ODOMETER_DECREASE",
      severity: "High",
      description: "Previous odometer reading unavailable for comparison.",
    };
  }

  // Uses the shared helper function from vehicle schema
  const isDecreased = isOdometerDecrease(previousKm, transaction.odometerAtFillKm, false);

  return {
    triggered: isDecreased,
    ruleCode: "ODOMETER_DECREASE",
    severity: "High",
    description: isDecreased
      ? `Odometer reading at fill (${transaction.odometerAtFillKm.toLocaleString()} km) is lower than previously recorded reading (${previousKm.toLocaleString()} km). Odometer entry or calibration review required.`
      : "Odometer sequence is consistent.",
    metadata: {
      recordedKm: transaction.odometerAtFillKm,
      previousKm,
      deltaKm: transaction.odometerAtFillKm - previousKm,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 9: ODOMETER_JUMP
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 9: ODOMETER_JUMP
 * Flags odometer delta that is implausible for the elapsed time since the last recorded reading.
 * Architecture Doc Rule Section 24: Implausible km jump relative to MAX_PLAUSIBLE_KM_PER_HOUR.
 */
export function checkOdometerJump(
  transaction: FuelTransaction,
  previousTransaction?: FuelTransaction | null,
  vehicle?: Vehicle | null
): AnomalyRuleResult {
  const previousKm = previousTransaction
    ? previousTransaction.odometerAtFillKm
    : vehicle
    ? vehicle.odometerKm
    : null;

  const previousDateStr = previousTransaction
    ? previousTransaction.transactionDate
    : vehicle
    ? vehicle.updatedAt
    : null;

  if (previousKm === null || !previousDateStr) {
    return {
      triggered: false,
      ruleCode: "ODOMETER_JUMP",
      severity: "Medium",
      description: "Previous odometer or timestamp unavailable for jump calculation.",
    };
  }

  const deltaKm = transaction.odometerAtFillKm - previousKm;
  if (deltaKm <= 0) {
    // Negative delta is handled by ODOMETER_DECREASE
    return {
      triggered: false,
      ruleCode: "ODOMETER_JUMP",
      severity: "Medium",
      description: "Odometer delta is non-positive.",
    };
  }

  const prevTime = new Date(previousDateStr).getTime();
  const currTime = new Date(transaction.transactionDate).getTime();
  const elapsedHours = Math.max((currTime - prevTime) / (1000 * 60 * 60), 0.1);

  const impliedSpeedKmH = deltaKm / elapsedHours;
  const isJump = impliedSpeedKmH > ANOMALY_THRESHOLDS.MAX_PLAUSIBLE_KM_PER_HOUR;

  return {
    triggered: isJump,
    ruleCode: "ODOMETER_JUMP",
    severity: impliedSpeedKmH > 180 ? "Critical" : "High",
    description: isJump
      ? `Odometer advance of ${deltaKm.toLocaleString()} km over ${elapsedHours.toFixed(1)} hours implies an average speed of ${impliedSpeedKmH.toFixed(0)} km/h, exceeding the threshold of ${ANOMALY_THRESHOLDS.MAX_PLAUSIBLE_KM_PER_HOUR} km/h. Reading review required.`
      : "Odometer advance is within plausible velocity limits.",
    metadata: {
      deltaKm,
      elapsedHours,
      impliedSpeedKmH,
      maxPlausibleKmH: ANOMALY_THRESHOLDS.MAX_PLAUSIBLE_KM_PER_HOUR,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 10: FUEL_PURCHASES_TOO_CLOSE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 10: FUEL_PURCHASES_TOO_CLOSE
 * Flags two transactions for the same vehicle in a short window whose combined liters exceed the vehicle's tank capacity.
 * Architecture Doc Rule Section 24: Unusually rapid successive fueling exceeding tank volume.
 */
export function checkFuelPurchasesTooClose(
  transaction: FuelTransaction,
  recentTransactionsForVehicle?: FuelTransaction[],
  vehicle?: Vehicle | null
): AnomalyRuleResult {
  const tankCapacity = vehicle?.tankCapacityLiters ?? 300;

  if (!recentTransactionsForVehicle || recentTransactionsForVehicle.length <= 1) {
    return {
      triggered: false,
      ruleCode: "FUEL_PURCHASES_TOO_CLOSE",
      severity: "High",
      description: "No recent transactions found for proximity comparison.",
    };
  }

  const txnTime = new Date(transaction.transactionDate).getTime();
  const windowMs = ANOMALY_THRESHOLDS.PURCHASES_TOO_CLOSE_HOURS * 60 * 60 * 1000;

  const closeTransactions = recentTransactionsForVehicle.filter((other) => {
    if (other.id === transaction.id) return false;
    const otherTime = new Date(other.transactionDate).getTime();
    return Math.abs(txnTime - otherTime) <= windowMs;
  });

  if (closeTransactions.length === 0) {
    return {
      triggered: false,
      ruleCode: "FUEL_PURCHASES_TOO_CLOSE",
      severity: "High",
      description: "No other fuel purchases within close time window.",
    };
  }

  // Check if transaction + any close transaction exceeds tank capacity
  let excessivePair: FuelTransaction | null = null;
  let combinedLiters = 0;

  for (const other of closeTransactions) {
    const total = transaction.liters + other.liters;
    if (total > tankCapacity) {
      excessivePair = other;
      combinedLiters = total;
      break;
    }
  }

  const isTriggered = excessivePair !== null;

  return {
    triggered: isTriggered,
    ruleCode: "FUEL_PURCHASES_TOO_CLOSE",
    severity: "High",
    description: isTriggered
      ? `Two fuel purchases totaling ${combinedLiters.toFixed(1)} L were recorded within ${ANOMALY_THRESHOLDS.PURCHASES_TOO_CLOSE_HOURS} hours, exceeding vehicle tank capacity (${tankCapacity} L). Purchase interval review required.`
      : "Fuel purchase interval is normal relative to tank capacity.",
    metadata: {
      combinedLiters,
      tankCapacityLiters: tankCapacity,
      previousTransactionNumber: excessivePair?.transactionNumber,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 11: OUTSIDE_GEOFENCE_FUEL
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 11: OUTSIDE_GEOFENCE_FUEL
 * Checks if the fuel purchase location falls outside the assigned project's defined geofence boundary.
 * Architecture Doc Rule Section 24: Stubbed against Project.geofence using Haversine distance formula.
 *
 * NOTE: This is evaluated against static transaction GPS coordinates and Project.geofence.
 * It will be enhanced with live continuous GPS telematics once telematics tracking lands in a future phase.
 */
export function checkOutsideGeofenceFuel(
  transaction: FuelTransaction,
  project?: Project | null
): AnomalyRuleResult {
  if (!project || !project.geofence) {
    return {
      triggered: false,
      ruleCode: "OUTSIDE_GEOFENCE_FUEL",
      severity: "Medium",
      description: "Project has no geofence perimeter configured.",
    };
  }

  if (transaction.latitude === null || transaction.longitude === null) {
    return {
      triggered: false,
      ruleCode: "OUTSIDE_GEOFENCE_FUEL",
      severity: "Medium",
      description: "Transaction location coordinates not recorded.",
    };
  }

  const distanceKm = calculateHaversineDistanceKm(
    transaction.latitude,
    transaction.longitude,
    project.geofence.latitude,
    project.geofence.longitude
  );

  const isOutside = distanceKm > project.geofence.radiusKm;

  return {
    triggered: isOutside,
    ruleCode: "OUTSIDE_GEOFENCE_FUEL",
    severity: distanceKm > project.geofence.radiusKm * 3 ? "High" : "Medium",
    description: isOutside
      ? `Fuel station coordinates (${distanceKm.toFixed(1)} km from project center) are outside the designated ${project.geofence.radiusKm} km project geofence for '${project.name}'. Route variance review required.`
      : "Purchase location is within project geofence boundary.",
    metadata: {
      distanceKm,
      geofenceRadiusKm: project.geofence.radiusKm,
      projectLat: project.geofence.latitude,
      projectLon: project.geofence.longitude,
      stationLat: transaction.latitude,
      stationLon: transaction.longitude,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 12: EXCESSIVE_FUEL_CONSUMPTION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rule 12: EXCESSIVE_FUEL_CONSUMPTION
 * Flags unusually poor fuel economy (km/L) compared to plausible vehicle thresholds.
 * Architecture Doc Rule Section 24: Identifies potential fuel leaks, mechanical wear, or logging discrepancies.
 */
export function checkExcessiveFuelConsumption(
  transaction: FuelTransaction,
  previousTransaction?: FuelTransaction | null
): AnomalyRuleResult {
  if (!previousTransaction) {
    return {
      triggered: false,
      ruleCode: "EXCESSIVE_FUEL_CONSUMPTION",
      severity: "Medium",
      description: "Previous odometer reading unavailable to calculate fuel consumption delta.",
    };
  }

  const deltaKm = transaction.odometerAtFillKm - previousTransaction.odometerAtFillKm;
  if (deltaKm <= 0 || transaction.liters <= 0) {
    return {
      triggered: false,
      ruleCode: "EXCESSIVE_FUEL_CONSUMPTION",
      severity: "Medium",
      description: "Insufficient delta to compute fuel economy.",
    };
  }

  const kmPerLiter = deltaKm / transaction.liters;
  const isExcessive = kmPerLiter < ANOMALY_THRESHOLDS.MIN_PLAUSIBLE_KM_PER_LITER;

  return {
    triggered: isExcessive,
    ruleCode: "EXCESSIVE_FUEL_CONSUMPTION",
    severity: kmPerLiter < 0.4 ? "High" : "Medium",
    description: isExcessive
      ? `Calculated fuel economy (${kmPerLiter.toFixed(2)} km/L across ${deltaKm.toLocaleString()} km) is below expected operating efficiency (${ANOMALY_THRESHOLDS.MIN_PLAUSIBLE_KM_PER_LITER} km/L). Mechanical inspection or operational review required.`
      : "Fuel consumption efficiency is within expected parameters.",
    metadata: {
      deltaKm,
      liters: transaction.liters,
      kmPerLiter,
      minPlausibleKmPerLiter: ANOMALY_THRESHOLDS.MIN_PLAUSIBLE_KM_PER_LITER,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER EVALUATOR: Runs all 12 rules
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Master evaluation engine executing all 12 anomaly detection rules from Architecture Doc Section 24.
 * Returns an array of all rules that triggered for supervisory review.
 */
export function evaluateFuelTransaction(context: AnomalyEvaluationContext): AnomalyRuleResult[] {
  const results: AnomalyRuleResult[] = [];

  // Rule 1: FUEL_EXCEEDS_APPROVAL
  const r1 = checkFuelExceedsApproval(context.transaction, context.request);
  if (r1.triggered) results.push(r1);

  // Rule 2: INACTIVE_VEHICLE_FUEL
  const r2 = checkInactiveVehicleFuel(context.transaction, context.vehicle);
  if (r2.triggered) results.push(r2);

  // Rule 3: MISSING_RECEIPT
  const r3 = checkMissingReceipt(context.transaction);
  if (r3.triggered) results.push(r3);

  // Rule 4: UNASSIGNED_DRIVER_FUEL
  const r4 = checkUnassignedDriverFuel(context.transaction, context.activeAssignment);
  if (r4.triggered) results.push(r4);

  // Rule 5: FUEL_WITHOUT_TRIP
  const r5 = checkFuelWithoutTrip(context.transaction, context.recentTrips);
  if (r5.triggered) results.push(r5);

  // Rule 6: FUEL_OUTSIDE_PROJECT
  const r6 = checkFuelOutsideProject(context.transaction, context.vehicle, context.activeAssignment);
  if (r6.triggered) results.push(r6);

  // Rule 7: DUPLICATE_RECEIPT
  const r7 = checkDuplicateReceipt(context.transaction, context.allTransactions);
  if (r7.triggered) results.push(r7);

  // Rule 8: ODOMETER_DECREASE
  const r8 = checkOdometerDecrease(context.transaction, context.vehicle, context.previousTransaction);
  if (r8.triggered) results.push(r8);

  // Rule 9: ODOMETER_JUMP
  const r9 = checkOdometerJump(context.transaction, context.previousTransaction, context.vehicle);
  if (r9.triggered) results.push(r9);

  // Rule 10: FUEL_PURCHASES_TOO_CLOSE
  const r10 = checkFuelPurchasesTooClose(context.transaction, context.recentTransactionsForVehicle, context.vehicle);
  if (r10.triggered) results.push(r10);

  // Rule 11: OUTSIDE_GEOFENCE_FUEL
  const r11 = checkOutsideGeofenceFuel(context.transaction, context.project);
  if (r11.triggered) results.push(r11);

  // Rule 12: EXCESSIVE_FUEL_CONSUMPTION
  const r12 = checkExcessiveFuelConsumption(context.transaction, context.previousTransaction);
  if (r12.triggered) results.push(r12);

  return results;
}
