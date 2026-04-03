// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Users, AlertTriangle, Search, LayoutDashboard, 
//   Calendar, Bell, Settings, MessageSquare, 
//   TrendingUp, ArrowLeft, UserCircle, BookOpen, 
//   ShieldCheck, FileText, GraduationCap, ArrowRight,
//   Mail, UserCheck, CheckCircle2
// } from "lucide-react";

// export default function AdvisorDashboard() {
//   const [mounted, setMounted] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<typeof iramData | null>(null);

//   // Iram Ghafoor Khan ka real transcript data (from your CSV)
//   const iramData = { 
//     id: "560339", 
//     regNum: "F22-BSCS-105", 
//     batch: "Fall 2022", 
//     name: "Iram Ghafoor Khan", 
//     status: "Probation", 
//     cgpa: "2.12",
//     transcript: [
//       {
//         semester: "Semester 1",
//         sgpa: "2.08",
//         courses: [
//           { name: "IICT", grade: "B", cr: "3" },
//           { name: "Discrete structure", grade: "D", cr: "3" },
//           { name: "Applied Physics", grade: "C", cr: "3" },
//           { name: "English Composition & Comp.", grade: "A+", cr: "3" },
//           { name: "Programming Fundamentals", grade: "F", cr: "0" },
//           { name: "Pre calculs 1", grade: "C", cr: "3" }
//         ]
//       },
//       {
//         semester: "Semester 2",
//         sgpa: "1.61",
//         courses: [
//           { name: "Software Engineering", grade: "D", cr: "3" },
//           { name: "Calculus & Analytical Geometry", grade: "C", cr: "3" },
//           { name: "Presentation & Communication Skills", grade: "B", cr: "3" },
//           { name: "Graphics and Animation", grade: "C", cr: "3" },
//           { name: "Pakistan Studies", grade: "A", cr: "2" }
//         ]
//       },
//       {
//         semester: "Semester 3",
//         sgpa: "0.9",
//         courses: [
//           { name: "Software Requirements Engineering", grade: "D", cr: "3" },
//           { name: "Graphic Designing", grade: "C", cr: "3" },
//           { name: "Introduction to Psychology", grade: "F", cr: "0" },
//           { name: "Linear Algebra", grade: "F", cr: "0" },
//           { name: "Islamic Studies", grade: "B", cr: "2" }
//         ]
//       },
//       {
//         semester: "Semester 4",
//         sgpa: "1.31",
//         courses: [
//           { name: "Programming Fundamentals (Repeat)", grade: "D", cr: "4" },
//           { name: "Pre calculus 2", grade: "F", cr: "0" },
//           { name: "Human Computer Interaction", grade: "D", cr: "3" },
//           { name: "Quranic Teachings", grade: "B", cr: "2" },
//           { name: "Probability & Statistics", grade: "C", cr: "3" }
//         ]
//       },
//       {
//         semester: "Semester 5",
//         sgpa: "1.05",
//         courses: [
//           { name: "OOPs", grade: "D", cr: "4" },
//           { name: "Software Construction & Dev", grade: "D", cr: "3" },
//           { name: "Linear algebra", grade: "W", cr: "0" },
//           { name: "Machine Learning", grade: "F", cr: "0" }
//         ]
//       }
//     ],
//     roadmap: [
//       { name: "Programming Fundamentals", status: "Completed (D)", priority: "Low" },
//       { name: "Linear Algebra", status: "Must Repeat", priority: "Critical" },
//       { name: "Pre-Calculus 2", status: "Must Repeat", priority: "Critical" },
//       { name: "Data Structures", status: "Eligible", priority: "High" },
//       { name: "Operating Systems", status: "Locked (Prereq)", priority: "Medium" }
//     ]
//   };

//   const studentDatabase = [iramData];

//   return (
//     <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
//       {/* SIDEBAR */}
//       <aside className="w-72 bg-[#1e3a5f] text-white hidden lg:flex flex-col sticky top-0 h-screen z-50">
//         <div className="p-8">
//           <div className="flex items-center gap-3">
//             <div className="h-11 w-11 bg-[#FDB813] rounded-2xl flex items-center justify-center text-[#1e3a5f] font-black shadow-lg rotate-3">A</div>
//             <span className="font-black text-2xl tracking-tighter uppercase italic">Adviso</span>
//           </div>
//         </div>
        
