 
// /* eslint-disable react-hooks/set-state-in-effect */ 
// /* eslint-disable @typescript-eslint/no-explicit-any */ 
// "use client"; 
// import React, { useState, useEffect } from "react"; 
// import {  
//   Users, UserMinus, Clock, Filter, ChevronDown, Menu, Loader2  
// } from "lucide-react"; 
// import { useAdvisorAssignedBatches } from '@/src/hooks/assignBatches/useAdvisorAssignedBatches'; 
// import { useStudents } from '@/src/hooks/studentsHook/useStudents'; 
// import { AdvisorStudentList } from "@/components/StudentDetails/advisorStudentList"; 
// import { StudentTranscript } from "@/components/StudentDetails/StudentTranscript"; 
// import { Sidebar } from "@/components/navbars/route"; 
// import { ProfileView } from "@/components/ProfileView/route"; 
// import { AdvisoryParentScreen } from '@/components/AdvisorView/advisoryNavPtterrn'; 
// import { AdvisorTimetablePage } from "@/components/Timetable/AdvisorTimetablePage";
// import { AdvisorMeetingsPage } from "@/components/Meetings/AdvisorMeetingsPage";

// // Local component fallbacks or direct imports
// import AdvisoryNotes from "../../../../components/AdvisorView/AdvisoryNotes"; 
// import AdvisorChat from "../../../../components/Chat/AdvisorChat"; 
// import { AdvisoryLogs } from '../../../../components/AdvisorView/AdvisoryLogs'; 
// import Guidelines from "../../../../components/Guidelines/Guidelines"; 
// import FacultyRecommendation from "../../../../components/FacultyRecommendation/FacultyRecommendation"; 
 
// export default function AdvisorDashboard() { 
//   const [view, setView] = useState<string>("overview"); 
//   const [selectedBatch, setSelectedBatch] = useState<any>(null); 
//   const [selectedStudent, setSelectedStudent] = useState<any>(null); 
//   const [activeTab, setActiveTab] = useState("Total"); 
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
//   const [isFilterOpen, setIsFilterOpen] = useState(false); 
   
//   const { assignedBatches, isLoading: batchesLoading } = useAdvisorAssignedBatches(); 
//   const { students, isLoading: studentsLoading, fetchStudents } = useStudents(); 
//   const [filteredStudents, setFilteredStudents] = useState<any[]>([]); 
//   const [stats, setStats] = useState({ total: 0, irregular: 0, regular: 0 }); 
 
//   useEffect(() => { 
//     fetchStudents(); 
//   }, [fetchStudents]); 
 
//   useEffect(() => { 
//     if (students.length > 0 && selectedBatch) { 
//       const filtered = students.filter((student: any) =>  
//         student.BatchModel?.batchName === selectedBatch.batchName && 
//         student.BatchModel?.batchYear === selectedBatch.batchYear && 
//         student.BatchModel?.ProgramModel?.programName === selectedBatch.programName 
//       ); 
//       setFilteredStudents(filtered); 
       
//       const total = filtered.length; 
//       const irregular = filtered.filter((s: any) =>  
//         s.StudentStatus?.currentStatus !== 'Regular' && 
//         s.StudentStatus?.currentStatus !== 'Promoted' && 
//         s.StudentStatus?.currentStatus !== 'New Admission' 
//       ).length; 
//       const regular = total - irregular; 
//       setStats({ total, irregular, regular }); 
//     } 
//   }, [students, selectedBatch]); 
 
//   useEffect(() => { 
//     if (assignedBatches.length > 0 && !selectedBatch) { 
//       setSelectedBatch(assignedBatches[0]); 
//     } 
//   }, [assignedBatches, selectedBatch]); 
 
//   const handleViewStudentProfile = (student: any) => { 
//     setSelectedStudent(student); 
//     setView("student-profile"); 
//   }; 
 
//   const handleBackToOverview = () => { 
//     setSelectedStudent(null); 
//     setView("overview"); 
//   }; 
 
//   const handleViewTranscript = () => { 
//     setView("transcript"); 
//   }; 
 
