"use client";
import React, { useState } from 'react';
import { 
  Search, Plus, ChevronRight, ChevronLeft,
  Pin, User, ShieldCheck, AlertCircle, Lightbulb, Clock, X
} from 'lucide-react';

export const FacultyRecommendation = () => {
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

  // Form State for new recommendation
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    problem: '',
    solution: '',
    advisor: ''
  });

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
    rec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4 font-sans text-slate-900 relative">
      
      {/* --- ADD RECOMMENDATION MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">New Recommendation</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input required placeholder="Subject Name" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500" 
                onChange={e => setFormData({...formData, subject: e.target.value})} />
              <input required placeholder="Category (e.g. Credit Waiver)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500"
                onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required placeholder="Your Name (Advisor)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500"
                onChange={e => setFormData({...formData, advisor: e.target.value})} />
              <textarea required placeholder="Problem Description" rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500"
                onChange={e => setFormData({...formData, problem: e.target.value})} />
              <textarea required placeholder="Proposed Solution" rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500"
                onChange={e => setFormData({...formData, solution: e.target.value})} />
              <button type="submit" className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#2a5285] transition-all">
                Submit Recommendation
              </button>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase leading-none">Faculty Recommendations</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Official Student Case Management</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search by catagory"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-[280px]"
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2a5285] transition-all shadow-md active:scale-95"
              >
                <Plus size={14} /> New Recommendation
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
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
                        rec.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        rec.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right"><ChevronRight size={18} className="text-[#1e3a5f]/20 group-hover:text-amber-500 transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* --- DETAIL PAGE --- */
        <div className="py-4 fade-in">
          <div className="flex items-center gap-5 mb-8 px-2">
            <button onClick={() => setViewMode('list')} className="h-10 w-10 flex items-center justify-center text-[#1e3a5f] bg-white rounded-xl border border-slate-100 shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">Detailed Faculty Note</h2>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xl bg-[#fffce8] border-2 border-yellow-200 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <Pin className="absolute top-6 right-6 text-yellow-600 opacity-30 rotate-12" size={24} fill="currentColor" />
              <div className="space-y-6">
                <div className="border-b border-black/5 pb-4">
                  <div className="text-[9px] font-black text-yellow-700 uppercase mb-1">{selectedRec.recommendationCategory} • ID #{selectedRec.id}</div>
                  <h3 className="text-xl font-black text-[#1e3a5f] uppercase leading-none tracking-tight">{selectedRec.subject}</h3>
                </div>
                <div className="space-y-5 text-slate-700">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-widest"><AlertCircle size={12} /> Problem Description</span>
                    <p className="text-[12px] font-medium leading-relaxed uppercase">{selectedRec.problem}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest"><Lightbulb size={12} /> Advisor Solution</span>
                    <p className="text-[12px] font-medium leading-relaxed uppercase">{selectedRec.solution}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Noted By (Advisor)</span>
                      <p className="text-[11px] font-black text-[#1e3a5f] uppercase">{selectedRec.recommendedBy}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Approved By</span>
                      <p className="text-[11px] font-black text-[#1e3a5f] uppercase">{selectedRec.approvedBy}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-5 border-t border-black/5 flex justify-between items-center text-[9px]">
                  <span className={`px-4 py-1 rounded-lg font-black uppercase border-2 ${
                    selectedRec.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>{selectedRec.status}</span>
                  <span className="font-bold text-slate-400 uppercase flex items-center gap-1"><Clock size={12} /> {selectedRec.createdAt}</span>
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