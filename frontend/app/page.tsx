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
// import React, { useState } from 'react';
// import { Sidebar } from './components/Sidebar';
// import { Header, StatCard, StudentCard,RecentStudentCard } from './components/DashboardUI';
// import { Users, AlertTriangle, MessageSquare } from "lucide-react";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [userRole, setUserRole] = useState("advisor"); // Change to "student" to see the other view
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);

//   return (
//     <div className="flex min-h-screen bg-[#f8fafc]">
//       {/* 1. Sidebar Called Here */}
//       <Sidebar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         setSelectedStudent={setSelectedStudent} 
//         userRole={userRole}
//       />

//       <main className="flex-1 flex flex-col min-w-0">
//         {/* 2. Header Called Here */}
//         <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//         <div className="p-10 max-w-7xl mx-auto w-full space-y-10">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <StatCard label="Total Students" value="450" icon={<Users/>} />
//             <StatCard label="Critical Risk" value="12" icon={<AlertTriangle/>} color="text-red-500" />
//             <StatCard label="Messages" value="05" icon={<MessageSquare/>} />
//           </div>

//           {/* Rest of your logic (mapping students, etc.) goes here */}
//           <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
//              <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic mb-6">Dashboard Content</h2>
//              <p className="text-slate-400 font-bold italic">Welcome back, {userRole === "advisor" ? "Valeeja" : "Jannat"}! Select a tab from the sidebar to begin.</p>
//           </div>
//           {activeTab === "overview" && (
//   <div className="space-y-12">
    
//     {/* Recent Activity (Horizontal Scroll) */}
//     <section className="space-y-4">
//       <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest px-2">Recent Activity</h3>
//       <div className="flex gap-6 overflow-x-auto pb-6 px-2 no-scrollbar">
//         {studentDatabase.map((student, i) => (
//           <RecentStudentCard 
//             key={i} 
//             student={student} 
//             onClick={() => setSelectedStudent(student)} 
//           />
//         ))}
//       </div>
//     </section>

//     {/* Full Batch List (Vertical Grid) */}
//     <section className="space-y-4">
//       <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest px-2">Batch Directory</h3>
//       <div className="grid gap-4">
//         {studentDatabase.map((student, i) => (
//           <StudentCard 
//             key={i} 
//             student={student} 
//             onClick={() => setSelectedStudent(student)} 
//           />
//         ))}
//       </div>
//     </section>

//   </div>
// )}
//         </div>
//       </main>
//     </div>
//   );
// }





// "use client";
// import React, { useState } from 'react';
// import { Users, UserCheck, UserMinus, Clock } from 'lucide-react';
// import { Sidebar } from './components/Sidebar';
// import { StatCard } from './components/StatCard';
// // import { TranscriptTable } from './components/TranscriptTable';
// // import { RoadmapProgress } from './components/RoadmapProgress';

// export default function Dashboard() {
//   const [view, setView] = useState('Overview');
//   const [activeTab, setActiveTab] = useState('Total');
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
//       <Sidebar view={view} setView={setView} />
      
//       <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
//         <div className="max-w-6xl mx-auto p-10 w-full">
          
//           {view === 'Overview' && (
//             <>
//               <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic mb-8">System Insights</h2>
//               <div className="grid grid-cols-4 gap-6 mb-10">
//                 <StatCard 
//                    label="Total Students" value="10" icon={Users} 
//                    isActive={activeTab === 'Total'} onClick={() => setActiveTab('Total')} variant="Total"
//                 />
//                 <StatCard 
//                    label="Regular" value="06" icon={UserCheck} 
//                    isActive={activeTab === 'Regular'} onClick={() => setActiveTab('Regular')} variant="Regular"
//                 />
//               </div>
//             </>
//           )}

//           {/* {view === 'Transcript' && selectedStudent && (
//              <TranscriptTable transcript={selectedStudent.transcript} />
//           )}

//           {view === 'StudentProfile' && (
//              <div className="bg-white p-10 rounded-[3rem]">
//                 <RoadmapProgress />
//                 <button onClick={() => setView('Transcript')} className="mt-10 w-full p-5 bg-amber-50 rounded-2xl font-black uppercase text-[#1e3a5f]">
//                   View Detailed Transcript
//                 </button>
//              </div>
//           )} */}

//         </div>
//       </main>
//     </div>
//   );
// }

