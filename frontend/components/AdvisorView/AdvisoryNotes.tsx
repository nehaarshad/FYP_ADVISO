/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import { 
  Plus, Clock, FileText, Tag, X, Check, Edit2, ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import { useAdvisorNotes } from '@/src/hooks/advisorNotesHook/useAdvisorNotes';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { AdvisorNote } from '@/src/models/AdvisorNotes';
import { NoteFormData } from '@/src/hooks/advisorNotesHook/types/advisorNoteType';
import { LoadingState } from '../states/loadingState';
import { NoteCard } from './noteCard';
import { EmptyState } from '../states/emptystate';
import { NoteFormModal } from './noteFormModal';
import { DeleteConfirmModal } from './deleteNote';
import { NotesEmptyState } from './emptyState';


interface AdvisoryNotesProps {
  onBack: () => void;
  batchId?: number;
}

export default function AdvisoryNotes({ onBack, batchId }: AdvisoryNotesProps) {
  const [advisorId, setAdvisorId] = useState<number | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AdvisorNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<AdvisorNote | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get advisor ID on component mount
  useEffect(() => {
    const currentUser = sessionManager.getCurrentUser<any>();
    console.log("Current user in AdvisoryNotes: ", currentUser);
    
    const id = currentUser?.data?.id || 
               currentUser?.id || 
               currentUser?.userId || 
               (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}')?.data?.id : undefined);
    
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdvisorId(Number(id));
    } else {
      console.error('Could not find advisor ID');
    }
  }, []);

  const {
    notes,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    addNewNote,
    modifyNote,
    removeNote,
    clearError
  } = useAdvisorNotes(advisorId, batchId);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) clearError();
    };
  }, [error, clearError]);

  // --- Event Handlers ---
  const handleAddNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: AdvisorNote) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = (note: AdvisorNote) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNote(null);
    if (error) clearError();
  };

  const handleFormSave = async (formData: NoteFormData) => {
    let response;
    
    if (editingNote) {
      response = await modifyNote(
        editingNote.id,
        formData.title.trim(),
        formData.content.trim()
      );
    } else {
      response = await addNewNote(
        formData.title.trim(),
        formData.content.trim()
      );
    }

    if (!response.success) {
      console.error('Error saving note:', response.error);
      throw new Error(response.error || 'Failed to save note');
    }

    handleFormClose();
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

console.log(' deleting note:', noteToDelete.id);
    const response = await removeNote(noteToDelete.id);
    
    if (!response.success) {
      console.error('Error deleting note:', response.error);
      throw new Error(response.error || 'Failed to delete note');
    }

    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  // --- Render ---
  if (isLoading && notes.length === 0) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <div className="relative min-h-screen w-full max-w-[1200px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
              ADVISOR NOTES
            </h2>
            {batchId && (
              <p className="text-sm text-gray-500 mt-1">Filtering by batch: {batchId}</p>
            )}
          </div>
          
          <button
            onClick={handleAddNote}
            className="bg-[#1e3a5f] text-white px-4 md:px-6 py-2.5 rounded-xl font-black text-[10px] md:text-[12px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#2a4a6f] transition-colors shadow-lg"
          >
            <Plus size={16} strokeWidth={3} />
            New Note
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span className="flex-1 text-sm font-medium">{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Notes Grid or Empty State */}
      {notes.length === 0 && !isLoading ? (
        <NotesEmptyState onAddNote={handleAddNote} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <NoteFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={editingNote ? {
          id:editingNote.id,
          title: editingNote.title,
          content: editingNote.noteContent,
        } : undefined}
        isEditing={!!editingNote}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        note={noteToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </div>
  );
}