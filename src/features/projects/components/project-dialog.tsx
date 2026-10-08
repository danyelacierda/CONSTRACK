"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, updateProject } from "../use-projects";
import type { Project } from "@/types/domain";

export function ProjectDialog({ existing }: { existing?: Project }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      clientName: formData.get("clientName") as string,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || null,
      budgetPhp: Number(formData.get("budgetPhp")),
      status: formData.get("status") as any,
      spentPhp: existing?.spentPhp || 0,
      projectManagerId: existing?.projectManagerId || null,
      geofence: existing?.geofence || null,
    };

    try {
      if (existing) {
        await updateProject(existing.id, data);
      } else {
        await createProject(data);
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{existing ? "Edit Project" : "Add Project"}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md border max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 font-mono">{existing ? "EDIT" : "ADD"} PROJECT</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input name="code" placeholder="Code (e.g. PRJ-001)" defaultValue={existing?.code} required />
                <Input name="name" placeholder="Project Name" defaultValue={existing?.name} required />
              </div>
              <Input name="description" placeholder="Description" defaultValue={existing?.description} required />
              <Input name="location" placeholder="Location" defaultValue={existing?.location} required />
              <Input name="clientName" placeholder="Client Name" defaultValue={existing?.clientName} required />
              <div className="flex gap-2">
                <Input name="startDate" type="date" placeholder="Start Date" defaultValue={existing?.startDate} required />
                <Input name="endDate" type="date" placeholder="End Date" defaultValue={existing?.endDate || ""} />
              </div>
              <Input name="budgetPhp" type="number" placeholder="Budget (₱)" defaultValue={existing?.budgetPhp} required />
              
              <select name="status" defaultValue={existing?.status || "Planning"} className="w-full p-2 border rounded text-sm bg-background" required>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
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
