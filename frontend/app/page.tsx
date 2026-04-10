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

import React, { useState } from "react";
import { 
  Users, UserMinus, Clock, Bell, Search, Filter, ChevronDown 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components Imports
import { Sidebar } from "../components/navbars/route";
import { StudentList } from "../components/StudentDetails/StudentList";
import { StudentProfile } from "../components/StudentDetails/StudentProfile";
import { StudentTranscript } from "../components/StudentDetails/StudentTranscript";
import AdvisorChat from "../components/Chat/AdvisorChat";
import { MeetingList } from "../components/MeetingSchedule/MeetingList";
import AdvisoryNotes from "../components/AdvisorView/AdvisorNotes";
import { NotificationPanel } from "./components/NotificationPanel";
import { AdvisoryLogs } from '../components/AdvisorView/AdvisoryLogs';
import { AdvisorProfile } from "../components/AdvisorView/AdvisorProfile";

export default function Dashboard() {
  // --- States ---
  const [view, setView] = useState<string>("Overview");
  const [activeTab, setActiveTab] = useState("Total");
  const [selectedBatch, setSelectedBatch] = useState<string>("Fall 2024");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Navigation Handler ---
  const navigateTo = (tab: string) => {
    // Normalizing string to match view keys
    const targetView = tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase();
    
    setView(targetView);
    setActiveTab("Total"); 
    setIsFilterOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      
      <Sidebar 
        userRole="advisor" 
        activeTab={view} 
        setActiveTab={navigateTo} 
      />

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* --- HEADER --- */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student..." 
              className="w-80 pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-amber-400/20 outline-none transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setShowNotifications(true); setHasNewNotif(false); }}
              className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 relative transition-all"
            >
              <Bell size={20} />
              {hasNewNotif && (
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-10 w-full">
            
            {/* --- OVERVIEW SECTION --- */}
            {view === "Overview" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-12"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={<Users size={22} />} label="Overall Students" value="1045" color="bg-[#1e3a5f]" />
                  <StatCard icon={<UserMinus size={22} />} label="Irregular List" value="120" color="bg-red-50" textColor="text-red-500" />
                  <StatCard icon={<Clock size={22} />} label="Meeting Reminder" value="Oct 24, 2026" color="bg-amber-50" textColor="text-amber-500" />
                </div>

                {/* Batch Selection */}
                <div className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    {["Fall 2024", "Fall 2023", "Spring 2023"].map((batch) => (
                      <button 
                        key={batch}
                        onClick={() => { setSelectedBatch(batch); setActiveTab("Total"); }}
                        className={`px-6 py-3 rounded-2xl border font-black text-[12px] uppercase transition-all ${
                          selectedBatch === batch ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {batch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student List Section */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">
                      BS SE: <span className="text-amber-500">{selectedBatch}</span>
                    </h3>

                    {/* Filter Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-[#1e3a5f] hover:border-amber-400 transition-all"
                      >
                        <Filter size={14} className="text-amber-500" />
                        Filter: <span className="text-slate-400">{activeTab}</span>
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isFilterOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2"
                          >
                            {["Total", "Regular", "Irregular"].map((type) => (
                              <button 
                                key={type}
                                onClick={() => { setActiveTab(type); setIsFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-colors ${
                                  activeTab === type ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                {type} Students
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <StudentList 
                      selectedBatch={selectedBatch} 
                      activeTab={activeTab as any} 
                      onViewProfile={(s) => { setSelectedStudent(s); setView("Studentprofile"); }} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- OTHER VIEWS --- */}
            {view === "Studentprofile" && selectedStudent && (
              <StudentProfile 
                student={selectedStudent} 
                selectedBatch={selectedBatch} 
                onBack={() => setView("Overview")} 
                onViewTranscript={() => setView("Transcript")} 
              />
            )}

            {view === "Advisorprofile" && <AdvisorProfile />}
            
            {view === "Transcript" && selectedStudent && (
              <StudentTranscript student={selectedStudent} onBack={() => setView("Studentprofile")} />
            )}

            {view === 'Notes' && <AdvisoryNotes />}
            {view === 'Advisorchat' && <AdvisorChat />}
            {view === 'Meetings' && <MeetingList />}
            {view === 'Advisorylogs' && <AdvisoryLogs />}

          </div>
        </div>
      </main>

      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}

// Helper Sub-component for Stats
function StatCard({ icon, label, value, color, textColor = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center ${color.includes('bg-white') ? 'text-slate-600' : (color.includes('50') ? textColor : 'text-white')} mb-5`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${textColor}`}>{value}</p>
    </div>
  );
}