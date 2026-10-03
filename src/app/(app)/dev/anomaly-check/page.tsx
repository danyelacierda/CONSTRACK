import React from "react";
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
  type AnomalyEvaluationContext,
} from "@/services/anomaly-engine";
import { ANOMALY_RULE_CODES } from "@/types/enums";
import {
  INITIAL_VEHICLES,
  INITIAL_PROJECTS,
  INITIAL_DRIVERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TRIPS,
  INITIAL_FUEL_REQUESTS,
  INITIAL_FUEL_TRANSACTIONS,
} from "@/repositories/mock-data";
import type { FuelTransaction, FuelRequest, Vehicle } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AnomalyCheckPage() {
  // ─── 1. Clean Seed Data Evaluation (Expected: ZERO False Positives on clean tx-001) ───
  const cleanTxn = INITIAL_FUEL_TRANSACTIONS[0]; // ftx-001 is clean 150L matching freq-001
  const cleanRequest = INITIAL_FUEL_REQUESTS[0]; // freq-001
  const cleanVehicle = INITIAL_VEHICLES[0]; // veh-001
  const cleanDriver = INITIAL_DRIVERS[0]; // drv-001
  const cleanAssignment = INITIAL_ASSIGNMENTS[0]; // asg-001
  const cleanProject = INITIAL_PROJECTS[0]; // proj-001
  const cleanTrips = INITIAL_TRIPS;

  const cleanContext: AnomalyEvaluationContext = {
    transaction: cleanTxn,
    request: cleanRequest,
    vehicle: cleanVehicle,
    driver: cleanDriver,
    activeAssignment: cleanAssignment,
    project: cleanProject,
    recentTrips: cleanTrips,
    recentTransactionsForVehicle: [cleanTxn],
    allTransactions: [cleanTxn],
    previousTransaction: null,
  };

  const cleanEvaluationResults = evaluateFuelTransaction(cleanContext);

  // ─── 2. Crafted Bad Records to Test Every Individual Rule ────────────────────
  const baseTxn: FuelTransaction = {
    ...cleanTxn,
    id: "test-txn",
    transactionNumber: "TXN-TEST-001",
    receiptImageUrl: "https://example.com/receipt.jpg",
  };

  const ruleTests: Array<{
    ruleCode: (typeof ANOMALY_RULE_CODES)[number];
    ruleName: string;
    fired: boolean;
    resultDescription: string;
    severity: string;
  }> = [];

  // Test 1: FUEL_EXCEEDS_APPROVAL
  const badReq: FuelRequest = { ...cleanRequest, requestedLiters: 100 };
  const r1 = checkFuelExceedsApproval({ ...baseTxn, liters: 150 }, badReq);
  ruleTests.push({
    ruleCode: "FUEL_EXCEEDS_APPROVAL",
    ruleName: "checkFuelExceedsApproval",
    fired: r1.triggered,
    resultDescription: r1.description,
    severity: r1.severity,
  });

  // Test 2: INACTIVE_VEHICLE_FUEL
  const maintVehicle: Vehicle = { ...cleanVehicle, status: "Under Maintenance" };
  const r2 = checkInactiveVehicleFuel(baseTxn, maintVehicle);
  ruleTests.push({
    ruleCode: "INACTIVE_VEHICLE_FUEL",
    ruleName: "checkInactiveVehicleFuel",
    fired: r2.triggered,
    resultDescription: r2.description,
    severity: r2.severity,
  });

  // Test 3: MISSING_RECEIPT
  const r3 = checkMissingReceipt({ ...baseTxn, receiptImageUrl: null });
  ruleTests.push({
    ruleCode: "MISSING_RECEIPT",
    ruleName: "checkMissingReceipt",
    fired: r3.triggered,
    resultDescription: r3.description,
    severity: r3.severity,
  });

  // Test 4: UNASSIGNED_DRIVER_FUEL
  const r4 = checkUnassignedDriverFuel({ ...baseTxn, driverId: "drv-999" }, cleanAssignment);
  ruleTests.push({
    ruleCode: "UNASSIGNED_DRIVER_FUEL",
    ruleName: "checkUnassignedDriverFuel",
    fired: r4.triggered,
    resultDescription: r4.description,
    severity: r4.severity,
  });

  // Test 5: FUEL_WITHOUT_TRIP
  const r5 = checkFuelWithoutTrip(baseTxn, []);
  ruleTests.push({
    ruleCode: "FUEL_WITHOUT_TRIP",
    ruleName: "checkFuelWithoutTrip",
    fired: r5.triggered,
    resultDescription: r5.description,
    severity: r5.severity,
  });

  // Test 6: FUEL_OUTSIDE_PROJECT
  const r6 = checkFuelOutsideProject({ ...baseTxn, projectId: "proj-different" }, cleanVehicle, cleanAssignment);
  ruleTests.push({
    ruleCode: "FUEL_OUTSIDE_PROJECT",
    ruleName: "checkFuelOutsideProject",
    fired: r6.triggered,
    resultDescription: r6.description,
    severity: r6.severity,
  });

  // Test 7: DUPLICATE_RECEIPT
  const duplicateCandidate: FuelTransaction = {
    ...baseTxn,
    id: "txn-dup-other",
    receiptNumber: "OR-DUPLICATE-99",
  };
  const r7 = checkDuplicateReceipt(
    { ...baseTxn, receiptNumber: "OR-DUPLICATE-99" },
    [duplicateCandidate, { ...baseTxn, receiptNumber: "OR-DUPLICATE-99" }]
  );
  ruleTests.push({
    ruleCode: "DUPLICATE_RECEIPT",
    ruleName: "checkDuplicateReceipt",
    fired: r7.triggered,
    resultDescription: r7.description,
    severity: r7.severity,
  });

  // Test 8: ODOMETER_DECREASE
  const r8 = checkOdometerDecrease({ ...baseTxn, odometerAtFillKm: 40000 }, { ...cleanVehicle, odometerKm: 48000 });
  ruleTests.push({
    ruleCode: "ODOMETER_DECREASE",
    ruleName: "checkOdometerDecrease",
    fired: r8.triggered,
    resultDescription: r8.description,
    severity: r8.severity,
  });

  // Test 9: ODOMETER_JUMP
  const prevTxnForJump: FuelTransaction = {
    ...baseTxn,
    odometerAtFillKm: 48000,
    transactionDate: "2026-03-24T08:00:00Z",
  };
  const currentTxnJump: FuelTransaction = {
    ...baseTxn,
    odometerAtFillKm: 49500, // 1500 km in 2 hours = 750 km/h
    transactionDate: "2026-03-24T10:00:00Z",
  };
  const r9 = checkOdometerJump(currentTxnJump, prevTxnForJump, cleanVehicle);
  ruleTests.push({
    ruleCode: "ODOMETER_JUMP",
    ruleName: "checkOdometerJump",
    fired: r9.triggered,
    resultDescription: r9.description,
    severity: r9.severity,
  });

  // Test 10: FUEL_PURCHASES_TOO_CLOSE
  const prevCloseTxn: FuelTransaction = {
    ...baseTxn,
    id: "txn-close-1",
    liters: 200,
    transactionDate: "2026-03-24T10:00:00Z",
  };
  const currentCloseTxn: FuelTransaction = {
    ...baseTxn,
    id: "txn-close-2",
    liters: 180, // 200L + 180L = 380L > 300L tank capacity within 1 hr
    transactionDate: "2026-03-24T11:00:00Z",
  };
  const r10 = checkFuelPurchasesTooClose(currentCloseTxn, [prevCloseTxn, currentCloseTxn], cleanVehicle);
  ruleTests.push({
    ruleCode: "FUEL_PURCHASES_TOO_CLOSE",
    ruleName: "checkFuelPurchasesTooClose",
    fired: r10.triggered,
    resultDescription: r10.description,
    severity: r10.severity,
  });

  // Test 11: OUTSIDE_GEOFENCE_FUEL
  // Project is QC (14.6507, 121.0494, radius 5km). Point is in Batangas (~100km away)
  const outsideTxn: FuelTransaction = {
    ...baseTxn,
    latitude: 13.7565,
    longitude: 121.0583,
  };
  const r11 = checkOutsideGeofenceFuel(outsideTxn, cleanProject);
  ruleTests.push({
    ruleCode: "OUTSIDE_GEOFENCE_FUEL",
    ruleName: "checkOutsideGeofenceFuel",
    fired: r11.triggered,
    resultDescription: r11.description,
    severity: r11.severity,
  });

  // Test 12: EXCESSIVE_FUEL_CONSUMPTION
  const prevTxnForEco: FuelTransaction = {
    ...baseTxn,
    odometerAtFillKm: 48200,
  };
  const currTxnBadEco: FuelTransaction = {
    ...baseTxn,
    odometerAtFillKm: 48230, // only 30 km traveled for 150 liters = 0.20 km/L (< 0.8 km/L)
    liters: 150,
  };
  const r12 = checkExcessiveFuelConsumption(currTxnBadEco, prevTxnForEco);
  ruleTests.push({
    ruleCode: "EXCESSIVE_FUEL_CONSUMPTION",
    ruleName: "checkExcessiveFuelConsumption",
    fired: r12.triggered,
    resultDescription: r12.description,
    severity: r12.severity,
  });

  const allFired = ruleTests.every((t) => t.fired);
  const zeroCleanFalsePositives = cleanEvaluationResults.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
          ANOMALY ENGINE VERIFICATION SUITE
        </h1>
        <p className="text-sm text-muted-foreground">
          Automated proof that all 12 anomaly rules trigger on crafted bad records and zero false-positive on clean data.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={allFired ? "border-emerald-500/40 bg-emerald-950/10" : "border-destructive"}>
          <CardContent className="pt-6 flex items-center gap-4">
            {allFired ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive shrink-0" />
            )}
            <div>
              <div className="font-bold text-base text-foreground font-mono">
                {allFired ? "ALL 12 RULES TRIGGERED ON BAD RECORDS" : "RULE TRIGGER TEST FAILED"}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ruleTests.filter((t) => t.fired).length} / {ruleTests.length} rules verified with individual edge-case scenarios
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={zeroCleanFalsePositives ? "border-emerald-500/40 bg-emerald-950/10" : "border-destructive"}>
          <CardContent className="pt-6 flex items-center gap-4">
            {zeroCleanFalsePositives ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive shrink-0" />
            )}
            <div>
              <div className="font-bold text-base text-foreground font-mono">
                {zeroCleanFalsePositives ? "ZERO FALSE POSITIVES ON CLEAN SEED DATA" : "CLEAN DATA TRIGGERED ANOMALIES"}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Clean transaction TXN-2026-0120 produced {cleanEvaluationResults.length} anomaly flags
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rule by Rule Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">12-RULE TEST MATRIX RESULTS</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {ruleTests.map((t, idx) => (
              <div key={t.ruleCode} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      Rule {idx + 1}: {t.ruleCode}
                    </span>
                    <Badge variant={t.fired ? "good" : "destructive"}>
                      {t.fired ? "PASSED (Triggered)" : "FAILED (Did not trigger)"}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Severity: {t.severity}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-mono bg-muted/30 p-2 rounded border border-border mt-1">
                    {t.resultDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
