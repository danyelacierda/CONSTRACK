"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveVehicle } from "../use-vehicles";

export function VehicleArchiveButton({ vehicleId }: { vehicleId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleArchive() {
    if (!confirm("Are you sure you want to archive this vehicle?")) return;
    setLoading(true);
    try {
      await archiveVehicle(vehicleId);
      router.push("/fleet");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error archiving vehicle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleArchive} disabled={loading}>
      Archive Vehicle
    </Button>
  );
}
