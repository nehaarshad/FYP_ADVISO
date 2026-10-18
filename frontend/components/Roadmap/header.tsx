
"use client";
import React from 'react';
import { CloudUpload } from 'lucide-react';

interface RoadmapHeaderProps {
  showUploadForm: boolean;
  onToggleUpload: () => void;
}

export function RoadmapHeader({ showUploadForm, onToggleUpload }: RoadmapHeaderProps) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] uppercase tracking-tighter">
          Roadmap Management
        </h2>
        <p className="text-xs text-slate-400 mt-1">View, filter and manage academic roadmaps</p>
      </div>
      <button
        onClick={onToggleUpload}
        className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all flex items-center gap-2"
      >
        <CloudUpload size={16} />
        {showUploadForm ? 'Cancel' : 'Upload New Roadmap'}
      </button>
    </div>
  );
}