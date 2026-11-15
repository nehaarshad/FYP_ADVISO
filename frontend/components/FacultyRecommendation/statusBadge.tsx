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
        return <AlertCircle size={15} />;
      case 'In Progress':
        return <ClockIcon size={15} />;
      case 'Resolved':
        return <CheckCircle size={15} />;
      case 'Closed':
        return <XCircle size={15} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold  border ${getStatusColor(
          status
        )}`}
      >
        {getStatusIcon(status)} {status}
      </span>
      {isUrgent && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[13px] font-bold  border bg-red-50 text-red-600 border-red-200">
          <AlertCircle size={16} /> Urgent
        </span>
      )}
    </div>
  );
};