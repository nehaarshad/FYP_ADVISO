// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { BulkTimetableModal } from '@/components/Timetable/BulkTimetableModal';
// // import { ConfirmationDialog } from '@/components/Timetable/ConfirmationDialog';
// // import { TimetableEmptyState } from '@/components/Timetable/TimetableEmptyState';
// // import { TimetableErrorState } from '@/components/Timetable/TimetableErrorState';
// // import { TimetableGrid } from '@/components/Timetable/TimetableGrid';
// // import { TimetableList } from '@/components/Timetable/TimetableList';
// // import { TimetableSkeleton } from '@/components/Timetable/TimetableSkeleton';
// // import { Toast, ToastType } from '@/components/Timetable/Toast';
// // import { TimetableEntry, TimetableEntryInput, TimetableEntryUpdate } from '@/components/Timetable/types';
// // import { useBatchTimetable } from '@/src/hooks/batchTimetableHook/useBatchTimetable';
// // import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// // import React, { useMemo, useState } from 'react';

// // interface BatchTimetablePageProps {
// //   onBack?: () => void;
// // }

// // const asArray = <T,>(v: unknown): T[] => {
// //   if (Array.isArray(v)) return v as T[];
// //   const nested = (v as any)?.data;
// //   if (Array.isArray(nested)) return nested as T[];
// //   return [];
// // };


// // export const BatchTimetablePage: React.FC<BatchTimetablePageProps> = ({ onBack }) => {
// //   const currentUser = sessionManager.getCurrentUser<any>();
// //   const userId = currentUser?.data?.id || currentUser?.id;

// //   const {
// //     timetables,
// //     isLoading,
// //     error,
// //     refresh,
// //     add,
// //     update,
// //     remove,
// //   } = useBatchTimetable(userId);

// //   const safeTimetables = useMemo<TimetableEntry[]>(
// //     () => asArray<TimetableEntry>(timetables),
// //     [timetables]
// //   );
  

// //   const isOwner = (entry: TimetableEntry) => entry.userId === parseInt(userId);

// //   const personalIds = useMemo(
// //     () =>
// //       new Set(
// //         safeTimetables
// //           .filter((t) => t.userId === userId)
// //           .map((t) => t.id)
// //       ),
// //     [safeTimetables, userId]
// //   );

// //   const [view, setView] = useState<'list' | 'grid'>('list');
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
// //   const [editing, setEditing] = useState<TimetableEntry[] | null>(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [deleteTarget, setDeleteTarget] = useState<TimetableEntry | null>(null);
// //   const [deleting, setDeleting] = useState(false);
// //   const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

// //   const openAdd = () => {
// //     setModalMode('add');
// //     setEditing(null);
// //     setModalOpen(true);
// //   };

// //   /** Only open editor if the current user owns the entry */
// //   const openEdit = (entry: TimetableEntry) => {
// //     if (!isOwner(entry)) {
// //       setToast({ msg: "You can only edit your own entries", type: 'error' });
// //       return;
// //     }
// //     setModalMode('edit');
// //     setEditing([entry]);
// //     setModalOpen(true);
// //   };

// //   /** Guard delete request at handler level too */
// //   const requestDelete = (entry: TimetableEntry) => {
// //     if (!isOwner(entry)) {
// //       setToast({ msg: "You can only delete your own entries", type: 'error' });
// //       return;
// //     }
// //     setDeleteTarget(entry);
// //   };

// //   const handleSubmit = async (entries: TimetableEntryInput[]) => {
// //     // For 'edit' mode, ensure the target still belongs to the user
// //     if (modalMode === 'edit' && editing) {
// //       const unauthorized = editing.find((e) => !isOwner(e));
// //       if (unauthorized) {
// //         setToast({ msg: "You can only edit your own entries", type: 'error' });
// //         return;
// //       }
// //     }

// //     setSubmitting(true);
// //     let res;
// //     if (modalMode === 'add') {
// //       res = await add(entries);
// //     } else {
// //       const updates: TimetableEntryUpdate[] = (editing ?? []).map((e, i) => ({
// //         id: e.id,
// //         ...entries[i],
// //       }));
// //       res = await update(updates);
// //     }
// //     setSubmitting(false);

