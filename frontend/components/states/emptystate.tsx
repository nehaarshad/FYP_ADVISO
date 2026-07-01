import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
      {icon || <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />}
      <p className="text-slate-500 font-bold">{title}</p>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}