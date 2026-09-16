import React from 'react';
import { formatTime12, formatDuration } from './types';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';

interface Props {
  suggestion: MeetingSuggestion;
  busy?: boolean;
  onSchedule: (s: MeetingSuggestion) => void;
}

export const SuggestionCard: React.FC<Props> = ({ suggestion, busy, onSchedule }) => (
  <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-white hover:shadow-sm transition">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
        {suggestion.day.slice(0, 3)}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {formatTime12(suggestion.startTime)} — {formatTime12(suggestion.endTime)}
        </p>
        <p className="text-xs text-gray-500">{formatDuration(suggestion.durationMinutes)}</p>
      </div>
    </div>
    <button
      onClick={() => onSchedule(suggestion)}
      disabled={busy}
      className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
    >
      {busy && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      Schedule
    </button>
  </div>
);