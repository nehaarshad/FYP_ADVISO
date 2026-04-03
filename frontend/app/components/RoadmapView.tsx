"use client";
import React from 'react';
import { X } from "lucide-react";

/**
 * ROADMAP VIEW COMPONENT
 * * DEVELOPER NOTES:
 * 1. Data Source: The 'roadmapData' array contains all 8 semesters from the official BSSE roadmap.
 * 2. Styling: The layout uses a strict black-border grid to match the provided sample.
 * 3. Backend Integration: Use the 'category' field in 'roadmapData' to inject dynamic background colors.
 */

const roadmapData = [
  { id: 1, title: "Semester 1", creditHrs: "16", courses: [
    { name: "Programming Fundamentals", cr: "3+1", category: "computing" },
    { name: "Discrete Structures", cr: "3", category: "computing" },
    { name: "Functional English", cr: "3", category: "general" },
    { name: "Applied Physics", cr: "2+1", category: "general" },
    { name: "Application of ICT", cr: "2+1", category: "computing" },
  ]},
  { id: 2, title: "Semester 2", creditHrs: "17", courses: [
    { name: "Object Oriented Programming", cr: "3+1", category: "computing" },
    { name: "Digital Logic Design", cr: "2+1", category: "computing" },
    { name: "Ideology and Constitution of Pakistan", cr: "2", category: "general" },
    { name: "Calculus and Analytic Geometry", cr: "3", category: "math" },
    { name: "Expository Writing", cr: "3", category: "general" },
    { name: "Islamic Studies", cr: "2", category: "general" },
  ]},
  { id: 3, title: "Semester 3", creditHrs: "18", courses: [
    { name: "Data Structures", cr: "3+1", category: "computing" },
    { name: "Computer Organization and Assembly Language", cr: "2+1", category: "computing" },
    { name: "Multivariable Calculus", cr: "3", category: "math" },
    { name: "Technical & Business Writing", cr: "3", category: "general" },
    { name: "Software Engineering", cr: "3", category: "computing" },
    { name: "Introduction to Basic Teachings of Quran", cr: "2", category: "general" },
  ]},
  { id: 4, title: "Semester 4", creditHrs: "18", courses: [
    { name: "Analysis of Algorithms", cr: "3", category: "computing" },
    { name: "Database Systems", cr: "3+1", category: "computing" },
    { name: "Software Requirement Engineering", cr: "2+1", category: "domain-core" },
    { name: "Linear Algebra", cr: "3", category: "math" },
    { name: "Domain Elective 1", cr: "", category: "domain-elective" },
    { name: "Civics and Community Engagement", cr: "2", category: "general" },
  ]},
  { id: 5, title: "Semester 5", creditHrs: "18", courses: [
    { name: "Operating Systems", cr: "2+1", category: "computing" },
    { name: "Software Design & Architecture", cr: "3", category: "domain-core" },
    { name: "Parallel & Distributed Computing", cr: "2+1", category: "domain-core" },
    { name: "Probability & Statistics", cr: "3", category: "math" },
    { name: "Domain Elective 2", cr: "", category: "domain-elective" },
    { name: "Domain Elective 3", cr: "", category: "domain-elective" },
  ]},
  { id: 6, title: "Semester 6", creditHrs: "17", courses: [
    { name: "Computer Networks", cr: "2+1", category: "computing" },
    { name: "Artificial Intelligence", cr: "2+1", category: "domain-elective" },
    { name: "Software Quality Engineering", cr: "2+1", category: "domain-core" },
    { name: "Software Construction & Development", cr: "2+1", category: "domain-core" },
    { name: "Domain Elective 4", cr: "", category: "domain-elective" },
    { name: "Entrepreneurship", cr: "2", category: "general" },
  ]},
  { id: 7, title: "Semester 7", creditHrs: "17", courses: [
    { name: "Final Year Project-I", cr: "3", category: "computing" },
    { name: "Information Security", cr: "2+1", category: "computing" },
    { name: "Software Project Management", cr: "2+1", category: "domain-core" },
    { name: "Introduction to Hadith & Seerah", cr: "2", category: "general" },
    { name: "Domain Elective 5", cr: "", category: "domain-elective" },
    { name: "Elective Supporting Courses", cr: "3", category: "supporting" },
  ]},
  { id: 8, title: "Semester 8", creditHrs: "11", courses: [
    { name: "Final Year Project-II", cr: "3", category: "computing" },
    { name: "Professional Practices", cr: "2", category: "computing" },
    { name: "Domain Elective 6", cr: "", category: "domain-elective" },
    { name: "Domain Elective 7", cr: "", category: "domain-elective" },
    { name: "Social Sciences", cr: "2", category: "general" },
  ]},
];

