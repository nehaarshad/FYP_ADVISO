"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, FileText, Upload, 
  Search, LayoutDashboard, Clock, Filter, 
  ChevronRight, GraduationCap, Briefcase, 
  FileSpreadsheet, SearchX, Database, Calendar,
  Bell, Settings, UserMinus, ShieldCheck,
  Edit3, ExternalLink, MoreHorizontal, CheckCircle2,
  CloudUpload, ListFilter, Download, Trash2, Map, Layers
} from "lucide-react";

export default function CoordinatorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUserOptions, setShowAddUserOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [selectedSession, setSelectedSession] = useState("Fall 2025");
  const [roadmapType, setRoadmapType] = useState("Current");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setActiveTab("search-results");
      if (query.includes("49100") || query.toLowerCase().includes("valeeja")) {
        setSearchResult([{ id: "49100", name: "Valeeja Jamil", role: "Student", batch: "Fall 2022", advisor: "Ms. Shazwa" }]);
      } else if (query.toLowerCase().includes("shazwa")) {
        setSearchResult([{ id: "FA-102", name: "Ms. Shazwa", role: "Advisor", advising: "Batch 2022", status: "Active" }]);
      } else {
        setSearchResult([]);
      }
    } else {
      setSearchResult(null);
      if (query.length === 0) setActiveTab("overview");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e3a5f] text-white hidden lg:flex flex-col shadow-2xl sticky top-0 h-screen z-50">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gradient-to-tr from-[#FDB813] to-yellow-300 rounded-2xl flex items-center justify-center text-[#1e3a5f] font-black shadow-xl rotate-3">A</div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">Adviso</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          
          <div className="py-4">
             <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Management</p>
             <button onClick={() => setShowAddUserOptions(!showAddUserOptions)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${showAddUserOptions ? 'bg-white/10' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}>
                <UserPlus size={20}/>
                <span className="text-sm font-bold">Registration</span>
                <ChevronRight size={14} className={`ml-auto transition-transform ${showAddUserOptions ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showAddUserOptions && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-10 space-y-1 mt-1">
                    <SubMenuItem icon={<GraduationCap size={16}/>} label="New Student" onClick={() => setActiveTab("add-student")} />
                    <SubMenuItem icon={<Briefcase size={16}/>} label="New Faculty" onClick={() => setActiveTab("add-faculty")} />
                    <SubMenuItem icon={<Users size={16}/>} label="All Students" onClick={() => setActiveTab("all-program")} />
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          <div className="py-4 border-t border-white/5">
             <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Academic Control</p>
             <SidebarItem icon={<Map size={20}/>} label="SE Roadmaps" active={activeTab === "se-roadmaps"} onClick={() => setActiveTab("se-roadmaps")} />
             <SidebarItem icon={<Database size={20}/>} label="Session Data" active={activeTab === "session-mgmt"} onClick={() => setActiveTab("session-mgmt")} />
             <SidebarItem icon={<FileSpreadsheet size={20}/>} label="Upload Excel" active={activeTab === "upload-excel"} onClick={() => setActiveTab("upload-excel")} />
             <SidebarItem icon={<FileText size={20}/>} label="Request Forms" active={activeTab === "forms"} onClick={() => setActiveTab("forms")} />
          </div>
        </nav>

        <div className="p-6">
           <div className="bg-gradient-to-b from-white/10 to-transparent p-5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[#FDB813] border-2 border-[#1e3a5f] flex items-center justify-center font-black text-[#1e3a5f] text-xs">VJ</div>
                <div>
                  <p className="text-xs font-black italic">Valeeja Jamil</p>
                  <p className="text-[10px] opacity-50 font-bold uppercase">Admin</p>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sign Out</button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Quick Search: CMS ID, Name, or Batch..." className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-[1.5rem] font-bold text-sm focus:ring-2 focus:ring-[#FDB813] outline-none" value={searchQuery} onChange={(e) => handleGlobalSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <NavAction icon={<Bell size={20}/>} badge />
            <NavAction icon={<Settings size={20}/>} />
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* 1. OVERVIEW (FULL) */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <StatCard label="Total Students" value="1,240" icon={<Users/>} trend="+12% Since Fall" />
                   <StatCard label="Batch Advisors" value="48" icon={<ShieldCheck/>} trend="Active" />
                   <StatCard label="Requests" value="12" icon={<Clock/>} trend="Pending Approval" color="text-orange-500" />
                   <StatCard label="Graduation" value="94%" icon={<CheckCircle2/>} trend="Projected" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-[#1e3a5f] mb-6 flex items-center justify-between uppercase text-xs tracking-widest">Recent Profile Updates</h3>
                    <div className="space-y-4">
                      <ProfileUpdateItem name="Valeeja Jamil" role="Student" action="Updated CGPA" time="2 mins ago" />
                      <ProfileUpdateItem name="Ms. Shazwa" role="Advisor" action="New Batch Assigned" time="1 hour ago" />
                    </div>
                  </div>
                  <div className="bg-[#1e3a5f] p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
                    <h3 className="font-black text-xl leading-tight uppercase italic tracking-tighter">Sync New<br/>Session Content</h3>
                    <p className="text-white/50 text-[10px] font-bold my-4 uppercase tracking-widest">Update transcripts for Spring 2026.</p>
                    <button onClick={() => setActiveTab("upload-excel")} className="w-full bg-[#FDB813] text-[#1e3a5f] py-4 rounded-2xl font-black text-xs hover:scale-105 transition-transform uppercase">GO TO UPLOADER</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. REGISTRATION (FULL) */}
            {(activeTab === "add-student" || activeTab === "add-faculty") && (
              <motion.div key="registration" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl max-w-2xl mx-auto">
                <h2 className="text-2xl font-black text-[#1e3a5f] mb-8 uppercase tracking-tighter italic">Register New {activeTab === "add-student" ? "Student" : "Faculty Member"}</h2>
                <div className="space-y-6">
                  <InputGroup label="CMS ID / Official ID" placeholder="e.g. 49100" type="number" />
                  <InputGroup label="Full Name" placeholder="Enter full name" />
                  <InputGroup label="Official Email" placeholder="user@riphah.edu.pk" type="email" />
                  <button className="w-full bg-[#1e3a5f] text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all uppercase tracking-widest">CONFIRM & REGISTER USER</button>
                </div>
              </motion.div>
            )}

            {/* 3. SE ROADMAPS (NEW FEATURE MERGED) */}
            {activeTab === "se-roadmaps" && (
              <motion.div key="se-roadmaps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-[#1e3a5f] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#FDB813]">SE Roadmaps</h1>
                    <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Manage Degree Schemes</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <button onClick={() => setRoadmapType("Current")} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${roadmapType === "Current" ? 'bg-[#FDB813] text-[#1e3a5f]' : 'bg-white/10 hover:bg-white/20'}`}>Current</button>
                    <button onClick={() => setRoadmapType("Past")} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${roadmapType === "Past" ? 'bg-[#FDB813] text-[#1e3a5f]' : 'bg-white/10 hover:bg-white/20'}`}>Past</button>
                  </div>
                  <Layers className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-[#1e3a5f] text-xs uppercase tracking-widest flex items-center gap-2"><Upload size={16} className="text-[#FDB813]"/> New Roadmap</h3>
                    <div className="space-y-4">
                      <InputGroup label="Batch Range" placeholder="e.g. 2026-2030" />
                      <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                        <CloudUpload size={32} className="mx-auto text-slate-200 group-hover:text-[#FDB813] mb-2" />
                        <p className="text-[9px] font-black text-slate-400 uppercase">Drop Roadmap PDF</p>
                      </div>
                      <button className="w-full py-4 bg-[#1e3a5f] text-white rounded-2xl font-black text-xs uppercase shadow-lg">Upload Catalogue</button>
                    </div>
                  </div>
                  <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="space-y-3">
                      <RoadmapRow name="SE_Scheme_2025_Final.pdf" batch="2025-2029" date="Mar 2026" />
                      {roadmapType === "Past" && <RoadmapRow name="SE_Scheme_2022_Archived.pdf" batch="2022-2026" date="Sep 2022" isPast />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SESSION DATA (FULL) */}
            {activeTab === "session-mgmt" && (
              <motion.div key="session-mgmt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100">
                  <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Session Data Repository</h2>
                  <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl">
                    {["Fall 2025", "Spring 2026"].map(s => (
                      <button key={s} onClick={() => setSelectedSession(s)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedSession === s ? 'bg-[#1e3a5f] text-white' : 'text-slate-400'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100"><FileRow name="CS_Offerings.pdf" type="Course Offering" date="20 Mar" /></div>
                  <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100"><FileRow name="Timetable_v2.xlsx" type="Timetable" date="22 Mar" /></div>
                </div>
              </motion.div>
            )}

            {/* 5. ALL PROGRAM STUDENTS (TABLE FULL) */}
            {activeTab === "all-program" && (
              <motion.div key="program" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Academic Records</h2>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">CMS ID</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <StudentRow name="Valeeja Jamil" id="49100" batch="Fall 2022" cgpa="3.85" />
                      <StudentRow name="Ayesha Khan" id="48210" batch="Fall 2022" cgpa="3.62" />
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 6. UPLOAD EXCEL (FULL) */}
            {activeTab === "upload-excel" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                <div className="bg-white p-12 rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-6">
                  <CloudUpload size={40} className="mx-auto text-blue-200" />
                  <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Transcripts Batch Upload</h2>
                  <button className="px-12 py-5 bg-[#1e3a5f] text-white rounded-2xl font-black text-xs shadow-2xl uppercase tracking-widest">Start Sync</button>
                </div>
              </motion.div>
            )}

            {/* 7. REQUEST FORMS (FULL) */}
            {activeTab === "forms" && (
               <motion.div key="forms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-white rounded-[3rem] border border-slate-100">
                  <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic mb-6">Pending Request Forms</h2>
                  <div className="space-y-3">
                    <div className="p-6 bg-slate-50 rounded-[2rem] flex justify-between items-center border border-slate-100">
                       <div>
                          <p className="text-sm font-black text-[#1e3a5f]">Valeeja Jamil</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Character Certificate Request</p>
                       </div>
                       <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-xl uppercase">Approve</button>
                          <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-xl uppercase">Reject</button>
                       </div>
                    </div>
                  </div>
               </motion.div>
            )}

            {/* 8. SEARCH RESULTS (FULL) */}
            {activeTab === "search-results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="font-black text-[#1e3a5f] uppercase tracking-widest text-xs px-4">Search Results for "{searchQuery}"</h3>
                {searchResult?.map((user, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[#1e3a5f] italic text-2xl">{user.name[0]}</div>
                      <div>
                        <h4 className="text-lg font-black text-[#1e3a5f]">{user.name} <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md ml-2">{user.role}</span></h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CMS ID: {user.id} • {user.batch || user.advising}</p>
                      </div>
                    </div>
                    <button className="bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-black text-[10px] hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all uppercase italic">View Profile</button>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// LIBRARY COMPONENTS (FULL LIST)
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FDB813] text-[#1e3a5f] font-black shadow-xl' : 'opacity-60 hover:opacity-100 hover:bg-white/5 font-bold'}`}>
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}

