import {
  evaluateFuelTransaction,
  checkFuelExceedsApproval,
  checkInactiveVehicleFuel,
  checkMissingReceipt,
  checkUnassignedDriverFuel,
  checkFuelWithoutTrip,
  checkFuelOutsideProject,
  checkDuplicateReceipt,
  checkOdometerDecrease,
  checkOdometerJump,
  checkFuelPurchasesTooClose,
  checkOutsideGeofenceFuel,
  checkExcessiveFuelConsumption,
  ANOMALY_THRESHOLDS,
  type AnomalyEvaluationContext,
} from "../src/services/anomaly-engine";
import { ANOMALY_RULE_CODES } from "../src/types/enums";
import {
  INITIAL_VEHICLES,
  INITIAL_PROJECTS,
  INITIAL_DRIVERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TRIPS,
  INITIAL_FUEL_REQUESTS,
  INITIAL_FUEL_TRANSACTIONS,
} from "../src/repositories/mock-data";
import type { FuelTransaction, FuelRequest, Vehicle } from "../src/types/domain";

console.log("==================================================================");
console.log("   CONSTRACK — ANOMALY ENGINE 12-RULE VERIFICATION SUITE         ");
console.log("==================================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    if (detail) console.error(`         Detail: ${detail}`);
    testsFailed++;
  }
}

// ─── 1. VERIFY ALL 12 RULES EXIST ──────────────────────────────────────────────
console.log("\n--- PART 1: Rule Function Existence Check (12/12) ---");
const ruleFunctions = [
  { code: "FUEL_EXCEEDS_APPROVAL", fn: checkFuelExceedsApproval },
  { code: "INACTIVE_VEHICLE_FUEL", fn: checkInactiveVehicleFuel },
  { code: "MISSING_RECEIPT", fn: checkMissingReceipt },
  { code: "UNASSIGNED_DRIVER_FUEL", fn: checkUnassignedDriverFuel },
  { code: "FUEL_WITHOUT_TRIP", fn: checkFuelWithoutTrip },
  { code: "FUEL_OUTSIDE_PROJECT", fn: checkFuelOutsideProject },
  { code: "DUPLICATE_RECEIPT", fn: checkDuplicateReceipt },
  { code: "ODOMETER_DECREASE", fn: checkOdometerDecrease },
  { code: "ODOMETER_JUMP", fn: checkOdometerJump },
  { code: "FUEL_PURCHASES_TOO_CLOSE", fn: checkFuelPurchasesTooClose },
  { code: "OUTSIDE_GEOFENCE_FUEL", fn: checkOutsideGeofenceFuel },
  { code: "EXCESSIVE_FUEL_CONSUMPTION", fn: checkExcessiveFuelConsumption },
];

for (const { code, fn } of ruleFunctions) {
  assert(typeof fn === "function", `Function for ${code} is defined as a pure function`);
}

// ─── 2. TEST EACH RULE ON CRAFTED BAD RECORDS ──────────────────────────────────
console.log("\n--- PART 2: Crafted Bad Records (All 12 Must Fire) ---");

const cleanTxn = INITIAL_FUEL_TRANSACTIONS[0];
const cleanReq = INITIAL_FUEL_REQUESTS[0];
const cleanVeh = INITIAL_VEHICLES[0];
const cleanDrv = INITIAL_DRIVERS[0];
const cleanAsg = INITIAL_ASSIGNMENTS[0];
const cleanPrj = INITIAL_PROJECTS[0];
const cleanTrips = INITIAL_TRIPS;

const baseTxn: FuelTransaction = {
  ...cleanTxn,
  id: "test-txn-crafted",
  transactionNumber: "TXN-TEST-CRAFTED",
  receiptImageUrl: "https://example.com/receipt.jpg",
};

// 1. FUEL_EXCEEDS_APPROVAL
const r1 = checkFuelExceedsApproval(
  { ...baseTxn, liters: 165 },
  { ...cleanReq, requestedLiters: 150 }
);
assert(r1.triggered && r1.ruleCode === "FUEL_EXCEEDS_APPROVAL", "Rule 1: FUEL_EXCEEDS_APPROVAL triggers on 165L vs 150L approved", r1.description);

// 2. INACTIVE_VEHICLE_FUEL
const r2 = checkInactiveVehicleFuel(baseTxn, { ...cleanVeh, status: "Under Maintenance" });
assert(r2.triggered && r2.ruleCode === "INACTIVE_VEHICLE_FUEL", "Rule 2: INACTIVE_VEHICLE_FUEL triggers on Under Maintenance vehicle", r2.description);

