"use client";
import React from 'react';
import { CloudUpload, Upload, FileText, ExternalLink, Trash2 } from "lucide-react";

export function SessionManager({ selectedSession, setSelectedSession }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div><h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">Session Repository</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Academic Files (SRS-7.3)</p></div>
        <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
          {["Fall 2025", "Spring 2026"].map(s => (
            <button key={s} onClick={() => setSelectedSession(s)} className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all shadow-sm ${selectedSession === s ? 'bg-[#1e3a5f] text-white' : 'text-slate-400 hover:text-[#1e3a5f]'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8 text-[#FDB813]"><CloudUpload size={20} /><h3 className="font-black uppercase italic text-sm tracking-wider">New Upload</h3></div>
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Category</label>
              <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none appearance-none cursor-pointer">
                <option>Course Offering</option><option>Sessional Timetable</option><option>Batch Results</option><option>Other Documents</option>
              </select>
            </div>
            <div className="border-4 border-dashed border-slate-50 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center group hover:border-[#FDB813]/20 transition-colors cursor-pointer">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform"><Upload size={32} /></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Drop file to sync</p>
            </div>
          </div>
          <button className="w-full mt-8 bg-[#FDB813] text-[#1e3a5f] py-5 rounded-2xl font-black text-xs shadow-xl hover:scale-[1.02] transition-transform uppercase tracking-widest">Sync to {selectedSession}</button>
        </div>

        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8"><h3 className="font-black uppercase italic text-sm tracking-wider text-[#1e3a5f]">Active Files for {selectedSession}</h3><span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">3 Files</span></div>
          <div className="space-y-4">
            <SessionFileRow name="CS_Offerings_F25.pdf" category="Course Offering" date="20 Mar 2026" />
            <SessionFileRow name="Timetable_v2_Final.xlsx" category="Sessional Timetable" date="22 Mar 2026" />
            <SessionFileRow name="BCS_Batch22_Results.csv" category="Batch Results" date="24 Mar 2026" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionFileRow({ name, category, date }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm group-hover:bg-[#1e3a5f] group-hover:text-white transition-all"><FileText size={20} /></div>
        <div><p className="text-sm font-black text-[#1e3a5f]">{name}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{category}</p></div>
      </div>
      <div className="flex items-center gap-6"><p className="text-[10px] font-bold text-slate-300 uppercase">{date}</p><div className="flex gap-2"><button className="p-3 bg-white text-slate-400 hover:text-blue-500 rounded-xl shadow-sm border border-slate-100"><ExternalLink size={14}/></button><button className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100"><Trash2 size={14}/></button></div></div>
    </div>
  );
}