"use client";

import { useState, useEffect, useCallback } from "react";
import type { FuelRequest } from "@/types/domain";
import { fuelRequestRepository } from "@/repositories";

export interface UseFuelRequestsResult {
  requests: FuelRequest[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Feature hook for fuel request management.
 * Wraps fuelRequestRepository to isolate UI components from data access specifics.
 */
export function useFuelRequests(): UseFuelRequestsResult {
  const [requests, setRequests] = useState<FuelRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fuelRequestRepository.getAll();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load fuel requests"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    refetch: fetchRequests,
  };
}
