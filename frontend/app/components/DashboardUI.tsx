// import React from 'react';
// import { Search, Bell, ArrowRight, AlertTriangle, Clock } from "lucide-react";

// /**
//  * 1. HEADER COMPONENT
//  */
// export function Header({ searchQuery, setSearchQuery }: any) {
//   return (
//     <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
//       <div className="relative w-full max-w-xl">
//         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//         <input 
//           type="text" 
//           placeholder="Search Student..." 
//           className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 focus:ring-[#FDB813]" 
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//       <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-all relative">
//         <Bell size={20}/>
//         <div className="absolute top-3 right-3 h-2 w-2 bg-[#FDB813] border-2 border-white rounded-full"></div>
//       </div>
//     </header>
//   );
// }

// /**
//  * 2. STAT CARD (Top overview metrics)
//  */
// export function StatCard({ label, value, icon, color = "text-[#1e3a5f]" }: any) {
//   return (
//     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//       <div className="h-10 w-10 bg-slate-50 text-[#1e3a5f] rounded-xl flex items-center justify-center mb-4">{icon}</div>
//       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
//       <h3 className={`text-3xl font-black ${color} tracking-tighter`}>{value}</h3>
//     </div>
//   );
// }

// /**
//  * 3. RECENT STUDENT CARD (The horizontal box cards)
//  */
// export function RecentStudentCard({ student, onClick }: any) {
//   return (
//     <div 
//       onClick={onClick}
//       className="min-w-[280px] bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#FDB813] transition-all cursor-pointer group"
//     >
//       <div className="flex items-center gap-4">
//         <div className="h-12 w-12 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-[#FDB813] font-black italic group-hover:rotate-6 transition-transform">
//           {student?.name ? student.name[0] : "S"}
//         </div>
//         <div>
//           <h4 className="font-black text-[#1e3a5f] text-sm uppercase italic group-hover:text-[#FDB813] transition-colors line-clamp-1">
//             {student?.name}
//           </h4>
//           <div className="flex items-center gap-1 text-slate-400">
//             <Clock size={10} />
//             <p className="text-[9px] font-bold uppercase italic">Viewed recently</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /**
//  * 4. STUDENT CARD (The main list rows)
//  */
// export function StudentCard({ student, onClick, risk = false }: any) {
//   return (
//     <div 
//       onClick={onClick} 
//       className={`bg-white p-6 rounded-[2.5rem] border flex items-center justify-between group cursor-pointer transition-all hover:shadow-xl ${risk ? 'border-red-100 hover:border-red-500' : 'border-slate-100 hover:border-[#FDB813]'}`}
//     >
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[#1e3a5f] italic text-xl group-hover:bg-[#FDB813]">
//           {student?.name ? student.name[0] : "S"}
//         </div>
//         <div>
//           <h4 className="font-black text-[#1e3a5f] uppercase italic">{student?.name || "Unknown Student"}</h4>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {student?.id} • CGPA: {student?.cgpa}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic ${student?.status === 'Probation' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
//           {student?.status || "Active"}
//         </span>
//         <ArrowRight className="text-slate-200 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" size={20}/>
//       </div>
//     </div>
//   );
// }