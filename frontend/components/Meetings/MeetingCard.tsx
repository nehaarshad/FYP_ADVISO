
// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from 'react';
// import { formatTime12, formatDate } from './types';
// import { MeetingStatusBadge } from './MeetingStatusBadge';
// import { MeetingDatePicker } from './MeetingDatePicker';
// import { BatchMeeting, MeetingStatus } from '@/src/models/batchMeetingModel';

// interface Props {
//   meeting: BatchMeeting;
//   saving?: boolean;
//   onUpdate: (
//     id: number,
//     patch: { date?: string | null; status?: MeetingStatus; meetingSummary?: string | null }
//   ) => Promise<void>;
// }

// const STATUS_OPTIONS: MeetingStatus[] = ['pending', 'scheduled', 'cancelled', 'completed'];

// export const MeetingCard: React.FC<Props> = ({ meeting, saving, onUpdate }) => {
//   const [date, setDate] = useState<string | null>(meeting.date);
//   const [status, setStatus] = useState<MeetingStatus>(meeting.status);
//   const [summary, setSummary] = useState<string>(meeting.meetingSummary ?? '');

//   // Re-sync when the meeting prop changes (e.g., after refetch)
//   useEffect(() => {
//     setDate(meeting.date);
//     setStatus(meeting.status);
//     setSummary(meeting.meetingSummary ?? '');
//   }, [meeting.id, meeting.date, meeting.status, meeting.meetingSummary]);

//   const dirty =
//     date !== meeting.date ||
//     status !== meeting.status ||
//     (summary || '') !== (meeting.meetingSummary ?? '');

//   const handleSave = async () => {
//     const patch: {
//       date?: string | null;
//       status?: MeetingStatus;
//       meetingSummary?: string | null;
//     } = {};

//     if (date !== meeting.date) patch.date = date;
//     if (status !== meeting.status) patch.status = status;
//     if ((summary || '') !== (meeting.meetingSummary ?? '')) {
//       patch.meetingSummary = summary || null;
//     }

//     // Auto-set status to scheduled if a date is being picked but status unchanged and still pending
//     if (patch.date && !patch.status && meeting.status === 'pending') {
//       patch.status = 'scheduled';
//     }

//     await onUpdate(meeting.id, patch);
//   };

//   return (
//     <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-5 shadow-sm">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2.5 mb-1.5">
//             <MeetingStatusBadge status={meeting.status} />
//             <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
//               Batch #{meeting.batchId}
//             </span>
//           </div>
//           <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight">
//             {meeting.day} · {formatTime12(meeting.startTime)} — {formatTime12(meeting.endTime)}
//           </h3>
//           <p className="text-xs font-bold text-slate-500 mt-1">
//             Scheduled for: <span className="text-[#1e3a5f] font-black">{formatDate(meeting.date)}</span>
//           </p>
//         </div>
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4">
//         <MeetingDatePicker
//           meetingDay={meeting.day}
//           value={date}
//           disabled={saving || meeting.status === 'completed'}
//           onChange={setDate}
//         />

//         <div>
//           <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
//           <select
//             value={status}
//             disabled={saving}
//             onChange={(e) => setStatus(e.target.value as MeetingStatus)}
//             className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none disabled:bg-slate-50 transition"
//           >
//             {STATUS_OPTIONS.map((s) => (
//               <option key={s} value={s}>
//                 {s.charAt(0).toUpperCase() + s.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
//           Meeting summary / notes
//         </label>
//         <textarea
//           value={summary}
//           disabled={saving}
//           rows={3}
//           onChange={(e) => setSummary(e.target.value)}
//           placeholder="Add notes, decisions, and follow-ups…"
//           className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none resize-y disabled:bg-slate-50 transition placeholder:text-slate-400"
//         />
//       </div>

