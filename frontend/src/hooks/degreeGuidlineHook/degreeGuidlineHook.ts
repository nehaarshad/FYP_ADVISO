/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/degreeGuidlineHook/degreeGuidlineHook.ts
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateDegreeGuidelineData, UpdateDegreeGuidelineData } from '@/src/repositories/degreeGuidlineRepository/degreeGuidlineRepo';
import { useDegreeGuidelineStore } from '@/src/storage/degreeGuidlineStore/degreeGuidlineStore';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';

export const useDegreeGuidelines = () => {
  const store = useDegreeGuidelineStore();
  const { userProfile } = useUserProfile();
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userProgramId, setUserProgramId] = useState<number | null>(null);
  const hasFetched = useRef<{ [key: string]: boolean }>({});

  // Extract user program ID based on role
  useEffect(() => {
    if (userProfile) {
      const role = userProfile.role;
      
      if (role === 'student') {
        // Get program from student's batch
        const programId = (userProfile as any)?.profile?.Batch?.Program?.id || 
                          (userProfile as any)?.profile?.BatchModel?.ProgramModel?.id;
        if (programId) {
          setUserProgramId(programId);
          setSelectedProgramId(programId);
        }
      } else if (role === 'advisor') {
        // Get first program from advisor's assignments
        const assignments = (userProfile as any)?.profile?.BatchAssignments || [];
        if (assignments.length > 0) {
          const programId = assignments[0]?.BatchModel?.ProgramModel?.id || 
                           assignments[0]?.Batch?.Program?.id;
          if (programId) {
            setUserProgramId(programId);
            setSelectedProgramId(programId);
          }
        }
      } else if (role === 'coordinator' || role === 'admin') {
        // Can view all
        setUserProgramId(null);
        setSelectedProgramId(null);
      }
    }
  }, [userProfile]);

  // Fetch guidelines based on user role
  useEffect(() => {
    if (userProfile) {
      const role = userProfile.role;
      
      if ((role === 'student' || role === 'advisor') && userProgramId) {
        fetchGuidelinesForProgram(userProgramId);
      } else if (role === 'coordinator' || role === 'admin') {
        fetchGuidelines();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.role, userProgramId]);

  const fetchGuidelines = useCallback(async (programId?: number, search?: string, forceRefresh: boolean = false) => {
    const cacheKey = `guidelines_${programId || 'all'}_${search || 'noSearch'}`;
    
    if (hasFetched.current[cacheKey] && !forceRefresh) return;
    
    try {
      await store.fetchGuidelines(programId, search, forceRefresh);
      hasFetched.current[cacheKey] = true;
    } catch (error) {
      console.error('Failed to fetch guidelines:', error);
    }
  }, [store]);

  const fetchGuidelinesForProgram = useCallback(async (programId: number, forceRefresh: boolean = false) => {
    setSelectedProgramId(programId);
    await fetchGuidelines(programId, undefined, forceRefresh);
  }, [fetchGuidelines]);

  const searchGuidelines = useCallback(async (search: string, forceRefresh: boolean = false) => {
    setSearchQuery(search);
    await fetchGuidelines(undefined, search, forceRefresh);
  }, [fetchGuidelines]);

  const createGuideline = useCallback(async (data: CreateDegreeGuidelineData) => {
    const result = await store.createGuideline(data);
    
    if (result.success) {
      hasFetched.current = {};
      
      const role = userProfile?.role;
      if ((role === 'student' || role === 'advisor') && userProgramId) {
        await fetchGuidelinesForProgram(userProgramId, true);
      } else if (selectedProgramId) {
        await fetchGuidelinesForProgram(selectedProgramId, true);
      } else {
        await fetchGuidelines(undefined, undefined, true);
      }
      
      if (searchQuery) {
        await searchGuidelines(searchQuery, true);
      }
    }
    
    return result;
  }, [store, selectedProgramId, searchQuery, fetchGuidelinesForProgram, searchGuidelines, userProfile, userProgramId]);

  const updateGuideline = useCallback(async (id: number, data: UpdateDegreeGuidelineData) => {
    const result = await store.updateGuideline(id, data);
    
    if (result.success) {
      hasFetched.current = {};
      
      const role = userProfile?.role;
      if ((role === 'student' || role === 'advisor') && userProgramId) {
        await fetchGuidelinesForProgram(userProgramId, true);
      } else if (selectedProgramId) {
        await fetchGuidelinesForProgram(selectedProgramId, true);
      }
      
      if (searchQuery) {
        await searchGuidelines(searchQuery, true);
      }
    }
    
    return result;
  }, [store, selectedProgramId, searchQuery, fetchGuidelinesForProgram, searchGuidelines, userProfile, userProgramId]);

  const deleteGuideline = useCallback(async (id: number) => {
    const result = await store.deleteGuideline(id);
    
    if (result.success) {
      hasFetched.current = {};
      
      const role = userProfile?.role;
      if ((role === 'student' || role === 'advisor') && userProgramId) {
        await fetchGuidelinesForProgram(userProgramId, true);
      } else if (selectedProgramId) {
        await fetchGuidelinesForProgram(selectedProgramId, true);
      }
      
      if (searchQuery) {
        await searchGuidelines(searchQuery, true);
      }
    }
    
    return result;
  }, [store, selectedProgramId, searchQuery, fetchGuidelinesForProgram, searchGuidelines, userProfile, userProgramId]);

  const getGuidelinesByProgram = useCallback((programId: number) => {
    return store.getGuidelinesByProgram(programId);
  }, [store]);

  const getGuidelineById = useCallback((id: number) => {
    return store.getGuidelineById(id);
  }, [store]);

  const clearError = useCallback(() => store.clearError(), [store]);

  const clearCache = useCallback(() => {
    store.clearCache();
    hasFetched.current = {};
  }, [store]);

  return {
    // State
    guidelines: store.guidelines,
    selectedProgramGuidelines: store.selectedProgramGuidelines,
    isLoading: store.isLoading,
    error: store.error,
    selectedProgramId,
    searchQuery,
    userProgramId,
    
    // Actions
    fetchGuidelines,
    fetchGuidelinesForProgram,
    searchGuidelines,
    createGuideline,
    updateGuideline,
    deleteGuideline,
    getGuidelinesByProgram,
    getGuidelineById,
    setSelectedProgramId,
    setSearchQuery,
    clearError,
    clearCache,
  };
};