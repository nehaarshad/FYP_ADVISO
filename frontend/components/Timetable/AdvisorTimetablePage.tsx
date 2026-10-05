
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useMemo, useState } from 'react';
// import { BulkTimetableModal } from '@/components/Timetable/BulkTimetableModal';
// import { ConfirmationDialog } from '@/components/Timetable/ConfirmationDialog';
// import { TimetableEmptyState } from '@/components/Timetable/TimetableEmptyState';
// import { TimetableErrorState } from '@/components/Timetable/TimetableErrorState';
// import { TimetableGrid } from '@/components/Timetable/TimetableGrid';
// import { TimetableList } from '@/components/Timetable/TimetableList';
// import { TimetableSkeleton } from '@/components/Timetable/TimetableSkeleton';
// import { Toast, ToastType } from '@/components/Timetable/Toast';
// import {
//   TimetableEntry,
//   TimetableEntryInput,
//   TimetableEntryUpdate,
// } from '@/components/Timetable/types';
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import { useAdvisorTimetable } from '@/src/hooks/advisorTimetableHook/useAdvisorTimetable';
// import { Header, PageShell } from '@/components/Timetable/Timetable';

// interface AdvisorTimetablePageProps {
//   onBack?: () => void;
// }

// export const AdvisorTimetablePage: React.FC<AdvisorTimetablePageProps> = ({ onBack }) => {
//   const currentUser = sessionManager.getCurrentUser<any>();
//   const userId = currentUser?.data?.id || currentUser?.id;

//   const {
//     timetables,
//     isLoading,
//     error,
//     refresh,
//     add,
//     update,
//     remove,
//   } = useAdvisorTimetable(userId);

//   // 🔒 Guarantee array — fixes "entries is not iterable"
//   const safeTimetables: TimetableEntry[] = useMemo(() => {
//     if (Array.isArray(timetables)) return timetables;
//     const nested = (timetables as any)?.data;
//     if (Array.isArray(nested)) return nested;
//     return [];
//   }, [timetables]);

//   const [view, setView] = useState<'list' | 'grid'>('list');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
//   const [editing, setEditing] = useState<TimetableEntry[] | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<TimetableEntry | null>(null);
//   const [deleting, setDeleting] = useState(false);
//   const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

//   const openAdd = () => {
//     setModalMode('add');
//     setEditing(null);
//     setModalOpen(true);
//   };

//   const openEdit = (entry: TimetableEntry) => {
//     setModalMode('edit');
//     setEditing([entry]);
//     setModalOpen(true);
//   };

//   const handleSubmit = async (entries: TimetableEntryInput[]) => {
//     setSubmitting(true);
//     let res;
//     if (modalMode === 'add') {
//       res = await add(entries);
//     } else {
//       const updates: TimetableEntryUpdate[] = (editing ?? []).map((e, i) => ({
//         id: e.id,
//         ...entries[i],
//       }));
//       res = await update(updates);
//     }
//     setSubmitting(false);
//     if (res?.success) {
//       setToast({ msg: modalMode === 'add' ? 'Added successfully' : 'Updated successfully', type: 'success' });
//       setModalOpen(false);
//     } else {
//       setToast({ msg: res?.error || 'Failed to save', type: 'error' });
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     const res = await remove(deleteTarget.id);
//     setDeleting(false);
//     if (res?.success) {
//       setToast({ msg: 'Deleted successfully', type: 'success' });
//       setDeleteTarget(null);
//     } else {
//       setToast({ msg: res?.error || 'Failed to delete', type: 'error' });
//     }
//   };

//   const count = safeTimetables.length;
//   const showInitialLoader = isLoading && count === 0;
//   const showErrorState = !!error && count === 0;

//   if (showInitialLoader) {
//     return (
//       <PageShell>
//         <Header
//           title="My Advisor Timetable"
//           view={view}
//           onViewChange={setView}
//           onAdd={openAdd}
//           onBack={onBack}
//         />
//         <TimetableSkeleton />
//       </PageShell>
//     );
//   }

