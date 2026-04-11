// "use client";
// import OutlinedTextHeading from "@/components/textsComponents/OutlinedTextHeading";
// import { motion } from "framer-motion";
// import YellowFilledButtonProps from "@/components/buttons/FilledButton/yellowFilledButton";
// import { 
//   BookOpen, Users, Calendar, 
//   ShieldCheck, History, Send, 
//   CheckCircle2, Lightbulb, Search 
// } from "lucide-react";
// import LandingFooter from "@/components/footer/route";
// import SmallFeature from "@/components/cards/featureCards";
// import { useRouter } from 'next/navigation';

// export default function LandingPage() {
//   const router = useRouter();

//   // Navigation logic for Login page
//   const handleClick = () => {
//     router.push('/views/auth/login'); 
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans selection:bg-[#FDB813]/30 overflow-x-hidden">
      
//       {/* --- HERO SECTION --- */}
//       <section className="relative h-screen flex items-center justify-center text-center px-6">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{ backgroundImage: "url('/backgroundLanding.png')" }}
//         />
//         <div className="relative z-10 text-white max-w-5xl">
//           <motion.h1
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-4xl text-[#FDB813] md:text-6xl font-bold tracking-tight mb-10 mt-20"
//           >
//             Adviso - <br />
//             <span className="text-[#FDB813]">An Academic Batch Advisor System</span>
//           </motion.h1>
//           <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-white text-lg md:text-2xl font-light tracking-wide mb-16 leading-relaxed">
//               Smart Guidance, Simple Solution
//           </motion.h2>
//           <div className="mt-8">
//                {/* Button triggers the handleClick function */}
//                <YellowFilledButtonProps text="Get Started" onClick={handleClick}/>
//           </div>
//         </div>
//       </section>

//       {/* --- WHY CHOOSE US --- */}
//       <section className="py-32 px-6 md:px-12 text-center max-w-7xl mx-auto">
//             <OutlinedTextHeading text="Why Choose Us" hasDot={true} />
//         <div className="grid md:grid-cols-3 gap-12">
//           <SmallFeature Icon={Users} title="Structured Advisory System" desc="A well-organized platform that streamlines academic advising and student guidance." />
//           <SmallFeature Icon={Lightbulb} title="Efficient Meeting Management" desc="Schedule, manage, and track advisory meetings without manual effort." />
//           <SmallFeature Icon={Search} title="Transparent Decision Tracking" desc="All advisory decisions and academic records are securely stored and easy to access." />
//         </div>
//       </section>

//       {/* --- ABOUT US SECTION --- */}
//       <section id="about" className="bg-[#1e3a5f] text-white py-32 px-6 md:px-24">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
//           <div className="text-left">
//             <h2 className="text-3xl font-bold mb-24 tracking-wide text-[#FDB813] uppercase">About Us</h2>
//             <h3 className="text-4xl font-bold mb-7 leading-tight">Making academic guidance smarter, <br /> simpler, and more reliable.</h3>
//             <p className="text-white/70 leading-[2] text-lg font-normal">Adviso is a smart academic advising platform that connects students and advisors, streamlining guidance, course recommendations, meetings, and academic decisions.</p>
//           </div>
//           <motion.div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white/5">
//             <img src="/Image.png" alt="About" className="w-full h-[450px] object-cover" />
//           </motion.div>
//         </div>
//       </section>

//       <section id="features" className="py-32 px-6 md:px-12 text-center bg-white">
//               <OutlinedTextHeading text="Features" hasDot={true} />
//               <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
//                 <SmallFeature Icon={CheckCircle2} title="Smart Course Advising" desc="Automatically suggests eligible courses along with specific reasons." />
//                 <SmallFeature Icon={Calendar} title="Meeting Scheduling" desc="Schedule and track advisory sessions easily." />
//                 <SmallFeature Icon={ShieldCheck} title="Secure Records" desc="Store student profiles, transcripts, and decisions safely." />
//                 <SmallFeature Icon={History} title="Advisory History" desc="Complete logs accessible to future advisors." />
//                 <SmallFeature Icon={BookOpen} title="Automatic Transcript Management" desc="Manage student academic records automatically for accurate advising." />
//                 <SmallFeature Icon={Send} title="Digital Requests Form Submissions" desc="Submit academic requests quickly and digitally." />
//               </div>
//       </section>

//       <LandingFooter />
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Map, Bell, GraduationCap, CheckCircle2, 
  Database, Timer, ScrollText, ClipboardList,
  Search, Clock, Calendar, MessageSquare, FileText
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components Imports
import { Sidebar } from "@/components/navbars/route";
import { NotificationPanel } from "../components/Notifications/NotificationPanel";
import { StudentTranscript } from "../components/StudentDetails/StudentTranscript";
import { StudentProfile } from "../components/StudentDetails/StudentProfile";
import { MeetingList } from "../components/MeetingSchedule/MeetingList";
import Guidelines from "../components/Guidelines/Guidelines";
import SubmitRequest from "../components/RequestFoam/SubmitRequest";

import { StudentChat } from "../components/Chat/StudentChat"; 
import { AdvisorRemarks } from "../components/StudentDetails/AdvisorRemarks";

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<string>("Overview");
  const [navigationStack, setNavigationStack] = useState(["Overview"]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // NAVIGATION LOGIC
  const navigateTo = (tab: string) => {
    const target = tab.toLowerCase();
    let normalizedView = "";

    if (target === "profile" || target === "my profile") {
      normalizedView = "Studentprofile";
    } else if (target === "chat" || target === "advisorchat" || target === "advisor chat") {
      normalizedView = "StudentChat";
    } else if (target === "remarks" || target === "advisor remarks") {
      normalizedView = "Remarks";
    } else if (target === "transcript" || target === "my transcript") {
      normalizedView = "Transcript";
    } else {
      normalizedView = tab.charAt(0).toUpperCase() + tab.slice(1);
    }
    
    setView(normalizedView);
    setNavigationStack(prev => [...prev, normalizedView]);
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
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 outline-none">
      
      <Sidebar 
        userRole="student" 
        activeTab={view} 
        setActiveTab={navigateTo} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* --- HEADER --- */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-8 flex-1">
             <div className="relative max-w-md w-full group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search roadmap, courses or forms..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 focus:bg-white transition-all italic"
                />
             </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="flex flex-col items-end mr-2">
              <p className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest italic leading-none">{currentUser.id}</p>
              <p className="text-[9px] font-bold text-green-500 uppercase mt-1 flex items-center gap-1 italic">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> {currentUser.semester} Sem Active
              </p>
            </div>
            
            <button 
              onClick={() => setShowNotifications(true)}
              className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-amber-400 relative transition-all shadow-sm outline-none"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth outline-none">
          <div className="max-w-6xl mx-auto p-10 w-full">
            
            {/* --- OVERVIEW VIEW --- */}
            {view === "Overview" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3 italic">Degree Completion</h3>
                   <div className="space-y-6">
                     <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">{currentUser.department}</span>
                       <span className="text-3xl font-black text-[#1e3a5f] italic tracking-tighter">75%</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ActionCard icon={<BookOpen size={24}/>} label="Recommendations" onClick={() => navigateTo("Courses")} />
                   <ActionCard icon={<Map size={24}/>} label="Roadmap" onClick={() => navigateTo("Roadmap")} />
                  <ActionCard icon={<FileText size={24}/>} label="My Transcript" onClick={() => navigateTo("Transcript")} />
                  <ActionCard icon={<ScrollText size={24}/>} label="Advisor Remarks" onClick={() => navigateTo("Remarks")} />
                 
                </div>
              </div>
            )}

            {/* --- DYNAMIC MODULE VIEWS --- */}
            <div className="w-full outline-none">
              {view === "Studentprofile" && (
                <StudentProfile student={currentUser} selectedBatch={currentUser.batch} onBack={goBack} onViewTranscript={() => navigateTo("Transcript")} />
              )}
              {view === "Transcript" && (
                <StudentTranscript student={currentUser} onBack={goBack} />
              )}
              
              {view === "StudentChat" && (
                <StudentChat onBack={goBack} />
              )}
              
              {view === "Remarks" && (
                <AdvisorRemarks onBack={goBack} />
              )}
              {view === "RequestsFoam" && <SubmitRequest />}
              {view === "Meetings" && <MeetingList />}
              {view === "Guidelines" && <Guidelines />}
              
              {["Roadmap", "Courses", "Requests", "Progress"].includes(view) && (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center">
                  <Timer size={40} className="text-amber-500 animate-pulse mb-4" />
                  <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Module Under Review</h2>
                  <p className="text-slate-400 text-xs font-bold mt-2 uppercase">Scheduled for {currentUser.batch} Update</p>
                </div>
              )}
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
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default outline-none select-none">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{label}</p>
      <div className="flex justify-between items-end">
        <div className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</div>
        <div className="mb-1">
          {typeof trend === 'string' ? (
            <span className="text-[8px] font-bold text-slate-400 uppercase">{trend}</span>
          ) : (
            trend
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
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0 select-none"
    >
      <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest group-hover:italic">
        {label}
      </p>
    </div>
  );
}