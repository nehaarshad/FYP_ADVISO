

// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { 
//   BookOpen, Map, GraduationCap, CheckCircle2, 
//   Database, Timer, ScrollText, ClipboardList,
//   Clock, Calendar, MessageSquare, FileText, Menu, X, Loader2,
//   Eye,
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
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import Guidelines from "@/components/Guidelines/Guidelines";

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
//     isLoading: transcriptLoading,
//     fetchStudentTranscript,
//   } = useTranscript();

//   useEffect(() => {
//     setMounted(true);
    
//     if (!students || students.length === 0) {
//       console.log("Waiting for students to load...");
//       return;
//     }
    
//     const response = sessionManager.getCurrentUser<any>();
//     console.log("Session response:", response);
    
//     const currentUser = response?.data;
    
//     if (!currentUser) {
//       console.warn("No current user found in session");
//       return;
//     }
    
//     console.log("Looking for student with SAP ID:", currentUser.sapid);
    
//     const foundStudent = students.find((student: any) => {
//       const studentSapId = student.User?.sapid || student.sapid;
//       const sessionSapId = currentUser.sapid;
      
//       console.log(`Comparing student SAP ID: ${studentSapId} with session SAP ID: ${sessionSapId}`);
//       return studentSapId?.toString() === sessionSapId?.toString();
//     });
    
//     if (foundStudent) {
//       console.log("Found matching student:", foundStudent.id, foundStudent.studentName);
//       setCurrentStudentId(foundStudent.id);
//       fetchStudentTranscript(foundStudent.id);
//     } else {
//       console.error("No student found with SAP ID:", currentUser.sapid);
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
//                  <StatCard 
//                     label="Batch #" 
//                     value={`${studentData.batch} - ${studentData.batchYear}`}
//                     icon={<GraduationCap size={22}/>} 
//                  />

//                  <StatCard 
//                     label="Status" 
//                     value={`${studentData.status}`} 
//                     icon={<CheckCircle2 size={22}/>} 
//                  />
//                  <StatCard 
//                     label="Current CGPA" 
//                     value={studentData.cgpa || "0.00"} 
//                     icon={<Target size={22}/>} 
//                  />
                 
//                  <StatCard 
//                     label="Upcoming Meeting" 
//                     value={(
//                       <div className="flex flex-col gap-1.5 mt-1">
//                         <div className="flex items-center gap-2">
//                           <Clock size={10} className="text-amber-500 shrink-0" />
//                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0em]">To be scheduled</span>
//                         </div>
//                       </div>
//                     )}
//                     icon={<Clock size={22}/>} 
//                     color="text-orange-500"
//                  />
//                 </div>

//                 {/* DEGREE COMPLETION */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                   <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">
//                     Degree Completion - {studentData.department}
//                   </h3>
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-end">
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
//                         {studentData.completedCredits} of {studentData.totalCredits} Credits Completed
//                       </span>
//                       <span className="text-2xl md:text-3xl font-black text-[#1e3a5f] tracking-tighter">
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
              
//              {view === "CourseRecommendation" && studentData && (
//               <CompleteCourseDashboard
//                 onBack={goBack}
//                 studentId={studentData.id}
//                 studentName={studentData.studentName}
//                 selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
//                 sessionType="Regular"
//                 sessionYear={Number(studentData.batchYear)}
//               />
//             )}
              
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
//     <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none">
//       <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-4 md:mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
//         {icon}
//       </div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
//       <div className="flex justify-between items-end">
//         <div className={`text-lg md:text-2xl font-black tracking-tighter ${color}`}>{value}</div>
//         <div className="mb-1">
//           {trend && (
//             <span className="text-[8px] font-bold text-slate-400 uppercase">{trend}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionCard({ icon, label, onClick }: any) {
//   return (
//     <div 
//       onClick={onClick} 
//       className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none"
//     >
//       <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
//         {icon}
//       </div>
//       <p className="text-[8px] md:text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest">
//         {label}
//       </p>
//     </div>
//   );
// }



// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { 
//   BookOpen, Map, GraduationCap, CheckCircle2, 
//   Database, Timer, ScrollText, ClipboardList,
//   Clock, Calendar, MessageSquare, FileText, Menu, X, Loader2,
//   Eye,
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
// import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; // <-- Import Batch Meetings Hook
// import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
// import Guidelines from "@/components/Guidelines/Guidelines";

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
//     isLoading: transcriptLoading,
//     fetchStudentTranscript,
//   } = useTranscript();

//   // Fetch batch meetings using current student ID
//   const { meetings } = useBatchMeetings(currentStudentId);

//   useEffect(() => {
//     setMounted(true);
    
//     if (!students || students.length === 0) {
//       console.log("Waiting for students to load...");
//       return;
//     }
    
//     const response = sessionManager.getCurrentUser<any>();
//     console.log("Session response:", response);
    
//     const currentUser = response?.data;
    
//     if (!currentUser) {
//       console.warn("No current user found in session");
//       return;
//     }
    
//     console.log("Looking for student with SAP ID:", currentUser.sapid);
    
//     const foundStudent = students.find((student: any) => {
//       const studentSapId = student.User?.sapid || student.sapid;
//       const sessionSapId = currentUser.sapid;
      
//       console.log(`Comparing student SAP ID: ${studentSapId} with session SAP ID: ${sessionSapId}`);
//       return studentSapId?.toString() === sessionSapId?.toString();
//     });
    
//     if (foundStudent) {
//       console.log("Found matching student:", foundStudent.id, foundStudent.studentName);
//       setCurrentStudentId(foundStudent.id);
//       fetchStudentTranscript(foundStudent.id);
//     } else {
//       console.error("No student found with SAP ID:", currentUser.sapid);
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

//   // Filter meetings where status is 'scheduled' and get the earliest/first one
//   const upcomingMeeting = useMemo(() => {
//     if (!meetings || !Array.isArray(meetings)) return null;
    
//     const scheduledMeetings = meetings.filter(
//       (m: any) => m.status?.toLowerCase() === 'scheduled'
//     );

//     if (scheduledMeetings.length === 0) return null;

//     // Sort by date/time if available to get the nearest upcoming one
//     scheduledMeetings.sort((a: any, b: any) => {
//       const dateA = a.date ? new Date(a.date).getTime() : 0;
//       const dateB = b.date ? new Date(b.date).getTime() : 0;
//       return dateA - dateB;
//     });

//     return scheduledMeetings[0];
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
//                  <StatCard 
//                     label="Batch #" 
//                     value={`${studentData.batch} - ${studentData.batchYear}`}
//                     icon={<GraduationCap size={22}/>} 
//                  />

//                  <StatCard 
//                     label="Status" 
//                     value={`${studentData.status}`} 
//                     icon={<CheckCircle2 size={22}/>} 
//                  />
//                  <StatCard 
//                     label="Current CGPA" 
//                     value={studentData.cgpa || "0.00"} 
//                     icon={<Target size={22}/>} 
//                  />
                 
//                  <StatCard 
//                     label="Upcoming Meeting" 
//                     value={
//                       upcomingMeeting ? (
//                         <div className="flex flex-col gap-1 mt-1">
//                           <div className="flex items-center gap-1.5">
//                             <span className="text-xs font-bold text-slate-700">
//                               {upcomingMeeting.date ? new Date(upcomingMeeting.date).toLocaleDateString() : upcomingMeeting.day}
//                             </span>
//                           </div>
//                           <span className="text-[10px] font-medium text-slate-500">
//                             {upcomingMeeting.startTime} - {upcomingMeeting.endTime} ({upcomingMeeting.day})
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex flex-col gap-1.5 mt-1">
//                           <div className="flex items-center gap-2">
//                             <Clock size={10} className="text-amber-500 shrink-0" />
//                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0em]">To be scheduled</span>
//                           </div>
//                         </div>
//                       )
//                     }
//                     icon={<Clock size={22}/>} 
//                     color="text-orange-500"
//                  />
//                 </div>

