

// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   BookOpen, Map, Bell, GraduationCap, CheckCircle2, 
//   Database, Timer, PlayCircle, ScrollText, ClipboardList,
//   Search, ChevronLeft, FileSearch
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// // Components Imports
// import { Sidebar } from "@/components/navbars/route";
// import { NotificationPanel } from "../components/Notifications/NotificationPanel";
// import { StudentTranscript } from "../components/StudentDetails/StudentTranscript";
// import { StudentProfile } from "../components/StudentDetails/StudentProfile";
// import { MeetingList } from "../components/MeetingSchedule/MeetingList";
// import Guidelines from "../components/Guidelines/Guidelines";
// import AdvisorChat from "../components/Chat/AdvisorChat";

// export default function StudentDashboard() {
//   const [mounted, setMounted] = useState(false);
//   const [view, setView] = useState<string>("Overview");
//   const [navigationStack, setNavigationStack] = useState(["Overview"]);
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => { setMounted(true); }, []);

//   const [currentUser] = useState({
//     id: "F21-BSSE-042",
//     name: "Ahmed Ali",
//     email: "ahmed.ali@university.edu",
//     batch: "Fall 2021",
//     department: "Software Engineering",
//     semester: "6th",
//     cgpa: "3.82"
//   });

//   const navigateTo = (tab: string) => {
//     const target = tab.toLowerCase();
//     let normalizedView = "";

//     if (target === "profile" || target === "my profile") {
//       normalizedView = "Studentprofile";
//     } else {
//       normalizedView = tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase();
//     }
    
//     setView(normalizedView);
//     setNavigationStack(prev => [...prev, normalizedView]);
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

//   if (!mounted) return null;

//   return (
//     <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      
//       <Sidebar 
//         userRole="student" 
//         activeTab={view} 
//         setActiveTab={navigateTo} 
//       />

//       <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
//         {/* --- HEADER --- */}
//         <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
//           <div className="flex items-center gap-8 flex-1">
//              {/* SEARCH BAR */}
//              <div className="relative max-w-md w-full group hidden md:block">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={16} />
//                 <input 
//                   type="text" 
//                   placeholder="Search roadmap, courses or forms..." 
//                   className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 focus:bg-white transition-all italic"
//                 />
//              </div>
//           </div>

//           <div className="flex items-center gap-4 ml-4">
//             <div className="flex flex-col items-end mr-2">
//               <p className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest italic leading-none">{currentUser.id}</p>
//               <p className="text-[9px] font-bold text-green-500 uppercase mt-1 flex items-center gap-1 italic">
//                 <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> {currentUser.semester} Sem Active
//               </p>
//             </div>
            
//             <button 
//               onClick={() => setShowNotifications(true)}
//               className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-amber-400 relative transition-all shadow-sm outline-none"
//             >
//               <Bell size={20} />
//               <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
//             </button>
//           </div>
//         </header>

//         {/* --- CONTENT AREA --- */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
//           <div className="max-w-6xl mx-auto p-10 w-full">
            
//             {/* {view !== "Overview" && (
//               <button 
//                 onClick={goBack}
//                 className="flex items-center gap-2 mb-8 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all italic shadow-sm"
//               >
//                 <ChevronLeft size={16} /> Back
//               </button>
//             )} */}

//             {/* --- OVERVIEW VIEW --- */}
//             {view === "Overview" && (
//               <div className="space-y-8 animate-in fade-in duration-500">
                
//                 {/* STAT CARDS */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <StatCard label="Current CGPA" value={currentUser.cgpa} icon={<GraduationCap size={22}/>} trend="Status: Good" />
//                   <StatCard label="Credits Done" value="102/136" icon={<CheckCircle2 size={22}/>} />
//                   <StatCard label="Current Semester" value="06" icon={<Database size={22}/>} trend="Batch: F21" />
//                   <StatCard label="Upcoming Meeting" value="02" icon={<ClipboardList size={22}/>} trend="Track status" color="text-orange-500" />
//                 </div>

//                 {/* DEGREE COMPLETION */}
//                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                    <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest mb-6 border-l-4 border-[#FDB813] pl-3 italic">Degree Completion</h3>
//                    <div className="space-y-6">
//                      <div className="flex justify-between items-end">
//                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">{currentUser.department}</span>
//                        <span className="text-3xl font-black text-[#1e3a5f] italic tracking-tighter">75%</span>
//                      </div>
//                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
//                        <motion.div 
//                          initial={{ width: 0 }} 
//                          animate={{ width: '75%' }} 
//                          transition={{ duration: 1.2 }}
//                          className="h-full bg-[#1e3a5f] rounded-full" 
//                        />
//                      </div>
//                    </div>
//                 </div>

//                 {/* ACTION CARDS (Updated as per request) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <ActionCard icon={<BookOpen size={24}/>} label="Recommendations" onClick={() => navigateTo("Courses")} />
//                   <ActionCard icon={<ScrollText size={24}/>} label="My Transcript" onClick={() => navigateTo("Transcript")} />
//                   <ActionCard icon={<Map size={24}/>} label="Roadmap" onClick={() => navigateTo("Roadmap")} />
//                   <ActionCard icon={<Timer size={24}/>} label="View Progress" onClick={() => navigateTo("Progress")} />
                  
//                 </div>
//               </div>
//             )}

//             {/* --- DYNAMIC MODULE VIEWS --- */}
//             <div className="w-full">
//               {view === "Studentprofile" && (
//                 <StudentProfile student={currentUser} selectedBatch={currentUser.batch} onBack={goBack} onViewTranscript={() => navigateTo("Transcript")} />
//               )}
//               {view === "Transcript" && (
//                 <StudentTranscript student={currentUser} onBack={goBack} />
//               )}
//               {view === "Advisorchat" && <AdvisorChat />}
//               {view === "Meetings" && <MeetingList />}
//               {view === "Guidelines" && <Guidelines />}
              
//               {["Roadmap", "Courses", "Requests"].includes(view) && (
//                 <div className="h-[40vh] flex flex-col items-center justify-center text-center">
//                   <Timer size={40} className="text-amber-500 animate-pulse mb-4" />
//                   <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Module Under Review</h2>
//                   <p className="text-slate-400 text-xs font-bold mt-2 uppercase">Scheduled for {currentUser.batch} Update</p>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </main>

//       <AnimatePresence>
//         {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
//       </AnimatePresence>
//     </div>
//   );
// }

// // Sub-components
// function StatCard({ icon, label, value, trend, color = "text-[#1e3a5f]" }: any) {
//   return (
//     <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-amber-400 hover:shadow-md group cursor-default">
//       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a5f] mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all">
//         {icon}
//       </div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{label}</p>
//       <div className="flex justify-between items-end">
//         <p className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</p>
//         <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">{trend}</span>
//       </div>
//     </div>
//   );
// }

// function ActionCard({ icon, label, onClick }: any) {
//   return (
//     <div 
//       onClick={onClick} 
//       className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group active:scale-95"
//     >
//       <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
//         {icon}
//       </div>
//       <p className="text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest group-hover:italic">
//         {label}
//       </p>
//     </div>
//   );
// }