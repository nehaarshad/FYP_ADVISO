
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import { FilterOptions } from "../../utilits/filterOptions/studentsFilter/studentsFilterOption";
import { advisorProfileRepository } from '../../repositories/userProfileData/advisorsRepository/advisorRepository';

interface AdvisorState {
  advisors: BatchAdvisor[];
  filteredAdvisors: BatchAdvisor[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  statistics: any | null;

  // Actions
  fetchAdvisors: (forceRefresh?: boolean) => Promise<void>;
  addAdvisor: (advisor: BatchAdvisor) => void;
  updateAdvisor: (id: number, updatedData: Partial<BatchAdvisor>) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  getAdvisorById: (id: number) => BatchAdvisor | undefined;
  getAdvisorBySapId: (sapid: number) => BatchAdvisor | undefined;
  clearError: () => void;
}

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  advisors: [],
  filteredAdvisors: [],
  isLoading: false,
  error: null,
  filters: {},
  statistics: null,

  fetchAdvisors: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await advisorProfileRepository.fetchAllAdvisors(forceRefresh);
      console.log("Fetch all advisors: ",response)
      let advisorsArray: BatchAdvisor[] = [];
      if (Array.isArray(response)) {
        advisorsArray = response;
      } else if (response !== null && typeof response === 'object' && 'data' in response && Array.isArray((response as { data: unknown }).data)) {
        advisorsArray = (response as { data: BatchAdvisor[] }).data;
      } else {
        advisorsArray = [];
      }
      
      const statistics = {
        totalAdvisors: advisorsArray.length,
        activeAdvisors: advisorsArray.filter(a => a.User?.isActive === true).length,
        inactiveAdvisors: advisorsArray.filter(a => a.User?.isActive === false).length,
      };
      
      set({ 
        advisors: advisorsArray, 
        filteredAdvisors: advisorsArray,
        statistics,
        isLoading: false 
      });
      
      get().applyFilters();
    } catch (error: any) {
      console.error('Fetch advisors error:', error);
      set({ 
        error: error.message || 'Failed to fetch advisors', 
        isLoading: false,
        advisors: [],
        filteredAdvisors: []
      });
    }
  },

  addAdvisor: (advisor: BatchAdvisor) => {
    set((state) => {
      const newAdvisors = [advisor, ...state.advisors];
      const newStatistics = {
        totalAdvisors: newAdvisors.length,
        activeAdvisors: newAdvisors.filter(a => a.User?.isActive === true).length,
        inactiveAdvisors: newAdvisors.filter(a => a.User?.isActive === false).length,
      };
      return {
        advisors: newAdvisors,
        filteredAdvisors: newAdvisors,
        statistics: newStatistics,
      };
    });
    get().applyFilters();
  },

  updateAdvisor: (id: number, updatedData: Partial<BatchAdvisor>) => {
    set((state) => {
      const updatedAdvisors = state.advisors.map(advisor =>
        advisor.id === id ? { ...advisor, ...updatedData } : advisor
      );
      const newStatistics = {
        totalAdvisors: updatedAdvisors.length,
        activeAdvisors: updatedAdvisors.filter(a => a.User?.isActive === true).length,
        inactiveAdvisors: updatedAdvisors.filter(a => a.User?.isActive === false).length,
      };
      return {
        advisors: updatedAdvisors,
        filteredAdvisors: updatedAdvisors,
        statistics: newStatistics,
      };
    });
    get().applyFilters();
  },

  setFilters: (filters: Partial<FilterOptions>) => {
    set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },

  applyFilters: () => {
    const { advisors, filters } = get();
    if (advisors && Array.isArray(advisors) && advisors.length > 0) {
      const filtered = advisorProfileRepository.filterAdvisors(advisors, filters);
      set({ filteredAdvisors: filtered });
    } else {
      set({ filteredAdvisors: [] });
    }
  },

  getAdvisorById: (id: number) => {
    const { advisors } = get();
    if (advisors && Array.isArray(advisors)) {
      return advisors.find(advisor => advisor.id === id);
    }
    return undefined;
  },

  getAdvisorBySapId: (sapid: number) => {
    const { advisors } = get();
    if (advisors && Array.isArray(advisors)) {
      return advisors.find(advisor => advisor.User?.sapid === sapid);
    }
    return undefined;
  },

  clearError: () => set({ error: null }),
}));