function SubMenuItem({ icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer opacity-60 hover:opacity-100 text-[11px] font-bold transition-all hover:bg-white/10 italic">
      {icon} <span>{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all group hover:shadow-xl hover:shadow-slate-200/50">
      <div className="h-12 w-12 bg-slate-50 text-[#1e3a5f] rounded-2xl flex items-center justify-center group-hover:bg-[#FDB813] transition-colors mb-6">{icon}</div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-black ${color} tracking-tighter mb-2`}>{value}</h3>
      <p className="text-[10px] font-bold text-green-500 italic">{trend}</p>
    </div>
  );
}

function ProfileUpdateItem({ name, role, action, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-[#1e3a5f]">{name[0]}</div>
        <div>
          <p className="text-sm font-black text-[#1e3a5f]">{name} <span className="text-[10px] text-slate-400 font-bold ml-2">({role})</span></p>
          <p className="text-[10px] font-bold text-slate-400 italic lowercase">{action}</p>
        </div>
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase">{time}</span>
    </div>
  );
}

function StudentRow({ name, id, batch, cgpa }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-[10px] font-black">{name[0]}</div>
          <span className="text-xs font-black text-[#1e3a5f]">{name}</span>
        </div>
      </td>
      <td className="p-6 text-xs font-bold text-slate-500 tracking-widest">{id}</td>
      <td className="p-6 text-right"><button className="p-2 text-slate-300 hover:text-[#FDB813]"><Edit3 size={16}/></button></td>
    </tr>
  );
}

function FileRow({ name, type, date }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-all group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#1e3a5f] group-hover:bg-[#FDB813] transition-colors"><FileText size={18} /></div>
        <div><p className="text-xs font-black text-[#1e3a5f]">{name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{type}</p></div>
      </div>
      <div className="flex items-center gap-2"><p className="text-[9px] font-bold text-slate-300 mr-2">{date}</p><button className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-lg shadow-sm"><Trash2 size={14}/></button></div>
    </div>
  );
}

function RoadmapRow({ name, batch, date, isPast = false }: any) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${isPast ? 'bg-slate-50/50 grayscale' : 'bg-white border-slate-100 hover:border-[#FDB813]'}`}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isPast ? 'bg-slate-200 text-slate-400' : 'bg-yellow-50 text-[#FDB813]'}`}><FileText size={18} /></div>
        <div><p className="text-xs font-black text-[#1e3a5f]">{name}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{batch} • {date}</p></div>
      </div>
      <div className="flex gap-2"><button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button></div>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-[#FDB813] outline-none transition-all" />
    </div>
  );
}

function NavAction({ icon, badge = false }: any) {
  return (
    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative">
      {icon}
      {badge && <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full"></div>}
    </div>
  );
}