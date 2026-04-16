"use client";
import React, { useState } from 'react';
import { 
  User, Calendar, Search, CheckCircle2, 
  Clock, Download, Plus, X, MessageSquare, ArrowLeft 
} from 'lucide-react';

interface AdvisoryLogsProps {
  onBack?: () => void;
}

export const AdvisoryLogs: React.FC<AdvisoryLogsProps> = ({ onBack }) => {
  const [logs, setLogs] = useState([
    {
      id: '1',
      studentName: 'Hamza Ahmed',
      studentID: '21045',
      batch: 'Fall 2021',
      decision: 'Course Substitution',
      remarks: 'Linear Algebra replaced with Applied Maths.',
      date: '10 APR 2026',
      status: 'Approved',
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    studentID: '',
    batch: '',
    decision: '',
    remarks: '',
    status: 'In-Process'
  });

  const filteredLogs = logs.filter(log => log.studentID.includes(searchTerm));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    };
    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setFormData({ studentName: '', studentID: '', batch: '', decision: '', remarks: '', status: 'In-Process' });
  };

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6 relative">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Back Arrow Button */}
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-colors w-fit border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
              ADVISORY LOGS 
            </h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Student Record Management</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                maxLength={5}
                placeholder="Search CMS ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[180px] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-amber-400 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-md active:scale-95"
            >
              <Plus size={14} /> New Entry
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive Table/Card View */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">CMS ID</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Decision & Remarks</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#1e3a5f] font-black text-[10px]">
                        {log.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#1e3a5f] uppercase tracking-tight">{log.studentName}</p>
                        <p className="text-[9px] font-bold text-amber-500 uppercase">{log.batch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-black text-[#1e3a5f] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                      {log.studentID}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 max-w-[300px]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-tighter">{log.decision}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">
                        "{log.remarks}"
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      log.status === 'Approved' || log.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Approved' || log.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{log.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1e3a5f] font-black text-xs">
                    {log.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1e3a5f] uppercase">{log.studentName}</p>
                    <p className="text-[10px] font-bold text-amber-500 uppercase">{log.batch} • ID: {log.studentID}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">{log.date}</span>
              </div>
              
              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest mb-1">{log.decision}</p>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">"{log.remarks}"</p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                  log.status === 'Approved' || log.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${log.status === 'Approved' || log.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {log.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            No matching records found
          </div>
        )}
      </div>

      {/* 3. MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">New Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Student Name</label>
                  <input required name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. Ali Khan" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">CMS ID</label>
                  <input required name="studentID" maxLength={5} value={formData.studentID} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="5 digits" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Batch</label>
                  <input required name="batch" value={formData.batch} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. Fall 2024" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none bg-white">
                    <option value="In-Process">In-Process</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Decision</label>
                <input required name="decision" value={formData.decision} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. Course Substitution" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Remarks</label>
                <textarea required name="remarks" rows={2} value={formData.remarks} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none resize-none" placeholder="Write remarks here..." />
              </div>

              <button type="submit" className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-500 transition-all mt-4 shadow-lg active:scale-[0.98]">
                Confirm Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};