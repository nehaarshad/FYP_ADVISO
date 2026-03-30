"use client";
import React from 'react';
import { Layers, FileSpreadsheet } from "lucide-react";

export function RoadmapSection({ type }: { type: 'cs' | 'se' }) {
  const isCS = type === 'cs';
  return (
    <div className="space-y-8">
      <div className={`flex flex-col md:flex-row justify-between items-end gap-6 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden ${isCS ? 'bg-[#0f172a]' : 'bg-[#1e3a5f]'}`}>
        <div className="relative z-10">
          <h1 className={`text-4xl font-black uppercase italic tracking-tighter ${isCS ? 'text-blue-400' : 'text-[#FDB813]'}`}>{isCS ? 'CS Roadmap' : 'SE Roadmap'}</h1>
          <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">{isCS ? 'Computer Science Department' : 'Software Engineering Department'}</p>
        </div>
        <Layers className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
      </div>
      <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-slate-50 text-center">
        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${isCS ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-[#FDB813]'}`}><FileSpreadsheet size={32}/></div>
        <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic mb-2">Update {isCS ? 'CS' : 'SE'} Scheme</h2>
        <p className="text-slate-400 font-bold text-xs mb-8">Upload the latest academic roadmap (Excel/PDF) for the current session</p>
        <div className="flex justify-center gap-4">
          <button className="px-10 py-4 bg-[#1e3a5f] text-white rounded-2xl font-black text-xs uppercase shadow-xl tracking-widest hover:scale-105 transition-transform">Choose File</button>
          <button className="px-10 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest">View Current</button>
        </div>
      </div>
    </div>
  );
}