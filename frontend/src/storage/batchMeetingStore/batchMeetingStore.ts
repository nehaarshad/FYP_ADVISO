/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { batchMeetingRepository } from '../../repositories/batchMeetingRepository/batchMeetingRepository';
import { BatchMeeting } from '../../models/batchMeetingModel';
import {
  CreateMeetingPayload,
  MeetingSuggestion,
  UpdateMeetingPayload,
} from '../../repositories/batchMeetingRepository/types/batchMeetingTypes';

const asArray = <T,>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  const nested = (v as any)?.data;
  if (Array.isArray(nested)) return nested as T[];
  return [];
};

interface BatchMeetingState {
  suggestions: MeetingSuggestion[];
  meetings: BatchMeeting[];
  isLoading: boolean;
  isLoadingSuggestions: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchSuggestions: (userId: number, forceRefresh?: boolean) => Promise<void>;
  fetchMeetings: (userId: number, forceRefresh?: boolean) => Promise<void>;
  createMeeting: (
    payload: CreateMeetingPayload
  ) => Promise<{ success: boolean; message?: string; error?: string; data?: BatchMeeting }>;
  updateMeeting: (
    id: number,
    payload: UpdateMeetingPayload
  ) => Promise<{ success: boolean; message?: string; error?: string; data?: BatchMeeting }>;
  getMeetingById: (id: number) => BatchMeeting | undefined;
  clearError: () => void;
  clearCache: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

export const useBatchMeetingStore = create<BatchMeetingState>((set, get) => ({
  suggestions: [],
  meetings: [],
  isLoading: false,
  isLoadingSuggestions: false,
  error: null,
  lastFetched: null,

 fetchSuggestions: async (userId, forceRefresh = false) => {
  const { lastFetched, suggestions } = get();
  const valid =
    lastFetched !== null &&
    Date.now() - lastFetched < CACHE_TTL_MS &&
    suggestions.length > 0;
  if (!forceRefresh && valid) return;

  set({ isLoadingSuggestions: true, error: null });
  try {
    const response = await batchMeetingRepository.getSuggestions(userId);

    if (response.success) {
      set({
        suggestions: Array.isArray(response.data) ? response.data : [],
        isLoadingSuggestions: false,
        lastFetched: Date.now(),
      });
    } else {
      set({
        error: response.error || 'Failed to load suggestions',
        isLoadingSuggestions: false,
        suggestions: [],
      });
    }
  } catch (error: any) {
    set({
      error: error.message || 'Failed to load suggestions',
      isLoadingSuggestions: false,
      suggestions: [],
    });
  }
},
  fetchMeetings: async (userId, forceRefresh = false) => {
    const { lastFetched, meetings } = get();
    const valid =
      lastFetched !== null &&
      Date.now() - lastFetched < CACHE_TTL_MS &&
      meetings.length > 0;
    if (!forceRefresh && valid) return;

    set({ isLoading: true, error: null });
    try {
      const response = await batchMeetingRepository.getMeetingsForAdvisor(userId);
      if (response.success) {
        set({
          meetings: asArray<BatchMeeting>(response.data),
          isLoading: false,
          lastFetched: Date.now(),
        });
      } else {
        set({
          error: response.error || 'Failed to load meetings',
          isLoading: false,
          meetings: [],
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load meetings',
        isLoading: false,
        meetings: [],
      });
    }
  },

  createMeeting: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchMeetingRepository.createMeeting(payload);
      if (response.success && response.data) {
        // Optimistic add
        set((state) => ({
          meetings: [response.data as BatchMeeting, ...asArray<BatchMeeting>(state.meetings)],
          isLoading: false,
        }));
        // Refresh suggestions (slot may be consumed)
        await get().fetchSuggestions(payload.userId, true);
        return {
          success: true,
          message: 'Meeting scheduled as pending',
          data: response.data,
        };
      }
      set({ error: response.error || 'Failed to create meeting', isLoading: false });
      return { success: false, error: response.error || 'Failed to create meeting' };
    } catch (error: any) {
      set({ error: error.message || 'Failed to create meeting', isLoading: false });
      return { success: false, error: error.message || 'Failed to create meeting' };
    }
  },

  updateMeeting: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchMeetingRepository.updateMeeting(id, payload);
      if (response.success && response.data) {
        const updated = response.data;
        set((state) => ({
          meetings: asArray<BatchMeeting>(state.meetings).map((m) =>
            m.id === id ? updated : m
          ),
          isLoading: false,
        }));
        return { success: true, message: 'Meeting updated', data: updated };
      }
      set({ error: response.error || 'Failed to update meeting', isLoading: false });
      return { success: false, error: response.error || 'Failed to update meeting' };
    } catch (error: any) {
      set({ error: error.message || 'Failed to update meeting', isLoading: false });
      return { success: false, error: error.message || 'Failed to update meeting' };
    }
  },

  getMeetingById: (id) => asArray<BatchMeeting>(get().meetings).find((m) => m.id === id),

  clearError: () => set({ error: null }),

  clearCache: () => {
    set({ suggestions: [], meetings: [], lastFetched: null });
  },
}));