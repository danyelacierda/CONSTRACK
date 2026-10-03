import { assignmentRepository, projectRepository, vehicleRepository } from "@/repositories";
import type { VehicleAssignment } from "@/types/domain";

export interface CreateAssignmentParams {
  vehicleId: string;
  driverId: string;
  projectId: string;
  startDate: string;
  notes?: string;
  createdBy: string;
}

export interface AssignmentResult {
  success: boolean;
  assignment?: VehicleAssignment;
  error?: string;
}

/**
 * Enforces assignment business rules from Architecture Doc:
 * 1. Project must be in 'Active' status (cannot assign to 'Planning', 'Completed', or 'Cancelled' project).
 * 2. Overlap rule: Neither the vehicle nor the driver can have an existing concurrent 'Active' assignment.
 */
export async function createAssignment(params: CreateAssignmentParams): Promise<AssignmentResult> {
  // 1. Check Project Status Rule
  const project = await projectRepository.getById(params.projectId);
  if (!project) {
    return { success: false, error: "Project not found." };
  }
  if (project.status !== "Active") {
    return {
      success: false,
      error: `Cannot assign assets to project '${project.name}' because its status is '${project.status}'. Only 'Active' projects can receive assignments.`,
    };
  }

  // 2. Overlap Rule - Vehicle
  const existingVehicleAssignment = await assignmentRepository.getActiveByVehicleId(params.vehicleId);
  if (existingVehicleAssignment) {
    return {
      success: false,
      error: `Vehicle is already actively assigned under assignment ${existingVehicleAssignment.id}. Complete or release the active assignment first.`,
    };
  }

  // 3. Overlap Rule - Driver
  const existingDriverAssignment = await assignmentRepository.getActiveByDriverId(params.driverId);
  if (existingDriverAssignment) {
    return {
      success: false,
      error: `Driver is already actively assigned under assignment ${existingDriverAssignment.id}. Complete or release the active assignment first.`,
    };
  }

  // 4. Create new assignment
  const newAssignment = await assignmentRepository.create({
    vehicleId: params.vehicleId,
    driverId: params.driverId,
    projectId: params.projectId,
    status: "Active",
    startDate: params.startDate,
    endDate: null,
    notes: params.notes || "",
    createdBy: params.createdBy,
  });

  // Update vehicle current state
  await vehicleRepository.update(params.vehicleId, {
    currentProjectId: params.projectId,
    currentDriverId: params.driverId,
    status: "Active",
  });

  return {
    success: true,
    assignment: newAssignment,
  };
}
