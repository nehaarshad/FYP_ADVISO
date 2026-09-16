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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Schedule Meeting</h3>
          <p className="text-sm text-gray-500 mt-1">
            Day and time are fixed. Choose a date on the same weekday.
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {suggestion.day.slice(0, 3)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{suggestion.day}</p>
              <p className="text-sm text-gray-600">
                {formatTime12(suggestion.startTime)} — {formatTime12(suggestion.endTime)}
                <span className="ml-2 text-xs text-gray-400">
                  {formatDuration(suggestion.durationMinutes)}
                </span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting date
              <span className="text-gray-500 font-normal ml-1">
                (must be a <span className="font-medium">{suggestion.day}</span>)
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
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to save as <span className="font-medium">Pending</span> and pick later.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}
        </div>

        <div className="p-5 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {date ? 'Schedule' : 'Save as Pending'}
          </button>
        </div>
      </div>
    </div>
  );
};