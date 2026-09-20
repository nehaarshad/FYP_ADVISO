
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { 
//   BookOpen, Map, GraduationCap, CheckCircle2, 
//   Clock, Calendar, FileText, Menu, Loader2,
//   Target
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// // Components Imports
// import { Sidebar } from "@/components/navbars/route";
// import { StudentTranscript } from "../../../../components/StudentDetails/StudentTranscript";
// import { StudentProfile } from "../../../../components/StudentDetails/StudentProfile";
// import StudentChat from "../../../../components/Chat/StudentChat"; 
// import { AdvisorRemarks } from "../../../../components/StudentDetails/AdvisorRemarks";
// import { BatchTimetablePage } from "../../../../components/Timetable/Timetable";
// import { RoadmapDetailView } from "../../../../components/Roadmap/RoadmapView";
// import { CompleteCourseDashboard } from "../../../../components/CourseRecommendation/CompleteCourseDashboard";
// // ===== IMPORT YOUR HOOKS =====
// import { useStudents } from '@/src/hooks/studentsHook/useStudents';
// import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
// import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; 
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import Guidelines from "@/components/Guidelines/Guidelines";

// // Helper function to format 24h time ("11:00:00") to 12h AM/PM format ("11:00 AM")
// const formatTimeTo12Hour = (timeStr: string) => {
//   if (!timeStr) return '';
//   const parts = timeStr.split(':');
//   const hours = parts[0];
//   const minutes = parts[1];
//   if (!hours || !minutes) return timeStr;
  
//   const h = parseInt(hours, 10);
//   const period = h >= 12 ? 'PM' : 'AM';
//   const formattedHours = h % 12 || 12;
  
//   return `${formattedHours}:${minutes} ${period}`;
// };

// export default function StudentDashboard() {
//   const [mounted, setMounted] = useState(false);
//   const [view, setView] = useState<string>("Overview");
//   const [navigationStack, setNavigationStack] = useState(["Overview"]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showRoadmapModal, setShowRoadmapModal] = useState(false);
//   const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

//   const { 
//     students,
//     getStudentById,
//     getStudentBySapId,
//     isLoading: studentsLoading,
//     error: studentsError
//   } = useStudents();

//   const { 
//     getCGPA,
//     getTotalEarnedCredits,
//     fetchStudentTranscript,
//   } = useTranscript();

//   // Fetch batch meetings using current student ID
//   const { meetings } = useBatchMeetings(currentStudentId);

//   useEffect(() => {
//     setMounted(true);
    
//     if (!students || students.length === 0) {
//       return;
//     }
    
//     const response = sessionManager.getCurrentUser<any>();
//     const currentUser = response?.data;
    
//     if (!currentUser) {
//       return;
//     }
    
//     const foundStudent = students.find((student: any) => {
//       const studentSapId = student.User?.sapid || student.sapid;
//       const sessionSapId = currentUser.sapid;
//       return studentSapId?.toString() === sessionSapId?.toString();
//     });
    
//     if (foundStudent) {
//       setCurrentStudentId(foundStudent.id);
//       fetchStudentTranscript(foundStudent.id);
//     }
//   }, [students, getStudentBySapId, getStudentById, fetchStudentTranscript]);

//   useEffect(() => {
//     if (currentStudentId) {
//       fetchStudentTranscript(currentStudentId);
//     }
//   }, [currentStudentId, fetchStudentTranscript]);

//   const currentStudent = useMemo(() => {
//     if (!currentStudentId) return null;
//     return getStudentById(currentStudentId);
//   }, [currentStudentId, getStudentById]);

//   const studentData = useMemo(() => {
//     if (!currentStudent) return null;

//     const student = currentStudent;
//     const completedCredits = getTotalEarnedCredits();
//     const totalCredits = student.BatchModel?.RoadmapModel?.totalCreditHours || 136;
    
//     return {
//       id: student.id,
//       studentName: student.studentName  || 'Student',
//       email: student.email ,
//       sapid: student.User?.sapid,
//       batch: student.BatchModel?.batchName || 'N/A',
//       batchYear: student.BatchModel?.batchYear || 'N/A',
//       department: student.BatchModel?.ProgramModel?.programName || 'N/A',
//       semester: student.currentSemester || '1st',
//       cgpa: getCGPA(),
//       status: student.StudentStatus?.currentStatus || 'Active',
//       completedCredits: completedCredits,
//       totalCredits: totalCredits,
//       contactNumber: student.contactNumber,
//       registrationNumber: student.registrationNumber,
//       StudentStatus: student.StudentStatus,
//       BatchModel: student.BatchModel,
//       StudentGuardians: student.StudentGuardians,
//       User: student.User,
//     };
//   }, [currentStudent, getCGPA, getTotalEarnedCredits]);

//   // Robust Meeting Filter Logic
//   const upcomingMeeting = useMemo(() => {
//     if (!meetings || !Array.isArray(meetings) || meetings.length === 0) return null;
    
//     const scheduledMeetings = meetings.filter(
//       (m: any) => {
//         const s = m.status?.toLowerCase()?.trim();
//         return s === 'scheduled' || s === 'pending' || !s;
//       }
//     );

//     const targetList = scheduledMeetings.length > 0 ? scheduledMeetings : meetings;

//     const sortedMeetings = [...targetList].sort((a: any, b: any) => {
//       const dateA = a.date ? new Date(a.date).getTime() : 0;
//       const dateB = b.date ? new Date(b.date).getTime() : 0;
//       return dateA - dateB;
//     });

//     return sortedMeetings[0] || null;
//   }, [meetings]);

//   const completionPercentage = useMemo(() => {
//     if (!studentData || studentData.totalCredits === 0) return 0;
//     return (studentData.completedCredits / studentData.totalCredits) * 100;
//   }, [studentData]);

//   const navigateTo = (tab: string) => {
//     const target = tab.toLowerCase();
//     let normalizedView = "";

//     if (target === "profile" || target === "my profile") {
//       normalizedView = "Studentprofile";
//     } else if (target === "chat" || target === "advisorchat" || target === "advisor chat") {
//       normalizedView = "StudentChat";
//     } else if (target === "advRec" ) {
//       normalizedView = "advRec";
//     } else if (target === "sysRec" ) {
//       normalizedView = "sysRec";
//     } else if (target === "transcript" || target === "my transcript") {
//       normalizedView = "Transcript";
//     } else if (target === "recommendations" || target === "courses") {
//       normalizedView = "CourseRecommendation";
//     } else if (target === "timetable") {
//       normalizedView = "Timetable";
//     } else if (target === "roadmap") {
//       setShowRoadmapModal(true);
//       return;
//     } else if (target === "guidelines") {
//       normalizedView = "Guidelines";
//     } else if (target === "requests" || target === "submit request") {
//       normalizedView = "RequestsFoam";
//     } else {
//       normalizedView = tab.charAt(0).toUpperCase() + tab.slice(1);
//     }
    
//     setView(normalizedView);
//     setNavigationStack(prev => [...prev, normalizedView]);
//     setIsSidebarOpen(false);
//   };

//   const goBack = () => {
//     if (navigationStack.length > 1) {
//       const newStack = [...navigationStack];
//       newStack.pop();
//       const prevView = newStack[newStack.length - 1];
//       setView(prevView);
//       setNavigationStack(newStack);
//     }
//   };

//   if (!mounted || studentsLoading || (currentStudentId && !studentData && !studentsLoading)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="text-center">
//           <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" />
//           <p className="text-gray-600 font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (studentsError || !studentData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md">
//           <p className="text-red-600 font-bold mb-2">Error loading profile</p>
//           <p className="text-red-500 text-sm">{studentsError || "Student not found"}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 outline-none relative">
      
//       {/* Overlay for mobile */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsSidebarOpen(false)}
//             className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
//           />
//         )}
//       </AnimatePresence>

//       <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0`}>
//         <Sidebar 
//           userRole="student" 
//           activeTab={view} 
//           setActiveTab={navigateTo} 
//         />
//       </div>

//       <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
//         {/* HEADER */}
//         <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
//           <div className="flex items-center gap-4 flex-1">
//             <button 
//               title="btn"
//               onClick={() => setIsSidebarOpen(true)}
//               className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
//             >
//               <Menu size={24} />
//             </button>
//           </div>
//         </header>

//         {/* CONTENT AREA */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth outline-none">
//           <div className="max-w-6xl mx-auto p-5 md:p-10 w-full">
            
//             {/* OVERVIEW VIEW */}
//             {view === "Overview" && (
//               <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                
//                 {/* STAT CARDS */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//                   <StatCard 
//                     label="Batch #" 
//                     value={`${studentData.batch} - ${studentData.batchYear}`}
//                     icon={<GraduationCap size={22}/>} 
//                   />

//                   <StatCard 
//                     label="Status" 
//                     value={`${studentData.status}`} 
//                     icon={<CheckCircle2 size={22}/>} 
//                   />
                  
//                   <StatCard 
//                     label="Current CGPA" 
//                     value={studentData.cgpa || "0.00"} 
//                     icon={<Target size={22}/>} 
//                   />
                  
//                   <StatCard 
//                     label="Upcoming Meeting" 
//                     value={(
//                       <div className="flex flex-col gap-1 w-full overflow-hidden">
//                         {upcomingMeeting ? (
//                           <>
//                             <div className="flex items-center justify-between gap-1">
//                               <div className="flex items-center gap-1.5 text-xs font text-[#1e3a5f] truncate">
//                                 <Calendar size={13} className="text-amber-500 shrink-0" />
//                                 <span className="truncate">{upcomingMeeting.date || 'Date TBD'}</span>
//                               </div>
//                               <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
//                                 upcomingMeeting.status?.toLowerCase() === 'scheduled' ? 'bg-blue-50 text-blue-600' :
//                                 upcomingMeeting.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
//                                 upcomingMeeting.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-600' :
//                                 'bg-amber-50 text-amber-600'
//                               }`}>
//                                 {upcomingMeeting.status || 'Scheduled'}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
//                               <Clock size={12} className="text-amber-500 shrink-0" />
//                               <span className="truncate">
//                                 {upcomingMeeting.day ? `${upcomingMeeting.day} ` : ''} 
//                                 {upcomingMeeting.startTime ? `(${formatTimeTo12Hour(upcomingMeeting.startTime)} - ${formatTimeTo12Hour(upcomingMeeting.endTime)})` : ''}
//                               </span>
//                             </div>
//                           </>
//                         ) : (
//                           <div className="flex items-center gap-1.5 py-1">
//                             <Clock size={12} className="text-amber-500 shrink-0" />
//                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">To be scheduled</span>
//                           </div>
//                         )}
//                       </div>
//                     )} 
//                     icon={<Clock size={22}/>} 
//                     color="text-orange-500"
//                   />
//                 </div>

//                 {/* DEGREE COMPLETION */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                   <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">
//                     Degree Completion - {studentData.department}
//                   </h3>
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-end">
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
//                         {studentData.completedCredits} of {studentData.totalCredits} Credits Completed
//                       </span>
//                       <span className="text-2xl md:text-3xl font-bold text-[#1e3a5f] tracking-tighter">
//                         {Math.round(completionPercentage)}%
//                       </span>
//                     </div>
//                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
//                       <motion.div 
//                         initial={{ width: 0 }} 
//                         animate={{ width: `${completionPercentage}%` }} 
//                         transition={{ duration: 1.2 }}
//                         className="h-full bg-[#1e3a5f] rounded-full" 
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACTION CARDS */}
//                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <ActionCard icon={<BookOpen size={24}/>} label="Recommendations" onClick={() => navigateTo("Recommendations")} />
//                   <ActionCard icon={<Map size={24}/>} label="Roadmap" onClick={() => navigateTo("Roadmap")} />
//                   <ActionCard icon={<FileText size={24}/>} label="My Transcript" onClick={() => navigateTo("Transcript")} />
//                   <ActionCard icon={<Calendar size={24}/>} label="Timetable" onClick={() => navigateTo("Timetable")} />
//                 </div>
//               </div>
//             )}