"use client";
import React, { useState } from 'react';
import { Users, UserCheck, UserMinus, Clock, ArrowLeft } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { StudentList } from './components/StudentList';
import { StudentProfile } from './components/StudentProfile';
import { StudentTranscript } from './components/StudentTranscript';

type ViewState = 'Overview' | 'BatchDetails' | 'StudentProfile' | 'Transcript';
type StudentStatus = 'Total' | 'Regular' | 'Irregular' | 'Meetings';

export default function Dashboard() {
  const [view, setView] = useState<ViewState>('Overview');
  const [selectedBatch, setSelectedBatch] = useState('Fall 2024');
  const [activeTab, setActiveTab] = useState<StudentStatus>('Total');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const pastBatches = ["Fall 2023", "Spring 2022"];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        userRole="Batch Advisor" 
        activeTab={view} 
        setActiveTab={(v: any) => setView(v)} 
        setView={(v: any) => setView(v)} 
        setSelectedStudent={setSelectedStudent}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-10 w-full">
          
          {/* ---------------- LEVEL 1: OVERVIEW ---------------- */}
          {view === 'Overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Removed 'italic' from Advisor Dashboard heading */}
              <h2 className="text-3xl font-black text-[#1e3a5f] uppercase not-italic mb-8">Advisor Dashboard</h2>
              
              <div className="mb-12">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recent Batch</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard 
                    label="Current Advisory" 
                    value="Fall 2024" 
                    icon={Users} 
                    variant="Recent"
                    isActive={selectedBatch === 'Fall 2024'} 
                    onClick={() => { 
                      setSelectedBatch('Fall 2024'); 
                      setView('BatchDetails'); 
                      setActiveTab('Total');
                    }}
                  />
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Historical Records</p>
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
                        setView('BatchDetails'); 
                        setActiveTab('Total');
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 2: BATCH DETAILS ---------------- */}
          {view === 'BatchDetails' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setView('Overview')} 
                className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a5f] flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Batches
              </button>

              <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 flex justify-between items-center mb-8 shadow-lg border-b-4 border-amber-400">
                <div>
                  <p className="text-[10px] text-amber-400 font-black tracking-widest uppercase mb-1">Active Roster</p>
                  {/* Removed 'italic' from Batch heading */}
                  <h2 className="text-2xl font-black uppercase not-italic tracking-tight">
                    {selectedBatch} | BS SOFTWARE ENGINEERING
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { id: 'Total', label: 'Total Strength', count: '09', icon: Users, color: 'text-[#1e3a5f]', border: 'border-[#1e3a5f]' },
                  { id: 'Regular', label: 'Regular', count: '06', icon: UserCheck, color: 'text-green-600', border: 'border-green-600' },
                  { id: 'Irregular', label: 'Irregular', count: '03', icon: UserMinus, color: 'text-red-600', border: 'border-red-600' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as StudentStatus)} 
                    className={`h-[130px] rounded-[30px] bg-white transition-all flex flex-col items-start justify-between p-6 border shadow-sm group
                      ${activeTab === tab.id ? `${tab.border} border-2 scale-105 shadow-xl` : 'border-slate-100 hover:border-slate-300'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <tab.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tab.label}</p>
                      <p className={`text-2xl font-black ${activeTab === tab.id ? tab.color : 'text-slate-600'}`}>{tab.count}</p>
                    </div>
                  </button>
                ))}
              </div>

              <StudentList 
                selectedBatch={selectedBatch} 
                activeTab={activeTab} 
                onViewProfile={(student) => {
                  setSelectedStudent(student);
                  setView('StudentProfile');
                }} 
              />
            </div>
          )}

          {/* ---------------- LEVEL 3: STUDENT PROFILE ---------------- */}
          {view === 'StudentProfile' && selectedStudent && (
            <StudentProfile 
              student={selectedStudent}
              selectedBatch={selectedBatch}
              onBack={() => setView('BatchDetails')}
              onViewTranscript={() => setView('Transcript')}
            />
          )}

          {/* ---------------- LEVEL 4: TRANSCRIPT VIEW ---------------- */}
          {view === 'Transcript' && selectedStudent && (
            <StudentTranscript 
              student={selectedStudent}
              onBack={() => setView('StudentProfile')}
            />
          )}

        </div>
      </main>
    </div>
  );
}