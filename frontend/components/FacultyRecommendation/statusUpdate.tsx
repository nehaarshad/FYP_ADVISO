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
          className={`px-4 py-2 rounded-full text-[13px] font-bold  border transition-all ${
            currentStatus === status
              ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
              : 'bg-slate-300 text-slate-600 border-slate-200 hover:bg-slate-400'
          }`}
          onClick={() => onStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
};