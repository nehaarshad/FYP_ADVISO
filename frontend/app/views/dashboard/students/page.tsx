
"use client";
import React, { useState, useEffect } from "react";
import { 
  BookOpen, Map, Bell, GraduationCap, CheckCircle2, 
  Database, Timer, ScrollText, ClipboardList,
  Search, Clock, Calendar, MessageSquare, FileText, Menu, X
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
import { RoadmapView } from "@/app/components/RoadmapView";
import ViewRecommedCourse from "../../../../components/CourseRecommendation/ViewRecommedCourse";

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<string>("Overview");
  const [navigationStack, setNavigationStack] = useState(["Overview"]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const [currentUser] = useState({
    id: "F21-BSSE-042",
    name: "Ahmed Ali",
    email: "ahmed.ali@university.edu",
    batch: "Fall 2021",
    department: "Software Engineering",
    semester: "6th",
    cgpa: "3.82",
    status: "Regular",
    completedCredits: 102,
    totalCredits: 136,
  });

  const [advisorPicks] = useState([
    {
      id: "1",
      name: "Software Architecture",
      code: "SE-302",
      credits: 3,
      category: "Computing Core",
      basis: "Roadmap Sequence",
      advisorNote: "Aapne Software Engineering (SE-201) clear kar liya hai, isliye ye agla mandatory step hai."
    },
    {
      id: "2",
      name: "Cloud Computing",
      code: "CS-412",
      credits: 3,
      category: "SE Elective",
      basis: "Credit Hour Gap",
      advisorNote: "Graduation ke liye mazeed elective credits chahiye. Ye course aapke backend development interest se match karta hai."
    }
  ]);

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
      normalizedView = "Roadmap";
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

  if (!mounted) return null;

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
            
            {view === "Overview" && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <StatCard label="Current CGPA" value={currentUser.cgpa} icon={<GraduationCap size={22}/>} trend="Status: Good" />
                  <StatCard label="Credits Done" value="102/136" icon={<CheckCircle2 size={22}/>} />
                  <StatCard label="Current Semester" value="06" icon={<Database size={22}/>} trend="Batch: Fall 2021" />
                  <StatCard 
                    label="Upcoming Meeting" 
                    value={(
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-amber-500 shrink-0" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0em]">Monday</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={10} className="text-amber-500 shrink-0" />
                          <span className="text-[9px] font-black text-slate-500 tracking-[0em]"> 01-10-2026 </span>
                        </div>
                      </div>
                    )}
                    icon={<ClipboardList size={22}/>} 
                    color="text-orange-500"
                  />
                </div>

                {/* DEGREE COMPLETION */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3">Degree Completion</h3>
                   <div className="space-y-6">
                     <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">{currentUser.department}</span>
                       <span className="text-2xl md:text-3xl font-black text-[#1e3a5f] tracking-tighter">75%</span>
                     </div>
                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: '75%' }} 
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
              {view === "Studentprofile" && (<StudentProfile student={currentUser} selectedBatch={currentUser.batch} onBack={goBack} onViewTranscript={() => navigateTo("Transcript")} />)}
              {view === "Transcript" && (<StudentTranscript student={currentUser} onBack={goBack} />)}
              {view === "CourseRecommendation" && (
                <ViewRecommedCourse 
                  suggestedCourses={advisorPicks} 
                  advisorName="Dr. Sarah Ahmed" 
                  lastUpdated= "2 hours ago" 
                  onBack={goBack} 
                />
              )}
              {view === "StudentChat" && (<StudentChat onBack={goBack} />)}
              {view === "Remarks" && (<AdvisorRemarks onBack={goBack} />)}
              {view === "Timetable" && (<Timetable onBack={goBack} />)}
              {view === "RequestsFoam" && <SubmitRequest onBack={goBack} />}
              {view === "Guidelines" && <Guidelines onBack={goBack} />}
              {view === "Roadmap" && <RoadmapView onClose={goBack} />}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-4 md:mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
      <div className="flex justify-between items-end">
        <div className={`text-2xl md:text-3xl font-black tracking-tighter ${color}`}>{value}</div>
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