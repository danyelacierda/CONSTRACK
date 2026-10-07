import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/use-projects";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleGuard } from "@/components/shared/role-guard";
import { ProjectDialog } from "@/features/projects/components/project-dialog";
import { ProjectArchiveButton } from "@/features/projects/components/project-archive-button";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  if (!project || project.isArchived) return notFound();

  return (
    <RoleGuard permission="projects:read">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">{project.code} - {project.name}</h1>
            <p className="text-muted-foreground">{project.location} (Client: {project.clientName})</p>
          </div>
          <div className="flex gap-2">
            <RoleGuard permission="projects:update">
              <ProjectDialog existing={project} />
              <ProjectArchiveButton projectId={project.id} />
            </RoleGuard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
            <CardContent><StatusBadge status={project.status} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Budget & Spend</CardTitle></CardHeader>
            <CardContent>
              <p className="readout font-mono font-semibold">Budget: ₱{project.budgetPhp.toLocaleString()}</p>
              <p className="readout font-mono text-muted-foreground text-sm mt-1">Spent: ₱{project.spentPhp.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
            <CardContent>
              <p className="font-mono text-sm">Start: {project.startDate}</p>
              <p className="font-mono text-sm mt-1 text-muted-foreground">End: {project.endDate || "TBD"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
