/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Advisory/AdvisoryLogs.tsx

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, AlertCircle, BookOpen } from 'lucide-react';
import { useRecommendations } from '../../src/hooks/recommendationHook/useCourseRecommendationHook';
import { AdvisoryLogEntry } from '@/src/repositories/recommendationRepository/types/advisoryLog';

interface AdvisoryLogsProps {
  onBack?: () => void;
}

export const AdvisoryLogs: React.FC<AdvisoryLogsProps> = ({ onBack }) => {
  const { advisoryLogs, isLoadingLogs, logsError, fetchAdvisoryLogs, pagination } = useRecommendations();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdvisoryLogs();
  }, [fetchAdvisoryLogs]);

  // FIX: Ensure advisoryLogs is an array before calling filter
  const logsArray = Array.isArray(advisoryLogs) ? advisoryLogs : [];
  
  const filteredLogs = logsArray.filter((log: AdvisoryLogEntry) => {
    const name = log.Student?.studentName?.toLowerCase() ?? '';
    const sapid = String(log.Student?.User?.sapid ?? '');
    return name.includes(searchTerm.toLowerCase()) || sapid.includes(searchTerm);
  });

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoadingLogs) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button title="btn" onClick={onBack} className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6">
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-[1.5rem] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (logsError) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button title="btn" onClick={onBack} className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center py-20">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
            Failed to Load Logs
          </p>
          <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs mb-6">
            {logsError}
          </p>
          <button
            onClick={fetchAdvisoryLogs}
            className="px-6 py-2.5 bg-[#1e3a5f] text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no logs
  if (filteredLogs.length === 0 && !isLoadingLogs) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button title="btn" onClick={onBack} className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm overflow-hidden p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={22} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
            {searchTerm ? 'No matching records found' : 'No advisory logs yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6 relative">

      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <button
          title="btn"
          onClick={onBack}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-colors w-fit border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
              Advisory Logs
            </h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Your Finalized Recommendations · {pagination?.total ?? filteredLogs.length} total
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search student or SAP ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[220px] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-amber-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm overflow-hidden">

        {/* ── Desktop ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Program · Batch</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Session</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Courses Recommended</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Credits</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log: AdvisoryLogEntry) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-black text-[10px]">
                        {log.Student?.studentName?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#1e3a5f] uppercase tracking-tight">
                          {log.Student?.studentName ?? '—'}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          SAP: {log.Student?.User?.sapid ?? '—'} · Sem {log.Student?.currentSemester}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] font-black text-[#1e3a5f] uppercase">
                      {log.Student?.BatchModel?.ProgramModel?.programName ?? '—'}
                    </p>
                    <p className="text-[9px] font-bold text-amber-500 uppercase">
                      {log.Student?.BatchModel?.batchName} {log.Student?.BatchModel?.batchYear}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-[#1e3a5f] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 uppercase">
                      {log.Session?.sessionType} {log.Session?.sessionYear}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {(log.recommendedCourses ?? []).map((c, i) => (
                        <span
                          key={i}
                          className="text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md uppercase leading-snug"
                        >
                          {c.courseName}
                        </span>
                      ))}
                    </div>
                   </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] font-black text-[#1e3a5f]">
                      {log.totalCredits} Hrs
                    </span>
                   </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(log.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      }).toUpperCase()}
                    </span>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredLogs.map((log: AdvisoryLogEntry) => (
            <div key={log.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-black text-xs">
                    {log.Student?.studentName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1e3a5f] uppercase leading-tight">
                      {log.Student?.studentName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      SAP {log.Student?.User?.sapid} · Sem {log.Student?.currentSemester}
                    </p>
                    <p className="text-[9px] font-bold text-amber-500 uppercase">
                      {log.Student?.BatchModel?.ProgramModel?.programName} ·{' '}
                      {log.Student?.BatchModel?.batchName} {log.Student?.BatchModel?.batchYear}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-black text-[#1e3a5f] bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                    {log.Session?.sessionType} {log.Session?.sessionYear}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">
                    {new Date(log.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short',
                    }).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(log.recommendedCourses ?? []).map((c, i) => (
                  <span
                    key={i}
                    className="text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md uppercase"
                  >
                    {c.courseName}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase">
                  <BookOpen size={11} />
                  {log.recommendedCourses?.length ?? 0} courses
                </div>
                <span className="text-[10px] font-black text-[#1e3a5f]">
                  {log.totalCredits} Credit Hrs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};