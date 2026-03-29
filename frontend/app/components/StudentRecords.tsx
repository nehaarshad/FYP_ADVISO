"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";

export function StudentRecords() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Academic Records</h2>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">CMS ID</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <StudentRow name="Valeeja Jamil" id="49100" />
            <StudentRow name="Ayesha Khan" id="48210" />
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function StudentRow({ name, id }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="p-6"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-[10px] font-black">{name[0]}</div><span className="text-xs font-black text-[#1e3a5f]">{name}</span></div></td>
      <td className="p-6 text-xs font-bold text-slate-500 tracking-widest">{id}</td>
      <td className="p-6 text-right"><button className="p-2 text-slate-300 hover:text-[#FDB813]"><Edit3 size={16}/></button></td>
    </tr>
  );
}