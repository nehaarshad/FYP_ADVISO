

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings';
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import React, { useState } from 'react';
// import { Toast, ToastType } from '../Timetable/Toast';
// import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';
// import { SuggestionList } from './SuggestionList';
// import { MeetingCard } from './MeetingCard';
// import { MeetingEmptyState } from './MeetingEmptyState';
// import { MeetingSkeleton } from './MeetingSkeleton';
// import { ScheduleMeetingModal } from './ScheduleMeetingModal';

// type Tab = 'suggestions' | 'meetings';

// interface Props {
//   onBack?: () => void;
// }

// export const AdvisorMeetingsPage: React.FC<Props> = ({ onBack }) => {
//   const currentUser = sessionManager.getCurrentUser<any>();
//   const userId = currentUser?.data?.id || currentUser?.id;

//   const {
//     suggestions,
//     meetings,
//     isLoading,
//     isLoadingSuggestions,
//     error,
//     refreshSuggestions,
//     refreshMeetings,
//     create,
//     update,
//   } = useBatchMeetings(userId);

//   const [tab, setTab] = useState<Tab>('suggestions');
//   const [savingId, setSavingId] = useState<number | null>(null);
//   const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
//   const [scheduleTarget, setScheduleTarget] = useState<MeetingSuggestion | null>(null);
//   const [scheduleSubmitting, setScheduleSubmitting] = useState(false);

//   const handleSchedule = (s: MeetingSuggestion) => {
//     setScheduleTarget(s);
//   };

//   const handleConfirmSchedule = async (date: string | null) => {
//     if (!scheduleTarget) return;
//     setScheduleSubmitting(true);
//     const res = await create(
//       scheduleTarget.day,
//       scheduleTarget.startTime,
//       scheduleTarget.endTime,
//       date
//     );
//     setScheduleSubmitting(false);

//     if (res?.success) {
//       setToast({
//         msg: date ? 'Meeting scheduled' : 'Saved as pending',
//         type: 'success',
//       });
//       setScheduleTarget(null);
//       setTab('meetings');
//       await refreshMeetings(true);
//     } else {
//       setToast({ msg: res?.error || 'Failed to schedule', type: 'error' });
//     }
//   };

//   const handleUpdate = async (
//     id: number,
//     patch: { date?: string | null; status?: any; meetingSummary?: string | null }
//   ) => {
//     setSavingId(id);
//     const res = await update(id, patch);
//     setSavingId(null);
//     if (res?.success) {
//       setToast({ msg: 'Meeting updated', type: 'success' });
//     } else {
//       setToast({ msg: res?.error || 'Failed to update', type: 'error' });
//     }
//   };

//   const scheduledCount = meetings.filter((m) => m.status === 'scheduled').length;
//   const showInitialLoader = (isLoadingSuggestions && suggestions.length === 0) || (isLoading && meetings.length === 0);

//   if (showInitialLoader) {
//     return (
//       <PageShell>
//         <Header
//           title="Batch Meetings"
//           subtitle={`${scheduledCount} scheduled`}
//           tab={tab}
//           onTabChange={setTab}
//           onBack={onBack}
//         />
//         <MeetingSkeleton />
//       </PageShell>
//     );
//   }

//   return (
//     <PageShell>
//       <Header
//         title="Batch Meetings"
//         subtitle={`${scheduledCount} scheduled`}
//         tab={tab}
//         onTabChange={setTab}
//         onBack={onBack}
//       />

//       {tab === 'suggestions' && (
//         <>
//           {suggestions.length === 0 ? (
//             <MeetingEmptyState
//               title="No common free slots"
//               description="No overlap between the advisor and every student this week. Adjust timetables and refresh."
//             />
//           ) : (
//             <SuggestionList suggestions={suggestions} onSchedule={handleSchedule} />
//           )}
//         </>
//       )}

//       {tab === 'meetings' && (
//         <>
//           {meetings.length === 0 ? (
//             <MeetingEmptyState />
//           ) : (
//             <div className="space-y-4">
//               {meetings.map((m) => (
//                 <MeetingCard
//                   key={m.id}
//                   meeting={m}
//                   saving={savingId === m.id}
//                   onUpdate={handleUpdate}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {error && (
//         <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
//           {error}
//         </div>
//       )}

