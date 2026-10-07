"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveFuelRequest, rejectFuelRequest, recordFuelTransaction } from "../actions";
import { useCurrentUser } from "@/features/auth/role-context";
import type { FuelRequest } from "@/types/domain";

export function FuelWorkflowActions({ request }: { request: FuelRequest }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, hasPermission } = useCurrentUser();

  async function handleApprove() {
    if (!confirm("Approve this fuel request?")) return;
    setLoading(true);
    try {
      await approveFuelRequest(request.id, user?.id || "anon", user?.fullName || "Anon");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving request");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setLoading(true);
    try {
      await rejectFuelRequest(request.id, reason, user?.id || "anon", user?.fullName || "Anon");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error rejecting request");
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase() {
    setLoading(true);
    try {
      await recordFuelTransaction({
        transactionNumber: `TXN-${Date.now()}`,
        fuelRequestId: request.id,
        vehicleId: request.vehicleId,
        driverId: request.driverId,
        projectId: request.projectId,
        fuelType: request.fuelType,
        liters: request.requestedLiters,
        pricePerLiterPhp: 65, // mock price
        totalCostPhp: request.requestedLiters * 65,
        station: "Mock Station",
        receiptNumber: null,
        receiptImageUrl: null,
        odometerAtFillKm: 1000,
        transactionDate: new Date().toISOString(),
        verifiedBy: null,
        verifiedAt: null,
        latitude: null,
        longitude: null,
        notes: "",
        status: "Pending"
      }, user?.id || "anon", user?.fullName || "Anon");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error recording purchase");
    } finally {
      setLoading(false);
    }
  }

  if (request.status === "Pending Approval" || request.status === "Draft") {
    return (
      <div className="flex gap-2">
        {hasPermission("fuel:approve") && (
          <>
            <Button variant="outline" onClick={handleReject} disabled={loading}>Reject</Button>
            <Button onClick={handleApprove} disabled={loading}>Approve Request</Button>
          </>
        )}
      </div>
    );
  }

  if (request.status === "Approved") {
    return (
      <div className="flex gap-2">
        {hasPermission("fuel:purchase") && (
          <Button onClick={handlePurchase} disabled={loading}>Record Purchase</Button>
        )}
      </div>
    );
  }

  return null;
}
