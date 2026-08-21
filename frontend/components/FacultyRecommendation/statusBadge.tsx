// components/FacultyRecommendation/components/StatusBadge.tsx

import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { StatusBadgeProps } from './type/type';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isUrgent, id }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Closed':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle size={14} />;
      case 'In Progress':
        return <ClockIcon size={14} />;
      case 'Resolved':
        return <CheckCircle size={14} />;
      case 'Closed':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(
          status
        )}`}
      >
        {getStatusIcon(status)} {status}
      </span>
      {isUrgent && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border bg-red-50 text-red-600 border-red-200">
          <AlertCircle size={12} /> Urgent
        </span>
      )}
    </div>
  );
};