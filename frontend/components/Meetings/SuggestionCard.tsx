
import React from 'react';
import { formatTime12, formatDuration } from './types';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';

interface Props {
  suggestion: MeetingSuggestion;
  busy?: boolean;
  onSchedule: (s: MeetingSuggestion) => void;
}

export const SuggestionCard: React.FC<Props> = ({ suggestion, busy, onSchedule }) => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-all">
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
        {suggestion.day.slice(0, 3)}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#1e3a5f] uppercase tracking-tight truncate">
          {suggestion.day} · {formatTime12(suggestion.startTime)} — {formatTime12(suggestion.endTime)}
        </p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">
          {formatDuration(suggestion.durationMinutes)}
        </p>
      </div>
    </div>
    <button
      onClick={() => onSchedule(suggestion)}
      disabled={busy}
      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1e3a5f] bg-[#FDB813] hover:bg-[#e5a40f] rounded-xl transition-all shadow-md shadow-[#FDB813]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 shrink-0"
    >
      {busy && (
        <span className="w-3.5 h-3.5 border-2 border-[#1e3a5f]/30 border-t-[#1e3a5f] rounded-full animate-spin" />
      )}
      Schedule
    </button>
  </div>
);