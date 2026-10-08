import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RoleGuard } from "@/components/shared/role-guard";
import { Map as MapIcon } from "lucide-react";
import { tripRepository, vehicleRepository, driverRepository, projectRepository } from "@/repositories";
import { StatusBadge } from "@/components/shared/status-badge";
import MapEmbed from "@/components/shared/map-embed";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const [trips, vehicles, drivers, projects] = await Promise.all([
    tripRepository.getAll(),
    vehicleRepository.getAll(),
    driverRepository.getAll(),
    projectRepository.getAll(),
  ]);

  const vehicleMap = new Map(vehicles.map(v => [v.id, v.plateNumber]));
  const driverMap = new Map(drivers.map(d => [d.id, d.fullName]));
  const projectMap = new Map(projects.map(p => [p.id, p.name]));

  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">TRIPS & DISPATCHES</h1>
          <p className="text-sm text-muted-foreground">Monitor vehicle movements and project logistics</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <MapIcon className="h-4 w-4 text-primary" />
              LIVE DISPATCH MAP
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-0 border-b">
            <MapEmbed 
              center={[8.9475, 125.5406]} 
              zoom={10} 
              markers={projects
                .filter(p => p.geofence)
                .map(p => ({
                  lat: p.geofence!.latitude,
                  lng: p.geofence!.longitude,
                  label: p.name
                }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              TRIP LOGS ({trips.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle & Driver</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Origin → Destination</TableHead>
                  <TableHead>Scheduled Start</TableHead>
                  <TableHead className="text-right">Distance (km)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((t) => {
                  const vehiclePlate = vehicleMap.get(t.vehicleId) || t.vehicleId;
                  const driverName = driverMap.get(t.driverId) || t.driverId;
                  const projectName = projectMap.get(t.projectId) || t.projectId;
                  
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs font-bold text-primary">{vehiclePlate}</div>
                        <div className="text-[11px] text-muted-foreground">{driverName}</div>
                      </TableCell>
                      <TableCell className="text-xs text-foreground max-w-[150px] truncate">
                        {projectName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{t.origin}</span>
                        {" → "}
                        <span className="font-semibold text-foreground">{t.destination}</span>
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-mono">
                        {new Date(t.scheduledStart).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold readout">
                        {t.distanceKm ? t.distanceKm.toLocaleString() : "--"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {trips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No trips found.
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
