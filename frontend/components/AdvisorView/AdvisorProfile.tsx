"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, 
  ShieldCheck, GraduationCap, Briefcase 
} from "lucide-react";

export function AdvisorProfile() {
  const advisor = {
    name: "Fatima Basit",
    role: "Academic Advisor",
    rank: "Management Executive",
    id: "ADVISOR-2026-012",
    email: "fatima.basit@riphah.edu.pk",
    dept: "Academic Operations / Faculty of Computing",
    specialization: "Academic Administration",
    location: "Main Block, Islamabad Campus",
    joinedDate: "Spring 2022"
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
        <div className="h-32 w-32 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-center justify-center text-[#1e3a5f] shadow-sm relative">
          <User size={60} strokeWidth={1.5} />
          <div className="absolute -bottom-2 -right-2 bg-[#FDB813] p-2 rounded-xl text-[#1e3a5f] shadow-lg">
            <ShieldCheck size={18} />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-[#1e3a5f] tracking-tighter mb-2 uppercase">
            {advisor.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
            <span className="px-4 py-1.5 bg-[#FDB813] text-[#1e3a5f] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md">
              {advisor.role}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <ShieldCheck size={14} /> Official Profile
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
            Official Information
          </h3>
          <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
            Member Since {advisor.joinedDate}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <InfoRow 
            icon={<IdCard size={20} className="text-[#1e3a5f]" />} 
            label="Staff ID" 
            value={advisor.id} 
          />
          <InfoRow 
            icon={<Mail size={20} className="text-[#1e3a5f]" />} 
            label="Office Email" 
            value={advisor.email} 
          />
          <InfoRow 
            icon={<Briefcase size={20} className="text-[#1e3a5f]" />} 
            label="Designation" 
            value={advisor.rank} 
          />
          <InfoRow 
            icon={<Building size={20} className="text-[#1e3a5f]" />} 
            label="Department" 
            value={advisor.dept} 
          />
          <InfoRow 
            icon={<GraduationCap size={20} className="text-[#1e3a5f]" />} 
            label="Specialization" 
            value={advisor.specialization} 
          />
          <InfoRow 
            icon={<Globe size={20} className="text-[#1e3a5f]" />} 
            label="Office Location" 
            value={advisor.location} 
          />
        </div>
      </div>

      {/* Minimal Footer Footer */}
      <div className="mt-20 pt-8 border-t border-slate-50 text-center">
        <p className="text-[10px] text-slate-300 font-medium uppercase tracking-[0.2em]">
          Adviso Academic Management System • 2026
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="mt-1 p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-300">
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