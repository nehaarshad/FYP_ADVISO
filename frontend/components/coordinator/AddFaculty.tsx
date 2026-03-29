"use client";
import React from 'react';
import { motion } from "framer-motion";
import { UserPlus, Mail, Briefcase, ShieldCheck } from "lucide-react";

export function AddFaculty() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-blue-50 text-[#1e3a5f] rounded-2xl flex items-center justify-center">
            <UserPlus size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Add Batch Advisor</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Faculty Registration</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Full Name" placeholder="e.g. Dr. Arshad" icon={<UserPlus size={16}/>} />
            <InputField label="Email Address" placeholder="name@riphah.edu.pk" icon={<Mail size={16}/>} />
          </div>
          
          <div className="grid grid-cols-2 gap-6 items-end">
            <InputField label="Employee ID" placeholder="e.g. FAC-990" icon={<Briefcase size={16}/>} />
            {/* Displaying static role instead of dropdown */}
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
              <ShieldCheck size={18} className="text-[#FDB813]" />
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Assigned Role</p>
                <p className="text-xs font-black text-[#1e3a5f]">Batch Advisor</p>
              </div>
            </div>
          </div>

          <button className="w-full py-5 bg-[#1e3a5f] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all mt-4">
            Confirm Registration
          </button>
        </form>
      </div>
    </motion.div>
  );
}

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