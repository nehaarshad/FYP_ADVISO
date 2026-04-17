import { useProgramStore } from '@/src/storage/programStore/programStore';
import { useEffect, useCallback, useMemo } from 'react';

export const usePrograms = () => {
  const {
    programs,
    isLoading,
    error,
    fetchPrograms,
    addProgram,
    getProgramById,
    getProgramByName,
    clearError,
    clearCache,
  } = useProgramStore();

  // Auto-fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Get all program names for dropdowns
  const programNames = useMemo(() => {
    return programs.map(p => p.programName);
  }, [programs]);

  // Get programs as options for select inputs
  const programOptions = useMemo(() => {
    return programs.map(p => ({
      value: p.id,
      label: p.programName
    }));
  }, [programs]);

  // Add new program with validation
  const addNewProgram = useCallback(async (programName: string) => {
    if (!programName.trim()) {
      return { success: false, error: 'Program name is required' };
    }
    
    // Check if program already exists
    const existing = programs.find(p => 
      p.programName.toLowerCase() === programName.toLowerCase()
    );
    
    if (existing) {
      return { success: false, error: 'Program already exists' };
    }
    
    return await addProgram({ programName });
  }, [addProgram, programs]);

  // Refresh programs
  const refreshPrograms = useCallback(async () => {
    await fetchPrograms(true);
  }, [fetchPrograms]);

  return {
    // Data
    programs,
    programNames,
    programOptions,
    isLoading,
    error,
    
    // Metadata
    totalCount: programs.length,
    
    // Actions
    fetchPrograms: refreshPrograms,
    addProgram: addNewProgram,
    getProgramById,
    getProgramByName,
    clearError,
    clearCache,
  };
};