// src/hooks/advisorHooks/useAdvisors.ts
import { useEffect, useCallback, useMemo } from 'react';
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

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const searchAdvisors = useCallback((searchTerm: string) => {
    setFilters({ searchTerm });
  }, [setFilters]);

  const filterByStatus = useCallback((isActive: boolean) => {
    setFilters({ isActive });
  }, [setFilters]);

  return {
    advisors: filteredAdvisors,
    allAdvisors: advisors,
    isLoading,
    error,
    filters,
    statistics,
    totalCount: filteredAdvisors?.length || 0,
    totalAllCount: advisors?.length || 0,
    fetchAdvisors,
    searchAdvisors,
    filterByStatus,
    setFilters,
    clearFilters,
    getAdvisorById,
    getAdvisorBySapId,
    clearError,
  };
};