import React from 'react';
import { StatusUpdateProps } from './type/type';

export const StatusUpdate: React.FC<StatusUpdateProps> = ({
  currentStatus,
  isOwner,
  onStatusChange,
}) => {
  if (!isOwner || currentStatus === 'Closed') return null;

  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border transition-all ${
            currentStatus === status
              ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          onClick={() => onStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
};