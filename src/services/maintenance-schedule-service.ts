import type { MaintenanceTicket, Vehicle, MaintenanceUrgency } from "@/types/domain";

/**
 * Evaluates the urgency of a scheduled preventive maintenance ticket against current vehicle state.
 * Evaluates three primary threshold metrics:
 * 1. Calendar Date (days remaining)
 * 2. Odometer Reading (km remaining until service interval)
 * 3. Engine Hours (hours remaining)
 *
 * @param ticket - The maintenance ticket to evaluate
 * @param vehicle - The target vehicle with current metrics
 * @returns MaintenanceUrgency object with level: 'overdue' | 'due-now' | 'due-soon' | 'upcoming'
 */
export function evaluateScheduleUrgency(
  ticket: MaintenanceTicket,
  vehicle: Vehicle
): MaintenanceUrgency {
  const now = new Date();
  let daysUntilDue: number | null = null;
  let kmUntilDue: number | null = null;
  let hoursUntilDue: number | null = null;

  // 1. Date threshold
  if (ticket.nextServiceDueDate || ticket.scheduledDate) {
    const targetDateStr = ticket.nextServiceDueDate || ticket.scheduledDate;
    const targetDate = new Date(targetDateStr);
    const diffTime = targetDate.getTime() - now.getTime();
    daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 2. Odometer threshold
  if (ticket.nextServiceDueKm) {
    kmUntilDue = ticket.nextServiceDueKm - vehicle.odometerKm;
  }

  // 3. Engine hours threshold
  if (ticket.nextServiceDueHours) {
    hoursUntilDue = ticket.nextServiceDueHours - vehicle.engineHours;
  }

  // Evaluate urgency level
  let urgencyLevel: MaintenanceUrgency["urgencyLevel"] = "upcoming";
  let reason = "Scheduled preventive maintenance is upcoming.";

  const isOverdue =
    (daysUntilDue !== null && daysUntilDue < 0) ||
    (kmUntilDue !== null && kmUntilDue < 0) ||
    (hoursUntilDue !== null && hoursUntilDue < 0);

  const isDueNow =
    (daysUntilDue !== null && daysUntilDue <= 3) ||
    (kmUntilDue !== null && kmUntilDue <= 500) ||
    (hoursUntilDue !== null && hoursUntilDue <= 25);

  const isDueSoon =
    (daysUntilDue !== null && daysUntilDue <= 14) ||
    (kmUntilDue !== null && kmUntilDue <= 1500) ||
    (hoursUntilDue !== null && hoursUntilDue <= 75);

  if (isOverdue) {
    urgencyLevel = "overdue";
    reason = "Maintenance threshold has been exceeded. Immediate inspection required.";
  } else if (isDueNow) {
    urgencyLevel = "due-now";
    reason = "Service interval reached or due within 3 days / 500 km. Schedule servicing.";
  } else if (isDueSoon) {
    urgencyLevel = "due-soon";
    reason = "Service interval approaching within 2 weeks / 1,500 km.";
  }

  return {
    ticketId: ticket.id,
    vehicleId: vehicle.id,
    type: ticket.type,
    urgencyLevel,
    reason,
    daysUntilDue,
    kmUntilDue,
    hoursUntilDue,
  };
}
