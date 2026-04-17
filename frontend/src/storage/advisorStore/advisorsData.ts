
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
  isInitialized: boolean;

  fetchAdvisors: (forceRefresh?: boolean) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  updateAdvisor : (id: number, updatedData: any)=>void;
  getAdvisorById: (id: number) => BatchAdvisor | undefined;
  getAdvisorBySapId: (sapid: number) => BatchAdvisor | undefined;
  clearError: () => void;
  reset: () => void;
}

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  advisors: [],
  filteredAdvisors: [],
  isLoading: false,
  error: null,
  filters: {},
  statistics: null,
  isInitialized: false,

  fetchAdvisors: async (forceRefresh = false) => {
   
    const { isLoading, isInitialized } = get();
    if (isLoading) return;
    if (isInitialized && !forceRefresh) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await advisorProfileRepository.fetchAllAdvisors(forceRefresh);
      
      let advisorsArray: BatchAdvisor[] = [];
      if (Array.isArray(response)) {
        advisorsArray = response;
      } else if (response && 'data' in (response as any) && Array.isArray((response as any).data)) {
        advisorsArray = (response as any).data;
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
        isLoading: false,
        isInitialized: true
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

  updateAdvisor: (id: number, updatedData: any) => {
  set((state) => {
    const updatedAdvisors = state.advisors.map((advisor) =>
      advisor.id === id
        ? {
            ...advisor,
            ...updatedData,
            User: {
              ...advisor.User,
              isActive: updatedData.isCurrentlyAdvised
            }
          }
        : advisor
    );

    return {
      advisors: updatedAdvisors,
      filteredAdvisors: updatedAdvisors
    };
  });
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
  
  reset: () => {
    set({ 
      advisors: [], 
      filteredAdvisors: [], 
      isLoading: false, 
      error: null, 
      filters: {}, 
      statistics: null, 
      isInitialized: false 
    });
  },
}));