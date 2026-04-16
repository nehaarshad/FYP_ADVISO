"use client";
import React, { useState } from 'react';
import { 
  Plus, Clock, FileText, Tag, X, Check, Edit2, ArrowLeft 
} from 'lucide-react';

export default function AdvisoryNotes({ onBack }: { onBack: () => void }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  
  // State for form inputs
  const [formData, setFormData] = useState({ title: '', content: '', category: 'ACADEMIC' });

  // Restored all 3 initial notes
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
    setFormData({ title: note.title, content: note.content, category: note.category });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) return;

    if (editingNote) {
      // Update existing note
      setNotes(notes.map(n => n.id === editingNote.id ? { ...n, ...formData } : n));
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        ...formData,
        time: 'JUST NOW',
        // Dynamic styling based on category
        bgColor: formData.category === 'URGENT' ? 'bg-[#fef2f2]' : formData.category === 'OFFICE' ? 'bg-[#f0f9ff]' : 'bg-[#fffbeb]',
        borderColor: formData.category === 'URGENT' ? 'border-[#fee2e2]' : formData.category === 'OFFICE' ? 'border-[#e0f2fe]' : 'border-[#fef3c7]',
        tagColor: formData.category === 'URGENT' ? 'text-[#dc2626]' : formData.category === 'OFFICE' ? 'text-[#0284c7]' : 'text-[#d97706]'
      };
      setNotes([newNote, ...notes]);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', category: 'ACADEMIC' });
  };

  return (
    <div className="relative min-h-screen w-full max-w-[1200px] mx-auto p-4 md:p-6">
      
      {/* Dashboard View */}
      <div className={`${isCreating ? 'pointer-events-none opacity-50' : ''} transition-opacity duration-300`}>
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit border border-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
            ADVISOR NOTES
          </h2>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`${note.bgColor} ${note.borderColor} border-2 rounded-[1.5rem] p-5 md:p-6 flex flex-col justify-between min-h-[200px] shadow-sm relative cursor-pointer`}
              onClick={() => handleEdit(note)}
            >
              <div className="absolute top-4 right-4">
                <div className="bg-white/80 p-1.5 rounded-lg text-[#1e3a5f] border border-slate-100">
                  <Edit2 size={12} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={10} className={note.tagColor} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${note.tagColor}`}>
                    {note.category}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black text-[#1e3a5f] uppercase line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-[12px] md:text-[13px] font-bold text-slate-600/80 leading-snug line-clamp-2">
                  "{note.content}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/40">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{note.time}</span>
                </div>
                <FileText size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
          
          {/* Add New Note Trigger */}
          <div 
            onClick={() => setIsCreating(true)} 
            className="border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[200px] cursor-pointer bg-white"
          >
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-50">
              <Plus size={24} strokeWidth={3} className="text-amber-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">New Note</span>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/20 backdrop-blur-md">
          <div className="animate-in zoom-in-95 fade-in duration-300 w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
            <button onClick={closeForm} className="absolute top-6 right-6 text-slate-300 hover:text-red-500">
              <X size={20} />
            </button>
            <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">
              {editingNote ? 'Modify Note' : 'Create Record'}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                {['ACADEMIC', 'URGENT', 'OFFICE'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                      formData.category === cat ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none" 
                  placeholder="Note title..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest">Description</label>
                <textarea 
                  rows={3} 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none resize-none" 
                  placeholder="Write details..."
                />
              </div>

              <button 
                onClick={handleSave} 
                className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                <Check size={14} strokeWidth={3} /> {editingNote ? 'Update' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}