"use client";
import React from 'react';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  FileText, 
  ChevronRight 
} from 'lucide-react';

interface StudentProfileProps {
  student: any;
  selectedBatch: string;
  onBack: () => void;
  onViewTranscript: () => void;
}

export const StudentProfile = ({ student, selectedBatch, onBack, onViewTranscript }: StudentProfileProps) => {
  if (!student) return null;

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-black text-[10px] uppercase transition-all w-fit"
        >
          <ArrowLeft 
            size={14} 
            className="text-[#1e3a5f] group-hover:-translate-x-1 transition-transform stroke-[3]" 
          />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0 pr-2 pb-10">
        
        {/* LEFT COLUMN - Profile Card */}
        <div className="w-full lg:w-[320px] flex flex-col gap-5 shrink-0 lg:sticky lg:top-0">
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm border border-slate-50">
            <div className="w-18 h-18 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
              <User size={45} className="text-[#1e3a5f] opacity-40" />
            </div>
            
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase not-italic leading-tight mb-1 text-center tracking-tighter">
              {student.name}
            </h2>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 text-center">
              SAP ID: {student.code}
            </p>
            
            <div className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest mb-8 border-b-4 shadow-sm ${
              student.status === 'Regular' 
              ? 'bg-green-100 text-green-900 border-green-300' 
              : 'bg-red-100 text-red-900 border-red-300'       
            }`}>
              {student.status} Status
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Registration</span>
                <span className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-tighter">564576001</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Batch</span>
                <span className="text-[11px] font-black text-[#1e3a5f]">{selectedBatch}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onViewTranscript}
            className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white text-[#1e3a5f] border-2 border-slate-100 hover:border-amber-400 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-50 shadow-inner group-hover:scale-110 transition-transform">
                <FileText size={20} className="text-amber-500" />
              </div>
              <div className="text-left">
                <span className="block text-[13px] font-black uppercase tracking-tight group-hover:text-[#1e3a5f]">
                  View Transcript
                </span>
                <span className="text-[9px] font-bold uppercase text-slate-400 not-italic">
                  Complete Grade Report
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* RIGHT COLUMN - Stats & Roadmap */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">
          
          {/* STATS BANNER */}
          <div className="bg-[#1e3a5f] rounded-[2.1rem] p-2 text-white border-b-[6px] border-amber-400 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="pl-3">
                <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.1em] mb-2">
                  Current Academic Standing
                </p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-bold not-italic tracking-tight text-white ml-3 font-black">
  {student.cgpa || '0.00'}
</h2>
                  <span className="text-xs font-black not-italic text-slate-300 uppercase tracking-widest">
                    CGPA
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-7 py-6 rounded-[2.1rem] border border-white/10 min-w-[100px]">
<p className="text-[9px] font-black text-amber-400 uppercase mb-2 tracking-[0.1em]">
  Completed Credits
</p>
                 <p className="text-xl font-black text-amber-400"> 
  85 
  <span className="text-white"> / 130</span> 
  <span className="text-[10px] text-slate-400 uppercase ml-1">Hrs</span>
</p>
                <div className="flex items-baseline gap-2">
                  
                  
                </div>
              </div>
            </div>
            <BookOpen size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          {/* ROADMAP AREA */}
          <div className="bg-white rounded-[2.1rem] p-8 shadow-sm border border-slate-100 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-[14px] font-black uppercase tracking-widest text-[#1e3a5f] not-italic">
                    Degree Roadmap Progress
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Category-wise breakdown</p>
                </div>
              </div>
              <div className="text-right">
                
              </div>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pr-2">
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
                      <span className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 not-italic">
                        {cat.earned}/{cat.total}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-[2px]">
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