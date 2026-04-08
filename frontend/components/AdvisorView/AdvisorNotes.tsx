

"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Clock, FileText, Tag, X, Check, Edit2 
} from 'lucide-react';

export const AdvisoryNotes = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  
  const [notes, setNotes] = useState([
    {
      id: '1',
      category: 'ACADEMIC',
      title: 'BATCH MEETING AGENDA',
      content: 'Discuss the upcoming internship fair and core course registration issues for Fall 2024.',
      time: '2 HOURS AGO',
      bgColor: 'bg-[#fffbeb]', 
      borderColor: 'border-[#fef3c7]',
      tagColor: 'text-[#d97706]'
    },
    {
      id: '2',
      category: 'URGENT',
      title: 'IRREGULAR STUDENTS FOLLOW-UP',
      content: 'Need to call parents of students with CGPA below 2.0 after midterms.',
      time: 'YESTERDAY',
      bgColor: 'bg-[#fef2f2]', 
      borderColor: 'border-[#fee2e2]',
      tagColor: 'text-[#dc2626]'
    },
    {
      id: '3',
      category: 'OFFICE',
      title: 'COURSE SUBSTITUTION',
      content: 'Verify if "Discrete Structures" can be substituted for the old curriculum student.',
      time: '3 DAYS AGO',
      bgColor: 'bg-[#f0f9ff]', 
      borderColor: 'border-[#e0f2fe]',
      tagColor: 'text-[#0284c7]'
    }
  ]);

  // Edit function
  const handleEdit = (note: any) => {
    setEditingNote(note);
    setIsCreating(true);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingNote(null);
  };

  return (
    <div className="relative min-h-screen w-full max-w-[1300px] mx-auto p-4">
      
      {/* --- DASHBOARD VIEW --- */}
      <div className={`${isCreating ? 'blur-sm pointer-events-none opacity-50' : ''} transition-all duration-300`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter flex items-center gap-2">
              ADVISOR NOTES 
            </h2>
          </div>
        </div>

        {/* Grid with Edit Ability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`${note.bgColor} ${note.borderColor} border-2 rounded-[2rem] p-7 flex flex-col justify-between min-h-[260px] shadow-sm relative group cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleEdit(note)} // Card par click karte hi edit open hoga
            >
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/80 p-2 rounded-lg text-[#1e3a5f] shadow-sm">
                   <Edit2 size={14} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-5">
                  <Tag size={12} className={note.tagColor} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${note.tagColor}`}>{note.category}</span>
                </div>
                <h3 className="text-[18px] font-black text-[#1e3a5f] leading-tight mb-3 tracking-tight">{note.title}</h3>
                <p className="text-[14px] font-bold text-slate-600 leading-relaxed italic opacity-90">"{note.content}"</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200/50">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={14} /><span className="text-[9px] font-black uppercase tracking-widest">{note.time}</span>
                </div>
                <FileText size={18} className="text-slate-400" />
              </div>
            </div>
          ))}
          
          <div onClick={() => setIsCreating(true)} className="border-4 border-dashed border-amber-100 rounded-[2rem] flex flex-col items-center justify-center min-h-[260px] cursor-pointer hover:bg-amber-50/50 transition-all">
            <Plus size={28} strokeWidth={2.5} className="text-amber-400" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-4">Add Quick Note</span>
          </div>
        </div>
      </div>

      {/* --- CENTERED EDIT/CREATE CARD --- */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[2px]">
          <div className="animate-in zoom-in-95 fade-in duration-300 w-full max-w-md bg-white border-2 border-amber-100 rounded-[2.5rem] p-8 shadow-2xl">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h3>
              <button onClick={closeForm} className="text-slate-300 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex gap-2">
                {['Academic', 'Urgent', 'Office'].map(cat => (
                  <button 
                    key={cat} 
                    className={`flex-1 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${
                      editingNote?.category === cat.toUpperCase() 
                      ? 'bg-amber-500 border-amber-500 text-white' 
                      : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  defaultValue={editingNote?.title || ""}
                  className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold focus:ring-2 ring-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  rows={3}
                  defaultValue={editingNote?.content || ""}
                  className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold focus:ring-2 ring-amber-400 outline-none resize-none"
                />
              </div>

              <button 
                onClick={closeForm}
                className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#162a45] flex items-center justify-center gap-2 shadow-lg"
              >
                <Check size={14} /> {editingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};