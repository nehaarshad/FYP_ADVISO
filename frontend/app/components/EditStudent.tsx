"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { UserCog, Search, Save, Hash, GraduationCap, Mail, CheckCircle2 } from "lucide-react";

export function EditStudent() {
  const [searchId, setSearchId] = useState("");
  const [isFound, setIsFound] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* PROMINENT BLUE HEADER */}
        <div className="flex justify-between items-center mb-10 p-8 bg-[#1e3a5f] rounded-[2.5rem] min-h-[120px]">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-md text-[#FDB813] rounded-2xl flex items-center justify-center shadow-inner">
              <UserCog size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic leading-none">Edit Student Profile</h2>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-2">Update Existing Academic Records</p>
            </div>
          </div>
          
          {isFound && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 border border-green-500/30">
              <CheckCircle2 size={14} /> Record Loaded
            </div>
          )}
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-12 p-2 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center group focus-within:border-[#FDB813] transition-all">
          <div className="pl-6 pr-4 text-slate-400 group-focus-within:text-[#FDB813]"><Search size={22} /></div>
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by SAP ID (e.g. 49100)..." 
            className="flex-1 py-5 bg-transparent outline-none font-black text-sm text-[#1e3a5f] placeholder:text-slate-300"
          />
          <button 
            onClick={() => setIsFound(true)}
            className="bg-[#1e3a5f] text-white px-10 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all shadow-lg active:scale-95"
          >
            Fetch Data
          </button>
        </div>

        {/* UPDATE FORM */}
        <form className={`space-y-8 transition-opacity duration-500 ${isFound ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="grid grid-cols-2 gap-8">
            <EditField label="Full Name" defaultValue="Valeeja Jamil" icon={<GraduationCap size={18}/>} />
            <EditField label="Registration ID" defaultValue="49100" icon={<Hash size={18}/>} isReadOnly={true} />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <EditField label="University Email" defaultValue="valeeja.jamil@riphah.edu.pk" icon={<Mail size={18}/>} />
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Enrolled Program</label>
              <select className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer text-[#1e3a5f]">
                <option>BS Computer Science</option>
                <option>BS Software Engineering</option>
                <option>BS Information Technology</option>
              </select>
            </div>
          </div>

          <button className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-4 active:scale-[0.98] mt-10">
            <Save size={20} /> Update Student Record
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function EditField({ label, defaultValue, icon, isReadOnly = false }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest group-focus-within:text-[#FDB813]">{label}</label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813] transition-colors">{icon}</div>
        <input 
          type="text" 
          defaultValue={defaultValue} 
          readOnly={isReadOnly}
          className={`w-full pl-14 pr-8 py-5 rounded-[1.5rem] font-bold text-xs outline-none transition-all ${isReadOnly ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-[#1e3a5f] focus:ring-2 ring-[#FDB813]/20'}`} 
        />
      </div>
    </div>
  );
}