"use client";
import React from 'react';
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Mail, User, Fingerprint, BadgeCheck } from "lucide-react";

export function AddFaculty() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* HEADER SECTION: Registration Theme */}
        <div className="flex justify-between items-center mb-10 bg-[#1e3a5f]/5 p-6 rounded-[2.5rem] border border-[#1e3a5f]/10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-[#1e3a5f] text-[#FDB813] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <UserPlus size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic leading-none">Faculty Registration</h2>
            </div>
          </div>
          

        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Row 1: Name & SAP ID */}
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Full Name</label>
                <div className="relative">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={16} />
                   <input type="text" placeholder="Dr. Muhammad Arshad" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" />
                </div>
             </div>

             <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Employee / SAP ID</label>
                <div className="relative">
                   <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={16} />
                   <input type="text" placeholder="49XXX" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" />
                </div>
             </div>
          </div>

          {/* Row 2: Email & Fixed Rank */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest transition-colors group-focus-within:text-[#FDB813]">Official Email</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]" size={16} />
                   <input type="email" placeholder="faculty@riphah.edu.pk" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" />
                </div>
            </div>

            <div className="space-y-2 group opacity-80">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Designation</label>
                <div className="relative">
                   <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FDB813]" size={16} />
                   <input type="text" value="Batch Advisor" disabled className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl font-black text-xs cursor-not-allowed text-[#1e3a5f]" />
                </div>
             </div>
          </div>

          {/* REGISTER BUTTON */}
          <button className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4">
            Create Advisor Profile <UserPlus size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}