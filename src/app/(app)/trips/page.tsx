import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/shared/role-guard";
import { MapPin } from "lucide-react";

export default function TripsPage() {
  return (
    <RoleGuard permission="fleet:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">TRIPS</h1>
          <p className="text-sm text-muted-foreground">Vehicle trip logs and geofence tracking</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              ACTIVE TRIPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Trip monitoring is coming in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