//             {/* DYNAMIC MODULE VIEWS */}
//             <div className="w-full outline-none">
//               {view === "Studentprofile" && studentData && (
//                 <StudentProfile 
//                   student={studentData} 
//                   selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
//                   onBack={goBack} 
//                   onViewTranscript={() => navigateTo("Transcript")} 
//                 />
//               )}
              
//               {view === "Transcript" && studentData && (
//                 <StudentTranscript 
//                   student={studentData} 
//                   onBack={goBack} 
//                 />
//               )}
              
//               {view === "CourseRecommendation" && studentData && (
//                 <CompleteCourseDashboard
//                   onBack={goBack}
//                   studentId={studentData.id}
//                   studentName={studentData.studentName}
//                   selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
//                   sessionType="Regular"
//                   sessionYear={Number(studentData.batchYear)}
//                 />
//               )}
              
//               {view === "StudentChat" && (
//                 <StudentChat onBack={goBack} />
//               )}
              
//               {view === "advRec" && (
//                 <AdvisorRemarks onBack={goBack} />
//               )}
              
//               {view === "Timetable" && (
//                 <BatchTimetablePage onBack={goBack} />
//               )}

//               {view === "Guidelines" && (
//                 <Guidelines onBack={goBack} />
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Roadmap Modal */}
//       <RoadmapDetailView
//         isOpen={showRoadmapModal}
//         roadmap={studentData?.BatchModel?.RoadmapModel}
//         onClose={() => setShowRoadmapModal(false)}
//       />
//     </div>
//   );
// }