//                 {/* DEGREE COMPLETION */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                   <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">
//                     Degree Completion - {studentData.department}
//                   </h3>
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-end">
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
//                         {studentData.completedCredits} of {studentData.totalCredits} Credits Completed
//                       </span>
//                       <span className="text-2xl md:text-3xl font-black text-[#1e3a5f] tracking-tighter">
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
              
//              {view === "CourseRecommendation" && studentData && (
//               <CompleteCourseDashboard
//                 onBack={goBack}
//                 studentId={studentData.id}
//                 studentName={studentData.studentName}
//                 selectedBatch={`${studentData.batch} ${studentData.batchYear}`}
//                 sessionType="Regular"
//                 sessionYear={Number(studentData.batchYear)}
//               />
//             )}
              
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
//     <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none">
//       <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-4 md:mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
//         {icon}
//       </div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
//       <div className="flex justify-between items-end">
//         <div className={`text-lg md:text-2xl font-black tracking-tighter ${color}`}>{value}</div>
//         <div className="mb-1">
//           {trend && (
//             <span className="text-[8px] font-bold text-slate-400 uppercase">{trend}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionCard({ icon, label, onClick }: any) {
//   return (
//     <div 
//       onClick={onClick} 
//       className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none"
//     >
//       <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
//         {icon}
//       </div>
//       <p className="text-[8px] md:text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest">
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
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; // <-- Import Batch Meetings Hook
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import Guidelines from "@/components/Guidelines/Guidelines";

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

  useEffect(() => {
    setMounted(true);
    
    if (!students || students.length === 0) {
      console.log("Waiting for students to load...");
      return;
    }
    
    const response = sessionManager.getCurrentUser<any>();
    console.log("Session response:", response);
    
    const currentUser = response?.data;
    
    if (!currentUser) {
      console.warn("No current user found in session");
      return;
    }
    
    console.log("Looking for student with SAP ID:", currentUser.sapid);
    
    const foundStudent = students.find((student: any) => {
      const studentSapId = student.User?.sapid || student.sapid;
      const sessionSapId = currentUser.sapid;
      
      console.log(`Comparing student SAP ID: ${studentSapId} with session SAP ID: ${sessionSapId}`);
      return studentSapId?.toString() === sessionSapId?.toString();
    });
    
    if (foundStudent) {
      console.log("Found matching student:", foundStudent.id, foundStudent.studentName);
      setCurrentStudentId(foundStudent.id);
      fetchStudentTranscript(foundStudent.id);
    } else {
      console.error("No student found with SAP ID:", currentUser.sapid);
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

  // Get batch ID from student data to fetch batch-level meetings correctly
  const batchId = studentData?.BatchModel?.id;
  const { meetings } = useBatchMeetings(batchId);

  // Filter meetings where status is 'scheduled' and get the earliest/first one
  const upcomingMeeting = useMemo(() => {
    console.log("Batch ID passed to meetings hook:", batchId);
    console.log("Raw meetings response:", meetings);

    let meetingsList: any[] = [];
    if (Array.isArray(meetings)) {
      meetingsList = meetings;
    } else if (meetings && typeof meetings === 'object') {
      meetingsList = (meetings as any).data || (meetings as any).meetings || (meetings as any).batchMeetings || [];
    }

    if (!Array.isArray(meetingsList) || meetingsList.length === 0) return null;
    
    const scheduledMeetings = meetingsList.filter(
      (m: any) => m?.status?.toLowerCase() === 'scheduled'
    );

    console.log("Filtered Scheduled Meetings:", scheduledMeetings);

    if (scheduledMeetings.length === 0) return null;

    // Sort by date/time to get the nearest upcoming one
    scheduledMeetings.sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return scheduledMeetings[0];
  }, [meetings, batchId]);

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
                    value={
                      upcomingMeeting ? (
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-700">
                              {upcomingMeeting.date ? new Date(upcomingMeeting.date).toLocaleDateString() : upcomingMeeting.day}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-500">
                            {upcomingMeeting.startTime} - {upcomingMeeting.endTime} ({upcomingMeeting.day})
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 mt-1">
                          <div className="flex items-center gap-2">
                            <Clock size={10} className="text-amber-500 shrink-0" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0em]">To be scheduled</span>
                          </div>
                        </div>
                      )
                    }
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