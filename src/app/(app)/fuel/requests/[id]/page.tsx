import { notFound } from "next/navigation";
import { getFuelRequestById } from "@/features/fuel/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleGuard } from "@/components/shared/role-guard";
import { FuelWorkflowActions } from "@/features/fuel/components/fuel-workflow-actions";

export default async function FuelRequestDetailPage({ params }: { params: { id: string } }) {
  const request = await getFuelRequestById(params.id);
  if (!request) return notFound();

  return (
    <RoleGuard permission="fuel:read">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">{request.requestNumber}</h1>
            <p className="text-muted-foreground">Requested by {request.requestedBy} for {request.purpose}</p>
          </div>
          <div className="flex gap-2">
            <FuelWorkflowActions request={request} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
            <CardContent>
              <StatusBadge status={request.status} />
              {request.rejectionReason && <p className="text-xs text-destructive mt-2">Reason: {request.rejectionReason}</p>}
              {request.approvedBy && <p className="text-xs text-muted-foreground mt-2">Approved by: {request.approvedBy}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
            <CardContent>
              <p className="font-mono text-sm">Volume: {request.requestedLiters} L ({request.fuelType})</p>
              <p className="font-mono text-sm mt-1">Cost: ₱{request.estimatedCostPhp.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
