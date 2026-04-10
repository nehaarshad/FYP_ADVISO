"use client";
import React from 'react';
import { Trash2, Eye, GraduationCap } from "lucide-react";

export const BatchResults = () => {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic leading-none">Batch Results</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Result Card for backend data mapping */}
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-[#FDB813] transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm group-hover:bg-[#FDB813] transition-colors">
              <GraduationCap size={24} />
            </div>
            <div>
              {/* Backend Title */}
              <p className="font-black text-[#1e3a5f] text-sm uppercase">Result File </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              title="View Result"
              className="p-3 bg-white rounded-xl text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-all border border-slate-200 shadow-sm active:scale-95"
            >
              <Eye size={16}/>
            </button>
            
            <button 
              title="Delete Result"
              className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all border border-slate-200 shadow-sm active:scale-95"
            >
              <Trash2 size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};