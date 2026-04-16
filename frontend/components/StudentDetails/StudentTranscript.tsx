"use client";
import React from 'react';
import { 
  ArrowLeft, 
} from 'lucide-react';

interface TranscriptProps {
  student: any;
  onBack: () => void;
}

export const StudentTranscript = ({ student, onBack }: TranscriptProps) => {
  const defaultTranscript = [
    // ... (Your defaultTranscript data remains the same)
    {
      semester: "Semester 1", sgpa: "3.85",
      courses: [
        { name: "IICT", type: "Computing Core", grade: "A", cr: "3" },
        { name: "Discrete structure", type: "Mathematics and Science Foundation", grade: "A-", cr: "3" },
        { name: "Applied Physics", type: "Mathematics and Science Foundation", grade: "B+", cr: "3" },
        { name: "English Composition & Comp.", type: "General Education (Core)", grade: "A+", cr: "3" },
        { name: "Programming Fundamentals", type: "Computing Core", grade: "A", cr: "4" },
        { name: "Pre calculs 1", type: "Mathematics and Science Foundation", grade: "A", cr: "3" }
      ]
    },
    {
      semester: "Semester 2", sgpa: "3.75",
      courses: [
        { name: "Software Engineering", type: "SE Core", grade: "A", cr: "3" },
        { name: "Calculus & Analytical Geometry", type: "Mathematics and Science Foundation", grade: "B+", cr: "3" },
        { name: "Presentation & Communication Skills", type: "General Education (Core)", grade: "A", cr: "3" },
        { name: "Graphics and Animation", type: "University Elective", grade: "A-", cr: "3" },
        { name: "Pakistan Studies", type: "General Education (Core)", grade: "A", cr: "2" }
      ]
    },
    {
      semester: "Semester 3", sgpa: "3.90",
      courses: [
        { name: "Software Requirements Engineering", type: "SE Core", grade: "A", cr: "3" },
        { name: "Graphic Designing", type: "University Elective", grade: "A", cr: "3" },
        { name: "Introduction to Psychology", type: "General Education (Core)", grade: "A", cr: "3" },
        { name: "Linear Algebra", type: "SE Supporting", grade: "A-", cr: "3" },
        { name: "Islamic Studies", type: "General Education (Core)", grade: "A", cr: "2" }
      ]
    },
    {
      semester: "Semester 4", sgpa: "3.80",
      courses: [
        { name: "Data Structures", type: "Computing Core", grade: "A", cr: "4" },
        { name: "Pre calculus 2", type: "Mathematics and Science Foundation", grade: "A-", cr: "3" },
        { name: "Human Computer Interaction", type: "SE Core", grade: "A", cr: "3" },
        { name: "Quranic Teachings", type: "General Education (Core)", grade: "A", cr: "2" },
        { name: "Probability & Statistics", type: "SE Supporting", grade: "B+", cr: "3" }
      ]
    },
    {
      semester: "Semester 5", sgpa: "3.70",
      courses: [
        { name: "OOPs", type: "Computing Core", grade: "A", cr: "4" },
        { name: "Software Construction & Dev", type: "SE Core", grade: "A-", cr: "3" },
        { name: "Technical Writing", type: "General Education (Core)", grade: "A", cr: "3" },
        { name: "Machine Learning", type: "SE Elective", grade: "B", cr: "3" }
      ]
    }
  ];

  const displayTranscript = student?.transcript || defaultTranscript;

  const getTypeText = (type: string) => {
    switch(type) {
      case "Computing Core": return "text-red-800";
      case "Mathematics and Science Foundation": return "text-rose-600";
      case "General Education (Core)": return "text-slate-700";
      case "University Elective": return "text-purple-800";
      case "SE Core": return "text-yellow-600";
      case "SE Elective": return "text-lime-700";
      case "SE Supporting": return "text-indigo-700";
      default: return "text-slate-500";
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50/50 overflow-hidden">
      
      {/* Top Navigation */}
      <div className="p-4 md:p-6 shrink-0">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
          
          {/* Header Card - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.2rem] border border-slate-100 shadow-sm items-center">
            
            <div className="flex flex-col justify-center text-center sm:text-left">
              <p className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase leading-tight">
                {student?.name || "N/A"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Student Transcript</p>
            </div>

            <div className="flex flex-col justify-center items-center sm:items-start md:border-l md:border-slate-100 md:pl-8">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Cumulative GPA</p>
              <p className="text-3xl font-black text-amber-500 leading-none">
                {student?.cgpa || "3.78"}
              </p>
            </div>

            <div className="text-center md:text-right flex flex-col justify-center sm:col-span-2 md:col-span-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Degree Progress</p>
              <p className="text-xl font-black text-[#1e3a5f]">
                85 <span className="text-slate-300">/ 130</span> 
                <span className="text-[10px] text-slate-400 uppercase ml-1">Hrs</span>
              </p>
            </div>
          </div>

          {/* Semester Sections */}
          {displayTranscript.map((sem: any, idx: number) => (
            <div key={idx} className="bg-white rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="bg-slate-50/50 px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 flex flex-row justify-between items-center">
                <h3 className="text-xs md:text-sm font-black text-[#1e3a5f] uppercase tracking-widest">{sem.semester}</h3>
                <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white rounded-xl border border-slate-200 text-[10px] md:text-xs font-black text-amber-600 whitespace-nowrap">
                  SGPA: {sem.sgpa}
                </span>
              </div>
              
              {/* Desktop Table View (Hidden on Mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-4 w-[40%]">Course Title</th>
                      <th className="px-4 py-4 w-[30%]">Category</th>
                      <th className="px-4 py-4 text-center">Cr.</th>
                      <th className="px-8 py-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sem.courses.map((course: any, cIdx: number) => (
                      <tr key={cIdx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-4 font-bold text-[#1e3a5f] text-xs uppercase tracking-tight">
                          {course.name}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold uppercase ${getTypeText(course.type)}`}>
                            {course.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-black text-slate-500 text-xs">{course.cr}</td>
                        <td className="px-8 py-4 text-center">
                          <span className={`text-xs font-black ${course.grade === 'F' ? 'text-red-600' : 'text-green-600'}`}>
                            {course.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Hidden on Desktop) */}
              <div className="md:hidden divide-y divide-slate-100">
                {sem.courses.map((course: any, cIdx: number) => (
                  <div key={cIdx} className="p-5 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <p className="font-black text-[#1e3a5f] text-xs uppercase leading-tight">
                        {course.name}
                      </p>
                      <span className={`text-xs font-black shrink-0 ${course.grade === 'F' ? 'text-red-600' : 'text-green-600'}`}>
                        {course.grade}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className={`text-[9px] font-black uppercase tracking-tight max-w-[70%] ${getTypeText(course.type)}`}>
                        {course.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {course.cr} Credits
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};