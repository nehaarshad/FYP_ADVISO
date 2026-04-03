"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, LayoutDashboard, ChevronRight, 
  GraduationCap, Briefcase, Route, Layers, Map, 
  Info, Database, FileSpreadsheet, FileText, UserCog, ShieldCheck,
  BookOpen, ClipboardList, Bell
} from "lucide-react";

// 1. Sidebar Component
export function Sidebar({ 
  userRole = "coordinator", 
  activeTab, 
  setActiveTab, 
  showAddUserOptions, 
  setShowAddUserOptions, 
  showRoadmapOptions, 
  setShowRoadmapOptions 
}: any) {
  const router = useRouter(); 

  const handleSignOut = () => {
    router.push('/views/auth/login'); 
  };

  return (
    <aside className="w-72 bg-[#1e3a5f] text-white hidden lg:flex flex-col shadow-2xl sticky top-0 h-screen z-50">
      
      {/* LOGO SECTION */}
      <div className="h-24 flex items-center justify-center px-8 mb-4">
        <div 
          className="h-20 w-20 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => setActiveTab("overview")}
        >
          <img src="/Lightlogo.png" alt="Adviso Logo" className="h-full w-full object-contain" />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        
        {/* --- COORDINATOR ONLY SECTION --- */}
        {userRole === "coordinator" && (
          <>
            <div className="py-2">
                <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Users</p>
                <button onClick={() => {setShowAddUserOptions(!showAddUserOptions); setShowRoadmapOptions(false);}} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${showAddUserOptions ? 'bg-white/10' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}>
                  <UserPlus size={20}/><span className="text-sm font-bold">Registration</span>
                  <ChevronRight size={14} className={`ml-auto transition-transform ${showAddUserOptions ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {showAddUserOptions && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-10 space-y-1 mt-1">
                      <SubMenuItem icon={<GraduationCap size={16}/>} label="New Student" active={activeTab === "add-student"} onClick={() => setActiveTab("add-student")} />
                      <SubMenuItem icon={<Briefcase size={16}/>} label="New Faculty" active={activeTab === "add-faculty"} onClick={() => setActiveTab("add-faculty")} />
                      <SubMenuItem icon={<Users size={16}/>} label="All Students" active={activeTab === "all-program"} onClick={() => setActiveTab("all-program")} />
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <div className="py-2">
                <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Management</p>
                <SidebarItem icon={<UserCog size={20}/>} label="Edit Student" active={activeTab === "edit-student"} onClick={() => setActiveTab("edit-student")} />
                <SidebarItem icon={<ShieldCheck size={20}/>} label="Batch Advisor" active={activeTab === "edit-advisor"} onClick={() => setActiveTab("edit-advisor")} />
            </div>
          </>
        )}

        {/* --- ADVISOR ONLY SECTION --- */}
        {userRole === "advisor" && (
          <div className="py-2">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Advisory</p>
              <SidebarItem icon={<Users size={20}/>} label="My Students" active={activeTab === "my-students"} onClick={() => setActiveTab("my-students")} />
              <SidebarItem icon={<ClipboardList size={20}/>} label="Meetings" active={activeTab === "meetings"} onClick={() => setActiveTab("meetings")} />
              <SidebarItem icon={<FileText size={20}/>} label="Pending Requests" active={activeTab === "pending-requests"} onClick={() => setActiveTab("pending-requests")} />
          </div>
        )}

        {/* --- STUDENT ONLY SECTION --- */}
        {userRole === "student" && (
          <div className="py-2">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Student Portal</p>
              <SidebarItem icon={<BookOpen size={20}/>} label="My Roadmap" active={activeTab === "my-roadmap"} onClick={() => setActiveTab("my-roadmap")} />
              <SidebarItem icon={<Bell size={20}/>} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
              <SidebarItem icon={<FileText size={20}/>} label="Submit Request" active={activeTab === "submit-request"} onClick={() => setActiveTab("submit-request")} />
          </div>
        )}

        {/* --- SHARED SECTIONS --- */}
        <div className="py-2 border-t border-white/5 pt-4">
            <button onClick={() => {setShowRoadmapOptions(!showRoadmapOptions); setShowAddUserOptions(false);}} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${showRoadmapOptions ? 'bg-white/10' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}>
              <Route size={20}/><span className="text-sm font-bold">Roadmaps</span>
              <ChevronRight size={14} className={`ml-auto transition-transform ${showRoadmapOptions ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showRoadmapOptions && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-10 space-y-1 mt-1">
                  <SubMenuItem icon={<Layers size={16}/>} label="CS Department" active={activeTab === "cs-roadmaps"} onClick={() => setActiveTab("cs-roadmaps")} />
                  <SubMenuItem icon={<Map size={16}/>} label="SE Department" active={activeTab === "se-roadmaps"} onClick={() => setActiveTab("se-roadmaps")} />
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {userRole === "coordinator" && (
          <div className="py-4 border-t border-white/5">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Academic Control</p>
              <SidebarItem icon={<Info size={20}/>} label="Guidelines" active={activeTab === "guidelines"} onClick={() => setActiveTab("guidelines")} />
              <SidebarItem icon={<Database size={20}/>} label="Session Data" active={activeTab === "session-mgmt"} onClick={() => setActiveTab("session-mgmt")} />
              <SidebarItem icon={<FileSpreadsheet size={20}/>} label="Upload Excel" active={activeTab === "upload-excel"} onClick={() => setActiveTab("upload-excel")} />
          </div>
        )}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-6">
         <div className={`p-5 rounded-[2rem] border transition-all group ${activeTab === "profile" ? 'bg-white/20 border-white/20 shadow-lg' : 'bg-gradient-to-b from-white/10 to-transparent border-white/5 hover:bg-white/5'}`}>
            <div onClick={() => setActiveTab("profile")} className="flex items-center gap-3 mb-3 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-[#FDB813] border-2 border-[#1e3a5f] flex items-center justify-center font-black text-[#1e3a5f] text-xs uppercase group-hover:scale-110 transition-transform">
                {userRole.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black italic">Aleena Ayub</p>
                <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">{userRole}</p>
              </div>
            </div>
            <button onClick={handleSignOut} className="w-full py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Sign Out</button>
         </div>
      </div>
    </aside>
  );
}

// 2. Helper Components 
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FDB813] text-[#1e3a5f] font-black shadow-xl scale-[1.02]' : 'opacity-60 hover:opacity-100 hover:bg-white/5 font-bold'}`}>
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}

function SubMenuItem({ icon, label, onClick, active }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-[11px] font-bold italic ${active ? 'text-[#FDB813] bg-white/10 opacity-100' : 'opacity-60 hover:opacity-100 hover:bg-white/10'}`}>
      {icon} <span>{label}</span>
    </div>
  );
}


