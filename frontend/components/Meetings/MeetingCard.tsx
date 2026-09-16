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
  const [date, setDate] = useState<string | null>(meeting.date);
  const [status, setStatus] = useState<MeetingStatus>(meeting.status);
  const [summary, setSummary] = useState<string>(meeting.meetingSummary ?? '');

  // Re-sync when the meeting prop changes (e.g., after refetch)
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

    // Auto-set status to scheduled if a date is being picked but status unchanged and still pending
    if (patch.date && !patch.status && meeting.status === 'pending') {
      patch.status = 'scheduled';
    }

    await onUpdate(meeting.id, patch);
  };

  return (
    <div className="rounded-xl border bg-white p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MeetingStatusBadge status={meeting.status} />
            <span className="text-xs text-gray-400">Batch #{meeting.batchId}</span>
          </div>
          <h3 className="font-semibold text-gray-900">
            {meeting.day} · {formatTime12(meeting.startTime)} — {formatTime12(meeting.endTime)}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Scheduled for: <span className="font-medium">{formatDate(meeting.date)}</span>
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <MeetingDatePicker
          meetingDay={meeting.day}
          value={date}
          disabled={saving || meeting.status === 'completed'}
          onChange={setDate}
        />

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={status}
            disabled={saving}
            onChange={(e) => setStatus(e.target.value as MeetingStatus)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50"
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
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Meeting summary / notes
        </label>
        <textarea
          value={summary}
          disabled={saving}
          rows={3}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Add notes, decisions, and follow-ups…"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y disabled:bg-gray-50"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          disabled={!dirty || saving}
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          Save changes
        </button>
      </div>
    </div>
  );
};