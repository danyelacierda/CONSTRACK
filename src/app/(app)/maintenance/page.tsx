import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/shared/role-guard";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <RoleGuard permission="maintenance:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">MAINTENANCE</h1>
          <p className="text-sm text-muted-foreground">Vehicle and equipment maintenance schedules</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              MAINTENANCE LOGS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Maintenance tracking is coming in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
