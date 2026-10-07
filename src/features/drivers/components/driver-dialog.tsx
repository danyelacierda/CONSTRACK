"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDriver, updateDriver } from "../use-drivers";
import type { Driver } from "@/types/domain";

export function DriverDialog({ existing }: { existing?: Driver }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const data = {
      employeeId: formData.get("employeeId") as string,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      licenseNumber: formData.get("licenseNumber") as string,
      licenseExpiry: formData.get("licenseExpiry") as string,
      contactNumber: formData.get("contactNumber") as string,
      email: (formData.get("email") as string) || null,
      status: formData.get("status") as any,
      currentVehicleId: existing?.currentVehicleId || null,
      photoUrl: existing?.photoUrl || null,
    };

    try {
      if (existing) {
        await updateDriver(existing.id, data);
      } else {
        await createDriver(data);
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving driver");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{existing ? "Edit Driver" : "Add Driver"}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-bold mb-4 font-mono">{existing ? "EDIT" : "ADD"} DRIVER</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input name="employeeId" placeholder="Employee ID" defaultValue={existing?.employeeId} required />
              <div className="flex gap-2">
                <Input name="firstName" placeholder="First Name" defaultValue={existing?.firstName} required />
                <Input name="lastName" placeholder="Last Name" defaultValue={existing?.lastName} required />
              </div>
              <Input name="licenseNumber" placeholder="License Number" defaultValue={existing?.licenseNumber} required />
              <Input name="licenseExpiry" type="date" placeholder="License Expiry" defaultValue={existing?.licenseExpiry} required />
              <Input name="contactNumber" placeholder="Contact Number" defaultValue={existing?.contactNumber} required />
              <Input name="email" type="email" placeholder="Email (Optional)" defaultValue={existing?.email || ""} />
              
              <select name="status" defaultValue={existing?.status || "Active"} className="w-full p-2 border rounded text-sm bg-background" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
