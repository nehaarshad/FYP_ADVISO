"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Info, CloudUpload } from "lucide-react";

export function Guidelines() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-[#1e3a5f] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#FDB813]">Upload Guidelines</h1>
          <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Academic & Advising Policies</p>
        </div>
        <Info className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
      </div>
      <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-slate-50 text-center space-y-4">
         <div className="w-20 h-20 rounded-[2rem] bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2"><CloudUpload size={32}/></div>
         <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic mb-2">Publish New Rules</h2>
         <button className="px-10 py-4 bg-[#1e3a5f] text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 transition-transform">Upload Document</button>
      </div>
    </motion.div>
  );
}