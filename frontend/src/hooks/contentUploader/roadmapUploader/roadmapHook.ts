/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from 'react';
import { roadmapRepository } from '@/src/repositories/sessionContentManagement/roadmapRepositories';

export const useRoadmap = () => {
  const [programRoadmaps, setProgramRoadmaps] = useState<any[]>([]);
  const [batchRoadmap, setBatchRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramRoadmaps = useCallback(async (programName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roadmapRepository.getProgramRoadmaps(programName);
      if (response.success && response.data) {
        const roadmaps = response.data.data || response.data;
        setProgramRoadmaps(Array.isArray(roadmaps) ? roadmaps : [roadmaps]);
      } else {
        throw new Error(response.error || 'Failed to fetch roadmaps');
      }
    } catch (err: any) {
      setError(err.message);
      setProgramRoadmaps([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBatchRoadmap = useCallback(async (batchName: string, batchYear: string, programName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roadmapRepository.getBatchRoadmap(batchName, batchYear, programName);
      if (response.success && response.data) {
        const roadmap = response.data.data || response.data;
        setBatchRoadmap(roadmap);
      } else {
        throw new Error(response.error || 'Failed to fetch batch roadmap');
      }
    } catch (err: any) {
      setError(err.message);
      setBatchRoadmap(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    programRoadmaps,
    batchRoadmap,
    isLoading,
    error,
    fetchProgramRoadmaps,
    fetchBatchRoadmap,
    clearError,
  };
};