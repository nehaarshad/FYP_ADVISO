/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseManagement/useTimetable.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { timetableRepository } from '@/src/repositories/sessionContentManagement/timetablesRepositories';
import { Timetable } from '@/src/models/timetableModel';
import { UploadTimetableData } from '@/src/repositories/sessionContentManagement/types/uploadTimetable';

export const useTimetable = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [filteredTimetables, setFilteredTimetables] = useState<Timetable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const hasFetched = useRef(false);

  const fetchTimetables = useCallback(async (forceRefresh: boolean = false) => {
    if (hasFetched.current && !forceRefresh) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await timetableRepository.getTimetables(forceRefresh);
      if (response.success && response.data) {
        setTimetables(response.data);
        setFilteredTimetables(response.data);
        hasFetched.current = true;
      } else {
        throw new Error(response.error || 'Failed to fetch timetables');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadTimetable = useCallback(async (data: UploadTimetableData) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await timetableRepository.uploadTimetable(data);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.success) {
        await fetchTimetables(true);
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
  }, [fetchTimetables]);

  const filterBySession = useCallback((sessionType: string, sessionYear: string) => {
    const filtered = timetableRepository.getTimetablesBySession(timetables, sessionType, sessionYear);
    setFilteredTimetables(filtered);
  }, [timetables]);

  const filterByProgram = useCallback((programName: string) => {
    const filtered = timetableRepository.getTimetablesByProgram(timetables, programName);
    setFilteredTimetables(filtered);
  }, [timetables]);

  const filterByBatch = useCallback((batchName: string, batchYear: string) => {
    const filtered = timetableRepository.getTimetablesByBatch(timetables, batchName, batchYear);
    setFilteredTimetables(filtered);
  }, [timetables]);

  const filterByDay = useCallback((day: string) => {
    const filtered = timetableRepository.getTimetablesByDay(timetables, day);
    setFilteredTimetables(filtered);
  }, [timetables]);

  const clearFilters = useCallback(() => {
    setFilteredTimetables(timetables);
  }, [timetables]);

  return {
    timetables: filteredTimetables,
    allTimetables: timetables,
    isLoading,
    error,
    uploadProgress,
    fetchTimetables,
    uploadTimetable,
    filterBySession,
    filterByProgram,
    filterByBatch,
    filterByDay,
    clearFilters,
  };
};