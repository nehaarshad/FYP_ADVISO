/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StudentDetails/StudentTranscript.tsx
"use client";
import React, { useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
import { useCourseCatalog } from '@/src/hooks/courseDetailHook/useCourseDetails';

interface TranscriptProps {
  student: any;
  onBack: () => void;
}

export const StudentTranscript = ({ student, onBack }: TranscriptProps) => {
  const { 
    transcript, 
    isLoading, 
    error, 
    getCGPA,
    getTotalEarnedCredits,
    getSemesterData,
    fetchStudentTranscript,
  } = useTranscript();

  const { getCategoryStyle, fetchCourses } = useCourseCatalog();


  useEffect(() => {
    if (student?.id) {
      fetchStudentTranscript(student.id);
      
    }
  }, [student?.id, fetchStudentTranscript]);

   useEffect(() => {
    fetchCourses();
  }, []);


  // Add this helper function inside your component
const getGradeStyle = (grade: string) => {
  const gradeMap: Record<string, { bg: string; text: string }> = {
    'F': { bg: '#fee2e2', text: '#dc2626' },      
    'W': { bg: '#fef3c7', text: '#d97706' },  
    'D': { bg: '#a6c4e6', text: '#1e3a5f' },    
    'C': { bg: '#dcfce7', text: '#16a34a' },    
    'B': {  bg: '#dcfce7', text: '#16a34a' },      
    'B+': { bg: '#dcfce7', text: '#16a34a' },    
    'A': { bg: '#dcfce7', text: '#16a34a' },  
    'A-': { bg: '#dcfce7', text: '#16a34a' }, 
    'A+': { bg: '#dcfce7', text: '#16a34a' }, 
  };
  
  const defaultStyle = { bg: '#e2e8f0', text: '#64748b' };  // Slate gray for unknown grades
  
  return gradeMap[grade] || defaultStyle;
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 p-8 rounded-2xl">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-bold mb-2">Error loading transcript</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => fetchStudentTranscript(student?.id)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!transcript && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-500 font-bold">No transcript available</p>
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col bg-slate-50/50 overflow-hidden">
      {/* Top Navigation */}
      <div className="p-4 md:p-6 shrink-0">
        <button 
          title="btn"
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
          {/* Header Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.2rem] border border-slate-100 shadow-sm items-center">
            <div className="flex flex-col justify-center text-center sm:text-left">
              <p className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase leading-tight">
                {student?.studentName || "N/A"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                SAP ID: {student?.User?.sapid || "N/A"}
              </p>
            </div>

            <div className="flex flex-col justify-center items-center sm:items-start md:border-l md:border-slate-100 md:pl-8">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Cumulative GPA</p>
              <p className="text-3xl font-black text-amber-500 leading-none">
                {getCGPA()}
              </p>
            </div>

            <div className="text-center md:text-right flex flex-col justify-center sm:col-span-2 md:col-span-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Degree Progress</p>
              <p className="text-xl font-black text-[#1e3a5f]">
                {getTotalEarnedCredits()} <span className="text-slate-300">/ {student?.BatchModel?.RoadmapModel?.totalCreditHours || "N/A"}</span> 
                <span className="text-[10px] text-slate-400 uppercase ml-1">Credits</span>
              </p>
            </div>
          </div>

          {/* Semester Sections */}
          {getSemesterData().map((sem: any, idx: number) => (
             <div key={idx} className="bg-white rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="bg-slate-50/50 px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 flex flex-row justify-between items-center flex-wrap gap-2">
                <div className="flex flex-col">
                  <h3 className="text-s md:text-sm font-black text-[#1e3a5f] uppercase tracking-widest">{sem.semester}</h3>
                  <span className="text-[10px] text-slate-700 mt-0.5">
                    Earned: {sem.earnedCredits} / {sem.totalCredits} Credits
                  </span>
                </div>
                <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white rounded-xl border border-slate-200 text-[10px] md:text-xs font-black text-amber-600 whitespace-nowrap">
                  SGPA: {sem.sgpa}
                </span>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-4 w-[40%]">Course Title</th>
                      <th className="px-4 py-4 w-[30%]">Category</th>
                      <th className="px-4 py-4 text-center">Credits</th>
                      <th className="px-8 py-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sem.courses.map((course: any, cIdx: number) => {
                      const categoryStyle = getCategoryStyle(course.courseCategory);
                      const gradeStyle = getGradeStyle(course.grade);
                      
                      return (
                        <tr key={cIdx} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-4">
                            <div>
                              <p  className="font-bold text-[#1e3a5f] text-xs uppercase tracking-tight">
                                {course.courseName}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                                {course.courseCode}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                           <ul className="list-disc pl-4">
                              <li style={{ color: categoryStyle.color }}>
                                <span 
                                  className="text-[10px] font-bold uppercase py-1"
                                  style={{ color: categoryStyle.color }}
                                >
                                  {course.courseCategory || 'N/A'}
                                </span>
                              </li>
                            </ul>

                          </td>
                          <td className="px-4 py-4 text-center font-black text-slate-500 text-xs">
                            {course.earnedCreditHours}/{course.totalCreditHours}
                          </td>
                          <td className="px-8 py-4 text-center">
                            <span 
                              className="text-xs font-black px-3 py-1 rounded-lg"
                              style={{
                                backgroundColor: gradeStyle.bg,
                                color: gradeStyle.text
                              }}
                            >
                              {course.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {sem.courses.map((course: any, cIdx: number) => {
                  const categoryStyle = getCategoryStyle(course.courseCategory);
                  const gradeStyle = getGradeStyle(course.grade);
                  
                  return (
                    <div key={cIdx} className="p-5 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-black text-[#1e3a5f] text-xs uppercase leading-tight">
                            {course.courseName}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                            {course.courseCode}
                          </p>
                        </div>
                        <span 
                          className="text-xs font-black px-2 py-1 rounded-lg shrink-0"
                          style={{
                            backgroundColor: gradeStyle.bg,
                            color: gradeStyle.text
                          }}
                        >
                          {course.grade}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span 
                          className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: categoryStyle.backgroundColor,
                            color: categoryStyle.color
                          }}
                        >
                          {course.courseCategory || 'N/A'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          {course.earnedCreditHours}/{course.totalCreditHours} Credits
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};