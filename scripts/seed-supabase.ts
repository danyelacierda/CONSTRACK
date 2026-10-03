import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_PROJECTS,
  INITIAL_VEHICLES,
  INITIAL_EQUIPMENT,
  INITIAL_DRIVERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TRIPS,
  INITIAL_FUEL_REQUESTS,
  INITIAL_FUEL_TRANSACTIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_ANOMALIES,
  INITIAL_AUDIT_LOGS,
} from "../src/repositories/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  console.log("=========================================");
  console.log("CONSTRACK — Seeding Supabase Database");
  console.log("URL:", supabaseUrl);
  console.log("=========================================");

  // 1. Projects
  console.log("\n1. Seeding Projects...");
  const projectRows = INITIAL_PROJECTS.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    description: p.description,
    location: p.location,
    status: p.status,
    start_date: p.startDate,
    end_date: p.endDate,
    budget_php: p.budgetPhp,
    spent_php: p.spentPhp,
    client_name: p.clientName,
    project_manager_id: p.projectManagerId,
    geofence_latitude: p.geofence?.latitude ?? null,
    geofence_longitude: p.geofence?.longitude ?? null,
    geofence_radius_km: p.geofence?.radiusKm ?? null,
    is_archived: p.isArchived,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));
  const { error: pErr } = await supabase.from("projects").upsert(projectRows);
  if (pErr) throw new Error(`Projects seed error: ${pErr.message}`);
  console.log(`✓ Seeded ${projectRows.length} projects`);

  // 2. Vehicles
  console.log("\n2. Seeding Vehicles...");
  const vehicleRows = INITIAL_VEHICLES.map((v) => ({
    id: v.id,
    plate_number: v.plateNumber,
    name: v.name,
    type: v.type,
    status: v.status,
    fuel_type: v.fuelType,
    tank_capacity_liters: v.tankCapacityLiters,
    current_fuel_liters: v.currentFuelLiters,
    odometer_km: v.odometerKm,
    engine_hours: v.engineHours,
    make: v.make,
    model: v.model,
    year: v.year,
    current_project_id: v.currentProjectId,
    current_driver_id: v.currentDriverId,
    photo_url: v.photoUrl,
    is_archived: v.isArchived,
    created_at: v.createdAt,
    updated_at: v.updatedAt,
  }));
  const { error: vErr } = await supabase.from("vehicles").upsert(vehicleRows);
  if (vErr) throw new Error(`Vehicles seed error: ${vErr.message}`);
  console.log(`✓ Seeded ${vehicleRows.length} vehicles`);

  // 3. Equipment
  console.log("\n3. Seeding Equipment...");
  const equipRows = INITIAL_EQUIPMENT.map((e) => ({
    id: e.id,
    asset_code: e.assetCode,
    name: e.name,
    type: e.type,
    status: e.status,
    fuel_type: e.fuelType,
    tank_capacity_liters: e.tankCapacityLiters,
    current_fuel_liters: e.currentFuelLiters,
    engine_hours: e.engineHours,
    make: e.make,
    model: e.model,
    year: e.year,
    current_project_id: e.currentProjectId,
    photo_url: e.photoUrl,
    is_archived: e.isArchived,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  }));
  const { error: eqErr } = await supabase.from("equipment").upsert(equipRows);
  if (eqErr) throw new Error(`Equipment seed error: ${eqErr.message}`);
  console.log(`✓ Seeded ${equipRows.length} equipment`);

  // 4. Drivers
  console.log("\n4. Seeding Drivers...");
  const driverRows = INITIAL_DRIVERS.map((d) => ({
    id: d.id,
    employee_id: d.employeeId,
    first_name: d.firstName,
    last_name: d.lastName,
    full_name: d.fullName,
    license_number: d.licenseNumber,
    license_expiry: d.licenseExpiry,
    contact_number: d.contactNumber,
    email: d.email,
    status: d.status,
    current_vehicle_id: d.currentVehicleId,
    photo_url: d.photoUrl,
    is_archived: d.isArchived,
    created_at: d.createdAt,
    updated_at: d.updatedAt,
  }));
  const { error: dErr } = await supabase.from("drivers").upsert(driverRows);
  if (dErr) throw new Error(`Drivers seed error: ${dErr.message}`);
  console.log(`✓ Seeded ${driverRows.length} drivers`);

  // 5. Vehicle Assignments
  console.log("\n5. Seeding Vehicle Assignments...");
  const asgnRows = INITIAL_ASSIGNMENTS.map((a) => ({
    id: a.id,
    vehicle_id: a.vehicleId,
    driver_id: a.driverId,
    project_id: a.projectId,
    status: a.status,
    start_date: a.startDate,
    end_date: a.endDate,
    notes: a.notes,
    created_by: a.createdBy,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  }));
  const { error: aErr } = await supabase.from("vehicle_assignments").upsert(asgnRows);
  if (aErr) throw new Error(`Assignments seed error: ${aErr.message}`);
  console.log(`✓ Seeded ${asgnRows.length} assignments`);

  // 6. Trips
  console.log("\n6. Seeding Trips...");
  const tripRows = INITIAL_TRIPS.map((t) => ({
    id: t.id,
    vehicle_id: t.vehicleId,
    driver_id: t.driverId,
    project_id: t.projectId,
    status: t.status,
    origin: t.origin,
    destination: t.destination,
    purpose: t.purpose,
    scheduled_start: t.scheduledStart,
    scheduled_end: t.scheduledEnd,
    actual_start: t.actualStart,
    actual_end: t.actualEnd,
    odometer_start_km: t.odometerStartKm,
    odometer_end_km: t.odometerEndKm,
    distance_km: t.distanceKm,
    fuel_used_liters: t.fuelUsedLiters,
    notes: t.notes,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }));
  const { error: tErr } = await supabase.from("trips").upsert(tripRows);
  if (tErr) throw new Error(`Trips seed error: ${tErr.message}`);
  console.log(`✓ Seeded ${tripRows.length} trips`);

  // 7. Fuel Requests
  console.log("\n7. Seeding Fuel Requests...");
  const freqRows = INITIAL_FUEL_REQUESTS.map((fr) => ({
    id: fr.id,
    request_number: fr.requestNumber,
    vehicle_id: fr.vehicleId,
    driver_id: fr.driverId,
    project_id: fr.projectId,
    status: fr.status,
    fuel_type: fr.fuelType,
    requested_liters: fr.requestedLiters,
    estimated_cost_php: fr.estimatedCostPhp,
    purpose: fr.purpose,
    requested_by: fr.requestedBy,
    approved_by: fr.approvedBy,
    approved_at: fr.approvedAt,
    rejection_reason: fr.rejectionReason,
    created_at: fr.createdAt,
    updated_at: fr.updatedAt,
  }));
  const { error: frErr } = await supabase.from("fuel_requests").upsert(freqRows);
  if (frErr) throw new Error(`Fuel requests seed error: ${frErr.message}`);
  console.log(`✓ Seeded ${freqRows.length} fuel requests`);

  // 8. Fuel Transactions
  console.log("\n8. Seeding Fuel Transactions...");
  const ftrxRows = INITIAL_FUEL_TRANSACTIONS.map((ft) => ({
    id: ft.id,
    transaction_number: ft.transactionNumber,
    fuel_request_id: ft.fuelRequestId,
    vehicle_id: ft.vehicleId,
    driver_id: ft.driverId,
    project_id: ft.projectId,
    status: ft.status,
    fuel_type: ft.fuelType,
    liters: ft.liters,
    price_per_liter_php: ft.pricePerLiterPhp,
    total_cost_php: ft.totalCostPhp,
    station: ft.station,
    receipt_number: ft.receiptNumber,
    receipt_image_url: ft.receiptImageUrl,
    odometer_at_fill_km: ft.odometerAtFillKm,
    transaction_date: ft.transactionDate,
    verified_by: ft.verifiedBy,
    verified_at: ft.verifiedAt,
    latitude: ft.latitude,
    longitude: ft.longitude,
    notes: ft.notes,
    created_at: ft.createdAt,
    updated_at: ft.updatedAt,
  }));
  const { error: ftErr } = await supabase.from("fuel_transactions").upsert(ftrxRows);
  if (ftErr) throw new Error(`Fuel transactions seed error: ${ftErr.message}`);
  console.log(`✓ Seeded ${ftrxRows.length} fuel transactions`);

  // 9. Maintenance Tickets
  console.log("\n9. Seeding Maintenance Tickets...");
  const maintRows = INITIAL_MAINTENANCE_TICKETS.map((m) => ({
    id: m.id,
    ticket_number: m.ticketNumber,
    vehicle_id: m.vehicleId,
    equipment_id: m.equipmentId,
    project_id: m.projectId,
    status: m.status,
    priority: m.priority,
    type: m.type,
    description: m.description,
    scheduled_date: m.scheduledDate,
    completed_date: m.completedDate,
    cost_php: m.costPhp,
    vendor: m.vendor,
    odometer_at_service_km: m.odometerAtServiceKm,
    engine_hours_at_service: m.engineHoursAtService,
    next_service_due_km: m.nextServiceDueKm,
    next_service_due_date: m.nextServiceDueDate,
    next_service_due_hours: m.nextServiceDueHours,
    assigned_to: m.assignedTo,
    notes: m.notes,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  }));
  const { error: mErr } = await supabase.from("maintenance_tickets").upsert(maintRows);
  if (mErr) throw new Error(`Maintenance tickets seed error: ${mErr.message}`);
  console.log(`✓ Seeded ${maintRows.length} maintenance tickets`);

  // 10. Anomalies
  console.log("\n10. Seeding Anomalies...");
  const anomRows = INITIAL_ANOMALIES.map((a) => ({
    id: a.id,
    rule_code: a.ruleCode,
    severity: a.severity,
    status: a.status,
    description: a.description,
    fuel_transaction_id: a.fuelTransactionId,
    vehicle_id: a.vehicleId,
    driver_id: a.driverId,
    project_id: a.projectId,
    detected_at: a.detectedAt,
    reviewed_by: a.reviewedBy,
    reviewed_at: a.reviewedAt,
    resolution_notes: a.resolutionNotes,
    metadata: a.metadata,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  }));
  const { error: anomErr } = await supabase.from("anomalies").upsert(anomRows);
  if (anomErr) throw new Error(`Anomalies seed error: ${anomErr.message}`);
  console.log(`✓ Seeded ${anomRows.length} anomalies`);

  // 11. Audit Logs
  console.log("\n11. Seeding Audit Logs...");
  const auditRows = INITIAL_AUDIT_LOGS.map((al) => ({
    id: al.id,
    action: al.action,
    entity_type: al.entityType,
    entity_id: al.entityId,
    user_id: al.userId,
    user_name: al.userName,
    changes: al.changes,
    ip_address: al.ipAddress,
    timestamp: al.timestamp,
  }));
  const { error: alErr } = await supabase.from("audit_logs").upsert(auditRows);
  if (alErr) throw new Error(`Audit logs seed error: ${alErr.message}`);
  console.log(`✓ Seeded ${auditRows.length} audit logs`);

  console.log("\n🎉 ALL SEED DATA SUCCESSFULLY INSERTED INTO SUPABASE!");
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
