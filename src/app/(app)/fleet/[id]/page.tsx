import { notFound } from "next/navigation";
import { getVehicleById } from "@/features/fleet/use-vehicles";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleGuard } from "@/components/shared/role-guard";
import { VehicleDialog } from "@/features/fleet/components/vehicle-dialog";
import { VehicleArchiveButton } from "@/features/fleet/components/vehicle-archive-button";

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  if (!vehicle || vehicle.isArchived) return notFound();

  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">{vehicle.plateNumber}</h1>
            <p className="text-muted-foreground">{vehicle.name} - {vehicle.make} {vehicle.model} ({vehicle.year})</p>
          </div>
          <div className="flex gap-2">
            <RoleGuard permission="fleet:update">
              <VehicleDialog existing={vehicle} />
              <VehicleArchiveButton vehicleId={vehicle.id} />
            </RoleGuard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
            <CardContent><StatusBadge status={vehicle.status} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Odometer</CardTitle></CardHeader>
            <CardContent><span className="readout font-mono font-semibold">{vehicle.odometerKm.toLocaleString()} km</span></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Fuel Reserve</CardTitle></CardHeader>
            <CardContent><span className="readout font-mono font-semibold">{vehicle.currentFuelLiters} / {vehicle.tankCapacityLiters} L</span></CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
