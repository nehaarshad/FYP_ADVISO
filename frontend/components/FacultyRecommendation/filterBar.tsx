// components/FacultyRecommendation/filterBar.tsx

import React from 'react';
import { Filter, X, User } from 'lucide-react';

interface FilterBarProps {
  showFilterMenu: boolean;
  selectedStatus: string;
  selectedPostingAdvisor?: number;
  currentUserId?: number;
  onStatusChange: (status: string) => void;
  onAdvisorChange: (advisorId: number | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onToggle: () => void;
  showMyIssues?: boolean;
  onMyIssuesToggle?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  showFilterMenu,
  selectedStatus,
  selectedPostingAdvisor,
  currentUserId,
  onStatusChange,
  onAdvisorChange,
  onApply,
  onClear,
  onToggle,
  showMyIssues = false,
  onMyIssuesToggle,
}) => {
  if (!showFilterMenu) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
            Status
          </label>
          <select
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-blue-500/50"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* My Issues Filter */}
        {currentUserId && (
          <div className="flex-1 min-w-[150px] flex items-end">
            <button
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                showMyIssues
                  ? 'bg-[#1e3a5f] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={onMyIssuesToggle}
            >
              <User size={14} />
              My Issues
            </button>
          </div>
        )}

       
      </div>
    </div>
  );
};