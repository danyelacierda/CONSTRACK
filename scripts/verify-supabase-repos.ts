import {
  projectRepository,
  vehicleRepository,
  equipmentRepository,
  driverRepository,
  assignmentRepository,
  tripRepository,
  fuelRequestRepository,
  fuelTransactionRepository,
  maintenanceRepository,
  anomalyRepository,
  auditLogRepository
} from "../src/repositories";

async function main() {
  console.log("=== Testing 11 Supabase Repositories via Composition Root ===");

  const projects = await projectRepository.getAll();
  console.log(`✓ Projects: ${projects.length} records`);
  for (const p of projects) {
    console.log(`   - ${p.code}: ${p.name} (Budget: ₱${p.budgetPhp.toLocaleString()})`);
  }

  const vehicles = await vehicleRepository.getAll();
  console.log(`✓ Vehicles: ${vehicles.length} records`);
  for (const v of vehicles) {
    console.log(`   - ${v.plateNumber}: ${v.name} (${v.status}, Fuel: ${v.currentFuelLiters}L/${v.tankCapacityLiters}L)`);
  }

  const equipment = await equipmentRepository.getAll();
  console.log(`✓ Equipment: ${equipment.length} records`);
  for (const e of equipment) {
    console.log(`   - ${e.assetCode}: ${e.name} (${e.type})`);
  }

  const drivers = await driverRepository.getAll();
  console.log(`✓ Drivers: ${drivers.length} records`);
  for (const d of drivers) {
    console.log(`   - ${d.employeeId}: ${d.fullName} (License: ${d.licenseNumber})`);
  }

  const assignments = await assignmentRepository.getAll();
  console.log(`✓ Assignments: ${assignments.length} records`);

  const trips = await tripRepository.getAll();
  console.log(`✓ Trips: ${trips.length} records`);

  const fuelRequests = await fuelRequestRepository.getAll();
  console.log(`✓ Fuel Requests: ${fuelRequests.length} records`);

  const fuelTransactions = await fuelTransactionRepository.getAll();
  console.log(`✓ Fuel Transactions: ${fuelTransactions.length} records`);

  const maintenance = await maintenanceRepository.getAll();
  console.log(`✓ Maintenance Tickets: ${maintenance.length} records`);

  const anomalies = await anomalyRepository.getAll();
  console.log(`✓ Anomalies: ${anomalies.length} records`);

  const auditLogs = await auditLogRepository.getAll();
  console.log(`✓ Audit Logs: ${auditLogs.length} records`);

  console.log("\n🎉 ALL 11 REPOSITORIES ARE FULLY FUNCTIONAL AND CONNECTED TO SUPABASE!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