// 3. MISSING_RECEIPT
const r3 = checkMissingReceipt({ ...baseTxn, receiptImageUrl: null });
assert(r3.triggered && r3.ruleCode === "MISSING_RECEIPT", "Rule 3: MISSING_RECEIPT triggers when receiptImageUrl is null", r3.description);

// 4. UNASSIGNED_DRIVER_FUEL
const r4 = checkUnassignedDriverFuel({ ...baseTxn, driverId: "drv-stranger" }, cleanAsg);
assert(r4.triggered && r4.ruleCode === "UNASSIGNED_DRIVER_FUEL", "Rule 4: UNASSIGNED_DRIVER_FUEL triggers when driver does not match assignment", r4.description);

// 5. FUEL_WITHOUT_TRIP
const r5 = checkFuelWithoutTrip(baseTxn, []);
assert(r5.triggered && r5.ruleCode === "FUEL_WITHOUT_TRIP", "Rule 5: FUEL_WITHOUT_TRIP triggers when zero trips in surrounding window", r5.description);

// 6. FUEL_OUTSIDE_PROJECT
const r6 = checkFuelOutsideProject({ ...baseTxn, projectId: "proj-unassigned-099" }, cleanVeh, cleanAsg);
assert(r6.triggered && r6.ruleCode === "FUEL_OUTSIDE_PROJECT", "Rule 6: FUEL_OUTSIDE_PROJECT triggers on mismatched project allocation", r6.description);

// 7. DUPLICATE_RECEIPT
const duplicateOther: FuelTransaction = {
  ...baseTxn,
  id: "other-txn-dup",
  receiptNumber: "OR-MATCH-12345",
  station: "Petron Commonwealth",
};
const r7 = checkDuplicateReceipt(
  { ...baseTxn, receiptNumber: "OR-MATCH-12345", station: "Petron Commonwealth" },
  [duplicateOther, { ...baseTxn, receiptNumber: "OR-MATCH-12345", station: "Petron Commonwealth" }]
);
assert(r7.triggered && r7.ruleCode === "DUPLICATE_RECEIPT", "Rule 7: DUPLICATE_RECEIPT triggers on identical receipt number and station", r7.description);

// 8. ODOMETER_DECREASE
const r8 = checkOdometerDecrease({ ...baseTxn, odometerAtFillKm: 45000 }, { ...cleanVeh, odometerKm: 48000 });
assert(r8.triggered && r8.ruleCode === "ODOMETER_DECREASE", "Rule 8: ODOMETER_DECREASE triggers on 45,000 km vs prior 48,000 km", r8.description);

// 9. ODOMETER_JUMP
const prevForJump: FuelTransaction = {
  ...baseTxn,
  odometerAtFillKm: 48000,
  transactionDate: "2026-03-24T08:00:00Z",
};
const currForJump: FuelTransaction = {
  ...baseTxn,
  odometerAtFillKm: 49500, // 1500 km in 2 hours
  transactionDate: "2026-03-24T10:00:00Z",
};
const r9 = checkOdometerJump(currForJump, prevForJump, cleanVeh);
assert(r9.triggered && r9.ruleCode === "ODOMETER_JUMP", "Rule 9: ODOMETER_JUMP triggers on 1,500 km jump in 2 hours (>110 km/h threshold)", r9.description);

// 10. FUEL_PURCHASES_TOO_CLOSE
const closeTxn1: FuelTransaction = {
  ...baseTxn,
  id: "txn-c1",
  liters: 200,
  transactionDate: "2026-03-24T09:00:00Z",
};
const closeTxn2: FuelTransaction = {
  ...baseTxn,
  id: "txn-c2",
  liters: 180, // 200 + 180 = 380L > 300L tank capacity in 1 hour
  transactionDate: "2026-03-24T10:00:00Z",
};
const r10 = checkFuelPurchasesTooClose(closeTxn2, [closeTxn1, closeTxn2], cleanVeh);
assert(r10.triggered && r10.ruleCode === "FUEL_PURCHASES_TOO_CLOSE", "Rule 10: FUEL_PURCHASES_TOO_CLOSE triggers when 380L > 300L tank within 4h", r10.description);

// 11. OUTSIDE_GEOFENCE_FUEL
const outsideGeofenceTxn: FuelTransaction = {
  ...baseTxn,
  latitude: 13.7565, // Batangas (~100km from QC geofence)
  longitude: 121.0583,
};
const r11 = checkOutsideGeofenceFuel(outsideGeofenceTxn, cleanPrj);
assert(r11.triggered && r11.ruleCode === "OUTSIDE_GEOFENCE_FUEL", "Rule 11: OUTSIDE_GEOFENCE_FUEL triggers on ~100km distance vs 5km geofence", r11.description);

