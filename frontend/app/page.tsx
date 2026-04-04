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

// "use client";
// import React, { useState } from "react";
// import { Users, UserCheck, UserMinus, Clock, ArrowLeft, StickyNote} from "lucide-react";
// import { Sidebar } from "./components/Sidebar";
// import { StatCard } from "./components/StatCard";
// import { StudentList } from "./components/StudentList";
// import { StudentProfile } from "./components/StudentProfile";
// import { StudentTranscript } from "./components/StudentTranscript";
// import AdvisorChat from "./components/AdvisorChat";
// import { MeetingList } from './components/MeetingList';
// import { AdvisorNotes } from './components/AdvisorNotes';

// type ViewState = "Overview" | "BatchDetails" | "StudentProfile" | "Transcript" | "AdvisoryNotes" | "AdvisorChat" | "Meetings" | "Guidelines" | "Notes";

// type StudentStatus = "Total" | "Regular" | "Irregular";

// export default function Dashboard() {
//   const [view, setView] = useState<ViewState>("Overview");
//   const [activeTab, setActiveTab] = useState<string>("Overview");
//   const [selectedBatch, setSelectedBatch] = useState<string>("Fall 2024");
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);
// const [showNotifications, setShowNotifications] = useState(false);
//   const pastBatches = ["Fall 2023", "Spring 2022"];

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
//       {/* Sidebar */}
//       <Sidebar
//         userRole="Batch Advisor"
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         setView={(v: any) => setView(v as ViewState)}
//         setSelectedStudent={setSelectedStudent}
//       />

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
//         <div className="max-w-6xl mx-auto p-10 w-full">

//           {/* ---------------- OVERVIEW ---------------- */}
//           {view === "Overview" && (
//             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <h2 className="text-3xl font-black text-[#1e3a5f] uppercase mb-8">
//                 Advisor Dashboard
//               </h2>