// //     if (res?.success) {
// //       setToast({ msg: modalMode === 'add' ? 'Added' : 'Updated', type: 'success' });
// //       setModalOpen(false);
// //     } else {
// //       setToast({ msg: res?.error || 'Failed', type: 'error' });
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!deleteTarget || deleting) return;
// //     if (!isOwner(deleteTarget)) {
// //       setToast({ msg: "You can only delete your own entries", type: 'error' });
// //       setDeleteTarget(null);
// //       return;
// //     }

// //     setDeleting(true);
// //     const res = await remove(deleteTarget.id);
// //     setDeleting(false);

// //     if (res?.success) {
// //       setToast({ msg: 'Deleted', type: 'success' });
// //       setDeleteTarget(null);
// //     } else {
// //       const msg = res?.error || 'Failed';
// //       if (/not found/i.test(msg)) {
// //         setToast({ msg: 'Already deleted', type: 'success' });
// //         setDeleteTarget(null);
// //         await refresh(true);
// //       } else {
// //         setToast({ msg, type: 'error' });
// //       }
// //     }
// //   };

// //   const count = safeTimetables.length;
// //   const showInitialLoader = isLoading && count === 0;
// //   const showErrorState = !!error && count === 0;

// //   if (showInitialLoader) {
// //     return (
// //       <PageShell>
// //         <Header
// //           title="My Batch Timetable"
// //           view={view}
// //           onViewChange={setView}
// //           onAdd={openAdd}
// //           onBack={onBack}
// //         />
// //         <TimetableSkeleton />
// //       </PageShell>
// //     );
// //   }

// //   if (showErrorState) {
// //     return (
// //       <PageShell>
// //         <Header
// //           title="My Batch Timetable"
// //           view={view}
// //           onViewChange={setView}
// //           onAdd={openAdd}
// //           onBack={onBack}
// //         />
// //         <TimetableErrorState message={error as string} onRetry={() => refresh(true)} />
// //       </PageShell>
// //     );
// //   }

// //   return (
// //     <PageShell>
// //       <Header
// //         title="My Batch Timetable"
// //         subtitle={`${count} entr${count === 1 ? 'y' : 'ies'}`}
// //         view={view}
// //         onViewChange={setView}
// //         onAdd={openAdd}
// //         onBack={onBack}
// //       />

// //       {count === 0 ? (
// //         <TimetableEmptyState
// //           title="No classes scheduled"
// //           description="Add your first class entry to get started."
// //           actionLabel="Add entry"
// //           onAction={openAdd}
// //         />
// //       ) : view === 'grid' ? (
// //         <TimetableGrid
// //           entries={safeTimetables}
// //           // Grid shows all entries; only editable ones respond to click
// //           onEntryClick={(e) => isOwner(e) && openEdit(e)}
// //         />
// //       ) : (
// //         <TimetableList
// //           entries={safeTimetables}
// //           variantResolver={(e) => (personalIds.has(e.id) ? 'personal' : 'regular')}
// //           canEditResolver={isOwner}
// //           canDeleteResolver={isOwner}
// //           onEdit={openEdit}
// //           onDelete={requestDelete}
// //         />
// //       )}

// //       <BulkTimetableModal
// //         open={modalOpen}
// //         mode={modalMode}
// //         submitting={submitting}
// //         onClose={() => setModalOpen(false)}
// //         onSubmit={handleSubmit}
// //       />

// //       <ConfirmationDialog
// //         open={!!deleteTarget}
// //         title="Delete timetable entry?"
// //         description={
// //           deleteTarget
// //             ? `${deleteTarget.course} on ${deleteTarget.day} will be removed.`
// //             : ''
// //         }
// //         confirmLabel="Delete"
// //         loading={deleting}
// //         onConfirm={handleDelete}
// //         onCancel={() => setDeleteTarget(null)}
// //       />

// //       {toast && (
// //         <Toast
// //           message={toast.msg}
// //           type={toast.type}
// //           onClose={() => setToast(null)}
// //         />
// //       )}
// //     </PageShell>
// //   );
// // };

// // export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
// //   <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
// // );

