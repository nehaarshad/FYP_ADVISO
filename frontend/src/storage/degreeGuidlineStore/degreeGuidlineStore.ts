// src/storage/degreeGuidelinesStore/degreeGuidelinesStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { DegreeGuidlineModel } from '@/src/models/degreeGuidlineModel';
import { CreateDegreeGuidelineData, degreeGuidelinesRepository, UpdateDegreeGuidelineData } from '@/src/repositories/degreeGuidlineRepository/degreeGuidlineRepo';

interface DegreeGuidelineState {
  guidelines: DegreeGuidlineModel[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  selectedProgramGuidelines: DegreeGuidlineModel[];

  // Actions
  fetchGuidelines: (programId?: number, search?: string, forceRefresh?: boolean) => Promise<void>;
  createGuideline: (data: CreateDegreeGuidelineData) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateGuideline: (id: number, data: UpdateDegreeGuidelineData) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteGuideline: (id: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  getGuidelineById: (id: number) => DegreeGuidlineModel | undefined;
  getGuidelinesByProgram: (programId: number) => DegreeGuidlineModel[];
  clearError: () => void;
  clearCache: () => void;
  clearSelectedProgramGuidelines: () => void;
}

export const useDegreeGuidelineStore = create<DegreeGuidelineState>((set, get) => ({
  guidelines: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  selectedProgramGuidelines: [],

  fetchGuidelines: async (programId?: number, search?: string, forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await degreeGuidelinesRepository.getAllGuidelines(forceRefresh);
      
      if (response.success && response.data) {
        set({ 
          guidelines: response.data, 
          isLoading: false,
          lastFetched: Date.now()
        });

        // If programId is provided, update selectedProgramGuidelines
        if (programId) {
          const programGuidelines = response.data.filter(g => g.programId === programId);
          set({ selectedProgramGuidelines: programGuidelines });
        }
      } else {
        set({ 
          error: response.error || 'Failed to fetch guidelines', 
          isLoading: false,
          guidelines: []
        });
      }
    } catch (error: any) {
      console.error('Fetch guidelines error:', error);
      set({ 
        error: error.message || 'Failed to fetch guidelines', 
        isLoading: false,
        guidelines: []
      });
    }
  },

  createGuideline: async (data: CreateDegreeGuidelineData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("creating program guidlines: ",data)
      const response = await degreeGuidelinesRepository.createGuideline(data);
      
      if (response.success) {
        // Refresh the guidelines list
        await get().fetchGuidelines(undefined, undefined, true);
        
        return { 
          success: true, 
          message: response.message || 'Guideline created successfully'
        };
      } else {
        set({ error: response.error || 'Failed to create guideline', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to create guideline'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to create guideline', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to create guideline'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  updateGuideline: async (id: number, data: UpdateDegreeGuidelineData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await degreeGuidelinesRepository.updateGuideline(id, data);
      
      if (response.success) {
        // Refresh the guidelines list
        await get().fetchGuidelines(undefined, undefined, true);
        
        return { 
          success: true, 
          message: response.message || 'Guideline updated successfully'
        };
      } else {
        set({ error: response.error || 'Failed to update guideline', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to update guideline'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update guideline', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to update guideline'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGuideline: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await degreeGuidelinesRepository.deleteGuideline(id);
      
      if (response.success) {
        // Remove from local state and refresh
        const { guidelines } = get();
        set({ 
          guidelines: guidelines.filter(g => g.id !== id),
          isLoading: false
        });
        
        // Refresh to ensure consistency
        await get().fetchGuidelines(undefined, undefined, true);
        
        return { 
          success: true, 
          message: response.message || 'Guideline deleted successfully'
        };
      } else {
        set({ error: response.error || 'Failed to delete guideline', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to delete guideline'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete guideline', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to delete guideline'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  getGuidelineById: (id: number) => {
    const { guidelines } = get();
    return guidelines.find(guideline => guideline.id === id);
  },

  getGuidelinesByProgram: (programId: number) => {
    const { guidelines } = get();
    return guidelines.filter(guideline => guideline.programId === programId);
  },

  clearError: () => set({ error: null }),
  
  clearCache: () => {
    degreeGuidelinesRepository.clearCache();
    set({ guidelines: [], lastFetched: null, selectedProgramGuidelines: [] });
  },

  clearSelectedProgramGuidelines: () => set({ selectedProgramGuidelines: [] }),
}));