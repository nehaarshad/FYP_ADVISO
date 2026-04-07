"use client";
import React, { useState } from 'react';
import { Plus, Send, User, Hash } from 'lucide-react';

interface Note {
  id: string;
  studentName: string;
  content: string;
  date: string;
}

export const AdvisorNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', studentName: '44521', content: 'Follow up on probation documents by next week. Student needs to submit the undertaking.', date: 'Mar 25' },
    { id: '2', studentName: '44890', content: 'Recommended for Dean\'s List scholarship. GPA is consistently above 3.8.', date: 'Mar 28' },
  ]);

  const [newNote, setNewNote] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const addNote = () => {
    if (!newNote.trim() || !selectedStudent.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      studentName: selectedStudent,
      content: newNote,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setNotes([note, ...notes]);
    setNewNote('');
    setSelectedStudent('');
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Simple Header */}
      <div className="flex flex-col mb-8">
        <h2 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter">
          Advisor <span className="text-amber-500">Insights</span>
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Record and manage student observations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        
        {/* Left Section: Input Form */}
<div className="lg:col-span-4">
  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden h-fit">
    
    <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
      <Plus size={16} className="p-0.5 bg-amber-400 rounded-md text-[#1e3a5f]" /> 
      Add New Notes
    </h3>
    
    <div className="space-y-6">
      {/* Student ID Input */}
      <div className="group">
        {/* Label color made darker (removed opacity-70) */}
        <label className="text-[10px] font-black text-[#1e3a5f] uppercase ml-1 tracking-widest">
          Student CMS ID
        </label>
        <div className="relative mt-2">
          <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text"
            placeholder="e.g. 44123"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-11 pr-4 text-xs font-bold text-[#1e3a5f] focus:bg-white focus:border-amber-400 outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>
      
      {/* Note Content Textarea */}
      <div>
        {/* Label color made darker */}
        <label className="text-[10px] font-black text-[#1e3a5f] uppercase ml-1 tracking-widest">
          Note Content
        </label>
        <textarea 
          rows={5}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Share your advisor insights..."
          className="w-full mt-2 bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-[#1e3a5f] focus:bg-white focus:border-amber-400 outline-none transition-all resize-none leading-relaxed placeholder:text-slate-300"
        />
      </div>

      {/* Updated Send Button - Dark Blue Background & Darker Text logic on hover */}
      <button 
        onClick={addNote}
        disabled={!newNote.trim() || !selectedStudent.trim()}
        className="w-full bg-[#1e3a5f] text-white rounded-2xl py-4 flex items-center justify-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-amber-400 hover:text-[#1e3a5f] disabled:opacity-30 disabled:hover:bg-[#1e3a5f] disabled:hover:text-white transition-all shadow-lg active:scale-[0.98]"
      >
        <Send size={14} className="stroke-[3px]" /> 
        <span className="font-black">Send</span>
      </button>
    </div>
  </div>
</div>
        {/* Right Section: Notes List (Without Delete Option) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Recent Logs ({notes.length})
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-4 custom-scrollbar max-h-[calc(100vh-250px)] pb-10">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative border-l-4 border-l-amber-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                      <User size={10} className="text-[#1e3a5f]" />
                    </div>
                    <span className="text-[10px] font-black text-[#1e3a5f] tracking-tight">{note.studentName}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase bg-slate-50 px-2 py-1 rounded-md">{note.date}</span>
                </div>
                
                <div className="min-h-[60px] pb-2">
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed italic text-balance">
                    "{note.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};