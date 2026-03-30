"use client";
import React from 'react';
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";

export function ExcelUploader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white p-12 rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-6">
        <CloudUpload size={40} className="mx-auto text-blue-200" />
        <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Transcripts Batch Upload</h2>
        <button className="px-12 py-5 bg-[#1e3a5f] text-white rounded-2xl font-black text-xs shadow-2xl uppercase tracking-widest">Start Sync</button>
      </div>
    </motion.div>
  );
}