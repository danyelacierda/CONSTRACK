"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createVehicle, updateVehicle } from "../use-vehicles";
import type { Vehicle } from "@/types/domain";

export function VehicleDialog({ existing }: { existing?: Vehicle }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      plateNumber: formData.get("plateNumber") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      status: formData.get("status") as any,
      fuelType: formData.get("fuelType") as any,
      tankCapacityLiters: Number(formData.get("tankCapacityLiters")),
      currentFuelLiters: Number(formData.get("currentFuelLiters")),
      odometerKm: Number(formData.get("odometerKm")),
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number(formData.get("year")),
      engineHours: existing?.engineHours || 0,
      currentProjectId: existing?.currentProjectId || null,
      currentDriverId: existing?.currentDriverId || null,
      photoUrl: existing?.photoUrl || null,
    };

    try {
      if (existing) {
        await updateVehicle(existing.id, data);
      } else {
        await createVehicle(data);
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving vehicle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{existing ? "Edit Vehicle" : "Add Vehicle"}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-bold mb-4 font-mono">{existing ? "EDIT" : "ADD"} VEHICLE</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input name="plateNumber" placeholder="Plate Number" defaultValue={existing?.plateNumber} required />
              <Input name="name" placeholder="Name/Identifier" defaultValue={existing?.name} required />
              <div className="flex gap-2">
                <Input name="make" placeholder="Make" defaultValue={existing?.make} required />
                <Input name="model" placeholder="Model" defaultValue={existing?.model} required />
              </div>
              <div className="flex gap-2">
                <Input name="year" type="number" placeholder="Year" defaultValue={existing?.year || new Date().getFullYear()} required />
                <Input name="odometerKm" type="number" placeholder="Odometer (km)" defaultValue={existing?.odometerKm || 0} required />
              </div>
              <div className="flex gap-2">
                <Input name="tankCapacityLiters" type="number" placeholder="Tank Cap (L)" defaultValue={existing?.tankCapacityLiters} required />
                <Input name="currentFuelLiters" type="number" placeholder="Current Fuel (L)" defaultValue={existing?.currentFuelLiters || 0} required />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select name="type" defaultValue={existing?.type || "Dump Truck"} className="w-full p-2 border rounded text-sm bg-background" required>
                  <option value="Dump Truck">Dump Truck</option>
                  <option value="Excavator">Excavator</option>
                  <option value="Bulldozer">Bulldozer</option>
                  <option value="Loader">Loader</option>
                  <option value="Service Vehicle">Service Vehicle</option>
                </select>
                <select name="fuelType" defaultValue={existing?.fuelType || "Diesel"} className="w-full p-2 border rounded text-sm bg-background" required>
                  <option value="Diesel">Diesel</option>
                  <option value="Gasoline">Gasoline</option>
                </select>
              </div>

              <select name="status" defaultValue={existing?.status || "Idle"} className="w-full p-2 border rounded text-sm bg-background" required>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
