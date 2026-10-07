import React from "react";
import { getAnomaliesPageData } from "@/features/anomalies/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AlertTriangle, Info, CheckCircle2, Eye } from "lucide-react";
import { RoleGuard } from "@/components/shared/role-guard";

export const dynamic = "force-dynamic";

export default async function AnomaliesPage() {
  const { anomalies, vehicleMap } = await getAnomaliesPageData();

  return (
    <RoleGuard permission="anomalies:read">
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">ANOMALY & DISCREPANCY REVIEW</h1>
        <p className="text-sm text-muted-foreground">
          Algorithmic discrepancy detection for fuel records, odometer readings, and custody logs
        </p>
      </div>

      {/* Mandatory Non-Accusatory Framing Banner */}
      <Alert variant="info" className="border-sky-500/30 bg-sky-950/20 text-sky-200">
        <Info className="h-4 w-4 text-sky-400" />
        <AlertTitle className="text-sm font-semibold tracking-wide font-mono">
          OPERATIONAL REVIEW PRINCIPLE — NOT AN ACCUSATION
        </AlertTitle>
        <AlertDescription className="text-xs text-sky-300 leading-relaxed mt-1">
          Flags shown below highlight mechanical, logging, or operational variances that require supervisory review.
          Discrepancies often stem from pump calibration variances, clerical data entry delays, or legitimate route diversions.
          All items remain neutral observations until reviewed by fleet operations management.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              DISCREPANCY LOGS ({anomalies.length})
            </CardTitle>
            <span className="text-xs font-mono text-muted-foreground">
              {anomalies.filter((a) => a.status === "Open" || a.status === "Under Review").length} Active Review Items
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Target Vehicle / Entity</TableHead>
                <TableHead className="w-[40%]">Observation & Discrepancy Note</TableHead>
                <TableHead>Detected Date</TableHead>
                <TableHead>Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((a) => {
                const vehicleDesc = a.vehicleId ? vehicleMap.get(a.vehicleId) || a.vehicleId : "—";

                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-primary">
                        {a.ruleCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.severity} />
                    </TableCell>
                    <TableCell className="text-xs font-mono text-foreground">
                      {vehicleDesc}
                    </TableCell>
                    <TableCell className="text-xs text-foreground leading-relaxed">
                      {a.description}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(a.detectedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a.reviewedBy || <span className="italic text-amber-400">Unreviewed</span>}
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
