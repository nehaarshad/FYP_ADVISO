"use client";
import React from 'react';
import { CalendarDays, Upload, Eye, Clock, CheckCircle2 } from "lucide-react";

export const Timetable = ({ session }: { session: string }) => {

  const timetables = [
    { id: 1, section: "CS - Batch 2021", type: "Regular", status: "Uploaded", lastUpdated: "2 days ago" },
    { id: 2, section: "SE - Batch 2022", type: "Regular", status: "Pending", lastUpdated: "Never" },
    { id: 3, section: "CS - Batch 2023", type: "Regular", status: "Uploaded", lastUpdated: "Today" },
  ];

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Class Timetables</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Manage Weekly Schedules for {session}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all shadow-md">
          <Upload size={14} /> Add New Timetable
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timetables.map((item) => (
          <div key={item.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-[#1e3a5f]/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm group-hover:bg-[#FDB813] transition-colors">
                <CalendarDays size={24} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${
                item.status === 'Uploaded' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {item.status === 'Uploaded' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                {item.status}
              </div>
            </div>

            <h4 className="font-black text-[#1e3a5f] text-md leading-tight uppercase">{item.section}</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Type: {item.type}</p>
            <p className="text-[8px] text-slate-300 font-medium uppercase mt-4 italic">Updated: {item.lastUpdated}</p>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button className={`flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest transition-all ${item.status === 'Uploaded' ? 'hover:bg-slate-100' : 'opacity-40 cursor-not-allowed'}`}>
                <Eye size={12} /> View
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-[#1e3a5f] rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-[#FDB813] transition-all">
                <Upload size={12} /> {item.status === 'Uploaded' ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};