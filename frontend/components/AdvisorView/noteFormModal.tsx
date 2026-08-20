// components/AdvisorView/NoteFormModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { NoteFormProps } from '@/src/hooks/advisorNotesHook/types/advisorNoteType';
import { useNoteForm } from '@/src/hooks/advisorNotesHook/useNoteForm';

export const NoteFormModal: React.FC<NoteFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false,
  isSaving = false
}) => {
  const {
    formData,
    isFormValid,
    updateField,
    resetForm,
    setForm
  } = useNoteForm(initialData);

  // Pre-populate form when editing
  useEffect(() => {
    if (isOpen && initialData) {
      setForm(initialData);
    } else if (isOpen && !initialData) {
      resetForm();
    }
  }, [isOpen, initialData, setForm, resetForm]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await onSave(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/20 backdrop-blur-md">
      <div className="animate-in zoom-in-95 fade-in duration-300 w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
          disabled={isSaving}
        >
          <X size={20} />
        </button>
        
        <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h3>

        <div className="space-y-4">

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest">
              Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none transition-all"
              placeholder="Enter note title..."
              disabled={isSaving}
              maxLength={100}
              autoFocus={isOpen}
            />
            <p className="text-[8px] text-slate-400 text-right">
              {formData.title.length}/100
            </p>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={4} 
              value={formData.content} 
              onChange={(e) => updateField('content', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none resize-none transition-all"
              placeholder="Write your note details..."
              disabled={isSaving}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleClose}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-[#1e3a5f] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:bg-[#2a4a6f] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !isFormValid}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Check size={14} strokeWidth={3} />
                  {isEditing ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};