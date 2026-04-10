"use client";
import React from 'react';
import { CalendarDays, Eye, CheckCircle2, Clock } from "lucide-react";

export const Timetable = ({ session }: { session: string }) => {
  const timetables = [
    { id: 1, section: "CS - Batch 2021", type: "Regular", status: "Available" },
    { id: 2, section: "CS - Batch 2023", type: "Regular", status: "Available" },
    { id: 3, section: "SE - Batch 2021", type: "Regular", status: "Available" },
  ];

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
      
      {/* Header Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic tracking-tighter leading-none">
          Class Timetables
        </h2>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {timetables.map((item) => (
          <div key={item.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
            
            {/* Status Icon & Badge */}
            <div className="flex justify-between items-start mb-8">
              <div className="h-14 w-14 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm">
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
            {/* Batch Info */}
            <div className="space-y-1 mb-10">
              <h4 className="font-black text-[#1e3a5f] text-lg leading-tight uppercase tracking-tight">
                {item.section}
              </h4>
             
            </div>
            <div>
              <button 
                disabled={item.status === 'Pending'}
                /* active:scale-95 adds the click/press effect */
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-transform ${
                  item.status === 'Available' 
                    ? 'bg-[#1e3a5f] text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Eye size={14} /> View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};