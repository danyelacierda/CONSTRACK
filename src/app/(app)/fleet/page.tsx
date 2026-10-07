import React from "react";
import { getFleetPageData } from "@/features/fleet/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { GaugeRing } from "@/components/shared/gauge-ring";
import { Truck, Plus, Fuel } from "lucide-react";
import { RoleGuard } from "@/components/shared/role-guard";
import { VehicleDialog } from "@/features/fleet/components/vehicle-dialog";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const { vehicles, driverMap, projectMap } = await getFleetPageData();

  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">FLEET INVENTORY</h1>
          <p className="text-sm text-muted-foreground">
            Manage dump trucks, heavy vehicles, and project assignments
          </p>
        </div>
        <RoleGuard permission="fleet:create">
          <VehicleDialog />
        </RoleGuard>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            REGISTERED ASSETS ({vehicles.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate & Identifier</TableHead>
                <TableHead>Type / Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Project</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead className="text-right">Odometer</TableHead>
                <TableHead className="text-center">Fuel Reserve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => {
                const fuelPercent = (v.currentFuelLiters / v.tankCapacityLiters) * 100;
                const assignedDriver = v.currentDriverId ? driverMap.get(v.currentDriverId) : null;
                const assignedProject = v.currentProjectId ? projectMap.get(v.currentProjectId) : null;

                return (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">
                      <Link href={`/fleet/${v.id}`} className="hover:underline">
                        <div className="font-mono font-bold text-primary text-sm">{v.plateNumber}</div>
                        <div className="text-xs text-muted-foreground">{v.name}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-foreground font-medium">{v.make} {v.model}</div>
                      <div className="text-[11px] text-muted-foreground">{v.type} ({v.year})</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {assignedProject || <span className="text-muted-foreground italic">Unassigned</span>}
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {assignedDriver || <span className="text-muted-foreground italic">None</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="readout font-mono font-semibold text-foreground text-xs">
                        {v.odometerKm.toLocaleString()} km
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2">
                        <GaugeRing value={fuelPercent} size={42} strokeWidth={3.5} />
                        <span className="readout text-xs text-muted-foreground">
                          {v.currentFuelLiters}/{v.tankCapacityLiters}L
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  );
}
