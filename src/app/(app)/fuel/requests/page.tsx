import React from "react";
import Link from "next/link";
import { getFuelRequestsPageData } from "@/features/fuel/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Fuel, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FuelRequestsPage() {
  const { requests, vehicleMap, driverMap, projectMap } = await getFuelRequestsPageData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">FUEL REQUEST WORKFLOW</h1>
          <p className="text-sm text-muted-foreground">
            Multi-stage fuel approval pipeline: Request → Approval → Purchase → Verification
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            FUEL ALLOCATIONS ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead>Approver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => {
                const vehiclePlate = vehicleMap.get(r.vehicleId) || r.vehicleId;
                const driverName = driverMap.get(r.driverId) || r.driverId;
                const projectName = projectMap.get(r.projectId) || r.projectId;

                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <div className="font-mono text-sm font-bold text-primary">{r.requestNumber}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-foreground">{vehiclePlate}</span>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {driverName}
                    </TableCell>
                    <TableCell className="text-xs text-foreground max-w-[200px] truncate">
                      {projectName}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold text-foreground readout">
                      {r.requestedLiters.toFixed(1)} L ({r.fuelType})
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold text-foreground readout">
                      ₱{r.estimatedCostPhp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.approvedBy || <span className="italic">Pending</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
