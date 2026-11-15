import React, { useMemo } from 'react';
import { TimetableEntry, WORK_DAYS, timeToMinutes, formatTime } from './types';

interface Props {
  entries: TimetableEntry[];
  onEntryClick?: (entry: TimetableEntry) => void;
}

export const TimetableGrid: React.FC<Props> = ({ entries, onEntryClick }) => {
  const { hourMarkers, earliest, latest } = useMemo(() => {
    if (entries.length === 0) {
      return { hourMarkers: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], earliest: 8 * 60, latest: 18 * 60 };
    }
    let min = Infinity;
    let max = -Infinity;
    for (const e of entries) {
      min = Math.min(min, timeToMinutes(e.startTime));
      max = Math.max(max, timeToMinutes(e.endTime));
    }
    const e = Math.max(0, Math.floor(min / 60) - 1);
    const l = Math.min(24, Math.ceil(max / 60) + 1);
    const markers = [];
    for (let h = e; h <= l; h++) markers.push(h);
    return { hourMarkers: markers, earliest: e * 60, latest: l * 60 };
  }, [entries]);

  const byDay = useMemo(() => {
    const map: Record<string, TimetableEntry[]> = {};
    for (const day of WORK_DAYS) map[day] = [];
    for (const e of entries) {
      if (map[e.day]) map[e.day].push(e);
    }
    return map;
  }, [entries]);

  const pixelsPerMinute = 1.2;
  // Add extra height for top and bottom padding
  const totalHeight = (latest - earliest) * pixelsPerMinute + 40; 

  return (
    <div className="overflow-x-auto bg-white rounded-3xl p-2 shadow-sm">
      <div className="min-w-[900px]">
        {/* Header row */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-slate-300 bg-slate-200 rounded-t-3xl overflow-hidden">
          <div className="p-3 text-[15px] font-extrabold text-slate-900 tracking-widest text-center">
            Time
          </div>
          {WORK_DAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-[13px] font-bold text-[#1e3a5f] tracking-widest text-center border-l border-slate-300"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[80px_repeat(6,1fr)]">
          <div className="relative pt-6 pb-6" style={{ height: totalHeight }}>
            {hourMarkers.map((h) => {
              const top = (h * 60 - earliest) * pixelsPerMinute;
              return (
                <div
                  key={h}
                  className="absolute right-0 -translate-y-1/2 pr-3 text-[13px] font-bold text-slate-600"
                  style={{ top: top + 20 }}
                >
                  {formatTime(`${String(h).padStart(2, '0')}:00`)}
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {WORK_DAYS.map((day) => (
            <div
              key={day}
              className="relative border-l border-r border-slate-300 pt-6 pb-6"
              style={{ height: totalHeight }}
            >
              {/* hour gridlines */}
              {hourMarkers.map((h) => {
                const top = (h * 60 - earliest) * pixelsPerMinute;
                return (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-slate-300"
                    style={{ top: top + 20 }}
                  />
                );
              })}

              {/* entries */}
              {byDay[day].map((e) => {
                const top = (timeToMinutes(e.startTime) - earliest) * pixelsPerMinute + 20;
                const height = (timeToMinutes(e.endTime) - timeToMinutes(e.startTime)) * pixelsPerMinute;
                return (
                  <button
                    key={e.id}
                    onClick={() => onEntryClick?.(e)}
                    className="absolute left-1 right-1 rounded-xl bg-[#1e3a5f] hover:bg-[#15304a] text-white text-left p-2.5 shadow-sm hover:shadow-md transition-all overflow-hidden border border-white/10 group z-10"
                    style={{ top, height }}
                    title={`${e.course}\n${formatTime(e.startTime)} — ${formatTime(e.endTime)}`}
                  >
                    <div className="text-xs font-bold tracking-tight truncate text-white group-hover:text-[#FDB813] transition-colors">
                      {e.course}
                    </div>
                    <div className="text-[10px] font-bold text-white/80 tracking-wider mt-0.5 truncate">
                      {formatTime(e.startTime)}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};