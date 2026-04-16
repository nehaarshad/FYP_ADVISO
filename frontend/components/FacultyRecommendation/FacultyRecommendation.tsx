"use client";
import React, { useState } from 'react';
import { 
  Search, Plus, ChevronRight, ChevronLeft,
  Pin, AlertCircle, Lightbulb, Clock, X, ArrowLeft
} from 'lucide-react';

interface FacultyRecommendationProps {
  onBack?: () => void;
}

export const FacultyRecommendation: React.FC<FacultyRecommendationProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [recommendations, setRecommendations] = useState([
    {
      id: 101,
      subject: 'Object Oriented Programming',
      description: 'Credit hour deficiency for core enrollment.',
      problem: 'Student has insufficient credit hours to register for this core subject as per the current semester load policy.',
      solution: 'Advisor requested a special credit hour waiver from the Dean to allow the student to sit in the course as a special case.',
      status: 'Approved',
      recommendedBy: 'Dr Fatima', 
      approvedBy: 'Aleena Ayub (Program Coordinator)',
      recommendationCategory: 'Credit Hours',
      createdAt: '12 APR 2026'
    },
    {
      id: 102,
      subject: 'Cloud Computing',
      description: 'Course not offered in current spring session.',
      problem: 'The student needs this specific course for graduation, but it is currently not offered in the Spring 2026 list.',
      solution: 'Formal request sent to Coordinator to open a special section for this course due to student graduation requirements.',
      status: 'Pending',
      recommendedBy: 'DR. Fozia', 
      approvedBy: 'Aleena Ayub (Program Coordinator)',
      recommendationCategory: 'Course Offering',
      createdAt: '11 APR 2026'
    }
  ]);

  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    problem: '',
    solution: '',
    advisor: ''
  });

  // --- SMART NAVIGATION LOGIC ---
  const handleBackAction = () => {
    if (viewMode === 'detail') {
      setViewMode('list');
      setSelectedRec(null);
    } else if (onBack) {
      onBack();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: recommendations.length + 101,
      subject: formData.subject,
      description: formData.problem.substring(0, 40) + "...",
      problem: formData.problem,
      solution: formData.solution,
      status: 'Pending',
      recommendedBy: formData.advisor,
      approvedBy: 'TBD',
      recommendationCategory: formData.category,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    };
    setRecommendations([newEntry, ...recommendations]);
    setShowAddModal(false);
    setFormData({ subject: '', category: '', problem: '', solution: '', advisor: '' });
  };

  const filteredRecs = recommendations.filter(rec => 
    rec.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.recommendationCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6 font-sans text-slate-900 relative">
      
      {/* --- UNIFIED NAVIGATION HEADER --- */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackAction} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-all border border-slate-100 active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        {viewMode === 'detail' && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
            
          </span>
        )}
      </div>

      {/* --- ADD MODAL (Responsive) --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">New Recommendation</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input required placeholder="Subject Name" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500/50" 
                onChange={e => setFormData({...formData, subject: e.target.value})} />
              <input required placeholder="Category" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500/50"
                onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required placeholder="Advisor Name" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500/50"
                onChange={e => setFormData({...formData, advisor: e.target.value})} />
              <textarea required placeholder="Problem Description" rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none resize-none focus:ring-2 ring-blue-500/50"
                onChange={e => setFormData({...formData, problem: e.target.value})} />
              <textarea required placeholder="Proposed Solution" rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none resize-none focus:ring-2 ring-blue-500/50"
                onChange={e => setFormData({...formData, solution: e.target.value})} />
              <button type="submit" className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all hover:bg-[#2a5285]">
                Submit Recommendation
              </button>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase leading-none">Faculty Recommendations</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Case Management System</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search category or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-[280px] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500/50 transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all hover:shadow-lg"
              >
                <Plus size={14} /> New Recommendation
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID & Category</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-4 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecs.map((rec) => (
                    <tr key={rec.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => { setSelectedRec(rec); setViewMode('detail'); }}>
                      <td className="px-6 py-5 text-[11px] font-black text-[#1e3a5f] uppercase tracking-tighter">#{rec.id} - {rec.recommendationCategory}</td>
                      <td className="px-6 py-5 text-xs font-bold text-slate-600 uppercase tracking-tighter">{rec.subject}</td>
                      <td className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase">{rec.description}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                          rec.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>{rec.status}</span>
                      </td>
                      <td className="px-4 py-5 text-right"><ChevronRight size={18} className="text-[#1e3a5f]/20 group-hover:text-amber-500 transition-colors" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredRecs.map((rec) => (
                <div key={rec.id} className="p-5 flex flex-col gap-4 active:bg-slate-50 transition-colors" onClick={() => { setSelectedRec(rec); setViewMode('detail'); }}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-[#1e3a5f] bg-slate-100 px-2 py-1 rounded">#{rec.id}</span>
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${
                          rec.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>{rec.status}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#1e3a5f] uppercase mb-1">{rec.subject}</h4>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{rec.recommendationCategory}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-2 line-clamp-2">{rec.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase pt-2 border-t border-slate-50">
                    <span>{rec.createdAt}</span>
                    <div className="flex items-center text-blue-600">View Detail <ChevronRight size={14} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* --- DETAIL PAGE (Sticky Note Style) --- */
        <div className="py-4 animate-in slide-in-from-right-10 duration-300">
          <div className="flex justify-center">
            <div className="w-full max-w-xl bg-[#fffce8] border-2 border-yellow-200 rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden">
              <Pin className="absolute top-6 right-6 text-yellow-600 opacity-30 rotate-12 hidden sm:block" size={24} fill="currentColor" />
              
              <div className="space-y-6">
                <div className="border-b border-black/5 pb-4">
                  <div className="text-[9px] font-black text-yellow-700 uppercase mb-1 tracking-widest">{selectedRec.recommendationCategory} • ID #{selectedRec.id}</div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase leading-tight tracking-tight">{selectedRec.subject}</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-widest"><AlertCircle size={14} /> The Problem</span>
                    <p className="text-[13px] md:text-[14px] font-medium leading-relaxed text-slate-700 uppercase">{selectedRec.problem}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest"><Lightbulb size={14} /> Proposed Solution</span>
                    <p className="text-[13px] md:text-[14px] font-medium leading-relaxed text-slate-700 uppercase">{selectedRec.solution}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/5">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Advisor</span>
                      <p className="text-[12px] font-black text-[#1e3a5f] uppercase">{selectedRec.recommendedBy}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Coordinator</span>
                      <p className="text-[12px] font-black text-[#1e3a5f] uppercase">{selectedRec.approvedBy}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px]">
                  <span className={`px-5 py-1.5 rounded-full font-black uppercase border-2 ${
                    selectedRec.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>{selectedRec.status}</span>
                  <span className="font-bold text-slate-400 uppercase flex items-center gap-1"><Clock size={12} /> Filed on {selectedRec.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyRecommendation;