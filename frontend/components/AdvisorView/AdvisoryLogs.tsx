"use client";
import React from 'react';
import { 
  StickyNote, 
  Plus, 
  MoreVertical, 
  Calendar,
  Tag,
  ChevronRight
} from 'lucide-react';

export const AdvisoryLogs = () => {
  const notes = [
    {
      id: '1',
      title: 'Midterm Review',
      description: 'Review performance of students with GPA < 2.5',
      date: '15 OCT 2025',
      category: 'Academic',
      priority: 'High'
    },
    {
      id: '2',
      title: 'Registration Deadline',
      description: 'Send reminders for elective course selection.',
      date: '20 OCT 2025',
      category: 'Admin',
      priority: 'Medium'
    },
    {
      id: '3',
      title: 'Parent Meeting',
      description: 'Meeting with CMS-098 parent regarding attendance.',
      date: '22 OCT 2025',
      category: 'Meeting',
      priority: 'Low'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">
            Advisor <span className="text-amber-500">Notes</span>
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Workspace</p>
        </div>
        
        <button className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#1e3a5f] hover:bg-slate-50 transition-all shadow-sm">
          <Plus size={20} />
        </button>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <div 
            key={note.id}
            className="group bg-white rounded-[1.8rem] p-6 border border-slate-100 shadow-sm hover:border-amber-200 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-6">
              {/* Icon Box */}
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                <StickyNote size={20} />
              </div>

              {/* Text Info */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-black text-[#1e3a5f] uppercase tracking-tight">
                    {note.title}
                  </span>
                  <span className="text-[8px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-400 uppercase tracking-widest">
                    {note.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold max-w-md truncate">
                  {note.description}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-8">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Due Date</p>
                <p className="text-[10px] font-black text-[#1e3a5f] uppercase">{note.date}</p>
              </div>
              
              <div className={`w-2 h-2 rounded-full ${
                note.priority === 'High' ? 'bg-red-400' : 
                note.priority === 'Medium' ? 'bg-amber-400' : 'bg-green-400'
              }`} />
              
              <ChevronRight size={18} className="text-slate-200 group-hover:text-[#1e3a5f] transition-all" />
            </div>
          </div>
        ))}

        {/* Action Bar */}
        <div className="mt-4 flex justify-center">
          <button className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-amber-500 transition-colors">
            Show Archive
          </button>
        </div>
      </div>
    </div>
  );
};