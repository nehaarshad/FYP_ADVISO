"use client";
import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

interface TranscriptProps {
  student: any;
  onBack: () => void;
}

export const StudentTranscript = ({ student, onBack }: TranscriptProps) => {
  const defaultTranscript = [
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

  const getTypeBg = (type: string) => {
    switch(type) {
      case "Computing Core": return "text-red-700";
      case "Mathematics and Science Foundation": return "text-rose-600";
      case "General Education (Core)": return "text-slate-700";
      case "University Elective": return "text-purple-700";
      case "SE Core": return "text-yellow-700";
      case "SE Elective": return "text-lime-800";
      case "SE Supporting": return "text-indigo-900";
      default: return "bg-slate-100";
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50/50">
      
      {/* Top Navigation */}
      <div className="p-6">
        <button 
          onClick={onBack} 
          className="p-1 hover:bg-slate-100 rounded-full text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-[2.2rem] border border-slate-100 shadow-sm mx-6 items-center">
  {/* Student Name - Size increased and Vertically Centered */}
  <div className="flex flex-col justify-center">
    <p className="text-2xl font-black text-[#1e3a5f] uppercase not-italic leading-none">
      {student?.name || "N/A"}
    </p>
  </div>

  {/* CGPA - Now closer to the name and centered */}
  <div className="flex flex-col justify-center md:border-l md:border-slate-50 md:pl-8">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">CGPA</p>
    <p className="text-3xl font-black text-amber-500 not-italic leading-none">
      {student?.cgpa || "3.78"}
    </p>
  </div>

  {/* Total Requirement - Right Aligned */}
  <div className="text-right flex flex-col justify-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Requirement</p>
    <p className="text-xl font-black text-[#1e3a5f]">
      85 <span className="text-slate-300">/ 130</span> 
      <span className="text-[10px] text-slate-400 uppercase ml-1">Hrs</span>
    </p>
  </div>
</div>

          {/* Semester Tables */}
          {displayTranscript.map((sem: any, idx: number) => (
            <div key={idx} className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm mx-6">
              <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                
                <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest not-italic">{sem.semester}</h3>
                <span className="px-4 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-black text-amber-600">
                  GPA: {sem.sgpa}
                </span>
              </div>
              
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-5 w-[35%]">Course Title</th>
                    <th className="px-4 py-5 w-[35%] text-left">Course Category</th>
                    <th className="px-4 py-5 w-[15%] text-center">Cr. Hrs</th>
                    <th className="px-8 py-5 w-[15%] text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sem.courses.map((course: any, cIdx: number) => (
                    <tr key={cIdx} className="hover:bg-slate-50/30 transition-colors">
                      
                      <td className="px-8 py-4 font-bold text-[#1e3a5f] text-xs uppercase not-italic tracking-tight truncate">
                        {course.name}
                      </td>
                      <td className="px-4 py-5 text-left">
                        <span className={`px-0 py-1 rounded-full text-[10px] font-medium uppercase tracking-tighter text-black ${getTypeBg(course.type)}`}>
                          {course.type}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center font-black text-slate-500 text-xs">{course.cr}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`text-xs font-black ${
                          course.grade === 'F' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};