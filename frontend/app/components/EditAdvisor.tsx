"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Layers, Mail, User, CheckCircle2, XCircle } from "lucide-react";

export function EditAdvisor() {
  const [status, setStatus] = useState("Active");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* PROMINENT BLUE HEADER (Consistent with Student Screen) */}
        <div className="flex justify-between items-center mb-10 p-8 bg-[#1e3a5f] rounded-[2.5rem] min-h-[120px]">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-md text-[#FDB813] rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic leading-none">Assign Advisor</h2>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-2">Batch & Role Management</p>
            </div>
          </div>
    
          <div className={`px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-tighter flex items-center gap-2 border ${
            status === "Active" ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            <div className={`h-2 w-2 rounded-full ${status === "Active" ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            Status: {status}
          </div>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Advisor Name</label>
                <div className="relative">
                   <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={18} />
                   <input type="text" placeholder="Dr. Arshad" className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" />
                </div>
             </div>

             <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Assign Batch</label>
                <div className="relative">
                   <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={18} />
                   <select className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 appearance-none cursor-pointer text-[#1e3a5f]">
                      <option value="">Select Target Batch...</option>
                      <option value="F22">Fall 2022 (BSCS)</option>
                      <option value="S23">Spring 2023 (BSSE)</option>
                      <option value="F25">Fall 2025 (New)</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Official Email</label>
                <div className="relative">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={18} />
                   <input type="email" placeholder="faculty@riphah.edu.pk" className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" />
                </div>
            </div>

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
            Complete Assignment <ShieldCheck size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}