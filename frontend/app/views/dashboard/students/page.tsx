/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  BookOpen, Map, Bell, GraduationCap, CheckCircle2, 
  Database, Timer, ScrollText, ClipboardList,
  Search, Clock, Calendar, MessageSquare, FileText, Menu, X, Loader2,
  Eye,
  Target
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components Imports
import { Sidebar } from "@/components/navbars/route";
import { NotificationPanel } from "../../../../components/Notifications/NotificationPanel";
import { StudentTranscript } from "../../../../components/StudentDetails/StudentTranscript";
import { StudentProfile } from "../../../../components/StudentDetails/StudentProfile";
import Guidelines from "../../../../components/Guidelines/Guidelines";
import SubmitRequest from "../../../../components/RequestFoam/SubmitRequest";
import { StudentChat } from "../../../../components/Chat/StudentChat"; 
import { AdvisorRemarks } from "../../../../components/StudentDetails/AdvisorRemarks";
import { Timetable } from "../../../../components/Timetable/Timetable";
import { ViewRecommedCourse } from "../../../../components/CourseRecommendation/ViewRecommedCourse";
import { RoadmapDetailView } from "../../../../components/Roadmap/RoadmapView";

// ===== IMPORT YOUR HOOKS =====
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<string>("Overview");
  const [navigationStack, setNavigationStack] = useState(["Overview"]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

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
    isLoading: transcriptLoading,
    fetchStudentTranscript,
  } = useTranscript();

