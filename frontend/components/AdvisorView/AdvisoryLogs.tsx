
"use client";
import React, { useState } from 'react';
import { 
  User, Calendar, Search, CheckCircle2, 
  Clock, Download, Plus, X, MessageSquare 
} from 'lucide-react';

export const AdvisoryLogs = () => {
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

  // Form State
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
    <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 relative">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter">
            ADVISORY LOGS 
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Student Record Management</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              maxLength={5}
              placeholder="Search CMS ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-amber-400 outline-none w-[180px] transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> New Entry
          </button>
        </div>
      </div>

      {/* 2. Optimized Table */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                  {/* Student Name & Batch */}
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

                  {/* CMS ID */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-black text-[#1e3a5f] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                      {log.studentID}
                    </span>
                  </td>

                  {/* Merged Decision & Remarks (Space Saving) */}
                  <td className="px-6 py-5 min-w-[350px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-tighter">{log.decision}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 line-clamp-1 italic group-hover:line-clamp-none transition-all">
                        "{log.remarks}"
                      </p>
                    </div>
                  </td>

                  {/* Status */}
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

                  {/* Date */}
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{log.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
              No matching records found
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL FORM - Wahi rahega bas styling thodi aur compact ki hai */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">New Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Student Name</label>
                  <input required name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. Ali Khan" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">CMS ID</label>
                  <input required name="studentID" maxLength={5} value={formData.studentID} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. 12345" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Batch</label>
                  <input required name="batch" value={formData.batch} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="e.g. Fall 2024" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none bg-white">
                    <option value="In-Process">In-Process</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Decision</label>
                <input required name="decision" value={formData.decision} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none" placeholder="Decision Type" />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Remarks</label>
                <textarea required name="remarks" rows={2} value={formData.remarks} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 ring-amber-400 outline-none resize-none" placeholder="Write remarks here..." />
              </div>

              <button type="submit" className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-amber-500 transition-all mt-4 shadow-lg shadow-blue-900/10">
                Confirm Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};