/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import React, { useState } from 'react';
import { Toast, ToastType } from '../Timetable/Toast';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';
import { Header, PageShell } from '../Timetable/Timetable';
import { SuggestionList } from './SuggestionList';
import { MeetingCard } from './MeetingCard';
import {MeetingEmptyState} from './MeetingEmptyState'
import { MeetingSkeleton } from './MeetingSkeleton';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';


type Tab = 'suggestions' | 'meetings';

interface Props {
  onBack?: () => void;
}

export const AdvisorMeetingsPage: React.FC<Props> = ({ onBack }) => {
  const currentUser = sessionManager.getCurrentUser<any>();
  const userId = currentUser?.data?.id || currentUser?.id;

  const {
    suggestions,
    meetings,
    isLoading,
    isLoadingSuggestions,
    error,
    refreshSuggestions,
    refreshMeetings,
    create,
    update,
  } = useBatchMeetings(userId);

  const [tab, setTab] = useState<Tab>('suggestions');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<MeetingSuggestion | null>(null);
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);

  const handleSchedule = (s: MeetingSuggestion) => {
  setScheduleTarget(s);
};

// Called by the modal when advisor confirms
const handleConfirmSchedule = async (date: string | null) => {
  if (!scheduleTarget) return;
  setScheduleSubmitting(true);
  const res = await create(
    scheduleTarget.day,
    scheduleTarget.startTime,
    scheduleTarget.endTime,
    date
  );
  setScheduleSubmitting(false);

  if (res?.success) {
    setToast({
      msg: date ? 'Meeting scheduled' : 'Saved as pending',
      type: 'success',
    });
    setScheduleTarget(null);
    setTab('meetings');
    await refreshMeetings(true);
  } else {
    setToast({ msg: res?.error || 'Failed to schedule', type: 'error' });
  }
};

  const handleUpdate = async (
    id: number,
    patch: { date?: string | null; status?: any; meetingSummary?: string | null }
  ) => {
    setSavingId(id);
    const res = await update(id, patch);
    setSavingId(null);
    if (res?.success) {
      setToast({ msg: 'Meeting updated', type: 'success' });
    } else {
      setToast({ msg: res?.error || 'Failed to update', type: 'error' });
    }
  };

  const scheduledCount = meetings.filter((m) => m.status === 'scheduled').length;

  return (
    <PageShell>
      <Header
        title="Batch Meetings"
        subtitle={` ${scheduledCount} scheduled`}
        view={'list'}                 
        onViewChange={() => undefined} 
        onAdd={() => undefined}       
        onBack={onBack}
      />
      {/* Tabs */}
      <div className="inline-flex p-1 bg-gray-100 rounded-lg mb-6">
        {(['suggestions', 'meetings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition ${
              tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            {t === 'suggestions' ? 'Available Meeting Slots' : `My Meetings (${meetings.length})`}
          </button>
        ))}
      </div>

      {tab === 'suggestions' && (
        <>
          {isLoadingSuggestions && suggestions.length === 0 ? (
            <MeetingSkeleton />
          ) : suggestions.length === 0 ? (
            <MeetingEmptyState
              title="No common free slots"
              description="No overlap between the advisor and every student this week. Adjust timetables and refresh."
            />
          ) : (
            <SuggestionList suggestions={suggestions} onSchedule={handleSchedule} />
          )}
        </>
      )}

      {tab === 'meetings' && (
        <>
          {isLoading && meetings.length === 0 ? (
            <MeetingSkeleton />
          ) : meetings.length === 0 ? (
            <MeetingEmptyState />
          ) : (
            <div className="space-y-4">
              {meetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  saving={savingId === m.id}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

        <ScheduleMeetingModal
          open={!!scheduleTarget}
          suggestion={scheduleTarget}
          submitting={scheduleSubmitting}
          onClose={() => setScheduleTarget(null)}
          onConfirm={handleConfirmSchedule}
        />

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </PageShell>
  );
};