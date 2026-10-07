"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveProject } from "../use-projects";

export function ProjectArchiveButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleArchive() {
    if (!confirm("Are you sure you want to archive this project?")) return;
    setLoading(true);
    try {
      await archiveProject(projectId);
      router.push("/projects");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error archiving project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleArchive} disabled={loading}>
      Archive Project
    </Button>
  );
}
