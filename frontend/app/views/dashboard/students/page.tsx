
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, Map, GraduationCap, CheckCircle2, 
  Clock, Calendar, FileText, Menu, Loader2,
  Target
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components Imports
import { Sidebar } from "@/components/navbars/route";
import { StudentTranscript } from "../../../../components/StudentDetails/StudentTranscript";
import { StudentProfile } from "../../../../components/StudentDetails/StudentProfile";
import StudentChat from "../../../../components/Chat/StudentChat"; 
import { BatchTimetablePage } from "../../../../components/Timetable/Timetable";
import { RoadmapDetailView } from "../../../../components/Roadmap/RoadmapView";

// ===== IMPORT YOUR HOOKS =====
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; 
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import Guidelines from "@/components/Guidelines/Guidelines";
import { AdvisoryLogs } from "@/components/AdvisorView/AdvisoryLogs";
import StudentRecommendationView from "@/components/CourseRecommendation/systemRecommendationView";
import { useAuthGuard } from "@/src/hooks/authHook/useAuthGuard";

// Helper function to format 24h time ("11:00:00") to 12h AM/PM format ("11:00 AM")
const formatTimeTo12Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const hours = parts[0];
  const minutes = parts[1];
  if (!hours || !minutes) return timeStr;
  
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  
  return `${formattedHours}:${minutes} ${period}`;
};

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<string>("Overview");
  const [navigationStack, setNavigationStack] = useState(["Overview"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

    useAuthGuard();
  const { 
    students,
    getStudentById,
    getStudentBySapId,
    isLoading: studentsLoading,
    error: studentsError
  } = useStudents();

  const { 
    getCGPA,
    getTotalEarnedCredits,
    fetchStudentTranscript,
  } = useTranscript();

  // Fetch batch meetings using current student ID
  const { meetings } = useBatchMeetings(currentStudentId);

  useEffect(() => {
    setMounted(true);
    
    if (!students || students.length === 0) {
      return;
    }
    
    const response = sessionManager.getCurrentUser<any>();
    const currentUser = response?.data;
 
    
    const foundStudent = students.find((student: any) => {
      const studentSapId = student.User?.sapid || student.sapid;
      const sessionSapId = currentUser.sapid;
      return studentSapId?.toString() === sessionSapId?.toString();
    });
    
    if (foundStudent) {
      setCurrentStudentId(foundStudent.id);
      fetchStudentTranscript(foundStudent.id);
    }
  }, [students, getStudentBySapId, getStudentById, fetchStudentTranscript]);

  useEffect(() => {
    if (currentStudentId) {
      fetchStudentTranscript(currentStudentId);
    }
  }, [currentStudentId, fetchStudentTranscript]);

  const currentStudent = useMemo(() => {
    if (!currentStudentId) return null;
    return getStudentById(currentStudentId);
  }, [currentStudentId, getStudentById]);

  const studentData = useMemo(() => {
    if (!currentStudent) return null;

    const student = currentStudent;
    const completedCredits = getTotalEarnedCredits();
    const totalCredits = student.BatchModel?.RoadmapModel?.totalCreditHours || 136;
    
    return {
      id: student.id,
      studentName: student.studentName || 'Student',
      email: student.email,
      sapid: student.User?.sapid,
      batch: student.BatchModel?.batchName || 'N/A',
      batchYear: student.BatchModel?.batchYear || 'N/A',
      department: student.BatchModel?.ProgramModel?.programName || 'N/A',
      semester: student.currentSemester || '1st',
      cgpa: getCGPA(),
      status: student.StudentStatus?.currentStatus || 'Active',
      completedCredits: completedCredits,
      totalCredits: totalCredits,
      contactNumber: student.contactNumber,
      registrationNumber: student.registrationNumber,
      StudentStatus: student.StudentStatus,
      BatchModel: student.BatchModel,
      StudentGuardians: student.StudentGuardians,
      User: student.User,
    };
  }, [currentStudent, getCGPA, getTotalEarnedCredits]);

  // Meeting Logic
  const upcomingMeeting = useMemo(() => {
    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) return null;
    
    const activeMeetings = meetings.filter(
      (m: any) => {
        const s = m.status?.toLowerCase()?.trim();
        return s !== 'completed' && s !== 'cancelled';
      }
    );

    const targetList = activeMeetings.length > 0 ? activeMeetings : meetings;

    const sortedMeetings = [...targetList].sort((a: any, b: any) => {
      const timeA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const timeB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });

    return sortedMeetings[0] || null;
  }, [meetings]);

  const completionPercentage = useMemo(() => {
    if (!studentData || studentData.totalCredits === 0) return 0;
    return (studentData.completedCredits / studentData.totalCredits) * 100;
  }, [studentData]);

  const navigateTo = (tab: string) => {
    const target = tab.toLowerCase();
    let normalizedView = "";

    if (target === "profile" || target === "my profile") {
      normalizedView = "Studentprofile";
    } else if (target === "chat" || target === "advisorchat" || target === "advisor chat") {
      normalizedView = "StudentChat";
    } else if (target === "transcript" || target === "my transcript") {
      normalizedView = "Transcript";
    } else if (target === "recommendations" || target === "courses") {
      normalizedView = "CourseRecommendation";
    } else if (target === "timetable") {
      normalizedView = "Timetable";
    } else if (target === "roadmap") {
      setShowRoadmapModal(true);
      return;
    } else if (target === "guidelines") {
      normalizedView = "Guidelines";
    } else if (target === "systemrec") {
      normalizedView = "systemRec";
    } else {
      normalizedView = tab.charAt(0).toUpperCase() + tab.slice(1);
    }
    
    setView(normalizedView);
    setNavigationStack(prev => [...prev, normalizedView]);
    setIsSidebarOpen(false);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      const prevView = newStack[newStack.length - 1];
      setView(prevView);
      setNavigationStack(newStack);
    }
  };

  if (!mounted || studentsLoading || (currentStudentId && !studentData && !studentsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" />
          <p className="text-slate-700 font-semibold text-base">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (studentsError || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md border border-red-200">
          <p className="text-red-700 font-bold text-base mb-2">Error loading profile</p>
          <p className="text-red-600 text-sm font-medium">{studentsError || "Student not found"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 outline-none relative">
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0`}>
        <Sidebar 
          userRole="student" 
          activeTab={view} 
          setActiveTab={navigateTo} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between flex-shrink-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              title="Open Menu"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1e3a5f] tracking-tight">
              Student Dashboard
            </h1>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth outline-none bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto p-6 md:p-10 w-full">
            
            {/* OVERVIEW VIEW */}
            {view === "Overview" && (
              <div className="space-y-7 md:space-y-9 animate-in fade-in duration-500">
                
                {/* 4 STATIC STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
                  <StatCard 
                    label="Batch" 
                    value={`${studentData.batch} ${studentData.batchYear}`}
                    icon={<GraduationCap size={25}/>} 
                  />

                  <StatCard 
                    label="Status" 
                    value={`${studentData.status}`} 
                    icon={<CheckCircle2 size={25}/>} 
                  />
                  
                  <StatCard 
                    label="Current CGPA" 
                    value={studentData.cgpa || "0.00"} 
                    icon={<Target size={25}/>} 
                  />
                  
                  <StatCard 
                    label="Upcoming Meeting" 
                    value={(
                      <div className="flex flex-col gap-1.5 w-full overflow-hidden">
                        {upcomingMeeting ? (
                          <>
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] truncate">
                                <Calendar size={14} className="text-amber-600 shrink-0" />
                                <span className="truncate">{upcomingMeeting.date || 'Date TBD'}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize shrink-0 ${
                                upcomingMeeting.status?.toLowerCase() === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                upcomingMeeting.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                upcomingMeeting.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-900'
                              }`}>
                                {upcomingMeeting.status || 'Scheduled'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 truncate">
                              <Clock size={13} className="text-amber-600 shrink-0" />
                              <span className="truncate">
                                {upcomingMeeting.day ? `${upcomingMeeting.day} ` : ''} 
                                {upcomingMeeting.startTime ? `(${formatTimeTo12Hour(upcomingMeeting.startTime)} - ${formatTimeTo12Hour(upcomingMeeting.endTime)})` : ''}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 py-1">
                            <Clock size={14} className="text-amber-600 shrink-0" />
                            <span className="text-xs font-semibold text-slate-500">To be scheduled</span>
                          </div>
                        )}
                      </div>
                    )} 
                    icon={<Clock size={25}/>} 
                    color="text-orange-600"
                  />
                </div>

                {/* DEGREE COMPLETION SECTION */}
                <div className="bg-white p-8 md:p-10 rounded-[2.2rem] border border-slate-200/80 shadow-xs">
                  <h3 className="text-sm md:text-base font-extrabold text-[#1e3a5f] mb-6 border-l-4 border-[#FDB813] pl-3">
                    Degree Completion - {studentData.department}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end gap-3 flex-wrap">
                      <span className="text-sm md:text-base font-semibold text-slate-700 truncate">
                        {studentData.completedCredits} of {studentData.totalCredits} credits completed
                      </span>
                      <span className="text-3xl md:text-4xl font-black text-[#1e3a5f] tracking-tight">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${completionPercentage}%` }} 
                        transition={{ duration: 1.2 }}
                        className="h-full bg-[#1e3a5f] rounded-full" 
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
                  <ActionCard icon={<BookOpen size={28}/>} label="Recommendations" onClick={() => navigateTo("Recommendations")} />
                  <ActionCard icon={<Map size={28}/>} label="Roadmap" onClick={() => navigateTo("Roadmap")} />
                  <ActionCard icon={<FileText size={28}/>} label="My Transcript" onClick={() => navigateTo("Transcript")} />
                  <ActionCard icon={<Calendar size={28}/>} label="Timetable" onClick={() => navigateTo("Timetable")} />
                </div>
              </div>
            )}

            {/* DYNAMIC MODULE VIEWS */}
            <div className="w-full outline-none">
              {view === "Studentprofile" && studentData && (
                <StudentProfile 
                  student={studentData} 
                  selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
                  onBack={goBack} 
                  onViewTranscript={() => navigateTo("Transcript")} 
                />
              )}
              
              {view === "Transcript" && studentData && (
                <StudentTranscript 
                  student={studentData} 
                  onBack={goBack} 
                />
              )}

              {view === "systemRec" && studentData && (
                <StudentRecommendationView 
                  onBack={goBack} 
                />
              )}
              
              {view === "CourseRecommendation" && studentData && (
                <AdvisoryLogs
                  onBack={goBack}
                  onOpenStudentRecommendations={() => navigateTo("systemRec")}
                />
              )}
              
              {view === "StudentChat" && (
                <StudentChat onBack={goBack} />
              )}
              
              {view === "Timetable" && (
                <BatchTimetablePage onBack={goBack} />
              )}

              {view === "Guidelines" && (
                <Guidelines onBack={goBack} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Roadmap Modal */}
      <RoadmapDetailView
        isOpen={showRoadmapModal}
        roadmap={studentData?.BatchModel?.RoadmapModel}
        onClose={() => setShowRoadmapModal(false)}
      />
    </div>
  );
}

// STATIC STAT CARD COMPONENT
function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[2.2rem] p-6 md:p-7 border border-slate-200/80 shadow-xs select-none flex flex-col justify-between min-h-[155px]">
      <div className="flex items-center justify-between w-full">
        <div className="w-12 h-12 bg-slate-100/80 rounded-2xl flex items-center justify-center text-[#1e3a5f] shrink-0">
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-semibold text-slate-500 capitalize">{trend}</span>
        )}
      </div>
      
      <div className="mt-3.5">
        <p className="text-xs font-semibold text-slate-500 mb-1.5 truncate capitalize">{label}</p>
        <div className={`text-base md:text-xl font-extrabold tracking-tight capitalize ${color}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

// ACTION CARD COMPONENT
function ActionCard({ icon, label, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className="bg-white p-6 md:p-8 rounded-[2.2rem] border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#1e3a5f] hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none min-h-[155px]"
    >
      <div className="h-13 w-13 md:h-14 md:w-14 bg-slate-100/80 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors duration-300 shrink-0">
        {icon}
      </div>
      <p className="text-xs md:text-sm font-bold text-[#1e3a5f] text-center tracking-wide truncate w-full">
        {label}
      </p>
    </div>
  );
}