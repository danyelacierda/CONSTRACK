"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFuelRequest } from "../actions";
import { useCurrentUser } from "@/features/auth/role-context";
import type { Vehicle, Project } from "@/types/domain";

export function FuelRequestDialog({ vehicles = [], projects = [] }: { vehicles?: Vehicle[], projects?: Project[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useCurrentUser();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      requestNumber: `REQ-${Date.now()}`,
      vehicleId: formData.get("vehicleId") as string,
      driverId: formData.get("driverId") as string,
      projectId: formData.get("projectId") as string,
      fuelType: formData.get("fuelType") as any,
      requestedLiters: Number(formData.get("requestedLiters")),
      estimatedCostPhp: Number(formData.get("estimatedCostPhp")),
      purpose: formData.get("purpose") as string,
      requestedBy: user?.fullName || "Unknown",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      status: "Draft" as any,
    };

    try {
      await createFuelRequest(data, user?.id || "anon", user?.fullName || "Anon");
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Request</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-bold mb-4 font-mono">NEW FUEL REQUEST</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <select name="vehicleId" className="w-full p-2 border rounded text-sm bg-background" required defaultValue="">
                <option value="" disabled>Select Vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.plateNumber} ({v.name})</option>
                ))}
              </select>
              <Input name="driverId" placeholder="Driver ID (e.g. drv-001)" required />
              <select name="projectId" className="w-full p-2 border rounded text-sm bg-background" required defaultValue="">
                <option value="" disabled>Select Project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Input name="requestedLiters" type="number" placeholder="Requested Liters" required />
              <Input name="estimatedCostPhp" type="number" placeholder="Estimated Cost (PHP)" required />
              <Input name="purpose" placeholder="Purpose" required />
              <select name="fuelType" className="w-full p-2 border rounded text-sm bg-background" required>
                <option value="Diesel">Diesel</option>
                <option value="Gasoline">Gasoline</option>
              </select>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