//   const handleBackToProfile = () => { 
//     setView("student-profile"); 
//   }; 
 
//   if (batchesLoading || studentsLoading) { 
//     return ( 
//       <div className="flex items-center justify-center min-h-screen bg-white"> 
//         <div className="text-center"> 
//           <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" /> 
//           <p className="text-gray-600 font-medium">Loading dashboard...</p> 
//         </div> 
//       </div> 
//     ); 
//   } 
 
//   return ( 
//     <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative"> 
//       <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}> 
//         <Sidebar
//   userRole="advisor"
//   activeTab={view}
//   setActiveTab={(tab) => {
//     setView(tab);
//     setIsSidebarOpen(false);
//   }}
// />
//       </div> 
 
//       {isSidebarOpen && ( 
//         <div 
//           className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden" 
//           onClick={() => setIsSidebarOpen(false)} 
//         /> 
//       )} 

//       <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative"> 
//         <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30"> 
//           <div className="flex items-center gap-4 flex-1"> 
//             <button 
//               title="Toggle Menu" 
//               onClick={() => setIsSidebarOpen(true)} 
//               className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
//             > 
//               <Menu size={24} /> 
//             </button> 
//           </div> 
//         </header> 

//         <div className="flex-1 overflow-y-auto p-4 md:p-10"> 
//           {view === "overview" && ( 
//             <div className="max-w-6xl mx-auto space-y-8"> 
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"> 
//                 <StatCard icon={<Users size={22} />} label="Total Students" value={selectedBatch ? stats.total.toString() : "0"} color="bg-indigo-50" /> 
//                 <StatCard icon={<UserMinus size={22} />} label="Irregular List" value={selectedBatch ? stats.irregular.toString() : "0"} color="bg-red-50" textColor="text-red-500" /> 
//                 <StatCard icon={<Clock size={22} />} label="Meeting Schedule" value="April 24, 2026" color="bg-green-50" textColor="text-green-500" /> 
//               </div> 
 
//               {assignedBatches.length > 0 && ( 
//                 <div> 
//                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Your Assigned Batches</h3> 
//                   <div className="flex flex-wrap gap-2 md:gap-3"> 
//                     {assignedBatches.map((batch: any) => ( 
//                       <button 
//                         key={`${batch.batchName}-${batch.batchYear}`} 
//                         onClick={() => { 
//                           setSelectedBatch(batch); 
//                           setActiveTab("Total"); 
//                         }} 
//                         className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border font-bold text-[10px] md:text-[12px] uppercase transition-all ${
//                           selectedBatch?.batchName === batch.batchName ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-400'
//                         }`}
//                       > 
//                         {batch.batchName} {batch.batchYear} - {batch.programName} 
//                       </button> 
//                     ))} 
//                   </div> 
//                 </div> 
//               )} 
 
//               {selectedBatch && ( 
//                 <div> 
//                   <div className="flex justify-between items-center mb-6"> 
//                     <h3 className="text-lg md:text-xl font-bold text-[#1e3a5f] uppercase tracking-tighter">
//                       {selectedBatch.programName}: <span className="text-amber-500">{selectedBatch.batchName} {selectedBatch.batchYear}</span>
//                     </h3> 
                    
//                     <div className="relative"> 
//                       <button 
//                         onClick={() => setIsFilterOpen(!isFilterOpen)} 
//                         className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase text-[#1e3a5f]"
//                       > 
//                         <Filter size={14} className="text-amber-500" /> 
//                         Filter: <span className="text-slate-400">{activeTab}</span> 
//                         <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} /> 
//                       </button> 
                      
//                       {isFilterOpen && ( 
//                         <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-50 p-2"> 
//                           {["Total", "Regular", "Irregular"].map((type) => ( 
//                             <button 
//                               key={type} 
//                               onClick={() => { 
//                                 setActiveTab(type); 
//                                 setIsFilterOpen(false); 
//                               }} 
//                               className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase ${activeTab === type ? 'bg-amber-50 text-amber-600' : 'text-slate-500'}`}
//                             > 
//                               {type} Students 
//                             </button> 
//                           ))} 
//                         </div> 
//                       )} 
//                     </div> 
//                   </div> 
                   
