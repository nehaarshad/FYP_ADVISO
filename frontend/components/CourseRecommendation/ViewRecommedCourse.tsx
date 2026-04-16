"use client";

import React from "react";
import { BookOpen, Info, CheckCircle2, LayoutGrid, Zap, ArrowLeft } from "lucide-react";

interface SuggestedCourse {
  id: string;
  name: string;
  code: string;
  credits: number;
  category: string;
  advisorNote: string;
  basis: string;
}

interface ViewRecommedProps {
  suggestedCourses: SuggestedCourse[];
  advisorName: string;
  lastUpdated: string;
  onBack?: () => void;
}

export default function ViewRecommedCourse({ suggestedCourses, advisorName, lastUpdated, onBack }: ViewRecommedProps) {
  // Static content update logic for the example
  const updatedCourses = suggestedCourses.map((course, index) => ({
    ...course,
    advisorNote: index === 0 
      ? "You have already cleared Software Engineering (SE-201), so this is the next mandatory step."
      : "For graduation, you need additional elective credits. This course aligns with your interest in backend development."
  }));

  return (
    <div className="w-full space-y-4 md:space-y-6 px-1 md:px-0">
      {/* Back Arrow Navigation */}
      <button 
        onClick={onBack} 
        className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Top Banner: Advisor Info */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
              Recommended Courses
            </h2>
            <p className="text-blue-100 text-[9px] md:text-[10px] font-bold uppercase mt-2 tracking-wide">
              Suggested by <span className="text-white underline">{advisorName}</span>
              <span className="block md:inline md:ml-2 opacity-70 mt-1 md:mt-0">• {lastUpdated}</span>
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-center md:items-end">
            <p className="text-[8px] md:text-[9px] font-black uppercase opacity-60 tracking-widest">Total Suggestions</p>
            <p className="text-lg md:text-xl font-black text-white leading-none mt-1">{updatedCourses.length} Courses</p>
          </div>
        </div>
        
        <Zap className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32 md:w-40 md:h-40" />
      </div>

      {/* Suggested Course List */}
      <div className="grid grid-cols-1 gap-4">
        {updatedCourses.length > 0 ? (
          updatedCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white border-2 border-slate-100 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-start md:items-stretch gap-4 md:gap-6"
            >
              {/* Icon & Category */}
              <div className="flex flex-row md:flex-col items-center md:items-center gap-3 shrink-0 w-full md:w-auto pb-3 md:pb-0 border-b md:border-b-0 border-slate-50">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-inner border border-slate-100">
                  <BookOpen size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col md:items-center gap-1">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[8px] font-black uppercase rounded-lg border border-amber-100">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base md:text-lg font-black text-[#1e3a5f] uppercase tracking-tight leading-tight">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.code}</span>
                      <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.credits} Credits</span>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 md:py-1 rounded-full border border-blue-100 self-start">
                    <CheckCircle2 size={12} className="text-blue-500" />
                    <span className="text-[8px] md:text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                      {course.basis}
                    </span>
                  </div>
                </div>

                {/* Advisor's Note - Updated Text & Non-Italic */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Info size={12} className="text-[#1e3a5f]" />
                    <span className="text-[8px] md:text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest">Advisor's Note</span>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-relaxed">
                    "{course.advisorNote}"
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 md:py-20 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 px-6">
            <LayoutGrid className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-400 font-black uppercase text-[10px] md:text-[12px] tracking-widest leading-none">No recommendations yet</p>
          </div>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col sm:flex-row items-center sm:items-start gap-3">
        <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200">
          <Zap size={16} />
        </div>
        <p className="text-[9px] md:text-[10px] font-bold text-amber-800 leading-snug text-center sm:text-left">
          These suggestions were made based on your academic roadmap. You can officially register for these courses during your next enrollment window.
        </p>
      </div>
    </div>
  );
}