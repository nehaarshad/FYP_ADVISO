// import React from 'react';
// import { TimetableEntry, DAY_SHORT, formatTime } from './types';

// interface Props {
//   entry: TimetableEntry;
//   variant?: 'regular' | 'personal';
//   canEdit?: boolean;
//   canDelete?: boolean;
//   onEdit?: (entry: TimetableEntry) => void;
//   onDelete?: (entry: TimetableEntry) => void;
// }

// export const TimetableEntryCard: React.FC<Props> = ({
//   entry,
//   variant = 'regular',
//   canEdit = false,
//   canDelete = false,
//   onEdit,
//   onDelete,
// }) => {
//   const variantStyles =
//     variant === 'personal'
//       ? 'bg-indigo-50 border-indigo-200'
//       : 'bg-white border-gray-200';

//   const showEdit = canEdit && !!onEdit;
//   const showDelete = canDelete && !!onDelete;

//   const creatorName = entry.Student?.studentName;

//   return (
//     <div
//       className={`flex items-center gap-4 p-4 rounded-xl border ${variantStyles} hover:shadow-sm transition`}
//     >
//       <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shrink-0">
//         <span className="text-xs font-medium uppercase">
//           {DAY_SHORT[entry.day] || entry.day.slice(0, 3)}
//         </span>
//       </div>

//       <div className="flex-1 min-w-0">
//         <h4 className="font-semibold text-gray-900 truncate">{entry.course}</h4>
//         <p className="text-sm text-gray-500 mt-0.5">
//           {formatTime(entry.startTime)} — {formatTime(entry.endTime)}
//         </p>

//         {/* Creator attribution */}
//         {variant === 'personal' ? (
//           <p className="text-xs text-indigo-600 font-medium mt-1">You</p>
//         ) : creatorName ? (
//           <p className="text-xs text-gray-400 mt-1">
//             Added by <span className="text-gray-600 font-medium">{creatorName}</span>
//           </p>
//         ) : null}
//       </div>

//       {(showEdit || showDelete) && (
//         <div className="flex items-center gap-2 shrink-0">
//           {showEdit && (
//             <button
//               onClick={() => onEdit!(entry)}
//               className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//               aria-label="Edit"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                 />
//               </svg>
//             </button>
//           )}
//           {showDelete && (
//             <button
//               onClick={() => onDelete!(entry)}
//               className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//               aria-label="Delete"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };




import React from 'react';
import { TimetableEntry, DAY_SHORT, formatTime } from './types';

interface Props {
  entry: TimetableEntry;
  variant?: 'regular' | 'personal';
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (entry: TimetableEntry) => void;
  onDelete?: (entry: TimetableEntry) => void;
}

export const TimetableEntryCard: React.FC<Props> = ({
  entry,
  variant = 'regular',
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}) => {
  const variantStyles =
    variant === 'personal'
      ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
      : 'bg-white border-slate-100 hover:border-slate-200';

  const showEdit = canEdit && !!onEdit;
  const showDelete = canDelete && !!onDelete;

  const creatorName = entry.Student?.studentName;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border ${variantStyles} transition-all`}
    >
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#1e3a5f] text-white shrink-0 shadow-sm">
  <span className="text-[10px] font-black uppercase tracking-wider text-white">
    {DAY_SHORT[entry.day] || entry.day.slice(0, 3)}
  </span>
</div>

      <div className="flex-1 min-w-0">
        <h4 className="font-black text-[#1e3a5f] uppercase tracking-tight truncate text-sm">
          {entry.course}
        </h4>
        <p className="text-xs font-bold text-slate-400 mt-0.5 tracking-wide">
          {formatTime(entry.startTime)} — {formatTime(entry.endTime)}
        </p>

        {/* Creator attribution */}
        {variant === 'personal' ? (
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">You</p>
        ) : creatorName ? (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Added by <span className="text-[#1e3a5f] font-black">{creatorName}</span>
          </p>
        ) : null}
      </div>

      {(showEdit || showDelete) && (
        <div className="flex items-center gap-1.5 shrink-0">
          {showEdit && (
            <button
              onClick={() => onEdit!(entry)}
              className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition"
              aria-label="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => onDelete!(entry)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              aria-label="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};