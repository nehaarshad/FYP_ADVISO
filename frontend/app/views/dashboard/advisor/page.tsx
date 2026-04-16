/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useState } from "react";
import { 
  Users, UserMinus, Clock, Bell, Search, Filter, ChevronDown, Menu 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';


// Components Imports
import { Sidebar } from "@/components/navbars/route";
import { StudentList } from "../../../../components/StudentDetails/StudentList";
import { StudentProfile } from "../../../../components/StudentDetails/StudentProfile";
import { StudentTranscript } from "../../../../components/StudentDetails/StudentTranscript";
import AdvisorChat from "../../../../components/Chat/AdvisorChat";
import { MeetingList } from "../../../../components/MeetingSchedule/MeetingList";
import Guidelines from "../../../../components/Guidelines/Guidelines";
import AdvisoryNotes from "../../../../components/AdvisorView/AdvisoryNotes";
import { NotificationPanel } from "../../../../components/Notifications/NotificationPanel";
import { AdvisoryLogs } from '../../../../components/AdvisorView/AdvisoryLogs';
import { AdvisorProfile } from "../../../../components/AdvisorView/AdvisorProfile";
import FacultyRecommendation from "../../../../components/FacultyRecommendation/FacultyRecommendation";
import CourseRecommendation from "../../../../components/CourseRecommendation/CourseRecommendation";

export default function Dashboard() {
  
    const [navigationStack, setNavigationStack] = useState<string[]>(["overview"]);
  const [isClient, setIsClient] = useState(false);
  const [view, setView] = useState<string>("overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBatch, setSelectedBatch] = useState<string>("Fall 2024");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  // --- Modal States ---
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState("");

  const navigateTo = (tab: string) => {
    const target = tab.toLowerCase().trim();
    if (target === "advisorprofile" || target === "profile") {
      setView("Advisorprofile");
    } else if (target === "facultyrecommendation") {
      setView("FacultyRecommendation");
    } else if (target === "overview") {
      setView("Overview");
      setSelectedStudent(null);
    } else {
      const normalized = tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase();
      setView(normalized);
    }
    setIsFilterOpen(false);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative">
      
      {/* SIDEBAR - Responsive Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar 
          userRole="advisor" 
          activeTab={view} 
          setActiveTab={navigateTo} 
        />
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative">
        
        {/* --- HEADER --- */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="relative w-full max-w-[200px] md:max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search student..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-amber-400/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => { setShowNotifications(true); setHasNewNotif(false); }}
              className="h-10 w-10 md:h-11 md:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 relative transition-all outline-none"
            >
              <Bell size={20} />
              {hasNewNotif && (
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <div className="max-w-6xl mx-auto p-4 md:p-10 w-full">
            
            {/* --- OVERVIEW SECTION --- */}
            {view === "Overview" && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
                {/* Stats Cards - 1 col on mobile, 3 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <StatCard icon={<Users size={22} />} label="Overall Students" value="1045" color="bg-[#1e3a5f]" />
                  <StatCard icon={<UserMinus size={22} />} label="Irregular List" value="120" color="bg-red-50" textColor="text-red-500" />
                  <StatCard icon={<Clock size={22} />} label="Meeting Reminder" value="Oct 24, 2026" color="bg-amber-50" textColor="text-amber-500" />
                </div>

                {/* Batch Selection Buttons - Scrollable on mobile */}
                <div className="pt-2">
                  <div className="flex flex-nowrap sm:flex-wrap gap-2 md:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    {["Fall 2024", "Fall 2023", "Spring 2023"].map((batch) => (
                      <button 
                        key={batch}
                        onClick={() => { setSelectedBatch(batch); setActiveTab("Total"); }}
                        className={`whitespace-nowrap px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border font-black text-[10px] md:text-[12px] uppercase transition-all outline-none ${
                          selectedBatch === batch ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {batch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student List & Filter */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">
                      BS SE: <span className="text-amber-500">{selectedBatch}</span>
                    </h3>

                    <div className="relative w-full sm:w-auto">
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between sm:justify-start gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-[#1e3a5f] hover:border-amber-400 transition-all outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <Filter size={14} className="text-amber-500" />
                          Filter: <span className="text-slate-400">{activeTab}</span>
                        </div>
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isFilterOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2"
                          >
                            {["Total", "Regular", "Irregular"].map((type) => (
                              <button 
                                key={type}
                                onClick={() => { setActiveTab(type); setIsFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-colors outline-none ${
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

                  {/* Table Wrapper for Horizontal Scroll */}
                  <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto">
                    <div className="min-w-[600px] md:min-w-full">
                      <StudentList 
                        selectedBatch={selectedBatch} 
                        activeTab={activeTab as any} 
                        onViewProfile={(s) => { setSelectedStudent(s); setView("Studentprofile"); }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- DYNAMIC RENDER LOGIC --- */}
            <div className="w-full">
              {view === "Studentprofile" && selectedStudent && (
                <StudentProfile 
                  student={selectedStudent} 
                  selectedBatch={selectedBatch} 
                  onBack={() => setView("Overview")} 
                  onViewTranscript={() => setView("Transcript")} 
                  isAdvisor={true} 
                  onNavigateToCourseRec={() => setIsSessionModalOpen(true)}
                />
              )}
              {view === "CourseRecommendation" && selectedStudent && (
                <CourseRecommendation 
                  selectedBatch={targetSession} 
                  onBack={() => setView("Studentprofile")} 
                />
              )}
              {view === "Advisorprofile" && <AdvisorProfile />}
              {/* Ensure the string matches exactly what you set in your navigation click handler */}
{view === 'FacultyRecommendation' && (
  <FacultyRecommendation onBack={() => setView('Overview')} />
)}
              {view === "Transcript" && selectedStudent && (
                <StudentTranscript student={selectedStudent} onBack={() => setView("Studentprofile")} />
              )}
              {view === 'Notes' && <AdvisoryNotes onBack={() => setView("Overview")} />}
              {view === 'Advisorchat' && (
  <AdvisorChat onBack={() => setView('Overview')} />)}
              {/* Inside your Dashboard render logic */}
{view === 'Meetings' && (
  <MeetingList onBack={() => setView("Overview")} />)}
              {view === 'Advisorylogs' && (
  <AdvisoryLogs onBack={() => setView('Overview')} />)}
              {view === "Guidelines" && <Guidelines onBack={() => setView("Overview")} />}
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {isSessionModalOpen && (
          <SessionPickerModal 
            onClose={() => setIsSessionModalOpen(false)} 
            onConfirm={(session) => {
              setTargetSession(session);
              setIsSessionModalOpen(false);
              setView("CourseRecommendation");
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}

// --- Responsive StatCard ---
function StatCard({ icon, label, value, color, textColor = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm transition-transform duration-300 hover:shadow-md">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-xl md:rounded-2xl flex items-center justify-center ${color.includes('bg-[#1e3a5f]') ? 'text-white' : (color.includes('50') ? textColor : 'text-white')} mb-4 md:mb-5`}>
        {icon}
      </div>
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl md:text-3xl font-black ${textColor}`}>{value}</p>
    </div>
  );
}

// --- Session Picker Modal (Responsive) ---
function SessionPickerModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: (s: string) => void }) {
  const sessions = ["Fall 2025", "Spring 2026", "Fall 2026"];
  const [selected, setSelected] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-slate-100"
      >
        <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase italic tracking-tighter mb-2">
          Select <span className="text-amber-500">Session</span>
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
          Choose target session for recommendation
        </p>

        <div className="space-y-3 mb-6">
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex justify-between items-center group ${
                selected === s 
                ? "border-amber-400 bg-amber-50 text-amber-600 shadow-sm shadow-amber-200/50" 
                : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-tight ${selected === s ? 'text-amber-600' : ''}`}>{s}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected === s ? 'border-amber-500 bg-amber-500' : 'border-slate-200'}`}>
                {selected === s && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 outline-none">
            Cancel
          </button>
          <button 
            disabled={!selected}
            onClick={() => onConfirm(selected)}
            className="flex-1 py-3 bg-[#1e3a5f] text-white rounded-xl text-[10px] font-black uppercase shadow-lg disabled:opacity-30 outline-none"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}