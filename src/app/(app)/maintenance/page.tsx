import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RoleGuard } from "@/components/shared/role-guard";
import { Wrench } from "lucide-react";
import { maintenanceRepository, vehicleRepository, equipmentRepository, projectRepository } from "@/repositories";
import { StatusBadge } from "@/components/shared/status-badge";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const [tickets, vehicles, equipment, projects] = await Promise.all([
    maintenanceRepository.getAll(),
    vehicleRepository.getAll(),
    equipmentRepository.getAll(),
    projectRepository.getAll(),
  ]);

  const vehicleMap = new Map(vehicles.map(v => [v.id, v.plateNumber]));
  const equipmentMap = new Map(equipment.map(e => [e.id, e.assetCode]));
  const projectMap = new Map(projects.map(p => [p.id, p.name]));

  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">MAINTENANCE</h1>
          <p className="text-sm text-muted-foreground">Service records for vehicles and equipment</p>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              MAINTENANCE TICKETS ({tickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead className="text-right">Cost (PHP)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => {
                  const assetName = t.vehicleId ? vehicleMap.get(t.vehicleId) || t.vehicleId 
                                  : t.equipmentId ? equipmentMap.get(t.equipmentId) || t.equipmentId 
                                  : "Unknown Asset";
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium font-mono text-primary">
                        {t.ticketNumber}
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {t.priority} Priority
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {assetName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {t.type} - {t.description}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-mono">
                        {t.scheduledDate}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold readout">
                        ₱{t.costPhp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No maintenance tickets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
