"use client";
import React, { useState } from 'react';
import { GraduationCap, Upload, ChevronDown, ChevronRight, CheckCircle2, BookOpen } from "lucide-react";

// Backend Integration ke liye Interfaces
interface Course {
  title: string;
  cr: number;
  grade: string;
}

interface Semester {
  num: string;
  sgpa: string;
  courses: Course[];
}

interface Program {
  title: string; // e.g., "BS Software Engineering"
  status: 'Published' | 'Pending';
  semesters: Semester[];
}

interface BatchGroup {
  year: string; // e.g., "Batch 2022"
  programs: Program[];
}

export const BatchResults = () => {
  // State for Accordion (kaunsa batch khula hua hai)
  const [openBatch, setOpenBatch] = useState<string | null>("Batch 2022");

  // FYP Data Structure: Organised by Batch Year
  const batchData: BatchGroup[] = [
    {
      year: "Batch 2022",
      programs: [
        {
          title: "BS Software Engineering",
          status: "Published",
          semesters: [
            {
              num: "Semester 2",
              sgpa: "1.61",
              courses: [
                { title: "SOFTWARE ENGINEERING", cr: 3, grade: "D" },
                { title: "CALCULUS & ANALYTICAL GEOMETRY", cr: 3, grade: "C" },
                { title: "PRESENTATION & COMMUNICATION SKILLS", cr: 3, grade: "B" },
              ]
            },
            {
              num: "Semester 3",
              sgpa: "0.9",
              courses: [
                { title: "SOFTWARE REQUIREMENTS ENGINEERING", cr: 3, grade: "D" },
                { title: "LINEAR ALGEBRA", cr: 0, grade: "F" },
              ]
            }
          ]
        },
        {
          title: "BS Computer Science",
          status: "Pending",
          semesters: []
        }
      ]
    },
    {
      year: "Batch 2021",
      programs: [
        { title: "BS Computer Science", status: "Published", semesters: [] }
      ]
    }
  ];

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Academic Results</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest italic">Select Batch to View Program Results</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all">
          <Upload size={14} /> Upload Timetable
        </button>
      </div>

      <div className="space-y-4">
        {batchData.map((batch) => (
          <div key={batch.year} className="border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all">
            {/* Batch Selector Header */}
            <button 
              onClick={() => setOpenBatch(openBatch === batch.year ? null : batch.year)}
              className={`w-full flex items-center justify-between p-6 md:p-8 transition-colors ${openBatch === batch.year ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${openBatch === batch.year ? 'bg-[#FDB813] text-[#1e3a5f]' : 'bg-slate-100 text-slate-400'}`}>
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-black text-[#1e3a5f] text-lg uppercase italic">{batch.year}</h3>
              </div>
              {openBatch === batch.year ? <ChevronDown size={20} className="text-[#1e3a5f]" /> : <ChevronRight size={20} className="text-slate-300" />}
            </button>

            {/* Programs List (Visible when batch is clicked) */}
            {openBatch === batch.year && (
              <div className="p-6 md:p-8 pt-0 bg-slate-50/30">
                <div className="space-y-8 mt-4">
                  {batch.programs.map((prog, pIdx) => (
                    <div key={pIdx} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <BookOpen size={18} className="text-[#FDB813]" />
                          <h4 className="font-black text-[#1e3a5f] text-md uppercase">{prog.title}</h4>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${prog.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {prog.status}
                        </span>
                      </div>

                      {/* Display Semesters if Published */}
                      {prog.semesters.length > 0 ? (
                        <div className="space-y-8 border-l-2 border-slate-50 pl-4">
                          {prog.semesters.map((sem, sIdx) => (
                            <div key={sIdx} className="space-y-4">
                              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                                <span className="text-[#1e3a5f] font-black text-sm uppercase italic">{sem.num}</span>
                                <span className="text-lg font-black text-[#FDB813]">{sem.sgpa} <small className="text-[8px] text-slate-300 uppercase">SGPA</small></span>
                              </div>
                              <div className="space-y-2">
                                {sem.courses.map((c, cIdx) => (
                                  <div key={cIdx} className="grid grid-cols-12 text-[10px] py-1 border-b border-slate-50/50">
                                    <div className="col-span-9 font-bold text-slate-500 uppercase">{c.title}</div>
                                    <div className="col-span-3 text-right font-black text-[#1e3a5f]">{c.grade}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-bold italic text-center py-4 uppercase">Results not yet processed for this program.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};