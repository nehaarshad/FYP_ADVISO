// components/FacultyRecommendation/components/SearchBar.tsx

import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { SearchBarProps } from './type/type';

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterToggle,
  onAddNew,
  openCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase leading-none">
          Faculty Recommendations
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
          {openCount} Open • {totalCount} Total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        <button
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-colors"
          onClick={onFilterToggle}
        >
          <Filter size={14} /> Filter
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all hover:shadow-lg"
        >
          <Plus size={14} /> New
        </button>
      </div>
    </div>
  );
};