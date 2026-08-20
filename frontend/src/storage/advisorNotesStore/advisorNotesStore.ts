/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

import {AdvisorNote,} from '@/src/models/AdvisorNotes';

import { advisorNotesRepository } from '@/src/repositories/advisorNotesRepository/advisorNotesRepo';
import { CreateAdvisorNoteData, UpdateAdvisorNoteData } from '@/src/hooks/advisorNotesHook/types/advisorNoteType';

interface AdvisorNotesState {
  notes: AdvisorNote[];

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  error: string | null;

  fetchNotes: (
    advisorId: number,
    forceRefresh?: boolean
  ) => Promise<any>;

  createNote: (
    data: CreateAdvisorNoteData
  ) => Promise<any>;

  updateNote: (
    data: UpdateAdvisorNoteData
  ) => Promise<any>;

  deleteNote: (
    id: number
  ) => Promise<any>;

  getNoteById: (
    id: number
  ) => AdvisorNote | undefined;

  clearError: () => void;

  clearCache: () => void;

  clearNotes: () => void;
}

export const useAdvisorNotesStore = create<AdvisorNotesState>(
  (set, get) => ({
    notes: [],

    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    error: null,

    fetchNotes: async (
      advisorId: number,
      forceRefresh: boolean = false
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await advisorNotesRepository.getNotes(
            {
              userId:advisorId,
            },
            forceRefresh
          );

        if (response.success) {
          set({
            notes: response.data || [],
            isLoading: false,
            error: null,
          });
        } else {
          set({
            notes: [],
            isLoading: false,
            error: response.error || 'Failed to fetch notes',
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch notes';

        set({
          notes: [],
          isLoading: false,
          error: errorMessage,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    // ============================================================
    // CREATE NOTE
    // ============================================================

    createNote: async (
      data: CreateAdvisorNoteData
    ) => {
      set({
        isCreating: true,
        error: null,
      });

      try {
        const response =
          await advisorNotesRepository.createNote(data);

        if (response.success) {
          set({
            isCreating: false,
          });
        } else {
          set({
            isCreating: false,
            error:
              response.error ||
              'Failed to create note',
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create note';

        set({
          isCreating: false,
          error: errorMessage,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    // ============================================================
    // UPDATE NOTE
    // ============================================================

    updateNote: async (
      data: UpdateAdvisorNoteData
    ) => {
      set({
        isUpdating: true,
        error: null,
      });

      try {
        const response =
          await advisorNotesRepository.updateNote(data);

        if (response.success) {
          set({
            isUpdating: false,
          });
        } else {
          set({
            isUpdating: false,
            error:
              response.error ||
              'Failed to update note',
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update note';

        set({
          isUpdating: false,
          error: errorMessage,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    // ============================================================
    // DELETE NOTE
    // ============================================================

    deleteNote: async (
      id: number
    ) => {
      set({
        isDeleting: true,
        error: null,
      });

      try {
        const response =
          await advisorNotesRepository.deleteNote(id);

        if (response.success) {
          set(state => ({
            notes: state.notes.filter(
              note => Number(note.id) !== Number(id)
            ),
            isDeleting: false,
          }));
        } else {
          set({
            isDeleting: false,
            error:
              response.error ||
              'Failed to delete note',
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete note';

        set({
          isDeleting: false,
          error: errorMessage,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    // ============================================================
    // GET NOTE BY ID
    // ============================================================

    getNoteById: (id: number) => {
      return get().notes.find(
        note => Number(note.id) === Number(id)
      );
    },

    // ============================================================
    // CLEAR ERROR
    // ============================================================

    clearError: () => {
      set({
        error: null,
      });
    },

    // ============================================================
    // CLEAR CACHE
    // ============================================================

    clearCache: () => {
      advisorNotesRepository.clearCache();

      set({
        notes: [],
      });
    },

    // ============================================================
    // CLEAR NOTES
    // ============================================================

    clearNotes: () => {
      set({
        notes: [],
      });
    },
  })
);