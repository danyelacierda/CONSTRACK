"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveDriver } from "../use-drivers";

export function DriverArchiveButton({ driverId }: { driverId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleArchive() {
    if (!confirm("Are you sure you want to archive this driver?")) return;
    setLoading(true);
    try {
      await archiveDriver(driverId);
      router.push("/drivers");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error archiving driver");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleArchive} disabled={loading}>
      Archive Driver
    </Button>
  );
}
