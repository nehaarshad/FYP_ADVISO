
"use client";
import React, { useState } from 'react';
import { 
  Plus, Clock, FileText, Tag, X, Check, Edit2 
} from 'lucide-react';

export default function AdvisoryNotes() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  
  const [notes, setNotes] = useState([
    {
      id: '1',
      category: 'ACADEMIC',
      title: 'BATCH MEETING AGENDA',
      content: 'Discuss internship fair and core course registration for Fall 2024.',
      time: '2 HOURS AGO',
      bgColor: 'bg-[#fffbeb]', 
      borderColor: 'border-[#fef3c7]',
      tagColor: 'text-[#d97706]'
    },
    {
      id: '2',
      category: 'URGENT',
      title: 'IRREGULAR STUDENTS',
      content: 'Call parents of students with CGPA below 2.0 after midterms.',
      time: 'YESTERDAY',
      bgColor: 'bg-[#fef2f2]', 
      borderColor: 'border-[#fee2e2]',
      tagColor: 'text-[#dc2626]'
    },
    {
      id: '3',
      category: 'OFFICE',
      title: 'COURSE SUBSTITUTION',
      content: 'Verify if "Discrete Structures" can be substituted for old curriculum.',
      time: '3 DAYS AGO',
      bgColor: 'bg-[#f0f9ff]', 
      borderColor: 'border-[#e0f2fe]',
      tagColor: 'text-[#0284c7]'
    }
  ]);

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setIsCreating(true);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingNote(null);
  };

  return (
    <div className="relative min-h-screen w-full max-w-[1200px] mx-auto p-4">
      
      {/* --- DASHBOARD VIEW (No Hover, No Blur) --- */}
      <div className={`${isCreating ? 'pointer-events-none opacity-50' : ''} transition-opacity duration-300`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter flex items-center gap-3">
            ADVISOR NOTES 
          </h2>
        </div>

        {/* --- SMALL COMPACT GRID (No Hover Effects) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <div 
              key={note.id} 
              // Removed hover scaling, hover shadow, and transition translate
              className={`${note.bgColor} ${note.borderColor} border-2 rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] shadow-sm relative cursor-pointer`}
              onClick={() => handleEdit(note)}
            >
              {/* Edit Icon - Always Visible (No group-hover) */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/80 p-1.5 rounded-lg text-[#1e3a5f] shadow-sm border border-slate-100">
                   <Edit2 size={12} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={10} className={note.tagColor} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${note.tagColor}`}>{note.category}</span>
                </div>
                {/* line-clamp to keep it small */}
                <h3 className="text-lg font-black text-[#1e3a5f] leading-tight mb-2 tracking-tight uppercase line-clamp-1">{note.title}</h3>
                <p className="text-[13px] font-bold text-slate-600/80 leading-snug italic line-clamp-2">"{note.content}"</p>
              </div>

              {/* Bottom Info - Compact */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/40">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{note.time}</span>
                </div>
                <FileText size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
          
          {/* Add Button Card - Compact (No Hover effects) */}
          <div 
            onClick={() => setIsCreating(true)} 
            className="border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[220px] cursor-pointer bg-white"
          >
            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm border border-slate-50">
              <Plus size={24} strokeWidth={3} className="text-amber-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">New Note</span>
          </div>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/20 backdrop-blur-md">
          <div className="animate-in zoom-in-95 fade-in duration-300 w-full max-w-md bg-white border border-white rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={closeForm} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">
                {editingNote ? 'Modify Note' : 'Create Record'}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                {['ACADEMIC', 'URGENT', 'OFFICE'].map(cat => (
                  <button 
                    key={cat} 
                    className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                      editingNote?.category === cat 
                      ? 'bg-white text-[#1e3a5f] shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest ml-1">Title</label>
                <input type="text" placeholder="Heading..." defaultValue={editingNote?.title || ""} className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest ml-1">Description</label>
                <textarea rows={3} placeholder="Details..." defaultValue={editingNote?.content || ""} className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none resize-none transition-all" />
              </div>

              <button onClick={closeForm} className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                <Check size={14} strokeWidth={3} /> {editingNote ? 'Update' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}