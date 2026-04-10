"use client";
import React from 'react';
import { motion } from "framer-motion";

export function StudentRecords() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="px-4">
        <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic tracking-tighter leading-none">
         Upload Student Records
        </h2>
      </div>

      {/* Upload Card */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Upload Type
          </label>
          <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none appearance-none cursor-pointer text-[#1e3a5f]">
            <option>New Student List (.csv)</option>
            <option>Batch Enrollment (.xlsx)</option>
            <option>Course Registration Data</option>
          </select>
        </div>
        {/* Action Button */}
        <button 
          className="w-full py-5 bg-[#1e3a5f] text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] active:scale-95 transition-all"
        >
          Process Records
        </button>
      </div>
    </motion.div>
  );
}