//                   <AdvisorStudentList  
//                     students={filteredStudents} 
//                     activeTab={activeTab} 
//                     isAdvisor={true} 
//                     onViewProfile={handleViewStudentProfile} 
//                     onRefresh={() => fetchStudents(true)} 
//                   /> 
//                 </div> 
//               )} 
//             </div> 
//           )} 

//           {view === "advisor-chat" && <AdvisorChat onBack={() => setView("overview")} />} 
//           {view === "advisory-logs" && <AdvisoryLogs onBack={() => setView("overview")} />} 
//           {view === "guidelines" && <Guidelines onBack={() => setView("overview")} />} 
//           {view === "faculty-recommendation" && <FacultyRecommendation onBack={() => setView("overview")} />} 
//           {view === "timetable" && <AdvisorTimetablePage onBack={() => setView("overview")} />} 
//             {view === "meeting" && <AdvisorMeetingsPage onBack={() => setView("overview")} />}
//           {view === "notes" && <AdvisoryNotes onBack={() => setView("overview")} />} 
//           {view === "student-profile" && selectedStudent && ( 
//             <AdvisoryParentScreen student={selectedStudent} onBack={handleBackToOverview} isAdvisor={true} onViewTranscript={handleViewTranscript} /> 
//           )} 
//           {view === "transcript" && selectedStudent && <StudentTranscript student={selectedStudent} onBack={handleBackToProfile} />} 
//           {view === "profile" && <ProfileView />} 
         
//         </div> 
//       </main> 
//     </div> 
//   ); 
// } 
 
// function StatCard({ icon, label, value, color, textColor = "text-[#1e3a5f]" }: any) { 
//   return ( 
//     <div className="bg-white rounded-[1.5rem] p-6 shadow-sm"> 
//       <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>{icon}</div> 
//       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p> 
//       <p className={`text-2xl font-bold ${textColor}`}>{value}</p> 
//     </div> 
//   ); 
// }














/* eslint-disable react-hooks/set-state-in-effect */ 
/* eslint-disable @typescript-eslint/no-explicit-any */ 
"use client"; 
import React, { useState, useEffect, useMemo } from "react"; 
import {  
  Users, UserMinus, Clock, Filter, ChevronDown, Menu, Loader2, Calendar  
} from "lucide-react"; 
import { useAdvisorAssignedBatches } from '@/src/hooks/assignBatches/useAdvisorAssignedBatches'; 
import { useStudents } from '@/src/hooks/studentsHook/useStudents'; 
import { useBatchMeetings } from '@/src/hooks/batchMeetingHook/useBatchMeetings'; 

import { AdvisorStudentList } from "@/components/StudentDetails/advisorStudentList"; 
import { StudentTranscript } from "@/components/StudentDetails/StudentTranscript"; 
import { Sidebar } from "@/components/navbars/route"; 
import { ProfileView } from "@/components/ProfileView/route"; 
import { AdvisoryParentScreen } from '@/components/AdvisorView/advisoryNavPtterrn'; 
import { AdvisorTimetablePage } from "@/components/Timetable/AdvisorTimetablePage";
import { AdvisorMeetingsPage } from "@/components/Meetings/AdvisorMeetingsPage";

// Local component fallbacks or direct imports
import AdvisoryNotes from "../../../../components/AdvisorView/AdvisoryNotes"; 
import AdvisorChat from "../../../../components/Chat/AdvisorChat"; 
import { AdvisoryLogs } from '../../../../components/AdvisorView/AdvisoryLogs'; 
import Guidelines from "../../../../components/Guidelines/Guidelines"; 
import FacultyRecommendation from "../../../../components/FacultyRecommendation/FacultyRecommendation"; 

// Helper function to format 24h time to 12h AM/PM format
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
 
