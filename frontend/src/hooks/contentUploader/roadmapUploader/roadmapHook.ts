/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/contentUploader/roadmapUploader/roadmapHook.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { roadmapRepository, UploadRoadmapData } from '@/src/repositories/sessionContentManagement/roadmapRepositories';
import { Roadmap } from '@/src/models/RoadmapModel';

export const useRoadmap = () => {
  const [programRoadmaps, setProgramRoadmaps] = useState<Roadmap[]>([]);
  const [batchRoadmap, setBatchRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const hasFetched = useRef<{ [key: string]: boolean }>({});

  const fetchProgramRoadmaps = useCallback(async (programName: string, forceRefresh: boolean = false) => {
    const cacheKey = `program_${programName}`;
    
    if (hasFetched.current[cacheKey] && !forceRefresh) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await roadmapRepository.getProgramRoadmaps(programName, forceRefresh);
      if (response.success && response.data) {
        setProgramRoadmaps(Array.isArray(response.data) ? response.data : [response.data]);
        hasFetched.current[cacheKey] = true;
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

  const fetchBatchRoadmap = useCallback(async (batchName: string, batchYear: string, programName: string, forceRefresh: boolean = false) => {
    const cacheKey = `batch_${batchName}_${batchYear}_${programName}`;
    
    if (hasFetched.current[cacheKey] && !forceRefresh) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await roadmapRepository.getBatchRoadmap(batchName, batchYear, programName, forceRefresh);
      if (response.success && response.data) {
        setBatchRoadmap(response.data);
        hasFetched.current[cacheKey] = true;
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

  const uploadRoadmap = useCallback(async (data: UploadRoadmapData) => {
  setIsLoading(true);
  setError(null);
  setUploadProgress(0);
  
  try {
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    const response = await roadmapRepository.uploadRoadmap(data);
    
    clearInterval(interval);
    setUploadProgress(100);
    
    if (response.success) {
      // Clear repository cache
      roadmapRepository.clearCache();
      
      // Clear React hook cache for ALL relevant keys
      hasFetched.current = {};
      
      // Force refresh all relevant data
      await fetchProgramRoadmaps(data.programName, true);
      
      // If batch info is provided, also refresh batch roadmap
      if (data.batchName && data.batchYear) {
        await fetchBatchRoadmap(data.batchName, data.batchYear, data.programName, true);
      }
      
      return { success: true, data: response.data };
    } else {
      setError(response.error || 'Upload failed');
      return { success: false, error: response.error };
    }
  } catch (err: any) {
    setError(err.message || 'An error occurred');
    return { success: false, error: err.message };
  } finally {
    setIsLoading(false);
  }
}, [fetchProgramRoadmaps, fetchBatchRoadmap]);

  const clearError = useCallback(() => setError(null), []);

  return {
    programRoadmaps,
    batchRoadmap,
    isLoading,
    error,
    uploadProgress,
    fetchProgramRoadmaps,
    fetchBatchRoadmap,
    uploadRoadmap,
    clearError,
  };
};