//   if (showErrorState) {
//     return (
//       <PageShell>
//         <Header
//           title="My Advisor Timetable"
//           view={view}
//           onViewChange={setView}
//           onAdd={openAdd}
//           onBack={onBack}
//         />
//         <TimetableErrorState message={error as string} onRetry={() => refresh(true)} />
//       </PageShell>
//     );
//   }

//   return (
//     <PageShell>
//       <Header
//         title="My Advisor Timetable"
//         subtitle={`${count} entr${count === 1 ? 'y' : 'ies'}`}
//         view={view}
//         onViewChange={setView}
//         onAdd={openAdd}
//         onBack={onBack}
//       />

//       {count === 0 ? (
//         <TimetableEmptyState
//           title="No slots scheduled"
//           description="Add your first slot to get started with your advising timetable."
//           actionLabel="Add slot"
//           onAction={openAdd}
//         />
//       ) : view === 'grid' ? (
//         <TimetableGrid entries={safeTimetables} onEntryClick={openEdit} />
//       ) : (
//         <TimetableList
//           entries={safeTimetables}
//           onEdit={openEdit}
//           onDelete={setDeleteTarget}
//         />
//       )}

//       <BulkTimetableModal
//         open={modalOpen}
//         mode={modalMode}
//         submitting={submitting}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//       />

//       <ConfirmationDialog
//         open={!!deleteTarget}
//         title="Delete timetable entry?"
//         description={
//           deleteTarget
//             ? `${deleteTarget.course} on ${deleteTarget.day} will be removed from your schedule.`
//             : ''
//         }
//         confirmLabel="Delete"
//         loading={deleting}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteTarget(null)}
//       />

