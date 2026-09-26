
import React from 'react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export const TimetableErrorState: React.FC<Props> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 shadow-sm">
      <svg
        className="w-7 h-7 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.33 16a2 2 0 001.74 3z"
        />
      </svg>
    </div>
    <p className="text-xs font-bold text-slate-600 mb-4 max-w-sm uppercase tracking-wider">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1e3a5f] bg-[#FDB813] hover:bg-[#e5a40f] rounded-xl transition-all shadow-md shadow-[#FDB813]/20"
      >
        Try again
      </button>
    )}
  </div>
);