// // export const Header: React.FC<{
// //   title: string;
// //   subtitle?: string;
// //   view: 'list' | 'grid';
// //   onViewChange: (v: 'list' | 'grid') => void;
// //   onAdd: () => void;
// //   onBack?: () => void;
// // }> = ({ title, subtitle, view, onViewChange, onAdd, onBack }) => (
// //   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
// //     <div className="flex items-center gap-3 min-w-0">
// //       {onBack && (
// //         <button
// //           onClick={onBack}
// //           aria-label="Go back"
// //           className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition shrink-0"
// //         >
// //           <svg
// //             className="w-5 h-5"
// //             fill="none"
// //             stroke="currentColor"
// //             viewBox="0 0 24 24"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth={2}
// //               d="M15 19l-7-7 7-7"
// //             />
// //           </svg>
// //         </button>
// //       )}
// //       <div className="min-w-0">
// //         <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
// //         {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
// //       </div>
// //     </div>

// //    {
// //     title !=="Batch Meetings" ?
// //      <div className="flex items-center gap-3 shrink-0">
// //       <div className="inline-flex p-1 bg-gray-100 rounded-lg">
// //         {(['list', 'grid'] as const).map((v) => (
// //           <button
// //             key={v}
// //             onClick={() => onViewChange(v)}
// //             className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${
// //               view === v ? 'bg-white shadow text-gray-900' : 'text-gray-500'
// //             }`}
// //           >
// //             {v}
// //           </button>
// //         ))}
// //       </div>

// //       <button
// //         onClick={onAdd}
// //         className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
// //       >
// //         + Add
// //       </button>
// //     </div>

// //     :

// //     null
// //    }
// //   </div>
// // );



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { BulkTimetableModal } from '@/components/Timetable/BulkTimetableModal';
// import { ConfirmationDialog } from '@/components/Timetable/ConfirmationDialog';
// import { TimetableEmptyState } from '@/components/Timetable/TimetableEmptyState';
// import { TimetableErrorState } from '@/components/Timetable/TimetableErrorState';
// import { TimetableGrid } from '@/components/Timetable/TimetableGrid';
// import { TimetableList } from '@/components/Timetable/TimetableList';
// import { TimetableSkeleton } from '@/components/Timetable/TimetableSkeleton';
// import { Toast, ToastType } from '@/components/Timetable/Toast';
// import { TimetableEntry, TimetableEntryInput, TimetableEntryUpdate } from '@/components/Timetable/types';
// import { useBatchTimetable } from '@/src/hooks/batchTimetableHook/useBatchTimetable';
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import React, { useMemo, useState } from 'react';

// interface BatchTimetablePageProps {
//   onBack?: () => void;
// }

// const asArray = <T,>(v: unknown): T[] => {
//   if (Array.isArray(v)) return v as T[];
//   const nested = (v as any)?.data;
//   if (Array.isArray(nested)) return nested as T[];
//   return [];
// };

// export const BatchTimetablePage: React.FC<BatchTimetablePageProps> = ({ onBack }) => {
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
//   } = useBatchTimetable(userId);

//   const safeTimetables = useMemo<TimetableEntry[]>(
//     () => asArray<TimetableEntry>(timetables),
//     [timetables]
//   );

//   const isOwner = (entry: TimetableEntry) => entry.userId === parseInt(userId);

//   const personalIds = useMemo(
//     () =>
//       new Set(
//         safeTimetables
//           .filter((t) => t.userId === userId)
//           .map((t) => t.id)
//       ),
//     [safeTimetables, userId]
//   );

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
//     if (!isOwner(entry)) {
//       setToast({ msg: "You can only edit your own entries", type: 'error' });
//       return;
//     }
//     setModalMode('edit');
//     setEditing([entry]);
//     setModalOpen(true);
//   };

//   const requestDelete = (entry: TimetableEntry) => {
//     if (!isOwner(entry)) {
//       setToast({ msg: "You can only delete your own entries", type: 'error' });
//       return;
//     }
//     setDeleteTarget(entry);
//   };

//   const handleSubmit = async (entries: TimetableEntryInput[]) => {
//     if (modalMode === 'edit' && editing) {
//       const unauthorized = editing.find((e) => !isOwner(e));
//       if (unauthorized) {
//         setToast({ msg: "You can only edit your own entries", type: 'error' });
//         return;
//       }
//     }

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
//     if (!deleteTarget || deleting) return;
//     if (!isOwner(deleteTarget)) {
//       setToast({ msg: "You can only delete your own entries", type: 'error' });
//       setDeleteTarget(null);
//       return;
//     }

//     setDeleting(true);
//     const res = await remove(deleteTarget.id);
//     setDeleting(false);