//         <nav className="flex-1 px-4 space-y-1">
//           <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === "overview"} onClick={() => {setActiveTab("overview"); setSelectedStudent(null);}} />
//           <SidebarItem icon={<Users size={20}/>} label="Assigned Batch" active={activeTab === "assigned-batch"} onClick={() => {setActiveTab("assigned-batch"); setSelectedStudent(null);}} />
//           <SidebarItem icon={<AlertTriangle size={20}/>} label="Risk Analysis" active={activeTab === "risk"} onClick={() => {setActiveTab("risk"); setSelectedStudent(null);}} />
//         </nav>

//         <div className="p-6">
//            <div className="bg-white/10 p-5 rounded-[2rem] border border-white/5">
//               <p className="text-[10px] font-black uppercase text-[#FDB813] mb-1">Advisor</p>
//               <p className="text-xs font-black italic text-white uppercase">Valeeja Jamil</p>
//            </div>
//         </div>
//       </aside>

//       <main className="flex-1 flex flex-col min-w-0">
//         <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
//           <div className="relative w-full max-w-xl">
//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search Student (e.g. Iram)..." 
//               className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 focus:ring-[#FDB813]" 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <NavAction icon={<Bell size={20}/>} badge />
//         </header>

//         <div className="p-10 max-w-7xl mx-auto w-full">
//           <AnimatePresence mode="wait">
            
//             {/* 1. PROFILE VIEW */}
//             {selectedStudent ? (
//               <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
//                 <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest italic">
//                   <ArrowLeft size={16}/> Back to Dashboard
//                 </button>

//                 <div className="grid lg:grid-cols-4 gap-8">
//                   {/* Left Bio Card */}
//                   <div className="lg:col-span-1 space-y-6">
//                     <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-center">
//                       <div className="h-24 w-24 bg-slate-50 rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-[#1e3a5f]">
//                         <UserCircle size={60} strokeWidth={1}/>
//                       </div>
//                       <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">{selectedStudent.name}</h2>
//                       <p className="text-[10px] font-black text-[#FDB813] mt-2 tracking-widest">ID: {selectedStudent.id}</p>
                      
//                       <div className="mt-8 pt-6 border-t border-slate-50 space-y-4 text-left">
//                         <ProfileMeta label="Reg No" value={selectedStudent.regNum} />
//                         <ProfileMeta label="Batch" value={selectedStudent.batch} />
//                         <ProfileMeta label="Status" value={selectedStudent.status} color="text-red-500" />
//                       </div>
//                     </div>

//                     <div className="bg-[#1e3a5f] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
//                       <p className="text-[10px] font-black uppercase text-[#FDB813] tracking-widest mb-1">Cumulative CGPA</p>
//                       <h3 className="text-5xl font-black italic">{selectedStudent.cgpa}</h3>
//                       <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
//                     </div>
//                   </div>

//                   {/* Right Content: Transcript & Roadmap */}
//                   <div className="lg:col-span-3 space-y-8">
                    
//                     {/* ROADMAP SECTION */}
//                     <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
//                        <div className="flex items-center gap-3 mb-8">
//                           <GraduationCap className="text-[#FDB813]" size={22}/>
//                           <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Audit Roadmap Progress</h3>
//                        </div>
//                        <div className="grid md:grid-cols-2 gap-4">
//                           {selectedStudent.roadmap.map((item: typeof iramData['roadmap'][0], i: number) => (
//                             <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-[#FDB813] transition-all">
//                                <div>
//                                   <p className="text-[11px] font-black text-slate-600 uppercase italic leading-none mb-1">{item.name}</p>
//                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</p>
//                                </div>
//                                {item.priority === 'Critical' ? <AlertTriangle size={16} className="text-red-500 animate-pulse"/> : <CheckCircle2 size={16} className="text-green-500"/>}
//                             </div>
//                           ))}
//                        </div>
//                     </div>

//                     {/* TRANSCRIPT SECTION (Real Excel Data) */}
//                     <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
//                       <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
//                         <FileText className="text-[#FDB813]" size={20}/>
//                         <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Academic Result History</h3>
//                       </div>
                      
