/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseManagement/useCourseOffering.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { courseOfferingRepository } from '@/src/repositories/sessionContentManagement/courseOfferingRepository';
import { CourseOffering } from '@/src/models/courseOfferingModel';
import { UploadCourseOfferingData } from '@/src/repositories/sessionContentManagement/types/uploadCourseOffering';

export const useCourseOffering = () => {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [filteredOfferings, setFilteredOfferings] = useState<CourseOffering[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const hasFetched = useRef(false);

  const fetchOfferings = useCallback(async (forceRefresh: boolean = false) => {
    if (hasFetched.current && !forceRefresh) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await courseOfferingRepository.getCourseOfferings(forceRefresh);
      if (response.success && response.data) {
        setOfferings(response.data);
        setFilteredOfferings(response.data);
        hasFetched.current = true;
      } else {
        throw new Error(response.error || 'Failed to fetch offerings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadOffering = useCallback(async (data: UploadCourseOfferingData) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await courseOfferingRepository.uploadCourseOffering(data);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.success) {
        await fetchOfferings(true);
        return { success: true };
      } else {
        setError(response.error || 'Upload failed');
        return { success: false };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [fetchOfferings]);

  const filterBySession = useCallback((sessionType: string, sessionYear: string) => {
    const filtered = courseOfferingRepository.getOfferingsBySession(offerings, sessionType, sessionYear);
    setFilteredOfferings(filtered);
  }, [offerings]);

  const filterByProgram = useCallback((programName: string) => {
    const filtered = courseOfferingRepository.getOfferingsByProgram(offerings, programName);
    setFilteredOfferings(filtered);
  }, [offerings]);

  const filterByBatch = useCallback((batchName: string, batchYear: string) => {
    const filtered = courseOfferingRepository.getOfferingsByBatch(offerings, batchName, batchYear);
    setFilteredOfferings(filtered);
  }, [offerings]);

  const clearFilters = useCallback(() => {
    setFilteredOfferings(offerings);
  }, [offerings]);

  return {
    offerings: filteredOfferings,
    allOfferings: offerings,
    isLoading,
    error,
    uploadProgress,
    fetchOfferings,
    uploadOffering,
    filterBySession,
    filterByProgram,
    filterByBatch,
    clearFilters,
  };
};