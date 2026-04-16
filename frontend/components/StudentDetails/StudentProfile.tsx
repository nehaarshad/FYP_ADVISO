"use client";
import React from 'react';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  FileText, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';

interface StudentProfileProps {
  student: any;
  selectedBatch: string;
  onBack: () => void;
  onViewTranscript: () => void;
  isAdvisor?: boolean; 
  onNavigateToCourseRec?: () => void;
}

export const StudentProfile = ({ 
  student, 
  selectedBatch, 
  onBack, 
  onViewTranscript,
  isAdvisor = false,
  onNavigateToCourseRec
}: StudentProfileProps) => {
  if (!student) return null;

  return (
    <div className="animate-in fade-in duration-500 min-h-full flex flex-col px-2 sm:px-4 md:px-0">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 pt-2 shrink-0">
        <button 
                  onClick={onBack} 
                  className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>

        {isAdvisor && (
          <button 
            onClick={onNavigateToCourseRec}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 md:px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles size={14} />
            <span className="hidden xs:inline">Recommend Courses</span>
            <span className="xs:hidden">Recommend Courses</span>
          </button>
        )}
      </div>

      {/* Main Container - Column on mobile, Row on Large Screens */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start flex-1 pb-10">
        
        {/* LEFT COLUMN - Profile Card */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4 md:gap-5 shrink-0 lg:sticky lg:top-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center shadow-sm border border-slate-50">
            <div className="w-16 h-16 md:w-18 md:h-18 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 shadow-inner border border-slate-100">
              <User size={32} className="text-[#1e3a5f] opacity-40 md:w-10 md:h-10" />
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase leading-tight mb-1 text-center tracking-tighter">
              {student.name}
            </h2>
            <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 md:mb-6 text-center">
              SAP ID: {student.code || '50952'}
            </p>
            
            <div className={`px-5 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-6 md:mb-8 border-b-4 shadow-sm ${
              student.status === 'Regular' 
              ? 'bg-green-100 text-green-900 border-green-300' 
              : 'bg-red-100 text-red-900 border-red-300'       
            }`}>
              {student.status} Status
            </div>

            <div className="w-full space-y-2 md:space-y-3 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center bg-slate-50/50 p-3 md:p-4 rounded-2xl">
                <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Registration</span>
                <span className="text-[10px] md:text-[11px] font-black text-[#1e3a5f] uppercase tracking-tighter">564576001</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50/50 p-3 md:p-4 rounded-2xl">
                <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Batch</span>
                <span className="text-[10px] md:text-[11px] font-black text-[#1e3a5f] uppercase">{selectedBatch}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onViewTranscript}
            className="w-full flex items-center justify-between p-4 md:p-5 rounded-[1.8rem] md:rounded-[2rem] bg-white text-[#1e3a5f] border-2 border-slate-100 hover:border-amber-400 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-50 shadow-inner group-hover:scale-110 transition-transform">
                <FileText size={18} className="text-amber-500 md:w-5 md:h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs md:text-[13px] font-black uppercase tracking-tight group-hover:text-[#1e3a5f]">
                  View Transcript
                </span>
                <span className="text-[8px] md:text-[9px] font-bold uppercase text-slate-400">
                  Complete Grade Report
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* RIGHT COLUMN - Stats & Roadmap */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0 w-full">
          
          {/* STATS BANNER */}
          <div className="bg-[#1e3a5f] rounded-[1.8rem] md:rounded-[2.1rem] p-4 md:p-2 text-white border-b-[6px] border-amber-400 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="pl-0 md:pl-6 py-4 text-center md:text-left">
                <p className="text-[9px] md:text-[10px] text-amber-400 font-black uppercase tracking-[0.1em] mb-2">
                  Current Academic Standing
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
                    {student.cgpa || '0.00'}
                  </h2>
                  <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest">
                    CGPA
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.1rem] border border-white/10 text-center md:text-left">
                <p className="text-[8px] md:text-[9px] font-black text-amber-400 uppercase mb-2 tracking-[0.1em]">
                  Completed Credits
                </p>
                <p className="text-lg md:text-xl font-black text-amber-400"> 
                  85 <span className="text-white"> / 130</span> 
                  <span className="text-[9px] md:text-[10px] text-slate-400 uppercase ml-1">Hrs</span>
                </p>
              </div>
            </div>
            <BookOpen size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700 hidden sm:block" />
          </div>

          {/* ROADMAP AREA */}
          <div className="bg-white rounded-[1.8rem] md:rounded-[2.1rem] p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 md:gap-4 mb-8 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-xs md:text-[14px] font-black uppercase tracking-widest text-[#1e3a5f]">
                  Degree Roadmap Progress
                </h3>
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Category-wise breakdown</p>
              </div>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
              {[
                { name: "Computing Core", earned: 30, total: 39, color: "bg-red-500" },
                { name: "Math & Science Foundation", earned: 9, total: 12, color: "bg-rose-300" },
                { name: "General Education", earned: 15, total: 19, color: "bg-slate-400" },
                { name: "University Elective", earned: 6, total: 12, color: "bg-violet-400" },
                { name: "SE Core", earned: 18, total: 24, color: "bg-yellow-400" },
                { name: "SE Elective", earned: 3, total: 15, color: "bg-lime-500" },
                { name: "SE Supporting", earned: 4, total: 9, color: "bg-indigo-800" },
              ].map((cat, i) => {
                const percentage = (cat.earned / cat.total) * 100;
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between mb-2 px-1">
                      <span className="text-[9px] md:text-[10px] font-black text-[#1e3a5f] uppercase tracking-tight group-hover:text-amber-500 transition-colors truncate pr-2">
                        {cat.name}
                      </span>
                      <span className="text-[9px] md:text-[10px] font-black text-slate-400 whitespace-nowrap">
                        {cat.earned}/{cat.total}
                      </span>
                    </div>
                    <div className="w-full h-2 md:h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-[2px]">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color}`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};