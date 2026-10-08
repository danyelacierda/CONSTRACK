import { notFound } from "next/navigation";
import { getDriverById } from "@/features/drivers/use-drivers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleGuard } from "@/components/shared/role-guard";
import { DriverDialog } from "@/features/drivers/components/driver-dialog";
import { DriverArchiveButton } from "@/features/drivers/components/driver-archive-button";
import { AlertCircle } from "lucide-react";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await getDriverById(id);
  if (!driver || driver.isArchived) return notFound();

  const expiry = new Date(driver.licenseExpiry);
  const daysRemaining = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;

  return (
    <RoleGuard permission="drivers:read">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">{driver.fullName}</h1>
            <p className="text-muted-foreground">{driver.employeeId} - {driver.contactNumber}</p>
          </div>
          <div className="flex gap-2">
            <RoleGuard permission="drivers:update">
              <DriverDialog existing={driver} />
              <DriverArchiveButton driverId={driver.id} />
            </RoleGuard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
            <CardContent><StatusBadge status={driver.status} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">License Number</CardTitle></CardHeader>
            <CardContent><span className="font-mono">{driver.licenseNumber}</span></CardContent>
          </Card>
          <Card className={isExpired ? "border-destructive" : ""}>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2">License Expiry {isExpired && <AlertCircle className="h-4 w-4 text-destructive" />}</CardTitle></CardHeader>
            <CardContent>
              <span className="font-mono">{driver.licenseExpiry}</span>
              {isExpired && <p className="text-xs text-destructive mt-1">Expired {Math.abs(daysRemaining)} days ago</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