//     if (res?.success) {
//       setToast({ msg: 'Deleted successfully', type: 'success' });
//       setDeleteTarget(null);
//     } else {
//       const msg = res?.error || 'Failed';
//       if (/not found/i.test(msg)) {
//         setToast({ msg: 'Already deleted', type: 'success' });
//         setDeleteTarget(null);
//         await refresh(true);
//       } else {
//         setToast({ msg, type: 'error' });
//       }
//     }
//   };

//   const count = safeTimetables.length;
//   const showInitialLoader = isLoading && count === 0;
//   const showErrorState = !!error && count === 0;

//   if (showInitialLoader) {
//     return (
//       <PageShell>
//         <Header
//           title="My Batch Timetable"
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
//           title="My Batch Timetable"
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
//         title="My Batch Timetable"
//         subtitle={`${count} entr${count === 1 ? 'y' : 'ies'}`}
//         view={view}
//         onViewChange={setView}
//         onAdd={openAdd}
//         onBack={onBack}
//       />

//       {count === 0 ? (
//         <TimetableEmptyState
//           title="No classes scheduled"
//           description="Add your first class entry to get started."
//           actionLabel="Add entry"
//           onAction={openAdd}
//         />
//       ) : view === 'grid' ? (
//         <TimetableGrid
//           entries={safeTimetables}
//           onEntryClick={(e) => isOwner(e) && openEdit(e)}
//         />
//       ) : (
//         <TimetableList
//           entries={safeTimetables}
//           variantResolver={(e) => (personalIds.has(e.id) ? 'personal' : 'regular')}
//           canEditResolver={isOwner}
//           canDeleteResolver={isOwner}
//           onEdit={openEdit}
//           onDelete={requestDelete}
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

// export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
// );

// export const Header: React.FC<{
//   title: string;
//   subtitle?: string;
//   view: 'list' | 'grid';
//   onViewChange: (v: 'list' | 'grid') => void;
//   onAdd: () => void;
//   onBack?: () => void;
// }> = ({ title, subtitle, view, onViewChange, onAdd, onBack }) => (
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
//         <h1 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight truncate">{title}</h1>
//         {subtitle && <p className="text-[11px] font-extrabold text-[#FDB813] uppercase tracking-wider mt-0.5">{subtitle}</p>}
//       </div>
//     </div>

//     {title !== "Batch Meetings" ? (
//       <div className="flex items-center gap-3 shrink-0">
//         <div className="inline-flex p-1 bg-slate-100 border border-slate-200/60 rounded-xl">
//           {(['list', 'grid'] as const).map((v) => (
//             <button
//               key={v}
//               onClick={() => onViewChange(v)}
//               className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
//                 view === v ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-slate-400 hover:text-slate-600'
//               }`}
//             >
//               {v}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={onAdd}
//           className="px-5 py-2.5 bg-[#FDB813] hover:bg-[#e5a40f] text-[#1e3a5f] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FDB813]/20 flex items-center gap-1.5"
//         >
//           <span className="text-sm font-black">+</span> Add
//         </button>
//       </div>
//     ) : null}
//   </div>
// );


/* eslint-disable @typescript-eslint/no-explicit-any */
import { BulkTimetableModal } from '@/components/Timetable/BulkTimetableModal';
import { ConfirmationDialog } from '@/components/Timetable/ConfirmationDialog';
import { TimetableEmptyState } from '@/components/Timetable/TimetableEmptyState';
import { TimetableErrorState } from '@/components/Timetable/TimetableErrorState';
import { TimetableGrid } from '@/components/Timetable/TimetableGrid';
import { TimetableList } from '@/components/Timetable/TimetableList';
import { TimetableSkeleton } from '@/components/Timetable/TimetableSkeleton';
import { Toast, ToastType } from '@/components/Timetable/Toast';
import { TimetableEntry, TimetableEntryInput, TimetableEntryUpdate } from '@/components/Timetable/types';
import { useBatchTimetable } from '@/src/hooks/batchTimetableHook/useBatchTimetable';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import React, { useMemo, useState } from 'react';

interface BatchTimetablePageProps {
  onBack?: () => void;
}

const asArray = <T,>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  const nested = (v as any)?.data;
  if (Array.isArray(nested)) return nested as T[];
  return [];
};

