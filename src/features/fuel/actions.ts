"use server";

import { fuelRequestRepository, fuelTransactionRepository, auditLogRepository, anomalyRepository } from "@/repositories";
import type { FuelRequest, FuelTransaction } from "@/types/domain";
import { evaluateFuelTransaction } from "@/services/anomaly-engine";
import { checkServerPermission } from "@/features/auth/server";

export async function getFuelRequestById(id: string) {
  return fuelRequestRepository.getById(id);
}

export async function createFuelRequest(data: Omit<FuelRequest, "id" | "createdAt" | "updatedAt">, userId: string, userName: string) {
  const req = await fuelRequestRepository.create({ ...data, status: "Pending Approval" });
  await auditLogRepository.create({
    action: "CREATE" as any,
    entityType: "FuelRequest",
    entityId: req.id,
    userId,
    userName,
    changes: { status: "Pending Approval" },
    ipAddress: null,
  });
  return req;
}

export async function approveFuelRequest(id: string, userId: string, userName: string) {
  const isAuthorized = await checkServerPermission("fuel:approve");
  if (!isAuthorized) {
    throw new Error("Unauthorized: You do not have permission to approve fuel requests.");
  }

  const req = await fuelRequestRepository.getById(id);
  if (!req) throw new Error("Not found");
  if (req.requestedBy === userName) throw new Error("Approver cannot be the same as requester");

  const updated = await fuelRequestRepository.update(id, {
    status: "Approved",
    approvedBy: userName,
    approvedAt: new Date().toISOString(),
  });

  await auditLogRepository.create({
    action: "UPDATE" as any,
    entityType: "FuelRequest",
    entityId: id,
    userId,
    userName,
    changes: { status: "Approved" },
    ipAddress: null,
  });
  return updated;
}

export async function rejectFuelRequest(id: string, reason: string, userId: string, userName: string) {
  const isAuthorized = await checkServerPermission("fuel:approve");
  if (!isAuthorized) {
    throw new Error("Unauthorized: You do not have permission to reject fuel requests.");
  }

  const updated = await fuelRequestRepository.update(id, {
    status: "Rejected",
    rejectionReason: reason,
  });

  await auditLogRepository.create({
    action: "UPDATE" as any,
    entityType: "FuelRequest",
    entityId: id,
    userId,
    userName,
    changes: { status: "Rejected", reason },
    ipAddress: null,
  });
  return updated;
}

export async function recordFuelTransaction(data: Omit<FuelTransaction, "id" | "createdAt" | "updatedAt">, userId: string, userName: string) {
  const isAuthorized = await checkServerPermission("fuel:purchase");
  if (!isAuthorized) {
    throw new Error("Unauthorized: You do not have permission to record fuel purchases.");
  }

  const tx = await fuelTransactionRepository.create(data);
  await fuelRequestRepository.update(data.fuelRequestId, { status: "Purchased" });

  await auditLogRepository.create({
    action: "CREATE" as any,
    entityType: "FuelTransaction",
    entityId: tx.id,
    userId,
    userName,
    changes: { status: "Purchased" },
    ipAddress: null,
  });
  return tx;
}

export async function verifyFuelTransaction(transactionId: string, userId: string, userName: string) {
  const isAuthorized = await checkServerPermission("fuel:verify");
  if (!isAuthorized) {
    throw new Error("Unauthorized: You do not have permission to verify fuel transactions.");
  }

  const tx = await fuelTransactionRepository.getById(transactionId);
  if (!tx) throw new Error("Transaction not found");

  const anomalies = await evaluateFuelTransaction({ transaction: tx });
  
  if (anomalies.length > 0) {
    for (const an of anomalies) {
      await anomalyRepository.create({
        ruleCode: an.ruleCode,
        severity: an.severity,
        status: "Open",
        description: an.description,
        fuelTransactionId: tx.id,
        vehicleId: tx.vehicleId,
        driverId: tx.driverId,
        projectId: tx.projectId,
        detectedAt: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null,
        resolutionNotes: null,
        metadata: an.metadata || {},
      });
    }
    await fuelTransactionRepository.update(tx.id, { status: "Under Review" });
    await fuelRequestRepository.update(tx.fuelRequestId, { status: "Flagged" });
  } else {
    await fuelTransactionRepository.update(tx.id, {
      status: "Completed",
      verifiedBy: userName,
      verifiedAt: new Date().toISOString(),
    });
    await fuelRequestRepository.update(tx.fuelRequestId, { status: "Verified" });
  }

  await auditLogRepository.create({
    action: "UPDATE" as any,
    entityType: "FuelTransaction",
    entityId: tx.id,
    userId,
    userName,
    changes: { status: anomalies.length > 0 ? "Flagged" : "Verified", anomaliesCount: anomalies.length },
    ipAddress: null,
  });
}
