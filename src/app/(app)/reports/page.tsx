import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/shared/role-guard";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <RoleGuard permission="reports:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">REPORTS</h1>
          <p className="text-sm text-muted-foreground">System-wide analytics and reporting</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              FINANCIAL & FUEL REPORTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Advanced reporting will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