useEffect(() => {
  setMounted(true);
  
  // Wait for students to be loaded
  if (!students || students.length === 0) {
    console.log("Waiting for students to load...");
    return;
  }
  
  const response = sessionManager.getCurrentUser<any>();
  console.log("Session response:", response);
  
  // Access the data property correctly
  const currentUser = response?.data;
  
  if (!currentUser) {
    console.warn("No current user found in session");
    return;
  }
  
  console.log("Looking for student with SAP ID:", currentUser.sapid);
  
  // Find student by SAP ID (most reliable method)
  const foundStudent = students.find((student: any) => {
    // Check by SAP ID from User or directly from student
    const studentSapId = student.User?.sapid || student.sapid;
    const sessionSapId = currentUser.sapid;
    
    console.log(`Comparing student SAP ID: ${studentSapId} with session SAP ID: ${sessionSapId}`);
    return studentSapId?.toString() === sessionSapId?.toString();
  });
  
  if (foundStudent) {
    console.log("Found matching student:", foundStudent.id, foundStudent.studentName);
    setCurrentStudentId(foundStudent.id);
    
    // Also fetch transcript for this student
    fetchStudentTranscript(foundStudent.id);
  } else {
    console.error("No student found with SAP ID:", currentUser.sapid);
    console.log("Available students SAP IDs:", students.map((s: any) => ({
      id: s.id,
      name: s.studentName,
      sapId: s.User?.sapid || s.sapid
    })));
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
      studentName: student.studentName  || 'Student',
      email: student.email ,
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
      //profile: student.profile
    };
  }, [currentStudent, getCGPA, getTotalEarnedCredits]);

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
    } else if (target === "remarks" || target === "advisor remarks" || target === "advisorremarks") {
      normalizedView = "Remarks";
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
    } else if (target === "requests" || target === "submit request") {
      normalizedView = "RequestsFoam";
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

  // Loading State
  if (!mounted || studentsLoading || (currentStudentId && !studentData && !studentsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  

  if (studentsError || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md">
          <p className="text-red-600 font-bold mb-2">Error loading profile</p>
          <p className="text-red-500 text-sm">{studentsError || "Student not found"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
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

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <button 
            title="btn"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="relative max-w-md w-full group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search roadmap, courses or forms..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-4">
            <button 
            title="btn"
              onClick={() => setShowNotifications(true)}
              className="h-10 w-10 md:h-11 md:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-amber-400 relative transition-all shadow-sm outline-none"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth outline-none">
          <div className="max-w-6xl mx-auto p-5 md:p-10 w-full">
            
            {/* OVERVIEW VIEW */}
            {view === "Overview" && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 
                 <StatCard 
                    label="Batch #" 
                    value={`${studentData.batch} - ${studentData.batchYear}`}
                    icon={<GraduationCap size={22}/>} 
                        />

                 <StatCard 
                    label="Status" 
                    value={`${studentData.status}`} 
                    icon={<CheckCircle2 size={22}/>} 
                  />
                   <StatCard 
                    label="Current CGPA" 
                    value={studentData.cgpa || "0.00"} 
                    icon={<Target size={22}/>} 
                  />
                  
                  
                  <StatCard 
                    label="Upcoming Meeting" 
                    value={(
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-amber-500 shrink-0" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0em]">To be scheduled</span>
                        </div>
                      </div>
                    )}
                    icon={<Clock size={22}/>} 
                    color="text-orange-500"
                  />
                </div>

                {/* DEGREE COMPLETION */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">
                    Degree Completion - {studentData.department}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
                        {studentData.completedCredits} of {studentData.totalCredits} Credits Completed
                      </span>
                      <span className="text-2xl md:text-3xl font-black text-[#1e3a5f] tracking-tighter">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ActionCard icon={<BookOpen size={24}/>} label="Recommendations" onClick={() => navigateTo("Recommendations")} />
                  <ActionCard icon={<Map size={24}/>} label="Roadmap" onClick={() => navigateTo("Roadmap")} />
                  <ActionCard icon={<FileText size={24}/>} label="My Transcript" onClick={() => navigateTo("Transcript")} />
                  <ActionCard icon={<Calendar size={24}/>} label="Timetable" onClick={() => navigateTo("Timetable")} />
                </div>
              </div>
            )}

            {/* DYNAMIC MODULE VIEWS */}
            <div className="w-full outline-none">
              
              {/* Student Profile View */}
              {view === "Studentprofile" && studentData && (
                <StudentProfile 
                  student={studentData} 
                  selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
                  onBack={goBack} 
                  onViewTranscript={() => navigateTo("Transcript")} 
                />
              )}
              
              {/* Transcript View */}
              {view === "Transcript" && studentData && (
                <StudentTranscript 
                  student={studentData} 
                  onBack={goBack} 
                />
              )}
              
              {/* Course Recommendations View */}
              {view === "CourseRecommendation" && (
                <ViewRecommedCourse 
                  onBack={goBack} 
                />
              )}
              
              {/* Student Chat View */}
              {view === "StudentChat" && (
                <StudentChat onBack={goBack} />
              )}
              
              {/* Advisor Remarks View */}
              {view === "Remarks" && (
                <AdvisorRemarks onBack={goBack} />
              )}
              
              {/* Timetable View */}
              {view === "Timetable" && (
                <Timetable onBack={goBack} />
              )}
              
              {/* Submit Request View */}
              {view === "RequestsFoam" && (
                <SubmitRequest onBack={goBack} />
              )}
              
              {/* Guidelines View */}
              {view === "Guidelines" && (
                <Guidelines onBack={goBack} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Roadmap Modal */}
      <RoadmapDetailView
        isOpen={showRoadmapModal}
        roadmap={studentData?.BatchModel?.RoadmapModel}
        onClose={() => setShowRoadmapModal(false)}
      />

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-4 md:mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
      <div className="flex justify-between items-end">
        <div className={`text-lg md:text-2xl font-black tracking-tighter ${color}`}>{value}</div>
        <div className="mb-1">
          {trend && (
            <span className="text-[8px] font-bold text-slate-400 uppercase">{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, label, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none"
    >
      <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
        {icon}
      </div>
      <p className="text-[8px] md:text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest">
        {label}
      </p>
    </div>
  );
}