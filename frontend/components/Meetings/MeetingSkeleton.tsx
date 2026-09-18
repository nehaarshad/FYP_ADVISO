
import React from 'react';

export const MeetingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-5 bg-slate-200 rounded-md w-20" />
          <div className="h-5 bg-slate-100 rounded-md w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        </div>
      </div>
    ))}
  </div>
);