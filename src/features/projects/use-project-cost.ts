"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProjectCostSummary } from "@/types/domain";
import { getProjectCostSummary } from "@/services/project-cost-service";

export interface UseProjectCostResult {
  summary: ProjectCostSummary | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Feature hook for project cost summary calculation.
 * Wraps getProjectCostSummary service to isolate UI components from business logic.
 */
export function useProjectCost(projectId: string | null | undefined): UseProjectCostResult {
  const [summary, setSummary] = useState<ProjectCostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [error, setError] = useState<Error | null>(null);

  const fetchCost = useCallback(async () => {
    if (!projectId) {
      setSummary(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjectCostSummary(projectId);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load project cost summary"));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchCost();
  }, [fetchCost]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchCost,
  };
}