// function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
//   return (
//     <div className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none flex flex-col justify-between min-h-[135px]">
//       <div className="flex items-center justify-between w-full">
//         <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner shrink-0">
//           {icon}
//         </div>
//         {trend && (
//           <span className="text-[9px] font-bold text-slate-400 uppercase">{trend}</span>
//         )}
//       </div>
      
//       <div className="mt-3">
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
//         <div className={`text-base md:text-xl font-bold tracking-tight ${color}`}>
//           {value}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionCard({ icon, label, onClick }: any) {
//   return (
//     <div 
//       onClick={onClick} 
//       className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none min-h-[120px]"
//     >
//       <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner shrink-0">
//         {icon}
//       </div>
//       <p className="text-[10px] md:text-xs font-bold uppercase text-[#1e3a5f] text-center tracking-wider truncate w-full">
//         {label}
//       </p>
//     </div>
//   );
// }












/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { AdvisorRemarks } from "../../../../components/StudentDetails/AdvisorRemarks";
import { BatchTimetablePage } from "../../../../components/Timetable/Timetable";
import { RoadmapDetailView } from "../../../../components/Roadmap/RoadmapView";
import { CompleteCourseDashboard } from "../../../../components/CourseRecommendation/CompleteCourseDashboard";
// ===== IMPORT YOUR HOOKS =====
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { useTranscript } from '@/src/hooks/transcriptHook/transcriptHokk';
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; 
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import Guidelines from "@/components/Guidelines/Guidelines";

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
    
    if (!currentUser) {
      return;
    }
    
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
    };
  }, [currentStudent, getCGPA, getTotalEarnedCredits]);

  // Updated Meeting Logic: Jab tak meeting explicitly 'completed' ya 'cancelled' na ho, refresh par bhi gayab nahi hogi
  const upcomingMeeting = useMemo(() => {
    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) return null;
    
    // Sirf un meetings ko filter karein jo completed ya cancelled nahi hain
    const activeMeetings = meetings.filter(
      (m:any) => {
        const s = m.status?.toLowerCase()?.trim();
        return s !== 'completed' && s !== 'cancelled';
      }
    );

    const targetList = activeMeetings.length > 0 ? activeMeetings : meetings;

    const sortedMeetings = [...targetList].sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
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
    } else if (target === "advRec" ) {
      normalizedView = "advRec";
    } else if (target === "sysRec" ) {
      normalizedView = "sysRec";
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
          <div className="flex items-center gap-4 flex-1">
            <button 
              title="btn"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
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
                      <div className="flex flex-col gap-1 w-full overflow-hidden">
                        {upcomingMeeting ? (
                          <>
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] truncate">
                                <Calendar size={13} className="text-amber-500 shrink-0" />
                                <span className="truncate">{upcomingMeeting.date || 'Date TBD'}</span>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                                upcomingMeeting.status?.toLowerCase() === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                                upcomingMeeting.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                upcomingMeeting.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-amber-50 text-amber-600'
                              }`}>
                                {upcomingMeeting.status || 'Scheduled'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span className="truncate">
                                {upcomingMeeting.day ? `${upcomingMeeting.day} ` : ''} 
                                {upcomingMeeting.startTime ? `(${formatTimeTo12Hour(upcomingMeeting.startTime)} - ${formatTimeTo12Hour(upcomingMeeting.endTime)})` : ''}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 py-1">
                            <Clock size={12} className="text-amber-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">To be scheduled</span>
                          </div>
                        )}
                      </div>
                    )} 
                    icon={<Clock size={22}/>} 
                    color="text-orange-500"
                  />
                </div>

                {/* DEGREE COMPLETION */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">
                    Degree Completion - {studentData.department}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
                        {studentData.completedCredits} of {studentData.totalCredits} Credits Completed
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-[#1e3a5f] tracking-tighter">
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
              
              {view === "CourseRecommendation" && studentData && (
                <CompleteCourseDashboard
                  onBack={goBack}
                  studentId={studentData.id}
                  studentName={studentData.studentName}
                  selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
                  sessionType="Regular"
                  sessionYear={Number(studentData.batchYear)}
                />
              )}
              
              {view === "StudentChat" && (
                <StudentChat onBack={goBack} />
              )}
              
              {view === "advRec" && (
                <AdvisorRemarks onBack={goBack} />
              )}
              
              {view === "Timetable" && (
                <BatchTimetablePage onBack={goBack} />
              )}

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
    </div>
  );
}

function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none flex flex-col justify-between min-h-[135px]">
      <div className="flex items-center justify-between w-full">
        <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner shrink-0">
          {icon}
        </div>
        {trend && (
          <span className="text-[9px] font-bold text-slate-400 uppercase">{trend}</span>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
        <div className={`text-base md:text-xl font-bold tracking-tight ${color}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, label, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none min-h-[120px]"
    >
      <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner shrink-0">
        {icon}
      </div>
      <p className="text-[10px] md:text-xs font-bold uppercase text-[#1e3a5f] text-center tracking-wider truncate w-full">
        {label}
      </p>
    </div>
  );
}