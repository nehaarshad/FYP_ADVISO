"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, 
  ShieldCheck, GraduationCap, Briefcase, ArrowLeft 
} from "lucide-react";

interface AdvisorProfileProps {
  onBack?: () => void;
}

export function AdvisorProfile({ onBack }: AdvisorProfileProps) {
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
    <div className="w-full max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pb-10 md:pb-12 border-b border-slate-100">
        <div className="h-28 w-28 md:h-32 md:w-32 bg-blue-50 border border-blue-100 rounded-[2.2rem] md:rounded-[2.5rem] flex items-center justify-center text-[#1e3a5f] shadow-sm relative shrink-0">
          <User size={50} className="md:w-[60px]" strokeWidth={1.5} />
          <div className="absolute -bottom-1 -right-1 bg-[#FDB813] p-1.5 md:p-2 rounded-lg md:rounded-xl text-[#1e3a5f] shadow-lg">
            <ShieldCheck size={16} />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-[#1e3a5f] tracking-tighter mb-3 uppercase leading-tight">
            {advisor.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 items-center">
            <span className="px-4 py-1.5 bg-[#FDB813] text-[#1e3a5f] text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md">
              {advisor.role}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs font-medium">
              <ShieldCheck size={14} /> Official Profile
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-10 md:mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <h3 className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            Official Information
          </h3>
          <span className="self-start sm:self-auto text-[8px] md:text-[9px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
            Member Since {advisor.joinedDate}
          </span>
        </div>
        
        {/* Grid: 1 column on mobile, 2 columns on medium+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-12 md:gap-x-16">
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

      {/* Footer */}
      <div className="mt-16 md:mt-20 pt-8 border-t border-slate-50 text-center">
        <p className="text-[8px] md:text-[10px] text-slate-300 font-medium uppercase tracking-[0.2em]">
          Adviso Academic Management System • 2026
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 md:gap-5 group">
      <div className="mt-0.5 md:mt-1 p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-300 shrink-0">
        {React.cloneElement(icon, { size: 18, className: "md:w-5 md:h-5 text-[#1e3a5f]" })}
      </div>
      <div className="min-w-0"> {/* min-w-0 prevents text overflow in flex containers */}
        <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">
          {label}
        </p>
        <p className="text-[#1e3a5f] font-bold text-sm md:text-[15px] tracking-tight break-words">
          {value}
        </p>
      </div>
    </div>
  );
}