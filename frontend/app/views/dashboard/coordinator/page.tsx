"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Settings, Users, ShieldCheck, Clock, Mail, 
  Building, IdCard, Map, BookOpen, Calendar, GraduationCap, 
  FileSearch, ChevronLeft, Database, ArrowRight, Info
} from "lucide-react";

// Existing Components Imports
import { Sidebar } from "@/app/components/Sidebar";
import { SessionManager } from "@/app/components/SessionManager";
import { RoadmapSection } from "@/app/components/Roadmaps";
import { StudentRecords } from "@/app/components/StudentRecords";
import { Guidelines } from "@/app/components/Guidelines";
import { AddFaculty } from "@/app/components/AddFaculty";
import { AddStudent } from "@/app/components/AddStudents";
import { NotificationPanel } from "@/app/components/NotificationPanel";
import { SettingsModal } from "@/app/components/SettingsModel";
import { EditStudent } from '@/app/components/EditStudent';
import { EditAdvisor } from '@/app/components/EditAdvisor';

// NEW Components Imports
import { CourseOffering } from "@/app/components/CourseOffering";
import { Timetable } from "@/app/components/Timetable";
import { BatchResults } from "@/app/components/BatchResults";
import { CourseCatalog } from "@/app/components/CourseCatalog";
import { RoadmapView } from "@/app/components/RoadmapView";