//                       <div className="p-8 space-y-12">
//                         {selectedStudent.transcript.map((sem: typeof iramData['transcript'][0], idx: number) => (
//                           <div key={idx} className="space-y-4">
//                             <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
//                               <span className="font-black text-[#1e3a5f] text-lg italic uppercase">{sem.semester}</span>
//                               <div className="text-right">
//                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">SGPA</p>
//                                 <p className="text-2xl font-black text-[#FDB813] leading-none">{sem.sgpa}</p>
//                               </div>
//                             </div>
//                             <table className="w-full text-left">
//                               <thead>
//                                 <tr className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                                   <th className="py-3">Course Title</th>
//                                   <th className="py-3 text-center">Cr. Hrs</th>
//                                   <th className="py-3 text-right pr-4">Grade</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-slate-50">
//                                 {sem.courses.map((course: typeof iramData['transcript'][0]['courses'][0], cIdx: number) => (
//                                   <tr key={cIdx} className="hover:bg-slate-50/50 transition-colors">
//                                     <td className="py-4 text-xs font-bold text-slate-600 uppercase italic">{course.name}</td>
//                                     <td className="py-4 text-xs font-black text-slate-400 text-center">{course.cr}</td>
//                                     <td className="py-4 text-right pr-4">
//                                       <span className={`px-3 py-1 rounded-lg font-black text-[11px] ${course.grade === 'F' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-[#1e3a5f]'}`}>
//                                         {course.grade}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ) : (
//               /* 2. MAIN DASHBOARD CONTENT (When no student selected) */
//               <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                
//                 {/* Stats Section */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <StatCard label="Total Assigned" value="450" icon={<Users/>} />
//                   <StatCard label="At Risk (Low CGPA)" value="12" icon={<AlertTriangle/>} color="text-red-500" />
//                   <StatCard label="Pending Tasks" value="05" icon={<MessageSquare/>} />
//                 </div>

