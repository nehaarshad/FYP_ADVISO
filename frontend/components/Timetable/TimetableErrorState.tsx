import React from 'react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export const TimetableErrorState: React.FC<Props> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
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
    <p className="text-sm text-gray-700 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
      >
        Try again
      </button>
    )}
  </div>
);