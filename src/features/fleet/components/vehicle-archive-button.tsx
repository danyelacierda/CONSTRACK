"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveVehicle, deleteVehicle } from "../use-vehicles";

export function VehicleArchiveButton({ vehicleId }: { vehicleId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this vehicle?")) return;
    setLoading(true);
    try {
      await deleteVehicle(vehicleId);
      router.push("/fleet");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting vehicle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      Delete Vehicle
    </Button>
  );
}
