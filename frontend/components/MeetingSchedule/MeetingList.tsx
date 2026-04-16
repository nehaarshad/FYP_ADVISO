"use client";
import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, Search, Check, X, Edit2, ArrowLeft } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  day: string;
  date: string; 
  time: string;
  room: string;
  studentName: string;
  summary: string;
}

export const MeetingList = ({ onBack }: { onBack?: () => void }) => {
  const [advisorMeetings, setAdvisorMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Academic Meeting', day: 'Monday', date: 'Mar 10, 2026', time: '10:30 AM', room: 'Room 204', studentName: 'Ahmed Ali', summary: 'Credit hours discussed.' },
    { id: '2', title: 'Academic Meeting', day: 'Tuesday', date: 'Mar 15, 2026', time: '02:00 PM', room: 'Zoom', studentName: 'Sara Khan', summary: 'GPA strategy review.' },
    { id: '3', title: 'Academic Meeting', day: 'Wednesday', date: 'May 12, 2026', time: '11:00 AM', room: 'Lab 02', studentName: 'Zainab Bibi', summary: '' },
    { id: '4', title: 'Academic Meeting', day: 'Thursday', date: 'May 20, 2026', time: '09:30 AM', room: 'Room 101', studentName: 'Usman Sheikh', summary: '' },
    { id: '5', title: 'Academic Meeting', day: 'Friday', date: 'Jun 05, 2026', time: '03:00 PM', room: 'Office', studentName: 'Hania Amir', summary: '' },
  ]);

  const [openMeetingId, setOpenMeetingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempSummary, setTempSummary] = useState("");

  const toggleSummary = (meet: Meeting) => {
    if (openMeetingId === meet.id) {
      setOpenMeetingId(null);
      setEditingId(null);
    } else {
      setOpenMeetingId(meet.id);
      setTempSummary(meet.summary);
      if (!meet.summary) setEditingId(meet.id);
    }
  };

  const saveSummary = (id: string) => {
    setAdvisorMeetings(prev => 
      prev.map(m => m.id === id ? { ...m, summary: tempSummary } : m)
    );
    setEditingId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-y-auto pb-10 px-4 md:px-0">
      <div className="flex flex-col gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">
          Batch Meetings
        </h2>
      </div>

      <div className="w-full bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 p-5 md:p-8">
        <h3 className="text-[10px] md:text-xs font-black text-[#1e3a5f] uppercase tracking-[0.2em] mb-6 md:mb-8">
          Meeting Schedule
        </h3>

        <div className="space-y-4">
          {advisorMeetings.map((meet) => {
            const isDone = new Date(meet.date) < new Date();
            const isOpen = openMeetingId === meet.id;
            const isEditing = editingId === meet.id;

            return (
              <div key={meet.id} className="flex flex-col p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-transparent transition-all">
                {/* Meeting Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
                      <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-800">{meet.day.substring(0, 3)}</span>
                      <span className="text-xl md:text-2xl font-black leading-none text-[#1e3a5f]">{meet.date.split(' ')[1].replace(',', '')}</span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-black text-[#1e3a5f] uppercase truncate">{meet.title}</p>
                      <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-600 text-[9px] md:text-[10px] font-bold">
                          <Clock size={12} className="text-amber-500" /> {meet.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-[9px] md:text-[10px] font-bold">
                          <Calendar size={12} className="text-amber-500" /> {meet.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className={`px-4 md:px-6 py-1.5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                      isDone ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {isDone ? 'Done' : 'Pending'}
                    </span>
                    <button onClick={() => toggleSummary(meet)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Summary Section */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in slide-in-from-top-2 duration-300">
                    {isEditing ? (
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Search size={16} />
                        </div>
                        <input 
                          type="text"
                          className="w-full pl-10 md:pl-12 pr-20 md:pr-24 py-3 bg-white border border-slate-200 rounded-xl text-[10px] md:text-[11px] font-medium text-slate-600 focus:ring-2 focus:ring-[#1e3a5f]/5 outline-none transition-all shadow-inner"
                          placeholder="Meeting summary..."
                          autoFocus
                          value={tempSummary}
                          onChange={(e) => setTempSummary(e.target.value)}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button onClick={() => saveSummary(meet.id)} className="p-1.5 bg-[#1e3a5f] text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start bg-white/40 p-3 rounded-xl border border-slate-100 group">
                        <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-relaxed pr-8">
                          <span className="font-black text-[#1e3a5f] uppercase text-[8px] md:text-[9px] mr-2">Meeting Summary:</span>
                          {meet.summary || "No summary available for this meeting."}
                        </p>
                        <button 
                          onClick={() => setEditingId(meet.id)}
                          className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};