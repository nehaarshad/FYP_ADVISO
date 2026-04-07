"use client";
import React from 'react';
import { 
  MessageSquare, 
  ChevronRight,
  Clock
} from 'lucide-react';

export const AdvisoryLogs = () => {
  const logs = [
    { 
      id: '1', 
      date: '24 OCT', 
      advisor: 'Dr. Sarah Ahmed', 
      note: 'Course withdrawal discussion.',
      status: 'Resolved'
    },
    { 
      id: '2', 
      date: '12 SEP', 
      advisor: 'Prof. Usman Khan', 
      note: 'Waitlist request for SE core.',
      status: 'Pending'
    }
  ];

  return (
    /* Margin top 6 taake Previous Batch se thora gap rahe */
    <div className="mt-6 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col shrink-0 overflow-hidden">
      
      {/* Header - Simple & Clean */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center text-white shadow-sm">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-widest text-[#1e3a5f]">
              Advisory Logs
            </h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Recent Activity</p>
          </div>
        </div>
        <button className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all">
          View All
        </button>
      </div>

      {/* Logs Items - No Scrolling */}
      <div className="space-y-3 overflow-hidden">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="group flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Date Badge */}
              <div className="flex flex-col items-center justify-center bg-white w-10 h-10 rounded-xl shadow-sm border border-slate-50 shrink-0 text-center">
                <span className="text-[10px] font-black text-[#1e3a5f] leading-none">{log.date.split(' ')[0]}</span>
                <span className="text-[7px] font-black text-slate-400 uppercase">{log.date.split(' ')[1]}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-tight">
                  {log.advisor}
                </span>
                <p className="text-[9px] text-slate-400 font-bold truncate max-w-[150px]">
                  {log.note}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${
                  log.status === 'Resolved' ? 'bg-green-400' : 'bg-amber-400'
                }`} />
              <ChevronRight size={14} className="text-slate-200 group-hover:text-amber-500 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};