export function RoadmapView({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans">
      <div className="bg-white w-full max-w-[98vw] h-[95vh] flex flex-col shadow-2xl border border-slate-300">
        
        {/* HEADER SECTION */}
        <div className="p-6 border-b flex items-center justify-between bg-white relative">
          <h1 className="text-2xl font-bold text-black w-full text-center tracking-tight">
            Study Plan for BS (Software Engineering)
          </h1>
          <button onClick={onClose} className="absolute right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-black" />
          </button>
        </div>

        {/* MAIN GRID BODY */}
        <div className="flex-1 overflow-auto p-4 bg-white">
          <div className="grid grid-cols-8 border-l border-t border-black min-w-[1400px]">
            {roadmapData.map((sem) => (
              <div key={sem.id} className="flex flex-col border-r border-black">
                
                {/* Semester Header Cell */}
                <div className="border-b border-black p-2 text-center h-[60px] flex flex-col justify-center bg-slate-50">
                  <h3 className="font-bold text-[12px] uppercase italic tracking-tighter">{sem.title}</h3>
                  <p className="text-[10px] font-bold tracking-tight">{sem.creditHrs} Credit Hrs.</p>
                </div>

                {/* Course List Section */}
                <div className="flex flex-col flex-1">
                  {sem.courses.map((course, idx) => (
                    <div 
                      key={idx} 
                      className="border-b border-black p-3 min-h-[95px] flex flex-col justify-center items-center text-center bg-white transition-all hover:bg-slate-50/50"
                      /* BACKEND NOTE: Inject background color here based on course.category */
                    >
                      <p className="text-[10px] font-semibold uppercase leading-tight mb-1 tracking-tight">
                        {course.name}
                      </p>
                      {course.cr && (
                        <p className="text-[11px] font-bold">({course.cr})</p>
                      )}
                    </div>
                  ))}
                  
                  {/* Fill empty cells to maintain height consistency */}
                  {Array.from({ length: 7 - sem.courses.length }).map((_, i) => (
                    <div key={i} className="border-b border-black min-h-[95px] bg-white"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER LEGEND SECTION */}
        <div className="p-4 bg-white border-t border-black">
          <div className="grid grid-cols-8 border border-black min-w-[1400px]">
            <LegendCell label="Computing Core" hours="46 Credit Hrs." />
            <LegendCell label="Mathematics & Supporting" hours="12 Credit Hrs." />
            <LegendCell label="General Education Requirement" hours="34 Credit Hrs." />
            <LegendCell label="Elective Supporting Courses" hours="3 Credit Hrs." />
            <LegendCell label="Domain Core" hours="18 Credit Hrs." />
            <LegendCell label="Domain Elective" hours="21 Credit Hrs." />
            
            {/* Final Total Display */}
            <div className="col-span-1 border-r border-black flex items-center justify-center p-2 bg-slate-50">
               <span className="text-[11px] font-bold tracking-widest">TOTAL</span>
            </div>
            <div className="col-span-1 flex items-center justify-center p-2">
               <span className="text-4xl font-black text-black italic">134</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Legend Cell Helper
function LegendCell({ label, hours }: { label: string, hours: string }) {
  return (
    <div className="border-r border-black p-2 flex flex-col justify-center items-center text-center min-h-[60px] bg-white">
      <p className="text-[9px] font-bold uppercase leading-tight tracking-tighter">{label}</p>
      <p className="text-[10px] font-semibold mt-1">{hours}</p>
    </div>
  );
}