"use client";
import React from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Hash, Mail } from "lucide-react";

export function AddStudent() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Enroll New Student</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Academic Profile Creation</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Student Name" placeholder="e.g. Valeeja Jamil" icon={<GraduationCap size={16}/>} />
            <InputField label="SAP ID / CMS" placeholder="49100" icon={<Hash size={16}/>} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Official Email" placeholder="std@riphah.edu.pk" icon={<Mail size={16}/>} />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Program</label>
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer">
                <option value="BSCS">BS Computer Science</option>
                <option value="BSSE">BS Software Engineering</option>
              </select>
            </div>
          </div>
          <button className="w-full py-5 bg-[#1e3a5f] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all mt-4">
            Register Student
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Reusable Input Component
function InputField({ label, placeholder, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input type="text" placeholder={placeholder} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20" />
      </div>
    </div>
  );
}