//       <ScheduleMeetingModal
//         open={!!scheduleTarget}
//         suggestion={scheduleTarget}
//         submitting={scheduleSubmitting}
//         onClose={() => setScheduleTarget(null)}
//         onConfirm={handleConfirmSchedule}
//       />

//       {toast && (
//         <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
//       )}
//     </PageShell>
//   );
// };

// export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
// );

// export const Header: React.FC<{
//   title: string;
//   subtitle?: string;
//   tab: Tab;
//   onTabChange: (t: Tab) => void;
//   onBack?: () => void;
// }> = ({ title, subtitle, tab, onTabChange, onBack }) => (
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
//     <div className="flex items-center gap-3 min-w-0">
//       {onBack && (
//         <button
//           onClick={onBack}
//           aria-label="Go back"
//           className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-50 border border-slate-100 rounded-xl transition shrink-0"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//       )}
//       <div className="min-w-0">
//         <h1 className="text-xl font-bold text-[#1e3a5f] uppercase tracking-tight truncate">{title}</h1>
//         {subtitle && <p className="text-[11px] font-bold text-[#FDB813] uppercase tracking-wider mt-0.5">{subtitle}</p>}
//       </div>
//     </div>

//     {/* Tab Switcher */}
//     <div className="flex items-center gap-3 shrink-0">
//       <div className="inline-flex p-1 bg-slate-50 rounded-xl border border-slate-200">
//         {(['suggestions', 'meetings'] as const).map((t) => (
//           <button
//             key={t}
//             onClick={() => onTabChange(t)}
//             className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
//               tab === t 
//                 ? 'bg-[#1e3a5f] text-white shadow-sm' 
//                 : 'text-slate-500 hover:text-[#1e3a5f]'
//             }`}
//           >
//             {t === 'suggestions' ? 'Available Slots' : 'My Meetings'}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>
// );




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import React, { useState } from 'react';
import { Toast, ToastType } from '../Timetable/Toast';
import { MeetingSuggestion } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';
import { SuggestionList } from './SuggestionList';
import { MeetingCard } from './MeetingCard';
import { MeetingEmptyState } from './MeetingEmptyState';
import { MeetingSkeleton } from './MeetingSkeleton';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';
import { Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const showInitialLoader = (isLoadingSuggestions && suggestions.length === 0) || (isLoading && meetings.length === 0);

  if (showInitialLoader) {
    return (
      <PageShell>
        <Header
          title="Batch Meetings"
          subtitle={`${scheduledCount} scheduled`}
          tab={tab}
          onTabChange={setTab}
          onBack={onBack}
        />
        <MeetingSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header
        title="Batch Meetings"
        subtitle={`${scheduledCount} scheduled`}
        tab={tab}
        onTabChange={setTab}
        onBack={onBack}
      />

      {tab === 'suggestions' && (
        <>
          {suggestions.length === 0 ? (
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
          {meetings.length === 0 ? (
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
export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="relative min-h-screen w-full max-w-6.5xl mx-auto p-4 md:p-8 pb-10 -mt-6 font-sans"
  >
    {children}
  </motion.div>
);

export const Header: React.FC<{
  title: string;
  subtitle?: string;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onBack?: () => void;
}> = ({ title, subtitle, tab, onTabChange, onBack }) => (
  <div className="flex flex-col gap-4 mb-8">
    {onBack && (
      <button 
        onClick={onBack} 
        aria-label="Go back"
        className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit border border-slate-100"
      >
        <ArrowLeft size={20} />
      </button>
    )}
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      {/* Heading section with slight right shift */}
      <div className="flex items-center gap-4 md:ml-15">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">
            {title}
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            {subtitle ? `${subtitle}` : "Manage batch meetings"}
          </p>
        </div>
      </div>

      {/* Tab Switcher with slight left shift using margin/alignment */}
      <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm self-start md:self-auto md:mr-7">
        {(['suggestions', 'meetings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`px-4 py-2 text-[10px] md:text-[12px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              tab === t 
                ? 'bg-[#1e3a5f] text-white shadow-sm' 
                : 'text-slate-500 hover:text-[#1e3a5f]'
            }`}
          >
            {t === 'suggestions' ? 'Available Slots' : 'My Meetings'}
          </button>
        ))}
      </div>
    </div>
  </div>
);