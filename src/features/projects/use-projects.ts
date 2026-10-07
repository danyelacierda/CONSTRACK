"use server";

import { projectRepository, assignmentRepository } from "@/repositories";
import type { Project } from "@/types/domain";

export async function getProjectById(id: string): Promise<Project | null> {
  return projectRepository.getById(id);
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt" | "isArchived">) {
  return projectRepository.create({ ...data, isArchived: false });
}

export async function updateProject(id: string, updates: Partial<Project>) {
  return projectRepository.update(id, updates);
}

export async function archiveProject(id: string) {
  const assignments = await assignmentRepository.getByProjectId(id);
  const hasActive = assignments.some(a => a.status === "Active");
  if (hasActive) throw new Error("Cannot archive project with active vehicle assignments");
  return projectRepository.update(id, { isArchived: true, status: "Completed" });
}
