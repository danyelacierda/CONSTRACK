import { projectRepository, fuelTransactionRepository, maintenanceRepository } from "@/repositories";
import type { ProjectCostSummary } from "@/types/domain";

/**
 * Computes live project cost allocation from verified fuel transactions and maintenance costs.
 * Architecture Doc Rule: Never rely on stored/denormalized project cost totals; calculate dynamically.
 *
 * @param projectId - Unique ID of the project
 * @returns ProjectCostSummary with calculated spending, remaining budget, and utilization percentage
 */
export async function getProjectCostSummary(projectId: string): Promise<ProjectCostSummary | null> {
  const project = await projectRepository.getById(projectId);
  if (!project) return null;

  // 1. Fetch all fuel transactions assigned to this project
  const transactions = await fuelTransactionRepository.getByProjectId(projectId);
  const fuelCostPhp = transactions.reduce((sum, txn) => sum + txn.totalCostPhp, 0);

  // 2. Fetch all maintenance tickets for this project
  const maintenanceTickets = await maintenanceRepository.getByProjectId(projectId);
  const maintenanceCostPhp = maintenanceTickets.reduce((sum, ticket) => sum + ticket.costPhp, 0);

  // 3. Compute live totals
  const totalSpentPhp = fuelCostPhp + maintenanceCostPhp;
  const remainingPhp = project.budgetPhp - totalSpentPhp;
  const utilizationPercent = project.budgetPhp > 0 ? (totalSpentPhp / project.budgetPhp) * 100 : 0;

  return {
    projectId: project.id,
    projectName: project.name,
    budgetPhp: project.budgetPhp,
    fuelCostPhp,
    maintenanceCostPhp,
    totalSpentPhp,
    remainingPhp,
    utilizationPercent,
  };
}
