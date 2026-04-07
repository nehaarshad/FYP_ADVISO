import React from 'react';

export const RoadmapProgress = () => {
  const categories = [
    { name: "Computing Core", earned: 30, total: 39, color: "bg-[#FF0000]" },
    { name: "Math & Science", earned: 9, total: 12, color: "bg-[#D9A7A7]" },
    { name: "General Ed", earned: 15, total: 19, color: "bg-[#A6A6A6]" },
    { name: "SE Core", earned: 18, total: 24, color: "bg-[#FFFF00]" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((cat, i) => (
        <div key={i}>
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-black text-[#1e3a5f] uppercase">{cat.name}</span>
            <span className="text-[10px] font-bold text-slate-400">{cat.earned}/{cat.total}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${cat.color}`} style={{ width: `${(cat.earned/cat.total)*100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};