//       <div className="flex justify-end gap-3 pt-1">
//         <button
//           disabled={!dirty || saving}
//           onClick={handleSave}
//           className="px-5 py-2.5 bg-[#FDB813] hover:bg-[#e5a40f] text-[#1e3a5f] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FDB813]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
//         >
//           {saving && (
//             <span className="w-3.5 h-3.5 border-2 border-[#1e3a5f]/30 border-t-[#1e3a5f] rounded-full animate-spin" />
//           )}
//           Save changes
//         </button>
//       </div>
//     </div>
//   );
// };


/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { formatTime12, formatDate } from './types';
import { MeetingStatusBadge } from './MeetingStatusBadge';
import { MeetingDatePicker } from './MeetingDatePicker';
import { BatchMeeting, MeetingStatus } from '@/src/models/batchMeetingModel';

interface Props {
  meeting: BatchMeeting;
  saving?: boolean;
  onUpdate: (
    id: number,
    patch: { date?: string | null; status?: MeetingStatus; meetingSummary?: string | null }
  ) => Promise<void>;
}

const STATUS_OPTIONS: MeetingStatus[] = ['pending', 'scheduled', 'cancelled', 'completed'];

export const MeetingCard: React.FC<Props> = ({ meeting, saving, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<string | null>(meeting.date);
  const [status, setStatus] = useState<MeetingStatus>(meeting.status);
  const [summary, setSummary] = useState<string>(meeting.meetingSummary ?? '');

  useEffect(() => {
    setDate(meeting.date);
    setStatus(meeting.status);
    setSummary(meeting.meetingSummary ?? '');
  }, [meeting.id, meeting.date, meeting.status, meeting.meetingSummary]);

  const dirty =
    date !== meeting.date ||
    status !== meeting.status ||
    (summary || '') !== (meeting.meetingSummary ?? '');

  const handleSave = async () => {
    const patch: {
      date?: string | null;
      status?: MeetingStatus;
      meetingSummary?: string | null;
    } = {};

    if (date !== meeting.date) patch.date = date;
    if (status !== meeting.status) patch.status = status;
    if ((summary || '') !== (meeting.meetingSummary ?? '')) {
      patch.meetingSummary = summary || null;
    }

    if (patch.date && !patch.status && meeting.status === 'pending') {
      patch.status = 'scheduled';
    }

    await onUpdate(meeting.id, patch);
    
    // Save hone ke baad dropdown close ho kar wapis normal view show ho jayega
    setIsOpen(false);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <MeetingStatusBadge status={meeting.status} />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
              Batch #{meeting.batchId}
            </span>
          </div>
          <h3 className="text-sm text-[#1e3a5f] uppercase tracking-tight">
            {meeting.day} · {formatTime12(meeting.startTime)} — {formatTime12(meeting.endTime)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Scheduled for: <span className="text-[#1e3a5f]">{formatDate(meeting.date)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] uppercase tracking-wider font-medium">
            {isOpen ? 'Close' : 'Edit'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/30">
          <div className="grid sm:grid-cols-2 gap-4">
            <MeetingDatePicker
              meetingDay={meeting.day}
              value={date}
              disabled={saving || meeting.status === 'completed'}
              onChange={setDate}
            />

            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-slate-500 mb-1.5">
                Select Status
              </label>
              <select
                value={status}
                disabled={saving}
                onChange={(e) => setStatus(e.target.value as MeetingStatus)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[11px] text-[#1e3a5f] bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none disabled:bg-slate-50 transition cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] uppercase tracking-wider text-slate-500 mb-1.5">
              Meeting summary / notes
            </label>
            <textarea
              value={summary}
              disabled={saving}
              rows={3}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Add notes, decisions, and follow-ups…"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[11px] text-slate-700 bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none resize-y disabled:bg-slate-50 transition placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              disabled={!dirty || saving}
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#FDB813] hover:bg-[#e5a40f] text-[#1e3a5f] text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FDB813]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 cursor-pointer"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-[#1e3a5f]/30 border-t-[#1e3a5f] rounded-full animate-spin" />
              )}
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};