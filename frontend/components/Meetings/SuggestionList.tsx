
import React, { useMemo, useState } from 'react';
import { SuggestionCard } from './SuggestionCard';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';

interface Props {
  suggestions: MeetingSuggestion[];
  onSchedule: (s: MeetingSuggestion) => Promise<void> | void;
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const SuggestionList: React.FC<Props> = ({ suggestions, onSchedule }) => {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, MeetingSuggestion[]> = {};
    for (const s of suggestions) {
      if (!map[s.day]) map[s.day] = [];
      map[s.day].push(s);
    }
    for (const d of Object.keys(map)) {
      map[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [suggestions]);

  const handleSchedule = async (s: MeetingSuggestion) => {
    const key = `${s.day}-${s.startTime}-${s.endTime}`;
    setBusyKey(key);
    try {
      await onSchedule(s);
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {DAY_ORDER.filter((d) => grouped[d]?.length).map((day) => (
        <div key={day}>
          <div className="flex items-center gap-2 mb-2.5">
            <h3 className="text-[10.5px] text-[#1e3a5f] uppercase tracking-wider">{day}</h3>
            <span className="text-[10px] text-[#1e3a5f] bg-slate-100 px-2 py-0.5 rounded-md">
              {grouped[day].length}
            </span>
          </div>
          <div className="space-y-2.5">
            {grouped[day].map((s) => {
              const key = `${s.day}-${s.startTime}-${s.endTime}`;
              return (
                <SuggestionCard
                  key={key}
                  suggestion={s}
                  busy={busyKey === key}
                  onSchedule={handleSchedule}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};