/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

import { Student } from '@/src/models/studentModel';
import {FilterOptions} from "../../utilits/filterOptions/studentsFilter/studentsFilterOption"
import { studentProfileRepository } from '../../repositories/userProfileData/studentsRepository/studentsRepo';

interface StudentState {
  students: Student[];
  filteredStudents: Student[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  statistics: any | null;

  // Actions
  fetchStudents: (forceRefresh?: boolean) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  getStudentById: (id: number) => Student | undefined;
  getStudentBySapId: (sapid: number) => Student | undefined;
  clearError: () => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  filteredStudents: [],
  isLoading: false,
  error: null,
  filters: {},
  statistics: null,

  fetchStudents: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const students = await studentProfileRepository.fetchAllStudents(forceRefresh);
      const statistics = studentProfileRepository.getStudentStatistics(students);
      
      set({ 
        students, 
        filteredStudents: students,
        statistics,
        isLoading: false 
      });
      
      // Apply existing filters
      get().applyFilters();
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch students', 
        isLoading: false 
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

  applyFilters: () => {
    const { students, filters } = get();
    const filtered = studentProfileRepository.filterStudents(students, filters);
    set({ filteredStudents: filtered });
  },

  getStudentById: (id: number) => {
    const { students } = get();
    return studentProfileRepository.getStudentById(students, id);
  },

  getStudentBySapId: (sapid: number) => {
    const { students } = get();
    return studentProfileRepository.getStudentBySapId(students, sapid);
  },

  clearError: () => set({ error: null }),
}));