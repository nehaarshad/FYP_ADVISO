"use client";
import React from 'react';
import { Search, Book, Eye } from "lucide-react";

export const CourseCatalog = () => {
  const courses = [
    { 
      code: "SE-312", 
      title: "Software Construction", 
      preReq: "CS-212", 
      crHrs: "3(2+1)", 
      category: "Core", 
      program: "BS SE" 
    },
    { 
      code: "CS-121", 
      title: "Programming Fundamentals", 
      preReq: "None", 
      crHrs: "4(3+1)", 
      category: "Core", 
      program: "BS CS" 
    },
    { 
      code: "SE-421", 
      title: "Cloud Computing", 
      preReq: "SE-312", 
      crHrs: "3(2+1)", 
      category: "Domain Elective", 
      program: "BS SE" 
    },
    { 
      code: "CS-302", 
      title: "Operating Systems", 
      preReq: "CS-201", 
      crHrs: "4(3+1)", 
      category: "Core", 
      program: "BS CS" 
    },
    { 
      code: "SE-322", 
      title: "Software Quality Engineering", 
      preReq: "SE-312", 
      crHrs: "3(3+0)", 
      category: "Core", 
      program: "BS SE" 
    },
    { 
      code: "CS-415", 
      title: "Mobile App Development", 
      preReq: "CS-121", 
      crHrs: "3(2+1)", 
      category: "Elective", 
      program: "BS CS" 
    },
    { 
      code: "CY-411", 
      title: "Ethical Hacking", 
      preReq: "CY-331", 
      crHrs: "3(2+1)", 
      category: "Domain Elective", 
      program: "BS CS" 
    },
    { 
      code: "AI-301", 
      title: "Artificial Intelligence", 
      preReq: "MT-202", 
      crHrs: "3(2+1)", 
      category: "Elective", 
      program: "BS SE" 
    },
    { 
      code: "SE-450", 
      title: "Big Data Analytics", 
      preReq: "CS-301", 
      crHrs: "3(3+0)", 
      category: "Domain Elective", 
      program: "BS SE" 
    },
  ];

  return (
    <div className="bg-white p-8 border border-slate-300 shadow-none">
      {/* Header -*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Course Catalog</h2>
          <div className="h-1 w-12 bg-slate-900 mt-1"></div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH COURSES..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all uppercase" 
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300">
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Code</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Course Name</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Pre-Req</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Credit</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Category</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Program</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {courses.map((course) => (
              <tr key={course.code} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-black text-slate-900 border-r border-slate-200 uppercase">
                  {course.code}
                </td>

                <td className="p-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-900 font-bold uppercase">{course.title}</p>
                </td>

                <td className="p-4 border-r border-slate-200">
                  <span className={`text-[10px] font-bold uppercase ${course.preReq === 'None' ? 'text-slate-300' : 'text-slate-900'}`}>
                    {course.preReq}
                  </span>
                </td>

                <td className="p-4 text-xs font-black text-slate-900 border-r border-slate-200">
                  {course.crHrs}
                </td>

                <td className="p-4 border-r border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-600">
                    {course.category}
                  </span>
                </td>

                <td className="p-4 text-[10px] font-black text-slate-500 border-r border-slate-200 uppercase">
                  {course.program}
                </td>

                <td className="p-4 text-center">
                  <button className="text-slate-400 hover:text-slate-900 transition-colors">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};