//       {toast && (
//         <Toast
//           message={toast.msg}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </PageShell>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { BulkTimetableModal } from '@/components/Timetable/BulkTimetableModal';
import { ConfirmationDialog } from '@/components/Timetable/ConfirmationDialog';
import { TimetableEmptyState } from '@/components/Timetable/TimetableEmptyState';
import { TimetableErrorState } from '@/components/Timetable/TimetableErrorState';
import { TimetableGrid } from '@/components/Timetable/TimetableGrid';
import { TimetableList } from '@/components/Timetable/TimetableList';
import { TimetableSkeleton } from '@/components/Timetable/TimetableSkeleton';
import { Toast, ToastType } from '@/components/Timetable/Toast';
import {
  TimetableEntry,
  TimetableEntryInput,
  TimetableEntryUpdate,
} from '@/components/Timetable/types';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { useAdvisorTimetable } from '@/src/hooks/advisorTimetableHook/useAdvisorTimetable';
import { ArrowLeft, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvisorTimetablePageProps {
  onBack?: () => void;
}

export const AdvisorTimetablePage: React.FC<AdvisorTimetablePageProps> = ({ onBack }) => {
  const currentUser = sessionManager.getCurrentUser<any>();
  const userId = currentUser?.data?.id || currentUser?.id;

  const {
    timetables,
    isLoading,
    error,
    refresh,
    add,
    update,
    remove,
  } = useAdvisorTimetable(userId);

  // 🔒 Guarantee array — fixes "entries is not iterable"
  const safeTimetables: TimetableEntry[] = useMemo(() => {
    if (Array.isArray(timetables)) return timetables;
    const nested = (timetables as any)?.data;
    if (Array.isArray(nested)) return nested;
    return [];
  }, [timetables]);

  const [view, setView] = useState<'list' | 'grid'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<TimetableEntry[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TimetableEntry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const openAdd = () => {
    setModalMode('add');
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (entry: TimetableEntry) => {
    setModalMode('edit');
    setEditing([entry]);
    setModalOpen(true);
  };

  const handleSubmit = async (entries: TimetableEntryInput[]) => {
    setSubmitting(true);
    let res;
    if (modalMode === 'add') {
      res = await add(entries);
    } else {
      const updates: TimetableEntryUpdate[] = (editing ?? []).map((e, i) => ({
        id: e.id,
        ...entries[i],
      }));
      res = await update(updates);
    }
    setSubmitting(false);
    if (res?.success) {
      setToast({ msg: modalMode === 'add' ? 'Added successfully' : 'Updated successfully', type: 'success' });
      setModalOpen(false);
    } else {
      setToast({ msg: res?.error || 'Failed to save', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await remove(deleteTarget.id);
    setDeleting(false);
    if (res?.success) {
      setToast({ msg: 'Deleted successfully', type: 'success' });
      setDeleteTarget(null);
    } else {
      setToast({ msg: res?.error || 'Failed to delete', type: 'error' });
    }
  };

  const count = safeTimetables.length;
  const showInitialLoader = isLoading && count === 0;
  const showErrorState = !!error && count === 0;

  if (showInitialLoader) {
    return (
      <PageShell>
        <Header
          title="My Advisor Timetable"
          subtitle={`${count} entr${Number(count) === 1 ? 'y' : 'ies'}`}
          view={view}
          onViewChange={setView}
          onAdd={openAdd}
          onBack={onBack}
        />
        <TimetableSkeleton />
      </PageShell>
    );
  }

  if (showErrorState) {
    return (
      <PageShell>
        <Header
          title="My Advisor Timetable"
          subtitle={`${count} entr${Number(count) === 1 ? 'y' : 'ies'}`}
          view={view}
          onViewChange={setView}
          onAdd={openAdd}
          onBack={onBack}
        />
        <TimetableErrorState message={error as string} onRetry={() => refresh(true)} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header
        title="My Advisor Timetable"
        subtitle={`${count} entr${Number(count) === 1 ? 'y' : 'ies'}`}
        view={view}
        onViewChange={setView}
        onAdd={openAdd}
        onBack={onBack}
      />

      {count === 0 ? (
        <TimetableEmptyState
          title="No slots scheduled"
          description="Add your first slot to get started with your advising timetable."
          actionLabel="Add slot"
          onAction={openAdd}
        />
      ) : view === 'grid' ? (
        <TimetableGrid entries={safeTimetables} onEntryClick={openEdit} />
      ) : (
        <TimetableList
          entries={safeTimetables}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <BulkTimetableModal
        open={modalOpen}
        mode={modalMode}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete timetable entry?"
        description={
          deleteTarget
            ? `${deleteTarget.course} on ${deleteTarget.day} will be removed from your schedule.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageShell>
  );
};

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.3 }}
    className="relative min-h-screen w-full max-w-6.5xl mx-auto p-4 md:p-8 pb-10 -mt-6 font-sans"
  >
    {children}
  </motion.div>
);

export const Header: React.FC<{
  title: string;
  subtitle?: string;
  view: string;
  onViewChange: (v: any) => void;
  onAdd: () => void;
  onBack?: () => void;
}> = ({ title, subtitle, view, onViewChange, onAdd, onBack }) => (
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
      {/* Heading section moved to md:ml-20 */}
      <div className="flex items-center gap-4 md:ml-20">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">
            {title}
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            {subtitle ? `${subtitle}` : "Manage your schedule"}
          </p>
        </div>
      </div>

      {/* Right controls moved to md:mr-20 */}
      <div className="flex items-center gap-3 self-start md:self-auto md:mr-20">
        {onViewChange && (
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`px-4 py-2 text-[10px] md:text-[12px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  view === v 
                    ? 'bg-[#1e3a5f] text-white shadow-sm' 
                    : 'text-slate-500 hover:text-[#1e3a5f]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1e3a5f] text-white text-[10px] md:text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-amber-500 shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Slot</span>
          </button>
        )}
      </div>
    </div>
  </div>
);