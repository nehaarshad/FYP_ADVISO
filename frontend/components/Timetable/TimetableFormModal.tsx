// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from 'react';
// import { DAYS, TimetableEntry, TimetableEntryInput } from './types';

// interface Props {
//   open: boolean;
//   mode: 'add' | 'edit';
//   initial?: TimetableEntry | null;
//   submitting?: boolean;
//   onClose: () => void;
//   onSubmit: (data: TimetableEntryInput) => void;
// }

// const empty: TimetableEntryInput = {
//   day: 'Monday',
//   course: '',
//   startTime: '09:00',
//   endTime: '10:00',
// };

// export const TimetableFormModal: React.FC<Props> = ({
//   open,
//   mode,
//   initial,
//   submitting = false,
//   onClose,
//   onSubmit,
// }) => {
//   const [form, setForm] = useState<TimetableEntryInput>(empty);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (open) {
//       if (mode === 'edit' && initial) {
//         setForm({
//           day: initial.day,
//           course: initial.course,
//           startTime: initial.startTime.slice(0, 5),
//           endTime: initial.endTime.slice(0, 5),
//         });
//       } else {
//         setForm(empty);
//       }
//       setError(null);
//     }
//   }, [open, mode, initial]);

//   if (!open) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.course.trim()) return setError('Course is required');
//     if (form.startTime >= form.endTime) return setError('End time must be after start time');
//     setError(null);
//     onSubmit({
//       day: form.day,
//       course: form.course.trim(),
//       startTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime,
//       endTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
//       >
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           {mode === 'add' ? 'Add Timetable Entry' : 'Edit Timetable Entry'}
//         </h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
//             <select
//               value={form.day}
//               onChange={(e) => setForm({ ...form, day: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             >
//               {DAYS.map((d) => (
//                 <option key={d} value={d}>{d}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//             <input
//               type="text"
//               value={form.course}
//               onChange={(e) => setForm({ ...form, course: e.target.value })}
//               placeholder="e.g. Data Structures"
//               className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
//               <input
//                 type="time"
//                 value={form.startTime}
//                 onChange={(e) => setForm({ ...form, startTime: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
//               <input
//                 type="time"
//                 value={form.endTime}
//                 onChange={(e) => setForm({ ...form, endTime: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
//               {error}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {submitting && (
//               <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//             )}
//             {mode === 'add' ? 'Add' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { DAYS, TimetableEntry, TimetableEntryInput } from './types';

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initial?: TimetableEntry | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (data: TimetableEntryInput) => void;
}

const empty: TimetableEntryInput = {
  day: 'Monday',
  course: '',
  startTime: '09:00',
  endTime: '10:00',
};

export const TimetableFormModal: React.FC<Props> = ({
  open,
  mode,
  initial,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<TimetableEntryInput>(empty);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initial) {
        setForm({
          day: initial.day,
          course: initial.course,
          startTime: initial.startTime.slice(0, 5),
          endTime: initial.endTime.slice(0, 5),
        });
      } else {
        setForm(empty);
      }
      setError(null);
    }
  }, [open, mode, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course.trim()) return setError('Course is required');
    if (form.startTime >= form.endTime) return setError('End time must be after start time');
    setError(null);
    onSubmit({
      day: form.day,
      course: form.course.trim(),
      startTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime,
      endTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-slate-100"
      >
        <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight mb-5">
          {mode === 'add' ? 'Add Timetable Entry' : 'Edit Timetable Entry'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Day</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-slate-50/50 focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Course</label>
            <input
              type="text"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              placeholder="e.g. Data Structures"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-slate-50/50 focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-slate-50/50 focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] bg-slate-50/50 focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl uppercase tracking-wider">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#1e3a5f] bg-[#FDB813] hover:bg-[#e5a40f] rounded-xl shadow-md shadow-[#FDB813]/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-[#1e3a5f]/40 border-t-[#1e3a5f] rounded-full animate-spin" />
            )}
            {mode === 'add' ? 'Add Entry' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};