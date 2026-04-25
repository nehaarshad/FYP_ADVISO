// src/hooks/advisorHooks/useAdvisorHook.ts
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAdvisorStore } from '../../storage/advisorStore/advisorsData';

export const useAdvisors = () => {
  const {
    advisors,
    filteredAdvisors,
    isLoading,
    error,
    filters,
    statistics,
    fetchAdvisors,
    setFilters,
    clearFilters,
    getAdvisorById,
    getAdvisorBySapId,
    clearError,
  } = useAdvisorStore();


  const searchAdvisors = useCallback((searchTerm: string) => {
    setFilters({ searchTerm });
  }, [setFilters]);

  const filterByStatus = useCallback((isActive: boolean) => {
    setFilters({ isActive });
  }, [setFilters]);

  const filterByBatch = useCallback((batchName: string, batchYear: string, programName: string) => {
    setFilters({ batchName, batchYear, programName });
  }, [setFilters]);

  const filterByName = useCallback((advName: string) => {
    setFilters({ advName });
  }, [setFilters]);

  const filterBySapId = useCallback((sapid: number | string) => {
    setFilters({ sapid });
  }, [setFilters]);

  const uniqueBatchNames = useMemo(() => {
    if (!advisors || !Array.isArray(advisors)) return [];
    const batchNames = advisors
      .map(a => a.BatchAssignments?.[0]?.BatchModel?.batchName)
      .filter(Boolean);
    return [...new Set(batchNames)];
  }, [advisors]);

  const uniqueBatchYears = useMemo(() => {
    if (!advisors || !Array.isArray(advisors)) return [];
    const batchYears = advisors
      .map(a => a.BatchAssignments?.[0]?.BatchModel?.batchYear)
      .filter(Boolean);
    return [...new Set(batchYears)];
  }, [advisors]);

  const uniquePrograms = useMemo(() => {
    if (!advisors || !Array.isArray(advisors)) return [];
    const programs = advisors
      .map(a => a.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.programName)
      .filter(Boolean);
    return [...new Set(programs)];
  }, [advisors]);

  return {
    advisors: filteredAdvisors,
    allAdvisors: advisors,
    isLoading,
    error,
    filters,
    statistics,
    totalCount: filteredAdvisors?.length || 0,
    totalAllCount: advisors?.length || 0,
    activeCount: statistics?.activeAdvisors || 0,
    inactiveCount: statistics?.inactiveAdvisors || 0,
    uniqueBatchNames,
    uniqueBatchYears,
    uniquePrograms,
    fetchAdvisors,
    searchAdvisors,
    filterByStatus,
    filterByBatch,
    filterByName,
    filterBySapId,
    setFilters,
    clearFilters,
    getAdvisorById,
    getAdvisorBySapId,
    clearError,
  };
};