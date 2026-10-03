import React from "react";
import { driverRepository, vehicleRepository } from "@/repositories";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Users, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const [drivers, vehicles] = await Promise.all([
    driverRepository.getAll(),
    vehicleRepository.getAll(),
  ]);

  const vehicleMap = new Map(vehicles.map((v) => [v.id, `${v.plateNumber} (${v.name})`]));
  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">AUTHORIZED DRIVERS</h1>
          <p className="text-sm text-muted-foreground">
            Driver roster, license compliance tracking, and vehicle custody
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            OPERATOR ROSTER ({drivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID & Name</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>License Expiration</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => {
                const expiry = new Date(d.licenseExpiry);
                const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysRemaining <= 60 && daysRemaining > 0;
                const isExpired = daysRemaining <= 0;

                const assignedVehicle = d.currentVehicleId ? vehicleMap.get(d.currentVehicleId) : null;

                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-mono text-xs font-semibold text-primary">{d.employeeId}</div>
                      <div className="text-sm font-medium text-foreground">{d.fullName}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground">
                      {d.licenseNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs text-foreground">{d.licenseExpiry}</div>
                      {isExpiringSoon && (
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3" /> Expires in {daysRemaining} days
                        </div>
                      )}
                      {isExpired && (
                        <div className="text-[11px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3" /> Expired {Math.abs(daysRemaining)} days ago
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {assignedVehicle || <span className="text-muted-foreground italic">None (Pool)</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {d.contactNumber}
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
