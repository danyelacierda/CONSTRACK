"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { createMaintenanceTicket } from "../use-maintenance";
import { useCurrentUser } from "@/features/auth/role-context";

interface ReportIssueDialogProps {
  vehicleId: string;
  vehicleName: string;
}

/**
 * ReportIssueDialog
 * 
 * A client-side dialog component that allows users (typically Drivers) 
 * to report maintenance issues for a specific vehicle. It collects issue 
 * details and submits a new maintenance ticket to the backend.
 *
 * @param {string} vehicleId - The ID of the vehicle having the issue.
 * @param {string} vehicleName - The display name/plate of the vehicle.
 */
export function ReportIssueDialog({ vehicleId, vehicleName }: ReportIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentUser();

  const [type, setType] = useState("Repair");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [description, setDescription] = useState("");
  const [odometer, setOdometer] = useState("");

  /**
   * Handles the form submission by constructing a new MaintenanceTicket
   * payload and calling the server action `createMaintenanceTicket`.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createMaintenanceTicket({
        ticketNumber: `MT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
        vehicleId,
        equipmentId: null,
        projectId: null,
        status: "Scheduled",
        priority,
        type,
        description: `Reported by Driver (${user?.firstName || 'Unknown'}): ${description}`,
        scheduledDate: new Date().toISOString().split("T")[0],
        completedDate: null,
        costPhp: 0,
        vendor: null,
        odometerAtServiceKm: odometer ? Number(odometer) : null,
        engineHoursAtService: null,
        nextServiceDueKm: null,
        nextServiceDueDate: null,
        nextServiceDueHours: null,
        assignedTo: null,
        notes: "Driver reported issue",
      });
      setOpen(false);
      setDescription("");
      setOdometer("");
      alert("Issue reported successfully. The Fleet Manager and Admin have been notified.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error reporting issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" className="gap-2 border-orange-500/30 text-orange-500 hover:bg-orange-500/10" onClick={() => setOpen(true)}>
        <AlertCircle className="h-4 w-4" />
        Report Issue
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-bold mb-4 font-mono">REPORT MAINTENANCE ISSUE</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset</label>
                <Input value={vehicleName} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border rounded text-sm bg-background"
                  >
                    <option value="Repair">Repair</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Parts Replacement">Parts Replacement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full p-2 border rounded text-sm bg-background"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Odometer (Optional)</label>
                <Input
                  type="number"
                  placeholder="e.g. 45000"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  placeholder="Describe the issue you are experiencing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded text-sm bg-background min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