//               <div className="mb-12">
//                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//                   Recent Batch
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   <StatCard
//                     label="Current Advisory"
//                     value="Fall 2024"
//                     icon={Users}
//                     variant="Recent"
//                     isActive={selectedBatch === "Fall 2024"}
//                     onClick={() => {
//                       setSelectedBatch("Fall 2024");
//                       setView("BatchDetails");
//                       setActiveTab("Total");
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="mb-10">
//                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//                   Historical Records
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   {pastBatches.map((batch) => (
//                     <StatCard
//                       key={batch}
//                       label="Past Batch"
//                       value={batch}
//                       icon={Clock}
//                       variant="Previous"
//                       isActive={selectedBatch === batch}
//                       onClick={() => {
//                         setSelectedBatch(batch);
//                         setView("BatchDetails");
//                         setActiveTab("Total");
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ---------------- BATCH DETAILS ---------------- */}
//           {view === "BatchDetails" && (
//             <div className="animate-in slide-in-from-right-4 duration-500">
//               <button
//                 onClick={() => setView("Overview")}
//                 className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a5f] flex items-center gap-2 transition-colors"
//               >
//                 <ArrowLeft size={14} /> Back to Batches
//               </button>

//               <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 flex justify-between items-center mb-8 shadow-lg border-b-4 border-amber-400">
//                 <div>
//                   <p className="text-[10px] text-amber-400 font-black tracking-widest uppercase mb-1">
//                     Active Roster
//                   </p>
//                   <h2 className="text-2xl font-black uppercase tracking-tight">
//                     {selectedBatch} | BS SOFTWARE ENGINEERING
//                   </h2>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//                 {[
//                   { id: "Total", label: "Total Strength", count: "09", icon: Users, border: "border-[#1e3a5f]" },
//                   { id: "Regular", label: "Regular", count: "06", icon: UserCheck, border: "border-green-600" },
//                   { id: "Irregular", label: "Irregular", count: "03", icon: UserMinus, border: "border-red-600" },
//                 ].map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`h-[130px] rounded-[30px] bg-white transition-all flex flex-col items-start justify-between p-6 border shadow-sm group
//                       ${activeTab === tab.id ? `${tab.border} border-2 scale-105 shadow-xl` : 'border-slate-100 hover:border-slate-300'}`}
//                   >
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white' : 'bg-slate-50 text-slate-400'}`}>
//                       <tab.icon size={18} />
//                     </div>
//                     <div className="text-left">
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tab.label}</p>
//                       <p className={`text-2xl font-black ${activeTab === tab.id ? 'text-[#1e3a5f]' : 'text-slate-600'}`}>{tab.count}</p>
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               <StudentList
//                 selectedBatch={selectedBatch}
//                 activeTab={activeTab as StudentStatus}
//                 onViewProfile={(student) => {
//                   setSelectedStudent(student);
//                   setView("StudentProfile");
//                 }}
//               />
//             </div>
//           )}

//           {/* ---------------- STUDENT PROFILE ---------------- */}
//           {view === "StudentProfile" && selectedStudent && (
//             <StudentProfile
//               student={selectedStudent}
//               selectedBatch={selectedBatch}
//               onBack={() => setView("BatchDetails")}
//               onViewTranscript={() => setView("Transcript")}
//             />
//           )}

//           {/* ---------------- TRANSCRIPT ---------------- */}
//           {view === "Transcript" && selectedStudent && (
//             <StudentTranscript
//               student={selectedStudent}
//               onBack={() => setView("StudentProfile")}
//             />
//           )}

//           {/* ---------------- ADVISOR CHAT ---------------- */}
//           {view === "AdvisorChat" && <AdvisorChat />}

//           {/* ---------------- GUIDELINES ---------------- */}
//           {view === "Guidelines" && (
//             <div>
//               <h2 className="text-2xl font-black text-[#1e3a5f] mb-6">Guidelines</h2>
//               <p>Guidelines content goes here...</p>
//             </div>
//           )}

//           {/* ---------------- MEETINGS ---------------- */}
//           {view === 'Meetings' && (
//             <div className="animate-in fade-in duration-500">
//               <button 
//                 onClick={() => setView('Overview')} 
//                 className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a5f] flex items-center gap-2 transition-colors"
//               >
//                 <ArrowLeft size={14} /> Back to Dashboard
//               </button>
//               <MeetingList />
//             </div>
//           )}

//           {/* ---------------- NOTES ---------------- */}
//           {view === 'Notes' && (
//             <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
//               <div className="flex-none">
//                 <button 
//   onClick={() => {
//     setView("Notes"); 
//     setActiveTab("Notes");
//   }}
// >
// </button>
//               </div>
//               <div className="flex-1 min-h-0 overflow-hidden">
//                 <AdvisorNotes />
//               </div>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { 
  Users, UserCheck, UserMinus, Clock, ArrowLeft, 
  StickyNote, Bell, Search, Settings 
} from "lucide-react"; 
import { AnimatePresence, motion } from "framer-motion"; 

// Components Imports
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { StudentList } from "./components/StudentList";
import { StudentProfile } from "./components/StudentProfile";
import { StudentTranscript } from "./components/StudentTranscript";
import AdvisorChat from "./components/AdvisorChat";
import { MeetingList } from './components/MeetingList';
import { AdvisorNotes } from './components/AdvisorNotes';
import { NotificationPanel } from "./components/NotificationPanel";
import { AdvisoryLogs } from './components/AdvisoryLogs';

type ViewState = "Overview" | "BatchDetails" | "StudentProfile" | "Transcript" | "AdvisoryNotes" | "AdvisorChat" | "Meetings" | "Guidelines" | "Notes";
type StudentStatus = "Total" | "Regular" | "Irregular";

