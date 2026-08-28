// components/GuidelinesFilters.tsx
import React from "react";
import { Search } from "lucide-react";

interface GuidelinesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedProgram: string;
  onFilterChange: (value: string) => void;
  programOptions: { value: string; label: string }[];
}

export const GuidelinesFilters: React.FC<GuidelinesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedProgram,
  onFilterChange,
  programOptions,
}) => {
  return (
    <div className="p-4 md:p-6 shrink-0 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>
        <select
          value={selectedProgram}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
        >
          {programOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};