export const BatchTimetablePage: React.FC<BatchTimetablePageProps> = ({ onBack }) => {
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
  } = useBatchTimetable(userId);

  const safeTimetables = useMemo<TimetableEntry[]>(
    () => asArray<TimetableEntry>(timetables),
    [timetables]
  );

  const isOwner = (entry: TimetableEntry) => entry.userId === parseInt(userId);

  const personalIds = useMemo(
    () =>
      new Set(
        safeTimetables
          .filter((t) => t.userId === userId)
          .map((t) => t.id)
      ),
    [safeTimetables, userId]
  );

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
    if (!isOwner(entry)) {
      setToast({ msg: "You can only edit your own entries", type: 'error' });
      return;
    }
    setModalMode('edit');
    setEditing([entry]);
    setModalOpen(true);
  };

  const requestDelete = (entry: TimetableEntry) => {
    if (!isOwner(entry)) {
      setToast({ msg: "You can only delete your own entries", type: 'error' });
      return;
    }
    setDeleteTarget(entry);
  };

  const handleSubmit = async (entries: TimetableEntryInput[]) => {
    if (modalMode === 'edit' && editing) {
      const unauthorized = editing.find((e) => !isOwner(e));
      if (unauthorized) {
        setToast({ msg: "You can only edit your own entries", type: 'error' });
        return;
      }
    }

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
    if (!deleteTarget || deleting) return;
    if (!isOwner(deleteTarget)) {
      setToast({ msg: "You can only delete your own entries", type: 'error' });
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    const res = await remove(deleteTarget.id);
    setDeleting(false);

    if (res?.success) {
      setToast({ msg: 'Deleted successfully', type: 'success' });
      setDeleteTarget(null);
    } else {
      const msg = res?.error || 'Failed';
      if (/not found/i.test(msg)) {
        setToast({ msg: 'Already deleted', type: 'success' });
        setDeleteTarget(null);
        await refresh(true);
      } else {
        setToast({ msg, type: 'error' });
      }
    }
  };

  const count = safeTimetables.length;
  const showInitialLoader = isLoading && count === 0;
  const showErrorState = !!error && count === 0;

  if (showInitialLoader) {
    return (
      <PageShell>
        <Header
          title="My Batch Timetable"
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
          title="My Batch Timetable"
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
        title="My Batch Timetable"
        subtitle={`${count} entr${count === 1 ? 'y' : 'ies'}`}
        view={view}
        onViewChange={setView}
        onAdd={openAdd}
        onBack={onBack}
      />

      {count === 0 ? (
        <TimetableEmptyState
          title="No classes scheduled"
          description="Add your first class entry to get started."
          actionLabel="Add entry"
          onAction={openAdd}
        />
      ) : view === 'grid' ? (
        <TimetableGrid
          entries={safeTimetables}
          onEntryClick={(e) => isOwner(e) && openEdit(e)}
        />
      ) : (
        <TimetableList
          entries={safeTimetables}
          variantResolver={(e) => (personalIds.has(e.id) ? 'personal' : 'regular')}
          canEditResolver={isOwner}
          canDeleteResolver={isOwner}
          onEdit={openEdit}
          onDelete={requestDelete}
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
            ? `${deleteTarget.course} on ${deleteTarget.day} will be removed.`
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
  <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
);

export const Header: React.FC<{
  title: string;
  subtitle?: string;
  view: 'list' | 'grid';
  onViewChange: (v: 'list' | 'grid') => void;
  onAdd: () => void;
  onBack?: () => void;
}> = ({ title, subtitle, view, onViewChange, onAdd, onBack }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
    <div className="flex items-center gap-3 min-w-0">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-50 border border-slate-100 rounded-xl transition shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div className="min-w-0">
        <h1 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-[11px] font-extrabold text-[#FDB813] uppercase tracking-wider mt-0.5">{subtitle}</p>}
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0">
      <div className="inline-flex p-1 bg-slate-50 rounded-xl border border-slate-200">
        {(['list', 'grid'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              view === v 
                ? 'bg-[#1e3a5f] text-white shadow-sm' 
                : 'text-slate-500 hover:text-[#1e3a5f]'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="px-5 py-2.5 bg-[#FDB813] hover:bg-[#e5a40f] text-[#1e3a5f] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FDB813]/20 flex items-center gap-1.5"
      >
        <span className="text-sm font-black">+</span> Add
      </button>
    </div>
  </div>
);