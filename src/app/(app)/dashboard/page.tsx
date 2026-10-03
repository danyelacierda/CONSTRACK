import React from "react";
import Link from "next/link";
import { getDashboardPageData } from "@/features/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GaugeRing } from "@/components/shared/gauge-ring";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Truck,
  Fuel,
  AlertTriangle,
  Wrench,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { vehicles, transactions, anomalies, maintenanceTickets, projects } =
    await getDashboardPageData();

  const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
  const totalFleet = vehicles.length;
  const fleetAvailability = totalFleet > 0 ? (activeVehicles / totalFleet) * 100 : 0;

  const totalFuelSpend = transactions.reduce((sum, t) => sum + t.totalCostPhp, 0);
  const activeProjectsCount = projects.filter((p) => p.status === "Active").length;
  const pendingMaintenance = maintenanceTickets.filter((m) => m.status === "Scheduled" || m.status === "In Progress").length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Framing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">FLEET & FUEL COMMAND</h1>
          <p className="text-sm text-muted-foreground">
            Accountability and audit oversight for ABC Construction & Development
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/fuel/requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Fuel className="h-4 w-4" />
            New Fuel Request
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fleet Availability
            </CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold readout">
                {activeVehicles} <span className="text-sm font-normal text-muted-foreground">/ {totalFleet} Active</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready for site deployment</p>
            </div>
            <GaugeRing value={fleetAvailability} size={48} strokeWidth={4} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fuel Spend (Month-to-Date)
            </CardTitle>
            <Fuel className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold readout text-foreground">
              ₱{totalFuelSpend.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Across {transactions.length} verified purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Discrepancies
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold readout text-amber-400">
              {anomalies.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires supervisor review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Projects
            </CardTitle>
            <Wrench className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold readout text-foreground">
              {activeProjectsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{pendingMaintenance} maintenance tickets queued</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Fleet Fuel Status & Open Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Status with GaugeRing Fuel Levels */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-mono">ACTIVE FLEET STATUS & FUEL RESERVES</CardTitle>
                <p className="text-xs text-muted-foreground">Real-time tank level telemetry and status indicators</p>
              </div>
              <Link href="/fleet" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                View all vehicles <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {vehicles.map((v) => {
                  const fuelPercent = (v.currentFuelLiters / v.tankCapacityLiters) * 100;
                  return (
                    <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-primary shrink-0">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-foreground">{v.plateNumber}</span>
                            <span className="text-xs text-muted-foreground font-normal">({v.name})</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>{v.type}</span>
                            <span>•</span>
                            <span className="readout">{v.odometerKm.toLocaleString()} km</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge status={v.status} />
                        <GaugeRing
                          value={fuelPercent}
                          size={46}
                          strokeWidth={4}
                          label="Tank"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Fuel Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-mono">RECENT FUEL TRANSACTIONS</CardTitle>
                <p className="text-xs text-muted-foreground">Purchases recorded at commercial gas stations</p>
              </div>
              <Link href="/fuel/requests" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                View requests <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {transactions.map((txn) => (
                  <div key={txn.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-semibold">{txn.transactionNumber}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {txn.station} • {new Date(txn.transactionDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="readout font-bold text-sm text-foreground">
                        ₱{txn.totalCostPhp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground readout">
                        {txn.liters} L @ ₱{txn.pricePerLiterPhp}/L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Open Anomalies & Maintenance */}
        <div className="space-y-6">
          <Card className="border-amber-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold font-mono flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  FLAGGED DISCREPANCIES
                </CardTitle>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {anomalies.length} Pending
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Automated anomaly checks requiring human verification
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {anomalies.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No open discrepancies detected.</p>
              ) : (
                anomalies.map((anom) => (
                  <div
                    key={anom.id}
                    className="p-3 rounded-lg border border-border bg-muted/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-primary">
                        {anom.ruleCode}
                      </span>
                      <StatusBadge status={anom.status} />
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      {anom.description}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Detected: {new Date(anom.detectedAt).toLocaleDateString()}</span>
                      <Link
                        href="/fuel/anomalies"
                        className="text-primary hover:underline font-semibold"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Maintenance Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
                <Wrench className="h-4 w-4 text-sky-400" />
                MAINTENANCE QUEUE
              </CardTitle>
              <p className="text-xs text-muted-foreground">Preventive service schedule and tickets</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {maintenanceTickets.map((t) => (
                <div key={t.id} className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{t.ticketNumber}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs font-medium text-foreground">{t.type}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Est: ₱{t.costPhp.toLocaleString("en-PH")}</span>
                    <span>Due: {t.scheduledDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
