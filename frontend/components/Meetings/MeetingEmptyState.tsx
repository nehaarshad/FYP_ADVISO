
import React from 'react';

interface Props {
  title?: string;
  description?: string;
}

export const MeetingEmptyState: React.FC<Props> = ({
  title = 'No meetings yet',
  description = 'Pick a suggested slot to schedule a meeting with the batch.',
}) => (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight mb-1">{title}</h3>
    <p className="text-xs font-bold text-slate-500 max-w-sm">{description}</p>
  </div>
);