import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Program } from './types';

interface RoadmapFilterProps {
  programs: Program[];
  selectedProgram: string;
  onProgramChange: (program: string) => void;
  error: string | null;
  onClearError: () => void;
  isSwitchingProgram: boolean;
}

export function RoadmapFilter({ 
  programs, 
  selectedProgram, 
  onProgramChange, 
  error, 
  onClearError,
  isSwitchingProgram 
}: RoadmapFilterProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            title="program-selector"
            value={selectedProgram}
            onChange={(e) => onProgramChange(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            disabled={isSwitchingProgram}
          >
            {programs.length === 0 ? (
              <option value="">Loading programs...</option>
            ) : (
              programs.map((p) => (
                <option key={p.id} value={p.programName}>{p.programName}</option>
              ))
            )}
          </select>
        </div>
        
        {error && (
          <div className="text-red-500 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
            <button onClick={onClearError} className="text-red-600 underline">Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}