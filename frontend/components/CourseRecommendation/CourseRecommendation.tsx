"use client";

import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Clock, BookOpen, Layers, Target } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  category: "Computing Core" | "SE Elective" | "SE Supporting" | "General Ed";
  credits: number;
  status: "Available" | "Clash" | "Prereq_Missing";
  logicReason: string;
  basis: "Roadmap Priority" | "Prerequisite Cleared" | "Gap Filling";
}

export default function SmartAdvisory({ onBack, selectedBatch }: { onBack: () => void, selectedBatch: string }) {
  
  const [suggestions] = useState<Course[]>([
    {
      id: "1",
      name: "Operating Systems",
      code: "CS-202",
      category: "Computing Core",
      credits: 4,
      status: "Available",
      basis: "Roadmap Priority",
      logicReason: "The prerequisite (DS) is already cleared, and this is a mandatory core subject for graduation."
    },
    {
      id: "2",
      name: "Software Architecture",
      code: "SE-302",
      category: "Computing Core",
      credits: 3,
      status: "Clash",
      basis: "Prerequisite Cleared",
      logicReason: "Time-table clash: the slot overlaps with “Computing Core” Section A."
    },
    {
      id: "3",
      name: "Machine Learning",
      code: "SE-410",
      category: "SE Elective",
      credits: 3,
      status: "Available",
      basis: "Gap Filling",
      logicReason: "The student has fewer elective credit hours. According to the roadmap, this is a 7th semester elective."
    }
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCourse = (id: string, status: string) => {
    if (status !== "Available") return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) return alert("Please select at least one course.");
    if (window.confirm(`Confirm: Suggest ${selectedIds.length} courses to student?`)) {
      alert("Success: Recommendations sent to Student Portal.");
      onBack();
    }
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
        <div>
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors mb-4 inline-flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">
            Irregular Student <span className="text-amber-500">Advisory</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Batch: {selectedBatch} | Auto-Scanning Roadmap & Clashes
          </p>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {suggestions.map((course) => {
          const isSelected = selectedIds.includes(course.id);
          const isAvailable = course.status === "Available";

          return (
            <div 
              key={course.id}
              onClick={() => toggleCourse(course.id, course.status)}
              className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                !isAvailable ? "bg-slate-50 border-slate-100 opacity-60" :
                isSelected ? "border-amber-500 bg-amber-50/10 shadow-lg scale-[1.01]" : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                  isSelected ? "bg-amber-500 border-amber-500 text-white" : "border-slate-200 text-slate-200"
                }`}>
                  <CheckCircle size={20} className="md:w-6 md:h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-lg text-[8px] md:text-[9px] font-black text-slate-600 uppercase">
                      <Layers size={10} /> {course.category}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-lg text-[8px] md:text-[9px] font-black text-blue-600 uppercase border border-blue-100">
                      <Target size={10} /> {course.basis}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-[#1e3a5f] uppercase leading-tight">{course.name}</h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">{course.code} • {course.credits} Credit Hours</p>

                  <div className="mt-3 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[8px] md:text-[9px] font-black text-[#1e3a5f] uppercase mb-1 flex items-center gap-1">
                      <BookOpen size={10} /> Advisor Note (System Logic):
                    </p>
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-relaxed">
                      "{course.logicReason}"
                    </p>
                  </div>
                </div>

                <div className="md:text-right shrink-0">
                  {course.status === "Clash" ? (
                    <div className="flex items-center justify-center md:justify-end gap-2 text-red-500 font-black text-[9px] md:text-[10px] uppercase bg-red-50 px-3 md:px-4 py-2 rounded-xl">
                      <Clock size={12} /> Time Clash Detected
                    </div>
                  ) : isAvailable ? (
                    <div className="text-green-600 font-black text-[9px] md:text-[10px] uppercase bg-green-50 px-3 md:px-4 py-2 rounded-xl text-center">
                      Eligible to Register
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="bg-[#1e3a5f] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl uppercase tracking-tighter">Finalize Recommendation</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Suggesting {selectedIds.length} {selectedIds.length === 1 ? 'subject' : 'subjects'}
          </p>
        </div>
        
        <button 
          onClick={handleConfirm}
          className="w-full md:w-auto px-8 md:px-12 py-3 md:py-4 bg-amber-500 text-slate-900 text-[10px] md:text-[11px] font-black uppercase rounded-xl md:rounded-2xl hover:bg-amber-400 transition-all shadow-lg active:scale-95"
        >
          Send Advice to Student
        </button>
      </div>
    </div>
  );
}