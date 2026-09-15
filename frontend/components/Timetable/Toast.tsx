import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Props {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const styles: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-900',
};

export const Toast: React.FC<Props> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div
        className={`${styles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[240px]`}
      >
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};