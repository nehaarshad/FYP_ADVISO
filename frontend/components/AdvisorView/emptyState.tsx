// components/AdvisorView/EmptyState.tsx
"use client";
import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  onAddNote: () => void;
}

export const NotesEmptyState: React.FC<EmptyStateProps> = ({ onAddNote }) => {
  return (
    <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText size={32} className="text-slate-300" />
      </div>
      <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tighter mb-2">
        No Notes Yet
      </h3>
      <p className="text-sm text-slate-400 font-medium mb-6">
        Click the &quot;New Note&quot; button to create your first advisory note.
      </p>
      <button
        onClick={onAddNote}
        className="bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2a4a6f] transition-colors shadow-lg"
      >
        Create Your First Note
      </button>
    </div>
  );
};