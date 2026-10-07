/**
 * Server-side data loaders for the Projects feature.
 * Integrates with project-cost-service for dynamic cost calculations.
 */
import { projectRepository } from "@/repositories";
import { getProjectCostSummary } from "@/services/project-cost-service";
import type { Project, ProjectCostSummary } from "@/types/domain";

/** Fetch all projects */
export async function getProjects(): Promise<Project[]> {
  return projectRepository.getAll();
}

/** Fetch a single project by ID */
export async function getProjectById(id: string): Promise<Project | null> {
  return projectRepository.getById(id);
}

/** Combined loader for the projects page with live cost summaries */
export async function getProjectsPageData() {
  const projects = await projectRepository.getAll();

  const costSummaries = await Promise.all(
    projects.map(async (project) => {
      const summary = await getProjectCostSummary(project.id);
      return { project, summary };
    })
  );

  return { costSummaries };
}
