"use client";
import React from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Hash, Mail, ArrowRight } from "lucide-react";

export function AddStudent() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/*HEADER  */}
        <div className="flex items-center gap-4 mb-10 p-6 rounded-[2.5rem] bg-slate-50 min-h-[110px]">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-white text-orange-500 shadow-sm">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic leading-none text-[#1e3a5f]">
              Enroll Student
            </h2>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Student Name" placeholder="e.g. Valeeja Jamil" icon={<GraduationCap size={16}/>} />
            <InputField label="SAP ID / CMS" placeholder="49100" icon={<Hash size={16}/>} />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Official Email" placeholder="std@riphah.edu.pk" icon={<Mail size={16}/>} />
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-[#FDB813]">Program</label>
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]">
                <option value="BSCS">BS Computer Science</option>
                <option value="BSSE">BS Software Engineering</option>
              </select>
            </div>
          </div>
          
          {/* MAIN ACTION BUTTON */}
          <button 
            className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-6"
          >
            <ArrowRight size={18} /> Register Student
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function InputField({ label, placeholder, icon }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-[#FDB813]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
        />
      </div>
    </div>
  );
}