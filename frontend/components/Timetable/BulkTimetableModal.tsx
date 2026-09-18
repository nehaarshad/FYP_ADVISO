
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { DAYS, TimetableEntryInput } from './types';

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (entries: TimetableEntryInput[]) => void;
}

const makeRow = (): TimetableEntryInput => ({
  day: 'Monday',
  course: '',
  startTime: '09:00',
  endTime: '10:00',
});

export const BulkTimetableModal: React.FC<Props> = ({
  open,
  mode,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [rows, setRows] = useState<TimetableEntryInput[]>([makeRow()]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setRows([makeRow()]);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const updateRow = (idx: number, patch: Partial<TimetableEntryInput>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, makeRow()]);
  const removeRow = (idx: number) =>
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.course.trim()) return setError(`Row ${i + 1}: Course is required`);
      if (r.startTime >= r.endTime)
        return setError(`Row ${i + 1}: End time must be after start time`);
    }
    setError(null);
    onSubmit(
      rows.map((r) => ({
        day: r.day,
        course: r.course.trim(),
        startTime: r.startTime.length === 5 ? `${r.startTime}:00` : r.startTime,
        endTime: r.endTime.length === 5 ? `${r.endTime}:00` : r.endTime,
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight">
            {mode === 'add' ? 'Add Timetable Entries' : 'Update Timetable Entries'}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
            Add one or more class slots at once.
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 items-end bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="col-span-3">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-wider">Day</label>
                <select
                  value={row.day}
                  onChange={(e) => updateRow(idx, { day: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-4">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-wider">Course</label>
                <input
                  type="text"
                  value={row.course}
                  onChange={(e) => updateRow(idx, { course: e.target.value })}
                  placeholder="Course name"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-wider">Start</label>
                <input
                  type="time"
                  value={row.startTime}
                  onChange={(e) => updateRow(idx, { startTime: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-wider">End</label>
                <input
                  type="time"
                  value={row.endTime}
                  onChange={(e) => updateRow(idx, { endTime: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1e3a5f] outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="col-span-1 flex justify-center pb-0.5">
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  disabled={rows.length === 1}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="w-full py-3 border-2 border-dashed border-slate-200 text-xs font-black uppercase tracking-wider text-[#1e3a5f] bg-white rounded-2xl hover:border-[#1e3a5f]/40 hover:bg-slate-50 transition-all"
          >
            + Add another entry
          </button>

          {error && (
            <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-[#1e3a5f] rounded-xl hover:bg-[#15304a] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#1e3a5f]/15"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {mode === 'add'
              ? `Add ${rows.length} Entr${rows.length === 1 ? 'y' : 'ies'}`
              : `Save ${rows.length} Entr${rows.length === 1 ? 'y' : 'ies'}`}
          </button>
        </div>
      </form>
    </div>
  );
};