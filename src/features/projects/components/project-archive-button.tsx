"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveProject, deleteProject } from "../use-projects";

export function ProjectArchiveButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    setLoading(true);
    try {
      await deleteProject(projectId);
      router.push("/projects");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      Delete Project
    </Button>
  );
}