export default function CoordinatorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSessionDetails, setShowSessionDetails] = useState(false); 
  const [navigationStack, setNavigationStack] = useState<string[]>(["overview"]);
  const [showAddUserOptions, setShowAddUserOptions] = useState(false);
  const [selectedSession, setSelectedSession] = useState("Fall 2025");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRoadmapOverlay, setShowRoadmapOverlay] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const navigateTo = (tab: string) => {
    setShowSessionDetails(false); 
    setNavigationStack(prev => [...prev, tab]);
    setActiveTab(tab);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); 
      const lastScreen = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setActiveTab(lastScreen);
    }
  };

  if (!mounted) return null;

  const BackButton = () => (
    <button 
      onClick={goBack}
      className="flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm w-fit"
    >
      <ChevronLeft size={16} /> Back
    </button>
  );

  const NavAction = ({ icon, badge, onClick }: any) => (
    <div onClick={onClick} className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative">
      {icon} {badge && <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full"></div>}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={navigateTo} 
        showAddUserOptions={showAddUserOptions} 
        setShowAddUserOptions={setShowAddUserOptions}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Quick Search..." className="w-full pl-14 pr-6 py-3 bg-slate-100/50 border-none rounded-[1.2rem] font-bold text-sm outline-none focus:ring-2 ring-[#FDB813]/20 transition-all" />
          </div>
          
          <div className="flex items-center gap-4">
            <NavAction icon={<Bell size={20}/>} badge onClick={() => setShowNotifications(true)} />
            <NavAction icon={<Settings size={20}/>} onClick={() => setShowSettings(true)} />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
            {activeTab === "overview" && (
              <div className="space-y-8">
                
                {!showSessionDetails ? (
                  <>
                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <StatCard label="Total Students" value="1,240" icon={<Users/>} trend="+12% Since Fall" />
                       <StatCard label="Batch Advisors" value="48" icon={<ShieldCheck/>} trend="Active" />
                       <StatCard label="Requests" value="--" icon={<Clock/>} trend="Coming Soon" color="text-slate-300" />
                    </div>

                    {/* FULL WIDTH SESSION DATA CARD */}
                    <div 
                      onClick={() => setShowSessionDetails(true)}
                      className="bg-[#1e3a5f] p-5 rounded-[1.5rem] shadow-lg cursor-pointer transition-all group relative overflow-hidden border-2 border-white/10 w-full"
                    >
                      <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-20 group-hover:bg-white/10 transition-colors" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="h-10 w-10 bg-[#FDB813] rounded-xl flex items-center justify-center text-[#1e3a5f] shadow-md">
                            <Database size={20} />
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5 italic">System Configuration</p>
                            <h2 className="text-lg font-black text-white uppercase italic tracking-tight">Manage Session Data</h2>
                          </div>
                        </div>
                        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-[#FDB813] group-hover:text-[#1e3a5f] group-hover:border-transparent transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>

                    {/* ACTION CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      <ActionCard icon={<Map/>} label="Roadmaps" onClick={() => navigateTo("roadmap-selector")} />
                      <ActionCard icon={<BookOpen/>} label="Course Offering" onClick={() => navigateTo("course-offering")} />
                      <ActionCard icon={<Calendar/>} label="Timetable" onClick={() => navigateTo("timetable")} />
                      <ActionCard icon={<GraduationCap/>} label="Results" onClick={() => navigateTo("results")} />
                      <ActionCard icon={<FileSearch/>} label="Course Details" onClick={() => navigateTo("course-details")} />
                    </div>
                  </>
                ) : (
                  /* SESSION VIEW (CLEAN) */
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                    <button 
                      onClick={() => setShowSessionDetails(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[#1e3a5f] font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all"
                    >
                      <ChevronLeft size={14} /> Back to Dashboard
                    </button>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px]">
                      <SessionManager selectedSession={selectedSession} setSelectedSession={setSelectedSession}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC CONTENT SWITCH */}
            {activeTab !== "overview" && (
              <div className="space-y-4">
                <BackButton />
                
                {/* Wapis saare components handle ho rahe hain */}
                {activeTab === "guidelines" && <Guidelines />}
                {activeTab === "roadmap-selector" && (
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-[#1e3a5f] mb-6 uppercase italic">Select Program Roadmap</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <SelectField label="Academic Session" options={["Fall 2025", "Spring 2025", "Fall 2024"]} />
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Degree Program</label>
                        <div className="flex gap-4">
                          <button onClick={() => navigateTo("cs-roadmaps")} className="flex-1 p-5 bg-slate-50 rounded-xl font-black text-[#1e3a5f] hover:bg-[#FDB813] transition-all uppercase tracking-widest text-[10px]">CS Dept</button>
                          <button onClick={() => navigateTo("se-roadmaps")} className="flex-1 p-5 bg-slate-50 rounded-xl font-black text-[#1e3a5f] hover:bg-[#FDB813] transition-all uppercase tracking-widest text-[10px]">SE Dept</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowRoadmapOverlay(true)} className="w-full p-5 bg-[#1e3a5f] text-white rounded-xl font-black uppercase italic tracking-widest hover:opacity-90 transition-all shadow-lg text-sm">View Current Roadmap</button>
                  </div>
                )}
                
                {activeTab === "cs-roadmaps" && <RoadmapSection type="cs"/>}
                {activeTab === "se-roadmaps" && <RoadmapSection type="se"/>}
                {activeTab === "course-offering" && <CourseOffering session={selectedSession} />}
                {activeTab === "timetable" && <Timetable session={selectedSession} />}
                {activeTab === "results" && <BatchResults />}
                {activeTab === "course-details" && <CourseCatalog />}
                {activeTab === "all-program" && <StudentRecords/>}
                {activeTab === "add-student" && <AddStudent/>}
                {activeTab === "add-faculty" && <AddFaculty/>}
                {activeTab === "edit-student" && <EditStudent/>}
                {activeTab === "edit-advisor" && <EditAdvisor/>}
                {activeTab === "profile" && <ProfileView />}
              </div>
            )}
        </div>
      </main>

      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showRoadmapOverlay && <RoadmapView onClose={() => setShowRoadmapOverlay(false)} />}
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ActionCard({ icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-[1.8rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FDB813] hover:shadow-md transition-all min-h-[140px]">
      <div className="h-12 w-12 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f]">{React.cloneElement(icon, { size: 24 })}</div>
      <p className="text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest">{label}</p>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white p-6 rounded-[1.8rem] shadow-sm border border-slate-100 group">
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FDB813] transition-colors">{React.cloneElement(icon, { size: 20 })}</div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
      <p className="text-[9px] font-bold text-green-500 italic mt-0.5">{trend}</p>
    </div>
  );
}

function SelectField({ label, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">{label}</label>
      <select className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-[#1e3a5f] outline-none text-xs">
        {options.map((opt: string) => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
      <div className="flex items-center gap-8 mb-8">
        <div className="h-20 w-20 bg-[#FDB813] rounded-2xl flex items-center justify-center text-3xl font-black text-[#1e3a5f]">AA</div>
        <div><h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Aleena Ayub</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1 italic">Coordinator Account</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-black uppercase text-slate-400 mb-1">Coordinator ID</p><p className="font-bold text-[#1e3a5f] text-sm">RIU-COORD-2026</p></div>
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-black uppercase text-slate-400 mb-1">Official Email</p><p className="font-bold text-[#1e3a5f] text-sm">aleena.ayub@riphah.edu.pk</p></div>
      </div>
    </div>
  );
}