
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';
import { formatTime12, formatDuration } from './types';

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const isSameWeekday = (iso: string, day: string) =>
  DAY_NAMES[new Date(iso + 'T00:00:00').getDay()] === day;

interface Props {
  open: boolean;
  suggestion: MeetingSuggestion | null;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (date: string | null) => void;
}

export const ScheduleMeetingModal: React.FC<Props> = ({
  open,
  suggestion,
  submitting,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDate('');
      setError(null);
    }
  }, [open]);

  if (!open || !suggestion) return null;

  const minDate = new Date().toISOString().slice(0, 10);

  const handleConfirm = () => {
    if (!date) return onConfirm(null);
    if (!isSameWeekday(date, suggestion.day)) {
      setError(`Meeting must fall on a ${suggestion.day}.`);
      return;
    }
    if (date < minDate) {
      setError('Please pick a future date.');
      return;
    }
    onConfirm(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#1e3a5f] uppercase tracking-tight">Schedule Meeting</h3>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Day and time are fixed. Choose a date on the same weekday.
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {suggestion.day.slice(0, 3)}
            </div>
            <div>
              <p className="font-bold text-[#1e3a5f] uppercase text-xs">{suggestion.day}</p>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {formatTime12(suggestion.startTime)} — {formatTime12(suggestion.endTime)}
                <span className="ml-2 text-[11px] font-bold text-[#FDB813] bg-[#1e3a5f]/10 px-2 py-0.5 rounded-md">
                  {formatDuration(suggestion.durationMinutes)}
                </span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Meeting date{' '}
              <span className="font-bold text-slate-400">
                (must be a <span className="text-[#1e3a5f] font-bold">{suggestion.day}</span>)
              </span>
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none transition"
            />
            <p className="text-[11px] font-medium text-slate-400 mt-1.5">
              Leave empty to save as <span className="font-bold text-slate-600">Pending</span> and pick later.
            </p>
          </div>

          {error && (
            <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1e3a5f] bg-[#FDB813] hover:bg-[#e5a40f] rounded-xl transition-all shadow-md shadow-[#FDB813]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-[#1e3a5f]/30 border-t-[#1e3a5f] rounded-full animate-spin" />
            )}
            {date ? 'Schedule' : 'Save as Pending'}
          </button>
        </div>
      </div>
    </div>
  );
};