export default function Dashboard() {
  const [view, setView] = useState<ViewState>("Overview");
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [selectedBatch, setSelectedBatch] = useState<string>("Fall 2024");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // --- Coordinator Style Notification States ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);

  const pastBatches = ["Fall 2023", "Spring 2022"];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      
      <Sidebar
        userRole="Batch Advisor"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setView={(v: any) => setView(v as ViewState)}
        setSelectedStudent={setSelectedStudent}
      />

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* --- COORDINATOR STYLE HEADER --- */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student or CMS ID..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-amber-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Bell Icon Button */}
            <button 
              onClick={() => {
                setShowNotifications(true);
                setHasNewNotif(false);
              }}
              className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all relative shadow-sm"
            >
              <Bell size={20} />
              {hasNewNotif && (
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
            </button>
            
            {/* User Profile Info */}
            <div className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-[#1e3a5f]">Advisor Name</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Software Eng.</p>
              </div>
              <div className="h-10 w-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center text-amber-400 font-black text-xs">
                BA
              </div>
            </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-10 w-full">

            {/* ---------------- OVERVIEW (PREVIOUS BATCHES INTACT) ---------------- */}
            {view === "Overview" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <h2 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter">
                  Advisor <span className="text-amber-500">Dashboard</span>
                </h2>

                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Recent Batch
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      label="Current Advisory"
                      value="Fall 2024"
                      icon={Users}
                      variant="Recent"
                      isActive={selectedBatch === "Fall 2024"}
                      onClick={() => {
                        setSelectedBatch("Fall 2024");
                        setView("BatchDetails");
                        setActiveTab("Total");
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Previous Batch
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {pastBatches.map((batch) => (
                      <StatCard
                        key={batch}
                        label="Past Batch"
                        value={batch}
                        icon={Clock}
                        variant="Previous"
                        isActive={selectedBatch === batch}
                        onClick={() => {
                          setSelectedBatch(batch);
                          setView("BatchDetails");
                          setActiveTab("Total");
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* --- ADVISORY LOGS ADDED HERE (Right below Previous Batches) --- */}
                <div className="max-w-2xl">
                   <AdvisoryLogs />
                </div>

              </motion.div>
            )}

            {/* ---------------- BATCH DETAILS ---------------- */}
            {view === "BatchDetails" && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <button
                  onClick={() => setView("Overview")}
                  className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a5f] flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Batches
                </button>

                <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 flex justify-between items-center mb-8 shadow-lg border-b-4 border-amber-400">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                      {selectedBatch} | BS SOFTWARE ENGINEERING
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  {[
                    { id: "Total", label: "Total Student", count: "09", icon: Users, border: "border-[#1e3a5f]" },
                    { id: "Regular", label: "Regular", count: "06", icon: UserCheck, border: "border-green-600" },
                    { id: "Irregular", label: "Irregular", count: "03", icon: UserMinus, border: "border-red-600" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-[145px] rounded-[30px] bg-white transition-all flex flex-col items-start justify-between p-6 border shadow-sm group
                        ${activeTab === tab.id ? `${tab.border} border-2 scale-105 shadow-xl` : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <tab.icon size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tab.label}</p>
                        <p className={`text-2xl font-black ${activeTab === tab.id ? 'text-[#1e3a5f]' : 'text-slate-600'}`}>{tab.count}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <StudentList
                  selectedBatch={selectedBatch}
                  activeTab={activeTab as StudentStatus}
                  onViewProfile={(student) => {
                    setSelectedStudent(student);
                    setView("StudentProfile");
                  }}
                />
              </div>
            )}

            {/* ---------------- OTHER VIEWS ---------------- */}
            {view === "StudentProfile" && selectedStudent && (
              <StudentProfile student={selectedStudent} selectedBatch={selectedBatch} onBack={() => setView("BatchDetails")} onViewTranscript={() => setView("Transcript")} />
            )}
            {view === "Transcript" && selectedStudent && (
              <StudentTranscript student={selectedStudent} onBack={() => setView("StudentProfile")} />
            )}
            {view === "AdvisorChat" && <AdvisorChat />}
            {view === 'Meetings' && <MeetingList />}
            {view === 'Notes' && <AdvisorNotes />}

          </div>
        </div>
      </main>

      {/* --- COORDINATOR STYLE SLIDING NOTIFICATION PANEL --- */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}