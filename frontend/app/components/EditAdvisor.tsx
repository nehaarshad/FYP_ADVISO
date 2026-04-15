'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Layers, Mail, User, CheckCircle2, XCircle, Search, Save } from "lucide-react";

export function EditAdvisor() {
  const [status, setStatus] = useState("Active");
  const [searchId, setSearchId] = useState("");
  const [isFound, setIsFound] = useState(false);

  // Logic: Fetch Advisor Data
  const handleFetch = () => {
    if (searchId.trim() !== "") {
      console.log("Fetching Advisor with SAP ID:", searchId);
      // fetch call
      setIsFound(true);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto pb-10">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 p-8 bg-[#1e3a5f] rounded-[2.5rem] min-h-[120px]">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-md text-[#FDB813] rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic leading-none">Assign & Edit Advisor</h2>
            </div>
          </div>
    
          {isFound && (
            <div className={`px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-tighter flex items-center gap-2 border ${
              status === "Active" ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              <div className={`h-2 w-2 rounded-full ${status === "Active" ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              Status: {status}
            </div>
          )}
        </div>

        {/* SEARCH SECTION - Exact Same as EditStudent */}
        <div className="mb-12 p-2 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center group focus-within:border-[#FDB813] transition-all">
          <div className="pl-6 pr-4 text-slate-400 group-focus-within:text-[#FDB813]"><Search size={22} /></div>
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search Advisor by SAP ID (e.g. 49XXX)..." 
            className="flex-1 py-5 bg-transparent outline-none font-black text-sm text-[#1e3a5f] placeholder:text-slate-300"
          />
          <button 
            onClick={handleFetch}
            className="bg-[#1e3a5f] text-white px-10 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all shadow-lg active:scale-95"
          >
            Fetch Advisor
          </button>
        </div>

        {/* UPDATE FORM - Becomes visible after fetch */}
        <form className={`space-y-8 transition-all duration-500 ${isFound ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`} onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <EditField label="Advisor Name" defaultValue="Dr. Muhammad Arshad" icon={<User size={18} />} />

             <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest group-focus-within:text-[#FDB813]">Assign Batch</label>
                <div className="relative">
                   <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={18} />
                   <select className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 appearance-none cursor-pointer text-[#1e3a5f]">
                      <option value="F22">Fall 2022 (BSCS)</option>
                      <option value="S23">Spring 2023 (BSSE)</option>
                      <option value="F25">Fall 2025 (New)</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EditField label="Official Email" defaultValue="arshad.m@riphah.edu.pk" icon={<Mail size={18} />} />

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Activation Status</label>
              <div className="flex gap-3 h-[60px] bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100">
                <button type="button" onClick={() => setStatus("Active")} className={`flex-1 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${status === "Active" ? 'bg-white text-green-600 shadow-md' : 'text-slate-300'}`}>
                  <CheckCircle2 size={14} /> ACTIVE
                </button>
                <button type="button" onClick={() => setStatus("Inactive")} className={`flex-1 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${status === "Inactive" ? 'bg-white text-red-600 shadow-md' : 'text-slate-300'}`}>
                  <XCircle size={14} /> INACTIVE
                </button>
              </div>
            </div>
          </div>

          <button className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-4 active:scale-[0.98] mt-10">
            <Save size={20} /> Update Assignment & Status
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Reusable Field for consistency
function EditField({ label, defaultValue, icon, isReadOnly = false }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest group-focus-within:text-[#FDB813] transition-colors">{label}</label>
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