"use client";
import React from 'react';
import { FileText, Download, Eye } from "lucide-react";

export const CourseOffering = ({ session }: { session: string }) => {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
    
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Course Offerings</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Active Session: {session}</p>
        </div>
        <button className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all">
          Upload New List
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-[#FDB813] transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-black text-[#1e3a5f] text-sm uppercase">CS_Offerings_{session}.pdf</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Size: 1.2 MB • Uploaded: 2 days ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button title='view' className="p-3 bg-white rounded-xl text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-all border border-slate-200"><Eye size={16}/></button>
            <button title="Download" className="p-3 bg-white rounded-xl text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-all border border-slate-200"><Download size={16}/></button>
          </div>
        </div>
      </div>

    </div>
  );
};