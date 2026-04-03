"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, AlertTriangle, Search, LayoutDashboard, 
  Calendar, Bell, Settings, MessageSquare, 
  TrendingUp, ArrowLeft, UserCircle, BookOpen, 
  ShieldCheck, FileText, GraduationCap, ArrowRight,
  Mail, UserCheck, CheckCircle2
} from "lucide-react";

export default function AdvisorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof iramData | null>(null);

  // Iram Ghafoor Khan ka real transcript data (from your CSV)
  const iramData = { 
    id: "560339", 
    regNum: "F22-BSCS-105", 
    batch: "Fall 2022", 
    name: "Iram Ghafoor Khan", 
    status: "Probation", 
    cgpa: "2.12",
    transcript: [
      {
        semester: "Semester 1",
        sgpa: "2.08",
        courses: [
          { name: "IICT", grade: "B", cr: "3" },
          { name: "Discrete structure", grade: "D", cr: "3" },
          { name: "Applied Physics", grade: "C", cr: "3" },
          { name: "English Composition & Comp.", grade: "A+", cr: "3" },
          { name: "Programming Fundamentals", grade: "F", cr: "0" },
          { name: "Pre calculs 1", grade: "C", cr: "3" }
        ]
      },
      {
        semester: "Semester 2",
        sgpa: "1.61",
        courses: [
          { name: "Software Engineering", grade: "D", cr: "3" },
          { name: "Calculus & Analytical Geometry", grade: "C", cr: "3" },
          { name: "Presentation & Communication Skills", grade: "B", cr: "3" },
          { name: "Graphics and Animation", grade: "C", cr: "3" },
          { name: "Pakistan Studies", grade: "A", cr: "2" }
        ]
      },
      {
        semester: "Semester 3",
        sgpa: "0.9",
        courses: [
          { name: "Software Requirements Engineering", grade: "D", cr: "3" },
          { name: "Graphic Designing", grade: "C", cr: "3" },
          { name: "Introduction to Psychology", grade: "F", cr: "0" },
          { name: "Linear Algebra", grade: "F", cr: "0" },
          { name: "Islamic Studies", grade: "B", cr: "2" }
        ]
      },
      {
        semester: "Semester 4",
        sgpa: "1.31",
        courses: [
          { name: "Programming Fundamentals (Repeat)", grade: "D", cr: "4" },
          { name: "Pre calculus 2", grade: "F", cr: "0" },
          { name: "Human Computer Interaction", grade: "D", cr: "3" },
          { name: "Quranic Teachings", grade: "B", cr: "2" },
          { name: "Probability & Statistics", grade: "C", cr: "3" }
        ]
      },
      {
        semester: "Semester 5",
        sgpa: "1.05",
        courses: [
          { name: "OOPs", grade: "D", cr: "4" },
          { name: "Software Construction & Dev", grade: "D", cr: "3" },
          { name: "Linear algebra", grade: "W", cr: "0" },
          { name: "Machine Learning", grade: "F", cr: "0" }
        ]
      }
    ],
    roadmap: [
      { name: "Programming Fundamentals", status: "Completed (D)", priority: "Low" },
      { name: "Linear Algebra", status: "Must Repeat", priority: "Critical" },
      { name: "Pre-Calculus 2", status: "Must Repeat", priority: "Critical" },
      { name: "Data Structures", status: "Eligible", priority: "High" },
      { name: "Operating Systems", status: "Locked (Prereq)", priority: "Medium" }
    ]
  };

  const studentDatabase = [iramData];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e3a5f] text-white hidden lg:flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-[#FDB813] rounded-2xl flex items-center justify-center text-[#1e3a5f] font-black shadow-lg rotate-3">A</div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">Adviso</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === "overview"} onClick={() => {setActiveTab("overview"); setSelectedStudent(null);}} />
          <SidebarItem icon={<Users size={20}/>} label="Assigned Batch" active={activeTab === "assigned-batch"} onClick={() => {setActiveTab("assigned-batch"); setSelectedStudent(null);}} />
          <SidebarItem icon={<AlertTriangle size={20}/>} label="Risk Analysis" active={activeTab === "risk"} onClick={() => {setActiveTab("risk"); setSelectedStudent(null);}} />
        </nav>

        <div className="p-6">
           <div className="bg-white/10 p-5 rounded-[2rem] border border-white/5">
              <p className="text-[10px] font-black uppercase text-[#FDB813] mb-1">Advisor</p>
              <p className="text-xs font-black italic text-white uppercase">Valeeja Jamil</p>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Student (e.g. Iram)..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 focus:ring-[#FDB813]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NavAction icon={<Bell size={20}/>} badge />
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* 1. PROFILE VIEW */}
            {selectedStudent ? (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest italic">
                  <ArrowLeft size={16}/> Back to Dashboard
                </button>

                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Left Bio Card */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-center">
                      <div className="h-24 w-24 bg-slate-50 rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-[#1e3a5f]">
                        <UserCircle size={60} strokeWidth={1}/>
                      </div>
                      <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">{selectedStudent.name}</h2>
                      <p className="text-[10px] font-black text-[#FDB813] mt-2 tracking-widest">ID: {selectedStudent.id}</p>
                      
                      <div className="mt-8 pt-6 border-t border-slate-50 space-y-4 text-left">
                        <ProfileMeta label="Reg No" value={selectedStudent.regNum} />
                        <ProfileMeta label="Batch" value={selectedStudent.batch} />
                        <ProfileMeta label="Status" value={selectedStudent.status} color="text-red-500" />
                      </div>
                    </div>

                    <div className="bg-[#1e3a5f] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase text-[#FDB813] tracking-widest mb-1">Cumulative CGPA</p>
                      <h3 className="text-5xl font-black italic">{selectedStudent.cgpa}</h3>
                      <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                    </div>
                  </div>

                  {/* Right Content: Transcript & Roadmap */}
                  <div className="lg:col-span-3 space-y-8">
                    
                    {/* ROADMAP SECTION */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-3 mb-8">
                          <GraduationCap className="text-[#FDB813]" size={22}/>
                          <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Audit Roadmap Progress</h3>
                       </div>
                       <div className="grid md:grid-cols-2 gap-4">
                          {selectedStudent.roadmap.map((item: typeof iramData['roadmap'][0], i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-[#FDB813] transition-all">
                               <div>
                                  <p className="text-[11px] font-black text-slate-600 uppercase italic leading-none mb-1">{item.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</p>
                               </div>
                               {item.priority === 'Critical' ? <AlertTriangle size={16} className="text-red-500 animate-pulse"/> : <CheckCircle2 size={16} className="text-green-500"/>}
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* TRANSCRIPT SECTION (Real Excel Data) */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                        <FileText className="text-[#FDB813]" size={20}/>
                        <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Academic Result History</h3>
                      </div>
                      
                      <div className="p-8 space-y-12">
                        {selectedStudent.transcript.map((sem: typeof iramData['transcript'][0], idx: number) => (
                          <div key={idx} className="space-y-4">
                            <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
                              <span className="font-black text-[#1e3a5f] text-lg italic uppercase">{sem.semester}</span>
                              <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">SGPA</p>
                                <p className="text-2xl font-black text-[#FDB813] leading-none">{sem.sgpa}</p>
                              </div>
                            </div>
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                  <th className="py-3">Course Title</th>
                                  <th className="py-3 text-center">Cr. Hrs</th>
                                  <th className="py-3 text-right pr-4">Grade</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {sem.courses.map((course: typeof iramData['transcript'][0]['courses'][0], cIdx: number) => (
                                  <tr key={cIdx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 text-xs font-bold text-slate-600 uppercase italic">{course.name}</td>
                                    <td className="py-4 text-xs font-black text-slate-400 text-center">{course.cr}</td>
                                    <td className="py-4 text-right pr-4">
                                      <span className={`px-3 py-1 rounded-lg font-black text-[11px] ${course.grade === 'F' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-[#1e3a5f]'}`}>
                                        {course.grade}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* 2. MAIN DASHBOARD CONTENT (When no student selected) */
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Total Assigned" value="450" icon={<Users/>} />
                  <StatCard label="At Risk (Low CGPA)" value="12" icon={<AlertTriangle/>} color="text-red-500" />
                  <StatCard label="Pending Tasks" value="05" icon={<MessageSquare/>} />
                </div>

                {/* Switchable Lists based on Sidebar Tabs */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Recently Accessed Profiles</h3>
                    <div className="grid gap-4">
                      {studentDatabase.map((student, i) => (
                        <StudentCard key={i} student={student} onClick={() => setSelectedStudent(student)} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "assigned-batch" && (
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
                    <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest mb-6">Fall 2022 Batch List</h3>
                    <div className="space-y-4">
                       <StudentCard student={iramData} onClick={() => setSelectedStudent(iramData)} />
                       <div className="p-6 bg-slate-50 rounded-2xl text-center text-[10px] font-bold text-slate-400 uppercase">Load more students...</div>
                    </div>
                  </div>
                )}

                {activeTab === "risk" && (
                  <div className="space-y-6">
                    <h3 className="font-black text-red-500 text-xs uppercase italic tracking-widest">Critical Intervention Required</h3>
                    <div className="grid gap-4">
                      <StudentCard student={iramData} onClick={() => setSelectedStudent(iramData)} risk />
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// SHARED MINI-COMPONENTS
function StudentCard({ student, onClick, risk = false }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[2.5rem] border flex items-center justify-between group cursor-pointer transition-all hover:shadow-xl ${risk ? 'border-red-100 hover:border-red-500' : 'border-slate-100 hover:border-[#FDB813]'}`}
    >
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[#1e3a5f] italic text-xl group-hover:bg-[#FDB813]">
          {student.name[0]}
        </div>
        <div>
          <h4 className="font-black text-[#1e3a5f] uppercase italic">{student.name}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {student.id} • CGPA: {student.cgpa}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic ${student.status === 'Probation' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
          {student.status}
        </span>
        <ArrowRight className="text-slate-200 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" size={20}/>
      </div>
    </div>
  );
}

function ProfileMeta({ label, value, color = "text-slate-600" }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
      <span className={`text-[11px] font-black italic uppercase ${color}`}>{value}</span>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FDB813] text-[#1e3a5f] font-black shadow-xl shadow-[#FDB813]/20' : 'opacity-60 hover:opacity-100 hover:bg-white/5 font-bold'}`}>
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="h-10 w-10 bg-slate-50 text-[#1e3a5f] rounded-xl flex items-center justify-center mb-4">{icon}</div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-black ${color} tracking-tighter`}>{value}</h3>
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


