// import React from 'react';
// import { BookOpen } from 'lucide-react';

// interface EmptyStateProps {
//   title: string;
//   message: string;
//   icon?: React.ReactNode;
// }

// export function EmptyState({ title, message, icon }: EmptyStateProps) {
//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
//       {icon || <BookOpen size={48} className="mx-auto text-amber-500 mb-4" />}
//       <p className="text-slate-500 font-bold">{title}</p>
//       <p className="text-slate-400 text-sm">{message}</p>
//     </div>
//   );
// }


import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
      {icon || <BookOpen size={48} className="mx-auto text-[#F2A93B] mb-4" />}
      <p className="text-[#1B4B82] font-semibold text-base">{title}</p>
      <p className="text-[#8293AA] text-sm font-normal">{message}</p>
    </div>
  );
}