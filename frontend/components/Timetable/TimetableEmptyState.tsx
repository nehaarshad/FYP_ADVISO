
import React from 'react';

interface Props {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const TimetableEmptyState: React.FC<Props> = ({
  title = 'No timetable entries yet',
  description = 'Add your class schedule to see it here.',
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
      <svg
        className="w-8 h-8 text-[#1e3a5f]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight mb-1">{title}</h3>
    <p className="text-xs font-medium text-slate-400 mb-6 max-w-sm leading-relaxed uppercase tracking-wider">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-[#FDB813] hover:bg-[#e5a40f] text-[#1e3a5f] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FDB813]/20 flex items-center gap-2"
      >
        <span className="text-sm font-bold">+</span> {actionLabel}
      </button>
    )}
  </div>
);