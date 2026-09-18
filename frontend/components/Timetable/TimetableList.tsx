// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useMemo } from 'react';
// import { TimetableEntry, DAYS, timeToMinutes } from './types';
// import { TimetableEntryCard } from './TimetableEntryCard';

// interface Props {
//   entries: TimetableEntry[];
//   groupByDay?: boolean;
//   variantResolver?: (entry: TimetableEntry) => 'regular' | 'personal';
//   canEditResolver?: (entry: TimetableEntry) => boolean;
//   canDeleteResolver?: (entry: TimetableEntry) => boolean;
//   onEdit?: (entry: TimetableEntry) => void;
//   onDelete?: (entry: TimetableEntry) => void;
// }

// export const TimetableList: React.FC<Props> = ({
//   entries = [],
//   groupByDay = true,
//   variantResolver,
//   canEditResolver,
//   canDeleteResolver,
//   onEdit,
//   onDelete,
// }) => {
//   const safeEntries = Array.isArray(entries) ? entries : [];

//   const grouped = useMemo(() => {
//     const map: Record<string, TimetableEntry[]> = {};
//     for (const e of safeEntries) {
//       if (!map[e.day]) map[e.day] = [];
//       map[e.day].push(e);
//     }
//     for (const day of Object.keys(map)) {
//       map[day].sort(
//         (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
//       );
//     }
//     return map;
//   }, [safeEntries]);

//   const renderCard = (e: TimetableEntry) => (
//     <TimetableEntryCard
//       key={e.id}
//       entry={e}
//       variant={variantResolver?.(e) ?? 'regular'}
//       canEdit={canEditResolver ? canEditResolver(e) : !!onEdit}
//       canDelete={canDeleteResolver ? canDeleteResolver(e) : !!onDelete}
//       onEdit={onEdit}
//       onDelete={onDelete}
//     />
//   );

//   if (!groupByDay) {
//     const sorted = [...safeEntries].sort((a, b) => {
//       const dayDiff = DAYS.indexOf(a.day as any) - DAYS.indexOf(b.day as any);
//       if (dayDiff !== 0) return dayDiff;
//       return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
//     });
//     return <div className="space-y-3">{sorted.map(renderCard)}</div>;
//   }

//   return (
//     <div className="space-y-6">
//       {DAYS.filter((d) => grouped[d]?.length).map((day) => (
//         <div key={day}>
//           <div className="flex items-center gap-3 mb-3">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
//               {day}
//             </h3>
//             <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//               {grouped[day].length}
//             </span>
//           </div>
//           <div className="space-y-2">{grouped[day].map(renderCard)}</div>
//         </div>
//       ))}
//     </div>
//   );
// };



/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { TimetableEntry, DAYS, timeToMinutes } from './types';
import { TimetableEntryCard } from './TimetableEntryCard';

interface Props {
  entries: TimetableEntry[];
  groupByDay?: boolean;
  variantResolver?: (entry: TimetableEntry) => 'regular' | 'personal';
  canEditResolver?: (entry: TimetableEntry) => boolean;
  canDeleteResolver?: (entry: TimetableEntry) => boolean;
  onEdit?: (entry: TimetableEntry) => void;
  onDelete?: (entry: TimetableEntry) => void;
}

export const TimetableList: React.FC<Props> = ({
  entries = [],
  groupByDay = true,
  variantResolver,
  canEditResolver,
  canDeleteResolver,
  onEdit,
  onDelete,
}) => {
  const safeEntries = Array.isArray(entries) ? entries : [];

  const grouped = useMemo(() => {
    const map: Record<string, TimetableEntry[]> = {};
    for (const e of safeEntries) {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    }
    for (const day of Object.keys(map)) {
      map[day].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
      );
    }
    return map;
  }, [safeEntries]);

  const renderCard = (e: TimetableEntry) => (
    <TimetableEntryCard
      key={e.id}
      entry={e}
      variant={variantResolver?.(e) ?? 'regular'}
      canEdit={canEditResolver ? canEditResolver(e) : !!onEdit}
      canDelete={canDeleteResolver ? canDeleteResolver(e) : !!onDelete}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  if (!groupByDay) {
    const sorted = [...safeEntries].sort((a, b) => {
      const dayDiff = DAYS.indexOf(a.day as any) - DAYS.indexOf(b.day as any);
      if (dayDiff !== 0) return dayDiff;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
    return <div className="space-y-3">{sorted.map(renderCard)}</div>;
  }

  return (
    <div className="space-y-6">
      {DAYS.filter((d) => grouped[d]?.length).map((day) => (
        <div key={day}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-wider">
              {day}
            </h3>
            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {grouped[day].length}
            </span>
          </div>
          <div className="space-y-2">{grouped[day].map(renderCard)}</div>
        </div>
      ))}
    </div>
  );
};