// 12. EXCESSIVE_FUEL_CONSUMPTION
const prevForEco: FuelTransaction = {
  ...baseTxn,
  odometerAtFillKm: 48200,
};
const currBadEco: FuelTransaction = {
  ...baseTxn,
  odometerAtFillKm: 48220, // 20 km for 100 liters = 0.20 km/L (< 0.8 km/L)
  liters: 100,
};
const r12 = checkExcessiveFuelConsumption(currBadEco, prevForEco);
assert(r12.triggered && r12.ruleCode === "EXCESSIVE_FUEL_CONSUMPTION", "Rule 12: EXCESSIVE_FUEL_CONSUMPTION triggers on 0.20 km/L (<0.8 km/L)", r12.description);

// ─── 3. TEST ZERO FALSE POSITIVES ON CLEAN SEED DATA ───────────────────────────
console.log("\n--- PART 3: Clean Seed Data Test (Zero False Positives) ---");

const cleanContext: AnomalyEvaluationContext = {
  transaction: cleanTxn,
  request: cleanReq,
  vehicle: cleanVeh,
  driver: cleanDrv,
  activeAssignment: cleanAsg,
  project: cleanPrj,
  recentTrips: cleanTrips,
  recentTransactionsForVehicle: [cleanTxn],
  allTransactions: [cleanTxn],
  previousTransaction: null,
};

const cleanResults = evaluateFuelTransaction(cleanContext);
assert(cleanResults.length === 0, `Clean seed transaction produced ZERO false positives (got ${cleanResults.length})`);

// ─── 4. TEST MASTER EVALUATOR MULTI-RULE TRIGGER ───────────────────────────────
console.log("\n--- PART 4: Master evaluateFuelTransaction() Multi-Rule Execution ---");

// Multi-anomaly crafted record:
// - Missing receipt
// - Inactive vehicle (Under Maintenance)
// - Exceeds approval
const multiBadContext: AnomalyEvaluationContext = {
  transaction: {
    ...baseTxn,
    liters: 220, // exceeds 150L approval
    receiptImageUrl: null, // missing receipt
  },
  request: cleanReq, // 150L approved
  vehicle: { ...cleanVeh, status: "Under Maintenance" }, // inactive
  driver: cleanDrv,
  activeAssignment: cleanAsg,
  project: cleanPrj,
  recentTrips: cleanTrips,
  recentTransactionsForVehicle: [baseTxn],
  allTransactions: [baseTxn],
};

const multiResults = evaluateFuelTransaction(multiBadContext);
const triggeredCodes = multiResults.map((r) => r.ruleCode);
assert(triggeredCodes.includes("FUEL_EXCEEDS_APPROVAL"), "Master evaluator triggered FUEL_EXCEEDS_APPROVAL");
assert(triggeredCodes.includes("INACTIVE_VEHICLE_FUEL"), "Master evaluator triggered INACTIVE_VEHICLE_FUEL");
assert(triggeredCodes.includes("MISSING_RECEIPT"), "Master evaluator triggered MISSING_RECEIPT");

// ─── 5. VERIFY NON-ACCUSATORY COPY CONSTRAINTS ────────────────────────────────
console.log("\n--- PART 5: Non-Accusatory Language Compliance Check ---");

const allDescriptions = [
  r1.description,
  r2.description,
  r3.description,
  r4.description,
  r5.description,
  r6.description,
  r7.description,
  r8.description,
  r9.description,
  r10.description,
  r11.description,
  r12.description,
  ...multiResults.map((r) => r.description),
];

const BANNED_ACCUSATORY_WORDS = [
  "theft",
  "steal",
  "stolen",
  "thief",
  "fraud",
  "criminal",
  "crime",
  "guilt",
  "guilty",
  "illegal",
  "fake",
  "corrupt",
  "cheat",
];

let foundBannedWords = 0;
for (const desc of allDescriptions) {
  const lower = desc.toLowerCase();
  for (const word of BANNED_ACCUSATORY_WORDS) {
    if (lower.includes(word)) {
      console.error(`  [VIOLATION] Found accusatory word '${word}' in description: "${desc}"`);
      foundBannedWords++;
    }
  }
}

assert(foundBannedWords === 0, `No accusatory terminology detected across all rule output strings`);

console.log("\n==================================================================");
console.log(`SUMMARY: ${testsPassed} passed, ${testsFailed} failed`);
console.log("==================================================================");

if (testsFailed > 0) {
  process.exit(1);
}
