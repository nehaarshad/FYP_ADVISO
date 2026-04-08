"use client";
import React from 'react';
import { CalendarDays, Eye, Upload, CheckCircle2, Clock } from "lucide-react";

export const Timetable = ({ session }: { session: string }) => {
  const timetables = [
    { id: 1, section: "CS - Batch 2021", type: "Regular", status: "Available" },
    { id: 2, section: "SE - Batch 2022", type: "Regular", status: "Pending" },
    { id: 3, section: "CS - Batch 2023", type: "Regular", status: "Available" },
    { id: 4, section: "SE - Batch 2021", type: "Regular", status: "Available" },
  ];

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
      
      {/* HEADER */}
      <div className="mb-12">
        <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic tracking-tighter leading-none">
          Class Timetables
        </h2>
        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-[0.2em]">
          Academic Schedule • {session}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {timetables.map((item) => (
          <div key={item.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-shadow duration-200">
            
            <div className="flex justify-between items-start mb-8">
              <div className="h-14 w-14 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm group-hover:text-[#FDB813] group-hover:bg-[#1e3a5f]">
                <CalendarDays size={28} strokeWidth={1.5} />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                item.status === 'Available' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {item.status === 'Available' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                {item.status}
              </div>
            </div>

            <div className="space-y-1 mb-10">
              <h4 className="font-black text-[#1e3a5f] text-lg leading-tight uppercase tracking-tight">
                {item.section}
              </h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
                {item.type} Schedule
              </p>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                disabled={item.status === 'Pending'}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'Available' 
                    ? 'bg-white border border-slate-200 text-[#1e3a5f] hover:bg-slate-100 shadow-sm' 
                    : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
                }`}
              >
                <Eye size={12} /> View
              </button>
              
              <button className="flex items-center justify-center gap-2 py-3 bg-[#1e3a5f] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#FDB813] hover:text-[#1e3a5f] shadow-md">
                <Upload size={12} /> Upload
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};