export default function AdvisorDashboard() { 
  const [view, setView] = useState<string>("overview"); 
  const [selectedBatch, setSelectedBatch] = useState<any>(null); 
  const [selectedStudent, setSelectedStudent] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState("Total"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
   
  const { assignedBatches, isLoading: batchesLoading } = useAdvisorAssignedBatches(); 
  const { students, isLoading: studentsLoading, fetchStudents } = useStudents(); 
  
  // Sahi hook import aur use kiya gaya hai
  const { meetings = [] } = useBatchMeetings() as { meetings?: any[] };

  const [filteredStudents, setFilteredStudents] = useState<any[]>([]); 
  const [stats, setStats] = useState({ total: 0, irregular: 0, regular: 0 }); 
 
  useEffect(() => { 
    fetchStudents(); 
  }, [fetchStudents]); 
 
  useEffect(() => { 
    if (students.length > 0 && selectedBatch) { 
      const filtered = students.filter((student: any) => 
        student.BatchModel?.batchName === selectedBatch.batchName && 
        student.BatchModel?.batchYear === selectedBatch.batchYear && 
        student.BatchModel?.ProgramModel?.programName === selectedBatch.programName 
      ); 
      setFilteredStudents(filtered); 
       
      const total = filtered.length; 
      const irregular = filtered.filter((s: any) => 
        s.StudentStatus?.currentStatus !== 'Regular' && 
        s.StudentStatus?.currentStatus !== 'Promoted' && 
        s.StudentStatus?.currentStatus !== 'New Admission' 
      ).length; 
      const regular = total - irregular; 
      setStats({ total, irregular, regular }); 
    } 
  }, [students, selectedBatch]); 
 
  useEffect(() => { 
    if (assignedBatches.length > 0 && !selectedBatch) { 
      setSelectedBatch(assignedBatches[0]); 
    } 
  }, [assignedBatches, selectedBatch]); 

  // Nearest future meeting calculate karne ki behtar logic
  const upcomingMeeting = useMemo(() => {
    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) return null;
    
    const activeMeetings = meetings.filter((m: any) => {
      const s = m.status?.toLowerCase()?.trim();
      return s !== 'completed' && s !== 'cancelled';
    });

    const targetList = activeMeetings.length > 0 ? activeMeetings : meetings;

    const sortedMeetings = [...targetList].sort((a: any, b: any) => {
      const timeA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const timeB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });

    return sortedMeetings[0] || null;
  }, [meetings]);
 
  const handleViewStudentProfile = (student: any) => { 
    setSelectedStudent(student); 
    setView("student-profile"); 
  }; 
 
  const handleBackToOverview = () => { 
    setSelectedStudent(null); 
    setView("overview"); 
  }; 
 
  const handleViewTranscript = () => { 
    setView("transcript"); 
  }; 
 
  const handleBackToProfile = () => { 
    setView("student-profile"); 
  }; 
 
  if (batchesLoading || studentsLoading) { 
    return ( 
      <div className="flex items-center justify-center min-h-screen bg-white"> 
        <div className="text-center"> 
          <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" /> 
          <p className="text-gray-600 font-medium">Loading dashboard...</p> 
        </div> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative"> 
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}> 
        <Sidebar
          userRole="advisor"
          activeTab={view}
          setActiveTab={(tab) => {
            setView(tab);
            setIsSidebarOpen(false);
          }}
        /> 
      </div> 
 
      {isSidebarOpen && ( 
        <div 
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        /> 
      )} 

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative"> 
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30"> 
          <div className="flex items-center gap-4 flex-1"> 
            <button 
              title="Toggle Menu" 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            > 
              <Menu size={24} /> 
            </button> 
          </div> 
        </header> 

        <div className="flex-1 overflow-y-auto p-4 md:p-10"> 
          {view === "overview" && ( 
            <div className="max-w-6xl mx-auto space-y-8"> 
              {/* 3 STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"> 
                <StatCard 
                  icon={<Users size={22} />} 
                  label="Total Students" 
                  value={selectedBatch ? stats.total.toString() : "0"} 
                  color="bg-indigo-50" 
                /> 
                <StatCard 
                  icon={<UserMinus size={22} />} 
                  label="Irregular List" 
                  value={selectedBatch ? stats.irregular.toString() : "0"} 
                  color="bg-red-50" 
                  textColor="text-red-500" 
                /> 
                <StatCard 
                  icon={<Clock size={22} />} 
                  label="Meeting Schedule" 
                  value={
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
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">No active meeting</span>
                        </div>
                      )}
                    </div>
                  } 
                  color="bg-green-50" 
                  textColor="text-green-500" 
                /> 
              </div> 
 
              {assignedBatches.length > 0 && ( 
                <div> 
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Your Assigned Batches</h3> 
                  <div className="flex flex-wrap gap-2 md:gap-3"> 
                    {assignedBatches.map((batch: any) => ( 
                      <button 
                        key={`${batch.batchName}-${batch.batchYear}`} 
                        onClick={() => { 
                          setSelectedBatch(batch); 
                          setActiveTab("Total"); 
                        }} 
                        className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border font-bold text-[10px] md:text-[12px] uppercase transition-all ${
                          selectedBatch?.batchName === batch.batchName ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-400'
                        }`}
                      > 
                        {batch.batchName} {batch.batchYear} - {batch.programName} 
                      </button> 
                    ))} 
                  </div> 
                </div> 
              )} 
 
              {selectedBatch && ( 
                <div> 
                  <div className="flex justify-between items-center mb-6"> 
                    <h3 className="text-lg md:text-xl font-bold text-[#1e3a5f] uppercase tracking-tighter">
                      {selectedBatch.programName}: <span className="text-amber-500">{selectedBatch.batchName} {selectedBatch.batchYear}</span>
                    </h3> 
                    
                    <div className="relative"> 
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase text-[#1e3a5f]"
                      > 
                        <Filter size={14} className="text-amber-500" /> 
                        Filter: <span className="text-slate-400">{activeTab}</span> 
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} /> 
                      </button> 
                      
                      {isFilterOpen && ( 
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-50 p-2"> 
                          {["Total", "Regular", "Irregular"].map((type) => ( 
                            <button 
                              key={type} 
                              onClick={() => { 
                                setActiveTab(type); 
                                setIsFilterOpen(false); 
                              }} 
                              className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase ${activeTab === type ? 'bg-amber-50 text-amber-600' : 'text-slate-500'}`}
                            > 
                              {type} Students 
                            </button> 
                          ))} 
                        </div> 
                      )} 
                    </div> 
                  </div> 
                   
                  <AdvisorStudentList  
                    students={filteredStudents} 
                    activeTab={activeTab} 
                    isAdvisor={true} 
                    onViewProfile={handleViewStudentProfile} 
                    onRefresh={() => fetchStudents(true)} 
                  /> 
                </div> 
              )} 
            </div> 
          )} 

          {view === "advisor-chat" && <AdvisorChat onBack={() => setView("overview")} />} 
          {view === "advisory-logs" && <AdvisoryLogs onBack={() => setView("overview")} />} 
          {view === "guidelines" && <Guidelines onBack={() => setView("overview")} />} 
          {view === "faculty-recommendation" && <FacultyRecommendation onBack={() => setView("overview")} />} 
          {view === "timetable" && <AdvisorTimetablePage onBack={() => setView("overview")} />} 
          {view === "meeting" && <AdvisorMeetingsPage onBack={() => setView("overview")} />}
          {view === "notes" && <AdvisoryNotes onBack={() => setView("overview")} />} 
          {view === "student-profile" && selectedStudent && ( 
            <AdvisoryParentScreen student={selectedStudent} onBack={handleBackToOverview} isAdvisor={true} onViewTranscript={handleViewTranscript} /> 
          )} 
          {view === "transcript" && selectedStudent && <StudentTranscript student={selectedStudent} onBack={handleBackToProfile} />} 
          {view === "profile" && <ProfileView />} 
        </div> 
      </main> 
    </div> 
  ); 
} 
 
function StatCard({ icon, label, value, color, textColor = "text-[#1e3a5f]" }: any) { 
  return ( 
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between min-h-[135px]"> 
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-2`}>{icon}</div> 
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p> 
        <div className={`text-base md:text-lg font-bold ${textColor}`}>{value}</div> 
      </div>
    </div> 
  ); 
}