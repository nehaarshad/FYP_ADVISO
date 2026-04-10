
"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, 
  ShieldCheck, GraduationCap, MapPin
} from "lucide-react";

export function AdvisorProfile() {
  const advisor = {
    name: "Fatima Basit",
    role: "Senior Academic Advisor",
    rank: "Assistant Professor",
    id: "ADV-2026-089",
    email: "fatimabasit@riphah.edu.pk",
    dept: "Faculty of Computing & SE",
    specialization: "Software Engineering & UI/UX",
    location: "Gulberg Green Campus, Islamabad",
    joinedDate: "Fall 2021"
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Simple Header Section --- */}
      <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
        <div className="h-32 w-32 bg-white border border-slate-200 rounded-[2.5rem] flex items-center justify-center text-[#1e3a5f] shadow-sm relative">
          <User size={60} strokeWidth={1} />
          <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1.5 rounded-lg text-[#1e3a5f]">
            <ShieldCheck size={16} />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-[#1e3a5f] tracking-tighter mb-2 uppercase">
            {advisor.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {advisor.role}
            </span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
              {advisor.rank}
            </span>
          </div>
        </div>
      </div>

      {/* --- Details Grid (Light Style) --- */}
      <div className="mt-12">
        <h3 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-10">
          Professional Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <ProfileInfoRow 
            icon={<IdCard size={8} />} 
            label="Advisor ID" 
            value={advisor.id} 
          />
          <ProfileInfoRow 
            icon={<Mail size={18} />} 
            label="Official Email" 
            value={advisor.email} 
          />
          <ProfileInfoRow 
            icon={<GraduationCap size={18} />} 
            label="Specialization" 
            value={advisor.specialization} 
          />
          <ProfileInfoRow 
            icon={<Building size={18} />} 
            label="Department" 
            value={advisor.dept} 
          />
          <ProfileInfoRow 
            icon={<MapPin size={18} />} 
            label="Campus" 
            value={advisor.location} 
          />
          <ProfileInfoRow 
            icon={<Globe size={18} />} 
            label="Joined Date" 
            value={advisor.joinedDate} 
          />
        </div>
      </div>

      {/* --- Subtle Footer --- */}
      <div className="mt-20 pt-8 border-t border-slate-50 text-center">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">
          Adviso Faculty Management • 2026
        </p>
      </div>
    </div>
  );
}

// Minimal InfoRow Component
function ProfileInfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-5">
      <div className="mt-1 text-amber-500">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
          {label}
        </p>
        <p className="text-[#1e3a5f] font-bold text-[15px] tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}