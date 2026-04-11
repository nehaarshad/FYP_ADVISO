"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Settings, Users, ShieldCheck, Clock, 
  Map, BookOpen, Calendar, GraduationCap, 
  FileSearch, ChevronLeft, Database
} from "lucide-react";

// Components Imports
import { Sidebar } from "@/components/navbars/route";
import { SessionManager } from "@/app/components/SessionManager";
import { RoadmapSection } from "@/app/components/Roadmaps";
import { StudentRecords } from "@/app/components/StudentRecords";
import { Guidelines } from "@/components/Guidelines/Guidelines";
import { AddFaculty } from "@/app/components/AddFaculty";
import { AddStudent } from "@/app/components/AddStudents";
import { NotificationPanel } from "@/components/Notifications/NotificationPanel";
import { SettingsModal } from "@/app/components/SettingsModel";
import { EditStudent } from '@/app/components/EditStudent';
import { EditAdvisor } from '@/app/components/EditAdvisor';
import { CourseOffering } from "@/app/components/CourseOffering";
import { Timetable } from "@/app/components/Timetable";
import { BatchResults } from "@/app/components/BatchResults";
import { CourseCatalog } from "@/app/components/CourseCatalog";
import { RoadmapView } from "@/app/components/RoadmapView";
import { RequestForms} from "@/app/components/RequestForms";

// IMPORTING YOUR SEPARATE PROFILE COMPONENT
import { ProfileView } from "@/app/components/ProfileView"; 

export default function CoordinatorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [navigationStack, setNavigationStack] = useState<string[]>(["overview"]);
  const [selectedSession, setSelectedSession] = useState("Fall 2025");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRoadmapOverlay, setShowRoadmapOverlay] = useState(false);

  const navigateTo = (tab: string) => {
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

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      <Sidebar 
      userRole='coordinator'
        activeTab={activeTab} 
        setActiveTab={navigateTo} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Quick Search..." className="w-full pl-14 pr-6 py-3 bg-slate-100/50 border-none rounded-[1.2rem] font-bold text-sm outline-none focus:ring-2 ring-[#FDB813]/20 transition-all" />
          </div>
          
          <div className="flex items-center gap-4">
            <div onClick={() => setShowNotifications(true)} className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative">
              <Bell size={20}/> <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full"></div>
            </div>
            <div onClick={() => setShowSettings(true)} className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all">
              <Settings size={20}/>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
            {/* OVERVIEW SCREEN */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard label="Total Students" value="1,240" icon={<Users/>} trend="+12% Since Fall" />
                    <StatCard label="Batch Advisors" value="48" icon={<ShieldCheck/>} trend="Active" />
                    <StatCard label="Requests" value="--" icon={<Clock/>} trend="Coming Soon" color="text-slate-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ActionCard icon={<Database/>} label="Manage Session" onClick={() => navigateTo("manage-session")} />
                  <ActionCard icon={<Map/>} label="Roadmaps" onClick={() => navigateTo("roadmaps")} />
                  <ActionCard icon={<BookOpen/>} label="Course Offering" onClick={() => navigateTo("course-offering")} />
                  <ActionCard icon={<Calendar/>} label="Timetable" onClick={() => navigateTo("timetable")} />
                  <ActionCard icon={<GraduationCap/>} label="Results" onClick={() => navigateTo("results")} />
                  <ActionCard icon={<FileSearch/>} label="Course Details" onClick={() => navigateTo("course-details")} />
                </div>
              </div>
            )}

            {/* DYNAMIC COMPONENT SCREENS */}
            {activeTab !== "overview" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <button 
                  onClick={goBack}
                  className="flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm w-fit"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                
                {activeTab === "manage-session" && (
                   <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                     <SessionManager selectedSession={selectedSession} setSelectedSession={setSelectedSession}/>
                   </div>
                )}

                {activeTab === "roadmaps" && <RoadmapSection />}
                {activeTab === "course-offering" && <CourseOffering session={selectedSession} />}
                {activeTab === "timetable" && <Timetable session={selectedSession} />}
                {activeTab === "results" && <BatchResults />}
                {activeTab === "course-details" && <CourseCatalog />}
                {activeTab === "all-program" && <StudentRecords/>}
                {activeTab === "add-student" && <AddStudent/>}
                {activeTab === "add-faculty" && <AddFaculty/>}
                {activeTab === "edit-student" && <EditStudent/>}
                {activeTab === "edit-advisor" && <EditAdvisor/>}
                {activeTab === "guidelines" && <Guidelines />}
                {activeTab === "requests" && <RequestForms />}
                {/* NOW CALLING THE IMPORTED COMPONENT */}
                {activeTab === "profile" && <ProfileView />}
              </div>
            )}
        </div>
      </main>

      {/* Overlays */}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showRoadmapOverlay && <RoadmapView onClose={() => setShowRoadmapOverlay(false)} />}
    </div>
  );
}

// Helper Components
function ActionCard({ icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-[1.8rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FDB813] hover:shadow-md transition-all min-h-[140px] group">
      <div className="h-12 w-12 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] group-hover:bg-[#FDB813] transition-colors">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[10px] font-black uppercase text-[#1e3a5f] text-center tracking-widest">{label}</p>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white p-6 rounded-[1.8rem] shadow-sm border border-slate-100 group hover:border-[#FDB813] transition-all">
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FDB813] transition-colors">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
      <p className="text-[9px] font-bold text-green-500 italic mt-0.5">{trend}</p>
    </div>
  );
}