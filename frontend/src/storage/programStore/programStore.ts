// src/storage/programsStore/programsData.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import {  programRepository } from '../../repositories/programRepository/programRepository';
import { Program } from '@/src/models/programModel';
import { AddProgramData } from '@/src/repositories/programRepository/types/addProgramData';

interface ProgramState {
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchPrograms: (forceRefresh?: boolean) => Promise<void>;
  addProgram: (data: AddProgramData) => Promise<{ success: boolean; message?: string; error?: string }>;
  getProgramById: (id: number) => Program | undefined;
  getProgramByName: (name: string) => Program | undefined;
  clearError: () => void;
  clearCache: () => void;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchPrograms: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await programRepository.getAllPrograms(forceRefresh);
      
      if (response.success && response.data) {
        set({ 
          programs: response.data, 
          isLoading: false,
          lastFetched: Date.now()
        });
      } else {
        set({ 
          error: response.error || 'Failed to fetch programs', 
          isLoading: false,
          programs: []
        });
      }
    } catch (error: any) {
      console.error('Fetch programs error:', error);
      set({ 
        error: error.message || 'Failed to fetch programs', 
        isLoading: false,
        programs: []
      });
    }
  },

  addProgram: async (data: AddProgramData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await programRepository.addProgram(data);
      
      if (response.success) {
        // Refresh the programs list to include the new program
        await get().fetchPrograms(true);
        
        return { 
          success: true, 
          message: response.message || 'Program added successfully'
        };
      } else {
        set({ error: response.error || 'Failed to add program', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to add program'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to add program', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to add program'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  getProgramById: (id: number) => {
    const { programs } = get();
    return programs.find(program => program.id === id);
  },

  getProgramByName: (name: string) => {
    const { programs } = get();
    return programs.find(program => 
      program.programName.toLowerCase() === name.toLowerCase()
    );
  },

  clearError: () => set({ error: null }),
  
  clearCache: () => {
    programRepository.clearCache();
    set({ programs: [], lastFetched: null });
  },
}));