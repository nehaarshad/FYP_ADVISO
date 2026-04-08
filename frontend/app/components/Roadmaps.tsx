"use client";
import React, { useState } from 'react';
import { 
  CloudUpload, FileText, ExternalLink, Trash2, 
  Filter, ChevronDown, CheckCircle2 
} from "lucide-react";

export function RoadmapSection() {
  const [program, setProgram] = useState<'se' | 'cs'>('se');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. HEADER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e3a5f]">
            Upload Roadmap
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Manage Academic Schemes (SRS-7.4)
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* 2. UPLOAD SECTION */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8 text-[#FDB813]">
            <CloudUpload size={20} />
            <h3 className="font-black uppercase italic text-[11px] tracking-wider text-slate-400">New Upload</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">File Category</label>
              <div className="w-full p-5 bg-slate-50 rounded-2xl text-[12px] font-bold text-[#1e3a5f] border border-transparent uppercase tracking-wider">
                {program.toUpperCase()} Roadmap Scheme
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-all cursor-pointer relative">
              <div className="h-16 w-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mb-4 group-hover:scale-110 transition-transform">
                <CloudUpload size={32} />
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Drop File to Sync</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <button className="w-full mt-8 py-5 bg-[#FDB813] text-[#1e3a5f] rounded-2xl font-black text-[11px] shadow-xl shadow-yellow-500/10 hover:translate-y-[-2px] transition-all uppercase tracking-[0.2em]">
            Upload Roadmap 
          </button>
        </div>

        {/* 3. ACTIVE FILES SECTION (BUTTON REPLACED HERE) */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black uppercase italic text-[11px] tracking-wider text-slate-400">
              Active Files
            </h3>
            
            {/* FILTER BUTTON REPLACES THE BADGE/NUMBER */}
            <div className="relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[#1e3a5f] font-black text-[9px] uppercase tracking-widest border border-slate-100 transition-all"
              >
                <Filter size={12} className={program === 'cs' ? 'text-blue-500' : 'text-[#FDB813]'} />
                Filter: {program.toUpperCase()}
                <ChevronDown size={12} className={showFilter ? 'rotate-180' : ''} />
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                  <button 
                    onClick={() => { setProgram('cs'); setShowFilter(false); }}
                    className="w-full px-5 py-3 text-left text-[9px] font-black uppercase hover:bg-slate-50 border-b border-slate-50 transition-colors flex justify-between items-center"
                  >
                    CS Program {program === 'cs' && <CheckCircle2 size={10} className="text-blue-500" />}
                  </button>
                  <button 
                    onClick={() => { setProgram('se'); setShowFilter(false); }}
                    className="w-full px-5 py-3 text-left text-[9px] font-black uppercase hover:bg-slate-50 transition-colors flex justify-between items-center"
                  >
                    SE Program {program === 'se' && <CheckCircle2 size={10} className="text-[#FDB813]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <FileRow 
              name={program === 'cs' ? "CS_Offering_F25.pdf" : "SE_Offering_F25.pdf"} 
              type={program === 'cs' ? "CS Roadmap" : "SE Roadmap"} 
              date="07 Apr 2026" 
            />
            <FileRow 
              name={program === 'cs' ? "BSCS_Scheme_v1.xlsx" : "BSSE_Scheme_v2.xlsx"} 
              type="Detailed Scheme" 
              date="05 Apr 2026" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FileRow({ name, type, date }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/30 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm group-hover:bg-[#1e3a5f] group-hover:text-white transition-all">
          <FileText size={22} />
        </div>
        <div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight leading-none mb-1">{name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{type}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <p className="text-[9px] font-black text-slate-300 uppercase italic">{date}</p>
        <div className="flex gap-2">
          <button className="p-3 bg-white text-slate-400 hover:text-[#1e3a5f] rounded-xl shadow-sm border border-slate-100 transition-all">
            <ExternalLink size={14}/>
          </button>
          <button className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-all">
            <Trash2 size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}