//                 {/* Switchable Lists based on Sidebar Tabs */}
//                 {activeTab === "overview" && (
//                   <div className="space-y-6">
//                     <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest">Recently Accessed Profiles</h3>
//                     <div className="grid gap-4">
//                       {studentDatabase.map((student, i) => (
//                         <StudentCard key={i} student={student} onClick={() => setSelectedStudent(student)} />
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "assigned-batch" && (
//                   <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
//                     <h3 className="font-black text-[#1e3a5f] text-xs uppercase italic tracking-widest mb-6">Fall 2022 Batch List</h3>
//                     <div className="space-y-4">
//                        <StudentCard student={iramData} onClick={() => setSelectedStudent(iramData)} />
//                        <div className="p-6 bg-slate-50 rounded-2xl text-center text-[10px] font-bold text-slate-400 uppercase">Load more students...</div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "risk" && (
//                   <div className="space-y-6">
//                     <h3 className="font-black text-red-500 text-xs uppercase italic tracking-widest">Critical Intervention Required</h3>
//                     <div className="grid gap-4">
//                       <StudentCard student={iramData} onClick={() => setSelectedStudent(iramData)} risk />
//                     </div>
//                   </div>
//                 )}

//               </motion.div>
//             )}

//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }

// // SHARED MINI-COMPONENTS
// function StudentCard({ student, onClick, risk = false }: any) {
//   return (
//     <div 
//       onClick={onClick}
//       className={`bg-white p-6 rounded-[2.5rem] border flex items-center justify-between group cursor-pointer transition-all hover:shadow-xl ${risk ? 'border-red-100 hover:border-red-500' : 'border-slate-100 hover:border-[#FDB813]'}`}
//     >
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[#1e3a5f] italic text-xl group-hover:bg-[#FDB813]">
//           {student.name[0]}
//         </div>
//         <div>
//           <h4 className="font-black text-[#1e3a5f] uppercase italic">{student.name}</h4>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {student.id} • CGPA: {student.cgpa}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic ${student.status === 'Probation' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
//           {student.status}
//         </span>
//         <ArrowRight className="text-slate-200 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" size={20}/>
//       </div>
//     </div>
//   );
// }

// function ProfileMeta({ label, value, color = "text-slate-600" }: any) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
//       <span className={`text-[11px] font-black italic uppercase ${color}`}>{value}</span>
//     </div>
//   );
// }

// function SidebarItem({ icon, label, active, onClick }: any) {
//   return (
//     <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FDB813] text-[#1e3a5f] font-black shadow-xl shadow-[#FDB813]/20' : 'opacity-60 hover:opacity-100 hover:bg-white/5 font-bold'}`}>
//       {icon} <span className="text-sm tracking-tight">{label}</span>
//     </div>
//   );
// }

// function StatCard({ label, value, icon, color = "text-[#1e3a5f]" }: any) {
//   return (
//     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//       <div className="h-10 w-10 bg-slate-50 text-[#1e3a5f] rounded-xl flex items-center justify-center mb-4">{icon}</div>
//       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
//       <h3 className={`text-3xl font-black ${color} tracking-tighter`}>{value}</h3>
//     </div>
//   );
// }

// function NavAction({ icon, badge = false }: any) {
//   return (
//     <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative">
//       {icon}
//       {badge && <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full"></div>}
//     </div>
//   );
// }

//Final Code
"use client";
import React, { useState } from 'react';
import { 
  Users, Search, Bell, LayoutDashboard, 
  Bookmark, Clock, ArrowLeft, ChevronRight,
  UserCheck, UserMinus, Calendar, MapPin,
  Mail, Phone, GraduationCap, BookOpen, AlertCircle,
  CheckCircle2, Circle,FileText, X, User // Added missing imports
} from 'lucide-react';

// 1. Types Definition
type ViewState = 'Overview' | 'AssignedBatch' | 'BatchDetails' | 'StudentProfile' | 'Transcript';
type StudentStatus = 'Total' | 'Regular' | 'Irregular' | 'Meetings';
type AcademicStatus = 'Graduated' | 'Ungraduated' | 'Suspended' | 'Pending Fees' | 'Freeze';

interface SemesterData {
  semester: string;
  sgpa: string;
  courses: { name: string; grade: string; cr: string }[];
}

interface Student {
  id: string;
  name: string;
  status: 'Regular' | 'Irregular';
  academicStatus: AcademicStatus;
  code: string;
  email?: string;
  phone?: string;
  cgpa?: string;
  semester?: string;
  transcript?: SemesterData[]; // Transcript data support
}

const Dashboard: React.FC = () => {
  // 2. States
  const [view, setView] = useState<ViewState>('Overview');
  const [activeTab, setActiveTab] = useState<StudentStatus>('Total');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 3. Data: Students
const mainStudents: Student[] = [
  { 
    id: '1', 
    name: 'Valeeja Jamil', 
    status: 'Regular', 
    academicStatus: 'Ungraduated', 
    code: '48291', 
    email: 'valeeja@example.com', 
    phone: '+92 300 1234567', 
    cgpa: '3.8', 
    semester: '7th',
    transcript: [
      {
        semester: "Semester 1", sgpa: "3.85",
        courses: [
          { name: "IICT", grade: "A", cr: "3" },
          { name: "Discrete structure", grade: "A-", cr: "3" },
          { name: "Applied Physics", grade: "B+", cr: "3" },
          { name: "English Composition & Comp.", grade: "A+", cr: "3" },
          { name: "Programming Fundamentals", grade: "A", cr: "4" },
          { name: "Pre calculs 1", grade: "A", cr: "3" }
        ]
      },
      {
        semester: "Semester 2", sgpa: "3.75",
        courses: [
          { name: "Software Engineering", grade: "A", cr: "3" },
          { name: "Calculus & Analytical Geometry", grade: "B+", cr: "3" },
          { name: "Presentation & Communication Skills", grade: "A", cr: "3" },
          { name: "Graphics and Animation", grade: "A-", cr: "3" },
          { name: "Pakistan Studies", grade: "A", cr: "2" }
        ]
      },
      {
        semester: "Semester 3", sgpa: "3.90",
        courses: [
          { name: "Software Requirements Engineering", grade: "A", cr: "3" },
          { name: "Graphic Designing", grade: "A", cr: "3" },
          { name: "Introduction to Psychology", grade: "A", cr: "3" },
          { name: "Linear Algebra", grade: "A-", cr: "3" },
          { name: "Islamic Studies", grade: "A", cr: "2" }
        ]
      },
      {
        semester: "Semester 4", sgpa: "3.80",
        courses: [
          { name: "Data Structures", grade: "A", cr: "4" },
          { name: "Pre calculus 2", grade: "A-", cr: "3" },
          { name: "Human Computer Interaction", grade: "A", cr: "3" },
          { name: "Quranic Teachings", grade: "A", cr: "2" },
          { name: "Probability & Statistics", grade: "B+", cr: "3" }
        ]
      },
      {
        semester: "Semester 5", sgpa: "3.70",
        courses: [
          { name: "OOPs", grade: "A", cr: "4" },
          { name: "Software Construction & Dev", grade: "A-", cr: "3" },
          { name: "Technical Writing", grade: "A", cr: "3" },
          { name: "Machine Learning", grade: "B", cr: "3" }
        ]
      }
    ]
  },
  { id: '2', name: 'Ahmed Ali', status: 'Irregular', academicStatus: 'Ungraduated', code: '10293', cgpa: '2.4', transcript: [] },
  { id: '3', name: 'Sara Khan', status: 'Regular', academicStatus: 'Ungraduated', code: '55821', cgpa: '3.2', transcript: [] },
  { id: '4', name: 'Zainab Bibi', status: 'Regular', academicStatus: 'Ungraduated', code: '39402', cgpa: '3.9', transcript: [] },
  { id: '5', name: 'Hamza Sheikh', status: 'Regular', academicStatus: 'Ungraduated', code: '99201', cgpa: '3.0', transcript: [] },
  { id: '6', name: 'Dua Fatima', status: 'Regular', academicStatus: 'Ungraduated', code: '22831', cgpa: '3.5', transcript: [] },
  { id: '7', name: 'Bilal Hassan', status: 'Irregular', academicStatus: 'Ungraduated', code: '77492', cgpa: '2.1', transcript: [] },
  { id: '8', name: 'Meerab Jan', status: 'Regular', academicStatus: 'Ungraduated', code: '11029', cgpa: '3.7', transcript: [] },
  { id: '9', name: 'Usman Pirzada', status: 'Irregular', academicStatus: 'Ungraduated', code: '64532', cgpa: '2.8', transcript: [] },
  { id: '10', name: 'Eshal Malik', status: 'Irregular', academicStatus: 'Ungraduated', code: '88371', cgpa: '3.1', transcript: [] },
];

  const advisorMeetings = [
    { id: 1, title: '1st Meeting', day: 'Monday', date: 'Mar 12, 2026', time: '10:30 AM', room: 'Room 302' },
    { id: 2, title: '2nd Meeting', day: 'Wednesday', date: 'Mar 25, 2026', time: '01:00 PM', room: 'Conf. Hall A' },
    { id: 3, title: '3rd Meeting', day: 'Friday', date: 'Apr 03, 2026', time: '09:00 AM', room: 'Lab 04' },
    { id: 4, title: '4th Meeting', day: 'Sunday', date: 'Apr 18, 2026', time: '02:30 PM', room: 'HOD Office' },
    { id: 5, title: '5th Meeting', day: 'Tuesday', date: 'May 12, 2026', time: '11:00 AM', room: 'Seminar Room 1' },
  ];

  const historicalData: Record<string, any[]> = {
    'Fall 2021': [
      { id: 'f1', name: 'Valeeja Jamil', academicStatus: 'Graduated', code: '48291' },
      { id: 'f2', name: 'Ahmed Ali', academicStatus: 'Graduated', code: '10293' },
      { id: 'f3', name: 'Sara Khan', academicStatus: 'Graduated', code: '55821' },
      { id: 'f4', name: 'Zainab Bibi', academicStatus: 'Graduated', code: '39402' },
      { id: 'f5', name: 'Hamza Sheikh', academicStatus: 'Freeze', code: '99201' },
      { id: 'f6', name: 'Dua Fatima', academicStatus: 'Ungraduated', code: '22831' },
      { id: 'f7', name: 'Bilal Hassan', academicStatus: 'Ungraduated', code: '77492' },
    ],
    'Spring 2022': [
      { id: 's1', name: 'Meerab Jan', academicStatus: 'Graduated', code: '11029' },
      { id: 's2', name: 'Usman Pirzada', academicStatus: 'Graduated', code: '64532' },
      { id: 's3', name: 'Eshal Malik', academicStatus: 'Graduated', code: '88371' },
      { id: 's4', name: 'Hassan Raza', academicStatus: 'Graduated', code: '12930' },
      { id: 's5', name: 'Ayesha Khan', academicStatus: 'Graduated', code: '44521' },
      { id: 's6', name: 'Zohaib Ali', academicStatus: 'Graduated', code: '33201' },
      { id: 's7', name: 'Rida Zehra', academicStatus: 'Suspended', code: '90021' },
      { id: 's8', name: 'Omer Shah', academicStatus: 'Pending Fees', code: '55612' },
    ]
  };

  const roadmap = [
    { name: "Programming Fund.", completed: true },
    { name: "Data Structures", completed: true },
    { name: "Database Systems", completed: true },
    { name: "Software Engineering", completed: true },
    { name: "Upcoming: Artificial Intelligence", completed: false },
  ];

  const filteredStudents = mainStudents.filter(s => 
    activeTab === 'Total' ? true : s.status === activeTab
  );
const [showTranscript, setShowTranscript] = useState(false);
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Graduated': return 'bg-green-50 text-green-600 border-green-100';
      case 'Suspended': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending Fees': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Freeze': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setView('StudentProfile');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col p-6 shrink-0 shadow-xl">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center text-[#1e3a5f] font-bold text-sm">A</div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">ADVISO</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => setView('Overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${view === 'Overview' ? 'bg-amber-400 text-[#1e3a5f]' : 'hover:bg-white/10'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3">Management</div>
          <button onClick={() => setView('AssignedBatch')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${view === 'AssignedBatch' || view === 'BatchDetails' ? 'bg-amber-400 text-[#1e3a5f]' : 'hover:bg-white/10'}`}>
            <Bookmark size={18} /> Assigned Batch
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-10 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search records..." className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-4 text-xs outline-none" />
          </div>
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg border-2 border-amber-400"></div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-10">
            
            {/* ---------------- OVERVIEW ---------------- */}
            {view === 'Overview' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic mb-8">System Insights</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: 'Total Students', value: '10', icon: Users, tab: 'Total' },
                    { label: 'Regular Students', value: '06', icon: UserCheck, tab: 'Regular' },
                    { label: 'Irregular Students', value: '04', icon: UserMinus, tab: 'Irregular' },
                    { label: 'Meeting Schedule', value: '05', icon: Clock, tab: 'Meetings' }
                  ].map((item) => (
                    <button 
                      key={item.tab} 
                      onClick={() => setActiveTab(item.tab as StudentStatus)} 
                      className={`
                        h-[150px] rounded-[20px] bg-white transition-all flex flex-col items-start justify-between p-6 border shadow-sm
                        ${activeTab === item.tab 
                          ? (item.tab === 'Regular' ? 'border-green-500 border-2 scale-105 shadow-xl' 
                            : item.tab === 'Irregular' ? 'border-red-500 border-2 scale-105 shadow-xl' 
                            : 'border-[#1e3a5f] border-2 scale-105 shadow-xl')
                          : `border-slate-100 ${item.tab === 'Regular' ? 'hover:border-green-400' : item.tab === 'Irregular' ? 'hover:border-red-400' : 'hover:border-[#1e3a5f]'}`
                        }
                      `}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeTab === item.tab ? 'bg-slate-50 text-[#1e3a5f]' : 'bg-slate-50 text-slate-400'}`}>
                        <item.icon size={22} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`text-4xl font-black transition-colors ${activeTab === item.tab ? (item.tab === 'Regular' ? 'text-green-600' : item.tab === 'Irregular' ? 'text-red-600' : 'text-[#1e3a5f]') : 'text-[#1e3a5f]'}`}>
                          {item.value}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#1e3a5f] text-white rounded-3xl p-6 flex justify-between items-center mb-8 shadow-lg border-b-4 border-amber-400">
                  <div>
                    <p className="text-[10px] text-yellow-400 font-black tracking-widest uppercase">CURRENT BATCH OVERVIEW</p>
                    <h2 className="text-xl font-black mt-1 uppercase italic tracking-tight">BATCH: FALL 2022 | BS SOFTWARE ENGINEERING</h2>
                  </div>
                </div>

                <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                  {activeTab === 'Meetings' ? (
                    <>
                      <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-[0.2em] mb-8 italic">Meetings with Batch Advisor</h3>
                      <div className="space-y-4">
                        {advisorMeetings.map((meet) => {
                          const isDone = new Date(meet.date) < new Date();
                          return (
                            <div key={meet.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors">
                                  <span className="text-[9px] font-bold uppercase">{meet.day.substring(0, 3)}</span>
                                  <span className="text-xl font-black leading-none">{meet.date.split(' ')[1].replace(',', '')}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-black text-[#1e3a5f] uppercase italic group-hover:text-amber-500 transition-colors">{meet.title}</p>
                                  <div className="flex flex-wrap gap-x-5 mt-2">
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold"><Clock size={12} className="text-amber-500" /> {meet.time}</div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold"><Calendar size={12} className="text-amber-500" /> {meet.date}</div>
                                    <div className="flex items-center gap-1.5 text-[#1e3a5f]/70 text-[10px] font-black italic"><MapPin size={12} className="text-amber-500" /> {meet.room}</div>
                                  </div>
                                </div>
                              </div>
                              <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isDone ? 'bg-green-50 text-green-600 border-green-200 shadow-sm' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                {isDone ? 'Done' : 'Pending'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-[0.2em] mb-8 italic">Recent {activeTab} Activity</h3>
                      <div className="space-y-3">
                        {filteredStudents.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-5 bg-slate-50/40 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-[#1e3a5f] border border-slate-100 group-hover:bg-amber-400 transition-colors">{s.name.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-black text-[#1e3a5f] uppercase italic">{s.name}</p>
                                <p className="text-[11px] text-slate-400 font-black tracking-widest">{s.code}</p>
                              </div>
                            </div>
                            <button onClick={() => handleViewProfile(s)} className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest shadow-md italic hover:bg-amber-400 hover:text-[#1e3a5f] transition-all">VIEW PROFILE</button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STUDENT PROFILE VIEW ---------------- */}
            {view === 'StudentProfile' && selectedStudent && (
  <div className="animate-in fade-in duration-500 h-full flex flex-col">
    {/* Back Button - Reduced Margin */}
    <button onClick={() => setView('Overview')} className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-bold text-[10px] uppercase mb-4 shrink-0">
      <ArrowLeft size={14} /> Back to Roster
    </button>

    <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-0">
      
      {/* LEFT CARD - Fixed Height to fit screen */}
      <div className="w-full lg:w-[320px] h-[500px] bg-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-sm border border-slate-50 shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <User size={50} className="text-[#1e3a5f] opacity-70" />
        </div>
        
        <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic leading-none mb-2 text-center">
          {selectedStudent.name}
        </h2>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">
          SAP ID: {selectedStudent.code}
        </p>
        
        <div className="bg-[#ecfdf5] text-[#10b981] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#d1fae5] mb-8">
          {selectedStudent.status} Status
        </div>

        <div className="w-full h-px bg-slate-50 mb-8"></div>

        <div className="w-full grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Reg No</p>
            <p className="text-[12px] font-black text-[#1e3a5f]">F22-BSCS-001</p>
          </div>
          <div className="border-l border-slate-50">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Batch</p>
            <p className="text-[12px] font-black text-[#1e3a5f]">Fall 2022</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Flex layout to fill remaining height */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        
        {/* BLUE BANNER - Slimmer Height */}
        <div className="bg-[#1e3a5f] h-[100px] rounded-[1.5rem] px-8 py-4 flex justify-between items-center text-white border-b-4 border-amber-400 shadow-lg shrink-0">
  <div>
            <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Current Standing</p>
            <h2 className="text-3xl font-black italic tracking-tighter">{selectedStudent.cgpa} CGPA</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Completed Credits</p>
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-100">85 Cr. Hr</h2>
          </div>
        </div>

        {/* ROADMAP - Flexible height with internal scroll if list is long */}
       {/* ROADMAP AREA - 7 Categories Progress View */}
<div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col shrink-0">
  <div className="flex items-center justify-between mb-8 shrink-0">
    <div className="flex items-center gap-3">
      <BookOpen size={18} className="text-amber-500" />
      <h3 className="text-[12px] font-black uppercase tracking-widest text-[#1e3a5f] italic">
        Degree Roadmap & Category Progress
      </h3>
    </div>
    <div className="text-right">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Degree Requirement</p>
      <p className="text-lg font-black text-[#1e3a5f]">85 <span className="text-slate-300">/ 130</span> <span className="text-[10px] text-slate-400">Cr. Hr</span></p>
    </div>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
    {[
      { name: "Computing Core", earned: 30, total: 39, color: "bg-[#FF0000]" }, // Red
      { name: "Math & Science Foundation", earned: 9, total: 12, color: "bg-[#D9A7A7]" }, // Pinkish
      { name: "General Education", earned: 15, total: 19, color: "bg-[#A6A6A6]" }, // Grey
      { name: "University Elective", earned: 6, total: 12, color: "bg-[#B189FF]" }, // Purple
      { name: "SE Core", earned: 18, total: 24, color: "bg-[#FFFF00]" }, // Yellow
      { name: "SE Elective", earned: 3, total: 15, color: "bg-[#92D050]" }, // Light Green
      { name: "SE Supporting", earned: 4, total: 9, color: "bg-[#2E3192]" }, // Dark Blue
    ].map((cat, i) => {
      const percentage = (cat.earned / cat.total) * 100;
      return (
        <div key={i} className="group">
          <div className="flex justify-between items-end mb-2 px-1">
            <span className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-tight group-hover:text-amber-600 transition-colors">
              {cat.name}
            </span>
            <span className="text-[11px] font-black text-slate-500 italic">
              {cat.earned} <span className="text-slate-300 text-[9px] not-italic uppercase">out of</span> {cat.total}
            </span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color} ${cat.name === 'SE Core' ? 'border-r border-slate-300' : ''}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Achievement Tag */}
          <div className="mt-1 flex justify-end">
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              {Math.round(percentage)}% Completed
            </span>
          </div>
        </div>
      );
    })}

    {/* Academic Transcript Button - Spans full width at bottom */}
    <div className="md:col-span-2 pt-4">
      <button 
        onClick={() => setView('Transcript')} // View change karega
  className="w-full flex items-center justify-between p-5 rounded-3xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <FileText size={22} className="text-amber-600" />
          </div>
          <div className="text-left">
            <span className="block text-[14px] font-black uppercase tracking-tight text-[#1e3a5f]">Detailed Academic Transcript</span>
            <span className="text-[9px] font-bold text-amber-600 uppercase italic">Semester-wise Grade Breakdown</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</div>

      </div>
    </div>
  </div>
)}

{view === 'Transcript' && selectedStudent?.transcript && (
  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
    <button onClick={() => setView('StudentProfile')} className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-bold text-[10px] uppercase mb-6">
      <ArrowLeft size={14} /> Back to Profile
    </button>
    
    <div className="bg-[#1e3a5f] text-white p-8 rounded-[2rem] mb-8 flex justify-between items-center shadow-lg">
      <div>
        <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Full Transcript</p>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">{selectedStudent.name}</h2>
      </div>
      <div className="text-right">
        <p className="text-slate-400 text-[10px] font-black uppercase">Final CGPA</p>
        <p className="text-3xl font-black text-white italic">{selectedStudent.cgpa}</p>
      </div>
    </div>

    <div className="space-y-8">
      {selectedStudent.transcript.map((sem, idx) => (
        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
          <div className="flex justify-between items-end border-b-2 border-slate-50 pb-4 mb-6">
            <h3 className="text-lg font-black text-[#1e3a5f] uppercase italic">{sem.semester}</h3>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">SGPA</p>
              <p className="text-xl font-black text-amber-500">{sem.sgpa}</p>
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <th className="pb-4">Course Name</th>
                <th className="pb-4 text-center">Credit</th>
                <th className="pb-4 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sem.courses.map((course, cIdx) => (
                <tr key={cIdx}>
                  <td className="py-4 text-xs font-bold text-slate-600 uppercase italic">{course.name}</td>
                  <td className="py-4 text-xs font-black text-slate-400 text-center">{course.cr}</td>
                  <td className="py-4 text-right">
                    <span className={`px-3 py-1 rounded-lg font-black text-[10px] ${
                      course.grade === 'F' ? 'bg-red-50 text-red-500' : 
                      course.grade === 'W' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-[#1e3a5f]'
                    }`}>
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
)}
            {/* ---------------- ASSIGNED BATCH VIEW ---------------- */}
            {view === 'AssignedBatch' && (
              <div className="animate-in fade-in duration-500">
                <button onClick={() => setView('Overview')} className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-bold text-[10px] uppercase mb-6"><ArrowLeft size={14} /> Back</button>
                <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic mb-10">Assigned Batches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  {Object.keys(historicalData).map(batchName => (
                    <button key={batchName} onClick={() => { setSelectedBatch(batchName); setView('BatchDetails'); }} className="bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-amber-400 text-left hover:shadow-2xl transition-all group flex justify-between items-center">
                      <div><p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">Academic Record</p><h4 className="text-2xl font-black text-[#1e3a5f] uppercase italic">{batchName}</h4></div>
                      <ChevronRight size={24} className="text-slate-300 group-hover:text-amber-500"/>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------- BATCH DETAILS VIEW ---------------- */}
            {view === 'BatchDetails' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setView('AssignedBatch')} className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-bold text-[10px] uppercase mb-6"><ArrowLeft size={14} /> Back to Batches</button>
                <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic mb-8">{selectedBatch} Student Records</h2>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-3">
                  {historicalData[selectedBatch]?.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-5 bg-slate-50/40 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-[#1e3a5f] border border-slate-100 shadow-sm">{student.name.charAt(0)}</div>
                        <div><p className="text-sm font-black text-[#1e3a5f] uppercase italic">{student.name}</p><p className="text-[10px] text-slate-400 font-black tracking-widest">{student.code}</p></div>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${getStatusStyle(student.academicStatus)}`}>{student.academicStatus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;