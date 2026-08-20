// components/AdvisorView/DeleteConfirmModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { DeleteConfirmModalProps } from '@/src/hooks/advisorNotesHook/types/advisorNoteType';

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  note,
  onConfirm,
  onCancel,
  isDeleting
}) => {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 fade-in duration-200 w-full max-w-sm bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tighter mb-2">
            Delete Note
          </h3>
          <p className="text-sm text-slate-500 font-medium mb-6">
            `Are you sure you want to delete &quot;{note.title}&quot;? This action cannot be undone.`
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};