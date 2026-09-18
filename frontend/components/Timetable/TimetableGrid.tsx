// import React, { useMemo } from 'react';
// import { TimetableEntry, WORK_DAYS, timeToMinutes, formatTime } from './types';

// interface Props {
//   entries: TimetableEntry[];
//   onEntryClick?: (entry: TimetableEntry) => void;
// }

// export const TimetableGrid: React.FC<Props> = ({ entries, onEntryClick }) => {
//   const { hourMarkers, earliest, latest } = useMemo(() => {
//     if (entries.length === 0) {
//       return { hourMarkers: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], earliest: 8 * 60, latest: 18 * 60 };
//     }
//     let min = Infinity;
//     let max = -Infinity;
//     for (const e of entries) {
//       min = Math.min(min, timeToMinutes(e.startTime));
//       max = Math.max(max, timeToMinutes(e.endTime));
//     }
//     const e = Math.max(0, Math.floor(min / 60) - 1);
//     const l = Math.min(24, Math.ceil(max / 60) + 1);
//     const markers = [];
//     for (let h = e; h <= l; h++) markers.push(h);
//     return { hourMarkers: markers, earliest: e * 60, latest: l * 60 };
//   }, [entries]);

//   const byDay = useMemo(() => {
//     const map: Record<string, TimetableEntry[]> = {};
//     for (const day of WORK_DAYS) map[day] = [];
//     for (const e of entries) {
//       if (map[e.day]) map[e.day].push(e);
//     }
//     return map;
//   }, [entries]);

//   const pixelsPerMinute = 1.2;
//   const totalHeight = (latest - earliest) * pixelsPerMinute;

//   return (
//     <div className="overflow-x-auto bg-white border rounded-xl">
//       <div className="min-w-[900px]">
//         {/* Header row */}
//         <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b bg-gray-50">
//           <div className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">
//             Time
//           </div>
//           {WORK_DAYS.map((day) => (
//             <div
//               key={day}
//               className="p-3 text-xs font-semibold text-gray-700 uppercase text-center border-l"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Body */}
//         <div className="grid grid-cols-[80px_repeat(6,1fr)]">
//           {/* Hour column */}
//           <div className="relative" style={{ height: totalHeight }}>
//             {hourMarkers.map((h) => (
//               <div
//                 key={h}
//                 className="absolute right-0 -translate-y-1/2 pr-2 text-[10px] text-gray-400"
//                 style={{ top: (h * 60 - earliest) * pixelsPerMinute }}
//               >
//                 {formatTime(`${String(h).padStart(2, '0')}:00`)}
//               </div>
//             ))}
//           </div>

//           {/* Day columns */}
//           {WORK_DAYS.map((day) => (
//             <div
//               key={day}
//               className="relative border-l"
//               style={{ height: totalHeight }}
//             >
//               {/* hour gridlines */}
//               {hourMarkers.map((h) => (
//                 <div
//                   key={h}
//                   className="absolute left-0 right-0 border-t border-gray-100"
//                   style={{ top: (h * 60 - earliest) * pixelsPerMinute }}
//                 />
//               ))}

//               {/* entries */}
//               {byDay[day].map((e) => {
//                 const top = (timeToMinutes(e.startTime) - earliest) * pixelsPerMinute;
//                 const height = (timeToMinutes(e.endTime) - timeToMinutes(e.startTime)) * pixelsPerMinute;
//                 return (
//                   <button
//                     key={e.id}
//                     onClick={() => onEntryClick?.(e)}
//                     className="absolute left-1 right-1 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-left p-2 shadow-sm hover:shadow-md transition overflow-hidden"
//                     style={{ top, height }}
//                     title={`${e.course}\n${formatTime(e.startTime)} — ${formatTime(e.endTime)}`}
//                   >
//                     <div className="text-xs font-semibold truncate">{e.course}</div>
//                     <div className="text-[10px] opacity-90 mt-0.5 truncate">
//                       {formatTime(e.startTime)}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

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
  const totalHeight = (latest - earliest) * pixelsPerMinute;

  return (
    <div className="overflow-x-auto bg-white border border-slate-100 rounded-3xl shadow-sm">
      <div className="min-w-[900px]">
        {/* Header row */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-slate-100 bg-slate-50/60">
          <div className="p-3 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
            Time
          </div>
          {WORK_DAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest text-center border-l border-slate-100"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)]">
          {/* Hour column */}
          <div className="relative" style={{ height: totalHeight }}>
            {hourMarkers.map((h) => (
              <div
                key={h}
                className="absolute right-0 -translate-y-1/2 pr-3 text-[10px] font-bold text-slate-400"
                style={{ top: (h * 60 - earliest) * pixelsPerMinute }}
              >
                {formatTime(`${String(h).padStart(2, '0')}:00`)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WORK_DAYS.map((day) => (
            <div
              key={day}
              className="relative border-l border-slate-100"
              style={{ height: totalHeight }}
            >
              {/* hour gridlines */}
              {hourMarkers.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-slate-100/60"
                  style={{ top: (h * 60 - earliest) * pixelsPerMinute }}
                />
              ))}

              {/* entries */}
              {byDay[day].map((e) => {
                const top = (timeToMinutes(e.startTime) - earliest) * pixelsPerMinute;
                const height = (timeToMinutes(e.endTime) - timeToMinutes(e.startTime)) * pixelsPerMinute;
                return (
                  <button
                    key={e.id}
                    onClick={() => onEntryClick?.(e)}
                    className="absolute left-1 right-1 rounded-xl bg-[#1e3a5f] hover:bg-[#15304a] text-white text-left p-2.5 shadow-sm hover:shadow-md transition-all overflow-hidden border border-white/10 group"
                    style={{ top, height }}
                    title={`${e.course}\n${formatTime(e.startTime)} — ${formatTime(e.endTime)}`}
                  >
                    <div className="text-xs font-black uppercase tracking-tight truncate text-white group-hover:text-[#FDB813] transition-colors">
                      {e.course}
                    </div>
                    <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5 truncate">
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