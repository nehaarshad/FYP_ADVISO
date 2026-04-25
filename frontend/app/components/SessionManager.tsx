/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { CloudUpload, Upload } from "lucide-react";

export function SessionManager({ selectedSession, setSelectedSession }: any) {
  return (
    <div className="space-y-4"> {/* Spacing kam kar di */}
      {/* Session Toggle Header - More compact */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">Session Repository</h2>

        </div>
      </div>

      {/* Upload Section - Reduced Height & Padding */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5 text-[#FDB813]">
            <CloudUpload size={18} />
            <h3 className="font-black uppercase italic text-xs tracking-wider text-[#1e3a5f]">New Upload</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">File Category</label>
              <select title='uploadType' className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.2rem] text-xs font-bold focus:ring-2 focus:ring-[#FDB813] outline-none cursor-pointer">
                <option>Course Offering</option>
                <option>Sessional Timetable</option>
                <option>Batch Results</option>
               
              </select>
            </div>

            {/* Reduced height drop zone */}
            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-10 flex flex-col items-center justify-center text-center group hover:border-[#FDB813]/20 transition-colors cursor-pointer">
              <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-3 group-hover:scale-105 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Drop file to sync</p>
            </div>
          </div>

          <button className="w-full mt-6 bg-[#FDB813] text-[#1e3a5f] py-4 rounded-xl font-black text-[10px] shadow-lg active:scale-95 transition-all uppercase tracking-widest">
            Sync to {selectedSession}
          </button>
        </div>
      </div>
    </div>
  );
}