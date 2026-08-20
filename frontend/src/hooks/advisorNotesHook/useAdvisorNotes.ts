import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import {
  CreateAdvisorNoteData,
  UpdateAdvisorNoteData,
} from './types/advisorNoteType';

import { useAdvisorNotesStore } from '@/src/storage/advisorNotesStore/advisorNotesStore';

export const useAdvisorNotes = (
  advisorId?: number,
  batchId?: number
) => {
  const {
    notes,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,

    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,

    clearError,
    clearCache,
    clearNotes,
  } = useAdvisorNotesStore();

  useEffect(() => {
    if (!advisorId) {
      return;
    }

    fetchNotes(advisorId,);
  }, [advisorId, ]);


  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [notes]);

  const addNewNote = useCallback(
    async (
      title: string,
      noteContent: string
    ) => {
      if (!advisorId) {
        return {
          success: false,
          error: 'Advisor ID is required',
        };
      }

      if (!title.trim()) {
        return {
          success: false,
          error: 'Note title is required',
        };
      }

      if (!noteContent.trim()) {
        return {
          success: false,
          error: 'Note content is required',
        };
      }

      const data: CreateAdvisorNoteData = {
        userId:advisorId,
        title: title.trim(),
        noteContent: noteContent.trim(),
      };

      const response = await createNote(data);

      // Refresh after successful creation
      if (response.success) {
        await fetchNotes(
          advisorId,
          true
        );
      }

      return response;
    },
    [
      advisorId,
      batchId,
      createNote,
      fetchNotes,
    ]
  );


  const modifyNote = useCallback(
    async (
      id: number,
      title: string,
      noteContent: string
    ) => {
      if (!advisorId) {
        return {
          success: false,
          error: 'Advisor ID is required',
        };
      }

      if (!id) {
        return {
          success: false,
          error: 'Note ID is required',
        };
      }

      if (!title.trim()) {
        return {
          success: false,
          error: 'Note title is required',
        };
      }

      if (!noteContent.trim()) {
        return {
          success: false,
          error: 'Note content is required',
        };
      }

      const data: UpdateAdvisorNoteData = {
        id,
        userId:advisorId,
        title: title.trim(),
        noteContent: noteContent.trim(),
      };

      const response =
        await updateNote(data);

      if (response.success) {
        await fetchNotes(
          advisorId,
          true
        );
      }

      return response;
    },
    [
      advisorId,
      batchId,
      updateNote,
      fetchNotes,
    ]
  );

  const removeNote = useCallback(
    async (id: number) => {
      if (!id) {
        return {
          success: false,
          error: 'Note ID is required',
        };
      }

      return await deleteNote(id);
    },
    [deleteNote]
  );

  const refreshNotes = useCallback(
    async () => {
      if (!advisorId) {
        return {
          success: false,
          error: 'Advisor ID is required',
        };
      }

      return await fetchNotes(
        advisorId,
        true
      );
    },
    [
      advisorId,
      batchId,
      fetchNotes,
    ]
  );

  return {
    notes: sortedNotes,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    totalCount: notes.length,
    fetchNotes: refreshNotes,
    addNewNote,
    modifyNote,
    removeNote,
    getNoteById,
    clearError,
    clearCache,
    clearNotes,
  };
};