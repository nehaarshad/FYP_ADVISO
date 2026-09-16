import React from 'react';

export const MeetingSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 bg-white border rounded-xl space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    ))}
  </div>
);