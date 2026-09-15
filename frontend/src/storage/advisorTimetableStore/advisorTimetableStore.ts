/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { advisorTimetableRepository } from '../../repositories/meetingSchedulingRepo/advisorTimetableRepo/advisorTimetableRoute';
import { AdvisorTimetable } from '../../models/advisorTimetableModel';
import {
  AddAdvisorTimetablePayload,
  UpdateAdvisorTimetablePayload,
} from '../../repositories/meetingSchedulingRepo/advisorTimetableRepo/types/type';

const asArray = <T,>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  const nested = (v as any)?.data;
  if (Array.isArray(nested)) return nested as T[];
  return [];
};

interface AdvisorTimetableState {
  timetables: AdvisorTimetable[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchAdvisorTimetable: (
    userId: number,
    forceRefresh?: boolean
  ) => Promise<void>;
  addAdvisorTimetable: (
    payload: AddAdvisorTimetablePayload
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateAdvisorTimetable: (
    payload: UpdateAdvisorTimetablePayload
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteAdvisorTimetable: (
    id: number,
    userId: number
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  getTimetableById: (id: number) => AdvisorTimetable | undefined;
  clearError: () => void;
  clearCache: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

export const useAdvisorTimetableStore = create<AdvisorTimetableState>((set, get) => ({
  timetables: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchAdvisorTimetable: async (userId: number, forceRefresh = false) => {
    const { lastFetched, timetables } = get();
    const isCacheValid =
      lastFetched !== null &&
      Date.now() - lastFetched < CACHE_TTL_MS &&
      timetables.length > 0;

    if (!forceRefresh && isCacheValid) return;

    set({ isLoading: true, error: null });
    try {
      const response = await advisorTimetableRepository.getAdvisorTimetable(userId);

      if (response.success && response.data) {
        set({
          timetables: response.data,
          isLoading: false,
          lastFetched: Date.now(),
        });
      } else {
        set({
          error: response.error || 'Failed to fetch advisor timetable',
          isLoading: false,
          timetables: [],
        });
      }
    } catch (error: any) {
      console.error('Fetch advisor timetable error:', error);
      set({
        error: error.message || 'Failed to fetch advisor timetable',
        isLoading: false,
        timetables: [],
      });
    }
  },

  addAdvisorTimetable: async (payload: AddAdvisorTimetablePayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await advisorTimetableRepository.addAdvisorTimetable(payload);

      if (response.success) {
        await get().fetchAdvisorTimetable(payload.userId, true);
        return {
          success: true,
          message: (response as any).message || 'Timetable added successfully',
        };
      } else {
        set({ error: response.error || 'Failed to add timetable', isLoading: false });
        return {
          success: false,
          error: response.error || 'Failed to add timetable',
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to add timetable', isLoading: false });
      return {
        success: false,
        error: error.message || 'Failed to add timetable',
      };
    }
  },

  updateAdvisorTimetable: async (payload: UpdateAdvisorTimetablePayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await advisorTimetableRepository.updateAdvisorTimetable(payload);

      if (response.success) {
        await get().fetchAdvisorTimetable(payload.userId, true);
        return {
          success: true,
          message: (response as any).message || 'Timetable updated successfully',
        };
      } else {
        set({ error: response.error || 'Failed to update timetable', isLoading: false });
        return {
          success: false,
          error: response.error || 'Failed to update timetable',
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update timetable', isLoading: false });
      return {
        success: false,
        error: error.message || 'Failed to update timetable',
      };
    }
  },

  deleteAdvisorTimetable: async (id: number, userId: number) => {
  set({ isLoading: true, error: null });
  try {
    const response = await advisorTimetableRepository.deleteAdvisorTimetable(id, userId);

    if (response.success) {
      // Safe optimistic removal
      set((state) => ({
        timetables: asArray<AdvisorTimetable>(state.timetables).filter(
          (t) => t.id !== id
        ),
      }));

      // Refresh from server (source of truth)
      await get().fetchAdvisorTimetable(userId, true);

      return {
        success: true,
        message: (response as any).message || 'Timetable deleted successfully',
      };
    }

    set({
      error: response.error || 'Failed to delete timetable',
      isLoading: false,
    });
    return {
      success: false,
      error: response.error || 'Failed to delete timetable',
    };
  } catch (error: any) {
    set({
      error: error.message || 'Failed to delete timetable',
      isLoading: false,
    });
    return {
      success: false,
      error: error.message || 'Failed to delete timetable',
    };
  }
},

  getTimetableById: (id: number) => {
    return get().timetables.find((t) => t.id === id);
  },

  clearError: () => set({ error: null }),

  clearCache: () => {
    set({ timetables: [], lastFetched: null });
  },
}));