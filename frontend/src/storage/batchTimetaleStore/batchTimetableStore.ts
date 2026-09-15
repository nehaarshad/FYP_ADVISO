/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { batchTimetableRepository } from '../../repositories/meetingSchedulingRepo/batchTimetableRepo/batchTimetableRoute';
import { BatchTimetable } from '../../models/batchTimetableModel';
import {
  AddBatchTimetablePayload,
  UpdateBatchTimetablePayload,
} from '../../repositories/meetingSchedulingRepo/batchTimetableRepo/types/type';


const asArray = <T,>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  const nested = (v as any)?.data;
  if (Array.isArray(nested)) return nested as T[];
  return [];
};


interface BatchTimetableState {
  timetables: BatchTimetable[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchBatchTimetable: (
    userId: number,
    forceRefresh?: boolean
  ) => Promise<void>;
  addBatchTimetable: (
    payload: AddBatchTimetablePayload
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateBatchTimetable: (
    payload: UpdateBatchTimetablePayload
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteBatchTimetable: (
    id: number,
    userId: number
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  getTimetableById: (id: number) => BatchTimetable | undefined;
  clearError: () => void;
  clearCache: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const useBatchTimetableStore = create<BatchTimetableState>((set, get) => ({
  timetables: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchBatchTimetable: async (userId: number, forceRefresh = false) => {
    const { lastFetched, timetables } = get();
    const isCacheValid =
      lastFetched !== null &&
      Date.now() - lastFetched < CACHE_TTL_MS &&
      timetables.length > 0;

    if (!forceRefresh && isCacheValid) return;

    set({ isLoading: true, error: null });
    try {
      const response = await batchTimetableRepository.getBatchTimetable(userId);

      if (response.success && response.data) {
        set({
          timetables: response.data,
          isLoading: false,
          lastFetched: Date.now(),
        });
      } else {
        set({
          error: response.error || 'Failed to fetch batch timetable',
          isLoading: false,
          timetables: [],
        });
      }
    } catch (error: any) {
      console.error('Fetch batch timetable error:', error);
      set({
        error: error.message || 'Failed to fetch batch timetable',
        isLoading: false,
        timetables: [],
      });
    }
  },

  addBatchTimetable: async (payload: AddBatchTimetablePayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchTimetableRepository.addBatchTimetable(payload);

      if (response.success) {
        await get().fetchBatchTimetable(payload.userId, true);
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

  updateBatchTimetable: async (payload: UpdateBatchTimetablePayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchTimetableRepository.updateBatchTimetable(payload);

      if (response.success) {
        await get().fetchBatchTimetable(payload.userId, true);
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

  deleteBatchTimetable: async (id: number, userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchTimetableRepository.deleteBatchTimetable(id, userId);

      if (response.success) {
        set((state) => ({
          timetables: asArray<BatchTimetable>(state.timetables).filter(
            (t) => t.id !== id
          ),
        }));
        await get().fetchBatchTimetable(userId, true);
        return {
          success: true,
          message: (response as any).message || 'Timetable deleted successfully',
        };
      } else {
        set({ error: response.error || 'Failed to delete timetable', isLoading: false });
        return {
          success: false,
          error: response.error || 'Failed to delete timetable',
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete timetable', isLoading: false });
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