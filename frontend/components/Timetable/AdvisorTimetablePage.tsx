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
//     // Handle wrapped responses just in case the store missed a layer
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
//       setToast({ msg: modalMode === 'add' ? 'Added' : 'Updated', type: 'success' });
//       setModalOpen(false);
//     } else {
//       setToast({ msg: res?.error || 'Failed', type: 'error' });
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     const res = await remove(deleteTarget.id);
//     setDeleting(false);
//     if (res?.success) {
//       setToast({ msg: 'Deleted', type: 'success' });
//       setDeleteTarget(null);
//     } else {
//       setToast({ msg: res?.error || 'Failed', type: 'error' });
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
//           description="Add your first slot to get started."
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
//             ? `${deleteTarget.course} on ${deleteTarget.day} will be removed.`
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
import { Header, PageShell } from '@/components/Timetable/Timetable';

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
        subtitle={`${count} entr${count === 1 ? 'y' : 'ies'}`}
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