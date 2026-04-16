
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { Student } from '@/src/models/studentModel';
import { FilterOptions } from "../../utilits/filterOptions/studentsFilter/studentsFilterOption";
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
  addStudent: (student: Student) => void;
  updateStudent: (id: number, updatedData: Partial<Student>) => void;
  bulkAddStudents: (students: Student[]) => void;
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
      const response: any = await studentProfileRepository.fetchAllStudents(forceRefresh);
      console.log("fetch all students: ",response)
      let studentsArray: Student[] = [];
      if (Array.isArray(response)) {
        studentsArray = response;
      } else if (response && 'data' in response && Array.isArray(response.data)) {
        studentsArray = response.data;
      } else {
        studentsArray = [];
      }
      
      const statistics = {
        totalStudents: studentsArray.length,
        activeStudents: studentsArray.filter(s => s.User?.isActive === true).length,
        inactiveStudents: studentsArray.filter(s => s.User?.isActive === false).length,
      };
      
      set({ 
        students: studentsArray, 
        filteredStudents: studentsArray,
        statistics,
        isLoading: false 
      });
      
      get().applyFilters();
    } catch (error: any) {
      console.error('Fetch students error:', error);
      set({ 
        error: error.message || 'Failed to fetch students', 
        isLoading: false,
        students: [],
        filteredStudents: []
      });
    }
  },

  addStudent: (student: Student) => {
    set((state) => {
      const newStudents = [student, ...state.students];
      const newStatistics = {
        totalStudents: newStudents.length,
        activeStudents: newStudents.filter(s => s.User?.isActive === true).length,
        inactiveStudents: newStudents.filter(s => s.User?.isActive === false).length,
      };
      return {
        students: newStudents,
        filteredStudents: newStudents,
        statistics: newStatistics,
      };
    });
    get().applyFilters();
  },

  bulkAddStudents: (newStudents: Student[]) => {
    set((state) => {
      const updatedStudents = [...newStudents, ...state.students];
      const newStatistics = {
        totalStudents: updatedStudents.length,
        activeStudents: updatedStudents.filter(s => s.User?.isActive === true).length,
        inactiveStudents: updatedStudents.filter(s => s.User?.isActive === false).length,
      };
      return {
        students: updatedStudents,
        filteredStudents: updatedStudents,
        statistics: newStatistics,
      };
    });
    get().applyFilters();
  },

  updateStudent: (id: number, updatedData: Partial<Student>) => {
    set((state) => {
      const updatedStudents = state.students.map(student =>
        student.id === id ? { ...student, ...updatedData } : student
      );
      const newStatistics = {
        totalStudents: updatedStudents.length,
        activeStudents: updatedStudents.filter(s => s.User?.isActive === true).length,
        inactiveStudents: updatedStudents.filter(s => s.User?.isActive === false).length,
      };
      return {
        students: updatedStudents,
        filteredStudents: updatedStudents,
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
    const { students, filters } = get();
    if (students && Array.isArray(students) && students.length > 0) {
      const filtered = studentProfileRepository.filterStudents(students, filters);
      set({ filteredStudents: filtered });
    } else {
      set({ filteredStudents: [] });
    }
  },

  getStudentById: (id: number) => {
    const { students } = get();
    if (students && Array.isArray(students)) {
      return students.find(student => student.id === id);
    }
    return undefined;
  },

  getStudentBySapId: (sapid: number) => {
    const { students } = get();
    if (students && Array.isArray(students)) {
      return students.find(student => student.User?.sapid === sapid);
    }
    return undefined;
  },

  clearError: () => set({ error: null }),
}));