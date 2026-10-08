import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RoleGuard } from "@/components/shared/role-guard";
import { HardHat } from "lucide-react";
import { equipmentRepository, projectRepository } from "@/repositories";
import { StatusBadge } from "@/components/shared/status-badge";

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const [equipmentList, projects] = await Promise.all([
    equipmentRepository.getAll(),
    projectRepository.getAll(),
  ]);

  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">EQUIPMENT</h1>
          <p className="text-sm text-muted-foreground">Manage small tools and heavy machinery</p>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <HardHat className="h-4 w-4 text-primary" />
              EQUIPMENT INVENTORY ({equipmentList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Project</TableHead>
                  <TableHead className="text-right">Engine Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentList.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium font-mono text-primary flex items-center gap-3">
                      {eq.photoUrl ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden shrink-0 border border-border">
                          <img src={eq.photoUrl} alt={eq.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border">
                          <HardHat className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span>{eq.assetCode}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {eq.name}
                      <div className="text-[11px] text-muted-foreground font-normal">
                        {eq.make} {eq.model} ({eq.year})
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {eq.type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={eq.status} />
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {eq.currentProjectId ? projectMap.get(eq.currentProjectId) || eq.currentProjectId : <span className="italic text-muted-foreground">Unassigned</span>}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold readout">
                      {eq.engineHours.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {equipmentList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No equipment found.
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
