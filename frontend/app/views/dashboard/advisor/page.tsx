
"use client";
import React, { useState } from "react";
import { 
  Users, UserCheck, UserMinus, Clock, ArrowLeft, 
  StickyNote, Bell, Search, Settings 
} from "lucide-react"; 
import { AnimatePresence, motion } from "framer-motion"; 

// Components Imports
import { Sidebar } from "../../../../components/navbars/route";
import { StatCard } from "../../../components/StatCard";
import { StudentList } from "../../../components/StudentList";
import { StudentProfile } from "../../../components/StudentProfile";
import { StudentTranscript } from "../../../components/StudentTranscript";
import AdvisorChat from "../../../components/AdvisorChat";
import { MeetingList } from '../../../components/MeetingList';
import { AdvisorNotes } from '../../../components/AdvisorNotes';
import { NotificationPanel } from "../../../components/NotificationPanel";
import { AdvisoryLogs } from '../../../components/AdvisoryLogs';
type StudentStatus = "Total" | "Regular" | "Irregular";


export default function Dashboard() {
  const goBack = () => {
  if (navigationStack.length > 1) {
    const newStack = [...navigationStack];
    newStack.pop();
    const last = newStack[newStack.length - 1];
    setNavigationStack(newStack);
    setActiveTab(last);
    setView(last as any);
  }
};
const navigateTo = (tab: string) => {
  setNavigationStack(prev => [...prev, tab]);
  setActiveTab(tab);
  setView(tab as any); // important for switching views
};
  
    const [navigationStack, setNavigationStack] = useState<string[]>(["overview"]);

  const [view, setView] = useState<string>("overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBatch, setSelectedBatch] = useState<string>("Fall 2024");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // --- Coordinator Style Notification States ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);

  const pastBatches = ["Fall 2023", "Spring 2022"];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      
      <Sidebar 
            userRole='advisor'
              activeTab={activeTab} 
              setActiveTab={navigateTo} 
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