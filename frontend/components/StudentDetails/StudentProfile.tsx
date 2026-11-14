
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StudentDetails/StudentProfile.tsx
"use client";
import { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  FileText, 
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
import { RoadmapDetailView } from '../Roadmap/RoadmapView';

interface StudentProfileProps {
  student: any;
  selectedBatch?: string;
  onBack: () => void;
  onViewTranscript: () => void;
  isAdvisor?: boolean;
  onNavigateToCourseRec?: () => void;
}

export const StudentProfile = ({ 
  student, 
  onBack, 
  onViewTranscript, 
  isAdvisor, 
  onNavigateToCourseRec 
}: StudentProfileProps) => {
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const { 
    transcript, 
    getCGPA,
    getTotalEarnedCredits,
    fetchStudentTranscript,
  } = useTranscript();
 
  // Calculate earned credits per category from transcript
  const calculateEarnedCredits = () => {
    const earnedMap = new Map<string, number>();
    const sessionalTranscripts = transcript?.SessionalTranscripts || [];
    
    sessionalTranscripts.forEach((sessional: any) => {
      const courses = sessional.TranscriptCoursesDetails || [];
      
      courses.forEach((course: any) => {
        const category = course.courseCategory;
        const earnedCredits = parseFloat(course.earnedCreditHours) || 0;
        
        if (category) {
          const current = earnedMap.get(category) || 0;
          earnedMap.set(category, current + earnedCredits);
        }
      });
    });
    
    return earnedMap;
  };

  const roadmapCategories = student?.BatchModel?.RoadmapModel?.RoadmapCourseCategoryModels || [];
  const earnedCreditsMap = calculateEarnedCredits();
  
  const convertARGBToHex = (colorScheme: string): string => {
    if (!colorScheme) return '#e5e7eb';
    if (colorScheme.startsWith('#')) return colorScheme;
    let hex = colorScheme;
    if (hex.startsWith('FF')) {
      hex = hex.substring(2);
    }
    return `#${hex}`;
  };

  useEffect(() => {
    if (student?.id) {
      fetchStudentTranscript(student.id);
    }
  }, [student?.id, fetchStudentTranscript]);
    
  if (!student) return null;

  // Determine student status & safe class mapping for Tailwind
  const isRegular = student.StudentStatus?.currentStatus === 'Promoted' || student.StudentStatus?.currentStatus === 'New Admission' || 
                    student.StudentStatus?.currentStatus === 'Regular';
  const statusBadgeClasses = isRegular 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';

  return (
    <div className="animate-in fade-in duration-500 min-h-full flex flex-col px-2 sm:px-4 md:px-0 max-w-6xl mx-auto">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 pt-2 shrink-0">
        <button 
          title="Go Back"
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {isAdvisor && student.StudentStatus?.currentStatus !== 'Relegated' && (
          <button 
            onClick={onNavigateToCourseRec}
            className="flex items-center gap-2 bg-amber-400 text-[#1e3a5f] px-4 md:px-5 py-2.5 rounded-xl text-[12px] md:text-[13px] font-bold  hover:bg-amber-300 transition-all shadow-sm"
          >
            <Sparkles size={16} />
            <span>Recommend Courses</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start flex-1 pb-10">
        
        {/* LEFT COLUMN - Profile Card */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4 md:gap-5 shrink-0 lg:sticky lg:top-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <User size={40} className="text-[#1e3a5f] opacity-80" />
            </div>
            
            <h2 className="text-1xl md:text-3xl font-bold text-[#1e3a5f]  text-center tracking-tighter">
              {student.studentName}
            </h2>
            <p className="text-[11px] md:text-[13px] font-bold text-slate-600  tracking-wider mt-1">
              SAP ID: {student.User?.sapid}
            </p>
            
            <div className={`mt-4 px-4 py-1.5 rounded-full text-[12px] md:text-[13px] font-bold  tracking-wider ${statusBadgeClasses}`}>
              {student.StudentStatus?.currentStatus || 'Active'}
            </div>

            <div className="w-full space-y-3 mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-slate-600" />
                <span className="text-slate-800 font-semibold text-sm sm:text-sm truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-slate-600" />
                <span className="text-slate-800 font-semibold text-sm sm:text-sm">{student.contactNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap size={18} className="text-slate-600" />
                <span className="text-slate-800 font-semibold text-sm sm:text-sm">Semester {student.currentSemester}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-slate-600" />
                <span className="text-slate-800 font-semibold text-sm sm:text-sm">Batch {student.BatchModel?.batchName}-{student.BatchModel?.batchYear}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onViewTranscript}
            className="w-full flex items-center justify-between p-4 md:p-5 rounded-[1.8rem] bg-white text-[#1e3a5f] border-2 border-slate-100 hover:border-amber-400 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText size={20} className="text-amber-400" />
              </div>
              <div className="text-left">
                <span className="block text-[13px] md:text-[15px] font-bold  tracking-tight">
                   Transcript
                </span>
                <span className="text-[10px] md:text-[12px] font-bold text-slate-500 ">
                  Complete Grade Report
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>

          {student && student?.BatchModel?.RoadmapModel && (
            <button 
              onClick={() => setShowRoadmapModal(true)}
              className="w-full flex items-center justify-between p-4 md:p-5 rounded-[1.8rem] bg-white text-[#1e3a5f] border-2 border-slate-100 hover:border-slate-600 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 bg-amber-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={18} className="text-slate-800" />
                </div>
                <div className="text-left">
                 <span className="block text-[13px] md:text-[15px] font-bold  tracking-tight">
                   Assigned Roadmap
                  </span>
                  <span className="text-[10px] md:text-[12px] font-bold text-slate-500 ">
                    Program Structure & Courses
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
            </button>
          )}
        </div>

        {/* RIGHT COLUMN - Academic Info */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0 w-full">
          
          {/* Stats Banner */}
          <div className="bg-[#1e3a5f] rounded-[1.8rem] md:rounded-[2.1rem] p-4 md:p-2 text-white border-b-[6px] border-amber-400 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="pl-0 md:pl-6 py-4 text-center md:text-left">
                <p className="text-[11px] md:text-[13px] text-amber-400 font-bold  tracking-[0.1em] mb-2">
                  Current Academic Standing
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
                    {getCGPA()}
                  </h2>
                  <span className="text-[11px] md:text-[13px] font-bold text-slate-300  tracking-widest">
                    CGPA
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.1rem] border border-white/10 text-center md:text-left">
                <p className="text-[11px] md:text-[12px] font-bold text-amber-400  mb-2 tracking-[0.1em]">
                  Completed Credits
                </p>
                <p className="text-lg md:text-xl font-bold text-amber-400"> 
                  {getTotalEarnedCredits()} <span className="text-white">/ {student?.BatchModel?.RoadmapModel?.totalCreditHours || "0"}</span> 
                  <span className="text-[11px] md:text-[13px] text-slate-400  ml-1">Hrs</span>
                </p>
              </div>
            </div>
            <BookOpen size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700 hidden sm:block" />
          </div>

          {/* Roadmap Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            {roadmapCategories.map((cat: any, i: number) => {
              const categoryName = cat.CategoryModel?.categoryName || 'Unknown';
              const required = cat.requiredCredits || 0;
              const earned = earnedCreditsMap.get(categoryName) || 0;
              const percentage = required > 0 ? Math.min((earned / required) * 100, 100) : 0;
              const colorScheme = cat.CategoryModel?.colorScheme || '#64748b';
              const hexColor = convertARGBToHex(colorScheme);
              
              return (
                <div key={i} className="group">
                  <div className="flex justify-between mb-2 px-1">
                    <span className="text-[11px] md:text-[13px] font-bold  pr-2 text-slate-700">
                      {categoryName}
                    </span>
                    <span className="text-[11px] md:text-[12px] font-bold text-slate-500 whitespace-nowrap">
                      {earned}/{required}
                    </span>
                  </div>
                  <div className="w-full h-2 md:h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner p-[2px]">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: hexColor
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Reason */}
          {student.StudentStatus?.reason && (
            <div className="bg-amber-50 rounded-[1.8rem] p-6 border border-amber-200">
              <p className="text-[14px] text-amber-600 font-extrabold  tracking-wider mb-1">Status Remark</p>
              <p className="text-normal font-semibold text-amber-800">{student.StudentStatus.reason}</p>
            </div>
          )}

          {/* Guardian Information */}
          {student.StudentGuardians && student.StudentGuardians.length > 0 && (
            <div className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-extrabold text-[#1e3a5f]  tracking-wider mb-4">Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[13px] text-slate-600 ">Full Name</p>
                  <p className="text-sm font-semibold text-slate-500">{student.StudentGuardians[0]?.fullName || '---'}</p>
                </div>
                <div>
                  <p className="text-[13px] text-slate-600 ">Email</p>
                  <p className="text-sm font-semibold text-slate-500">{student.StudentGuardians[0]?.email || '---'}</p>
                </div>
                <div>
                  <p className="text-[13px] text-slate-600 ">Contact Number</p>
                  <p className="text-sm font-semibold text-slate-500">{student.StudentGuardians[0]?.contactNumber || '---'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <RoadmapDetailView
        isOpen={showRoadmapModal}
        roadmap={student?.BatchModel?.RoadmapModel}
        onClose={() => setShowRoadmapModal(false)}
      />
    </div>
  );
};