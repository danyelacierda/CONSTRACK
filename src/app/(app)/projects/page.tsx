import React from "react";
import { getProjectsPageData } from "@/features/projects/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { GaugeRing } from "@/components/shared/gauge-ring";
import { FolderKanban, MapPin, Calendar, PhilippinePeso } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { costSummaries } = await getProjectsPageData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">PROJECT COST CENTERS</h1>
          <p className="text-sm text-muted-foreground">
            Live fuel and maintenance expenditure tracked against project budgets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {costSummaries.map(({ project, summary }) => {
          const utilization = summary ? summary.utilizationPercent : 0;
          const fuelCost = summary ? summary.fuelCostPhp : 0;
          const maintCost = summary ? summary.maintenanceCostPhp : 0;
          const totalSpent = summary ? summary.totalSpentPhp : 0;

          return (
            <Card key={project.id} className="relative overflow-hidden">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{project.code}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <CardTitle className="text-lg font-bold mt-1 text-foreground">
                      {project.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      {project.location} • Client: {project.clientName}
                    </p>
                  </div>
                  <GaugeRing
                    value={utilization}
                    size={64}
                    strokeWidth={5}
                    label="Spent"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/40 border border-border">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
                      Total Budget
                    </span>
                    <span className="readout text-base font-bold text-foreground">
                      ₱{project.budgetPhp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="p-3 rounded-md bg-muted/40 border border-border">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
                      Allocated Cost
                    </span>
                    <span className="readout text-base font-bold text-amber-400">
                      ₱{totalSpent.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Live Cost Breakdown
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-muted-foreground">Fuel Transactions:</span>
                    <span className="readout font-semibold text-foreground">
                      ₱{fuelCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-muted-foreground">Maintenance & Repairs:</span>
                    <span className="readout font-semibold text-foreground">
                      ₱{maintCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {project.geofence && (
                  <div className="text-[11px] font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded flex items-center justify-between">
                    <span>Geofence: {project.geofence.radiusKm} km radius</span>
                    <span>Lat: {project.geofence.latitude}, Lon: {project.geofence.longitude}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
