"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, Users, ShieldCheck, Clock, Mail, Building, IdCard } from "lucide-react";

// Components Imports
import { Sidebar } from "@/components/coordinator/Sidebar";
import { SessionManager } from "@/components/coordinator/SessionManager";
import { RoadmapSection } from "@/components/coordinator/Roadmaps";
import { StudentRecords } from "@/components/coordinator/StudentRecords";
import { Guidelines } from "@/components/coordinator/Guidelines";
import { ExcelUploader } from "@/components/coordinator/ExcelUploader";
import { AddFaculty } from "@/components/coordinator/AddFaculty";
import { AddStudent } from "@/components/coordinator/AddStudents";
import { NotificationPanel } from "@/components/coordinator/NotificationPanel";
import { SettingsModal } from "@/components/coordinator/SettingsModel";

export default function CoordinatorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUserOptions, setShowAddUserOptions] = useState(false);
  const [showRoadmapOptions, setShowRoadmapOptions] = useState(false);
  const [selectedSession, setSelectedSession] = useState("Fall 2025");
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showAddUserOptions={showAddUserOptions} 
        setShowAddUserOptions={setShowAddUserOptions}
        showRoadmapOptions={showRoadmapOptions} 
        setShowRoadmapOptions={setShowRoadmapOptions}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick Search..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 ring-[#FDB813]/20 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <NavAction icon={<Bell size={20}/>} badge onClick={() => setShowNotifications(true)} />
            <NavAction icon={<Settings size={20}/>} onClick={() => setShowSettings(true)} />
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <StatCard label="Total Students" value="1,240" icon={<Users/>} trend="+12% Since Fall" />
                   <StatCard label="Batch Advisors" value="48" icon={<ShieldCheck/>} trend="Active" />
                   <StatCard label="Requests" value="12" icon={<Clock/>} trend="Pending Approval" color="text-orange-500" />
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {/* UPDATED: Full width activity container */}
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-[#1e3a5f] mb-6 uppercase text-xs tracking-widest">Recent Activity</h3>
                    <div className="space-y-4">
                      <ProfileUpdateItem name="Valeeja Jamil" role="Student" action="Updated Profile" time="Now" />
                      <ProfileUpdateItem name="Dr. Arshad" role="Advisor" action="Uploaded Roadmap" time="1h ago" />
                    </div>
                  </div>
                  
                  {/* BLUE BOX REMOVED FROM HERE */}
                </div>
              </motion.div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center gap-8 mb-10">
                    <div className="h-24 w-24 bg-[#FDB813] rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-[#1e3a5f] shadow-lg">AA</div>
                    <div>
                      <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic leading-none">Aleena Ayub</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic">Coordinator Account</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileDetail icon={<IdCard size={18}/>} label="Coordinator ID" value="RIU-COORD-2026" />
                    <ProfileDetail icon={<Mail size={18}/>} label="Official Email" value="aleena.ayub@riphah.edu.pk" />
                    <ProfileDetail icon={<Building size={18}/>} label="Department" value="Computing & SE" />
                    <ProfileDetail icon={<ShieldCheck size={18}/>} label="Access Level" value="Full System Administrative" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. DYNAMIC COMPONENTS */}
            {activeTab === "session-mgmt" && <SessionManager selectedSession={selectedSession} setSelectedSession={setSelectedSession} />}
            {activeTab === "cs-roadmaps" && <RoadmapSection type="cs" />}
            {activeTab === "se-roadmaps" && <RoadmapSection type="se" />}
            {activeTab === "guidelines" && <Guidelines />}
            {activeTab === "all-program" && <StudentRecords />}
            {activeTab === "upload-excel" && <ExcelUploader />}
            {activeTab === "add-faculty" && <AddFaculty />}
            {activeTab === "add-student" && <AddStudent />}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ProfileDetail({ icon, label, value }: any) {
  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1e3a5f]">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{label}</p>
        <p className="font-bold text-[#1e3a5f]">{value}</p>
      </div>
    </div>
  );
}

function NavAction({ icon, badge, onClick }: any) {
  return (
    <div onClick={onClick} className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative group">
      {icon}
      {badge && <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full group-hover:scale-125 transition-transform"></div>}
    </div>
  );
}

function StatCard({ label, value, icon, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FDB813] transition-colors">{icon}</div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
      <p className="text-[10px] font-bold text-green-500 italic mt-1">{trend}</p>
    </div>
  );
}

function ProfileUpdateItem({ name, role, action, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-[#1e3a5f]/5 rounded-full flex items-center justify-center text-[10px] font-black text-[#1e3a5f]">{name[0]}</div>
        <div>
          <p className="text-sm font-black text-[#1e3a5f]">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{action}</p>
        </div>
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
    </div>
  );
}