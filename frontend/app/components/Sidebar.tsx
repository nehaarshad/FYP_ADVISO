"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, LayoutDashboard, ChevronRight, 
  GraduationCap, Briefcase, Info, FileText, UserCog, ShieldCheck,
  BookOpen, ClipboardList, Bell, LogOut
} from "lucide-react";

export function Sidebar({ 
  userRole = "coordinator", 
  activeTab, 
  setActiveTab, 
  showAddUserOptions, 
  setShowAddUserOptions 
}: any) {
  const router = useRouter(); 

  const handleSignOut = () => {
    router.push('/views/auth/login'); 
  };

  return (
    <aside className="w-72 bg-[#1e3a5f] text-white hidden lg:flex flex-col shadow-2xl sticky top-0 h-screen z-50">
      
      {/* 1. BRANDING LOGO */}
      <div className="p-8 mb-4">
        <img 
          src="/Lightlogo.png" 
          alt="Adviso Logo" 
          className="w-32 h-auto object-contain drop-shadow-md" 
        />
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <SidebarItem 
          icon={<LayoutDashboard size={20}/>} 
          label="Overview" 
          active={activeTab === "overview"} 
          onClick={() => setActiveTab("overview")} 
        />
        
        {/* --- COORDINATOR ONLY SECTION --- */}
        {userRole === "coordinator" && (
          <>
            <div className="py-2">
                <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Users</p>
                <button 
                  onClick={() => setShowAddUserOptions(!showAddUserOptions)} 
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${showAddUserOptions ? 'bg-white/10' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}
                >
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

            <div className="py-2">
                <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Support & Info</p>
                <SidebarItem icon={<FileText size={20}/>} label="Request Forms" active={activeTab === "requests"} onClick={() => setActiveTab("requests")} />
                <SidebarItem icon={<Info size={20}/>} label="Guidelines" active={activeTab === "guidelines"} onClick={() => setActiveTab("guidelines")} />
            </div>
          </>
        )}

        {/* --- ADVISOR ONLY SECTION --- */}
        {userRole === "advisor" && (
          <div className="py-2">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Advisory</p>
              <SidebarItem icon={<Users size={20}/>} label="My Students" active={activeTab === "my-students"} onClick={() => setActiveTab("my-students")} />
              <SidebarItem icon={<ClipboardList size={20}/>} label="Meetings" active={activeTab === "meetings"} onClick={() => setActiveTab("meetings")} />
          </div>
        )}

        {/* --- STUDENT ONLY SECTION --- */}
        {userRole === "student" && (
          <div className="py-2">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Student Portal</p>
              <SidebarItem icon={<BookOpen size={20}/>} label="My Roadmap" active={activeTab === "my-roadmap"} onClick={() => setActiveTab("my-roadmap")} />
              <SidebarItem icon={<Bell size={20}/>} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          </div>
        )}
      </nav>

      {/* 2. PROFILE SECTION (Updated to be clickable) */}
      <div className="p-4">
        <div 
          onClick={() => setActiveTab("profile")}
          className={`border rounded-[2rem] p-4 shadow-xl cursor-pointer transition-all ${
            activeTab === "profile" ? 'bg-white/10 border-white/20' : 'bg-[#1e3a5f] border-white/10 hover:bg-white/5'
          }`}
        >
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="h-10 w-10 bg-[#FDB813] rounded-full flex items-center justify-center text-[#1e3a5f] font-black shadow-lg">
                C
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate italic">Aleena Ayub</p>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Coordinator</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Sign out pe click karne se profile active nahi hogi
                handleSignOut();
              }}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white border border-white/5"
            >
              Sign Out
            </button>
        </div>
      </div>
    </aside>
  );
}

// Helper Components 
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