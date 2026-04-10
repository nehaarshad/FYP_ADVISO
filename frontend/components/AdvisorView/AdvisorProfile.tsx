"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, 
  ShieldCheck, GraduationCap, Briefcase 
} from "lucide-react";

export function AdvisorProfile() {
  // Static Data for Fatima Basit
  const advisor = {
    name: "Fatima Basit",
    role: "Senior Academic Advisor",
    rank: "Assistant Professor",
    id: "ADV-2026-089",
    email: "fatima.basit@riphah.edu.pk",
    dept: "Faculty of Computing (SE)",
    specialization: "Software Engineering & UI/UX",
    location: "Gulberg Green Campus, Islamabad",
    joinedDate: "Fall 2021"
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
        {/* Profile Avatar */}
        <div className="h-32 w-32 bg-amber-50 border border-amber-100 rounded-[2.5rem] flex items-center justify-center text-amber-600 shadow-sm relative">
          <User size={60} strokeWidth={1.5} />
          <div className="absolute -bottom-2 -right-2 bg-[#1e3a5f] p-2 rounded-xl text-white shadow-lg border-2 border-white">
            <GraduationCap size={18} />
          </div>
        </div>
        
        {/* Name and Tag */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-[#1e3a5f] tracking-tighter mb-2 uppercase">
            {advisor.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
            <span className="px-4 py-1.5 bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md">
              {advisor.role}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tighter">
              <ShieldCheck size={14} className="text-amber-500" /> Verified Faculty Member
            </span>
          </div>
        </div>
      </div>

      {/* --- DETAILS GRID --- */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
            Professional Credentials
          </h3>
          <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase">
            Joined {advisor.joinedDate}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <AdvisorInfoRow 
            icon={<IdCard size={20} className="text-[#1e3a5f]" />} 
            label="Advisor ID" 
            value={advisor.id} 
          />
          <AdvisorInfoRow 
            icon={<Mail size={20} className="text-[#1e3a5f]" />} 
            label="Official Contact" 
            value={advisor.email} 
          />
          <AdvisorInfoRow 
            icon={<Briefcase size={20} className="text-[#1e3a5f]" />} 
            label="Academic Rank" 
            value={advisor.rank} 
          />
          <AdvisorInfoRow 
            icon={<Building size={20} className="text-[#1e3a5f]" />} 
            label="Faculty / Department" 
            value={advisor.dept} 
          />
          <AdvisorInfoRow 
            icon={<GraduationCap size={20} className="text-[#1e3a5f]" />} 
            label="Core Specialization" 
            value={advisor.specialization} 
          />
          <AdvisorInfoRow 
            icon={<Globe size={20} className="text-[#1e3a5f]" />} 
            label="Campus Location" 
            value={advisor.location} 
          />
        </div>
      </div>

      {/* --- BRANDING FOOTER --- */}
      <div className="mt-20 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
        <div className="px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-400 text-xs font-medium text-center">
          "Empowering students through structured guidance and academic excellence."
        </div>
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
          Adviso Advisor Portal • v2.0
        </p>
      </div>
    </div>
  );
}

// Reusable Row Component
function AdvisorInfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="mt-1 p-2.5 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-all duration-300 border border-transparent group-hover:border-amber-100">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
          {label}
        </p>
        <p className="text-[#1e3a5f] font-bold text-[15px] tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}