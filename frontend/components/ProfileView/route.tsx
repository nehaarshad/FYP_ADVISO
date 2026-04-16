/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, ShieldCheck
} from "lucide-react";

export function ProfileView() {
  const profile = {
    name: "Aleena Ayub",
    email: "aleena.ayub@riphah.edu.pk",
    id: "RIU-COORD-2026",
    dept: "Department of Computing & SE",
    role: "Academic Coordinator",
    location: "Gulberg Green Campus, Islamabad"
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
        <div className="h-32 w-32 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-[#1e3a5f] shadow-sm">
          <User size={60} strokeWidth={1} />
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-light text-slate-800 tracking-tight mb-2">
            {profile.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {profile.role}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <ShieldCheck size={14} /> Official Profile
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="mt-12">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-8">
          Account Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <InfoRow 
            icon={<IdCard size={18} className="text-slate-300" />} 
            label="Employee ID" 
            value={profile.id} 
          />
          <InfoRow 
            icon={<Mail size={18} className="text-slate-300" />} 
            label="Official Email" 
            value={profile.email} 
          />
          <InfoRow 
            icon={<Building size={18} className="text-slate-300" />} 
            label="Department" 
            value={profile.dept} 
          />
          <InfoRow 
            icon={<Globe size={18} className="text-slate-300" />} 
            label="Campus Location" 
            value={profile.location} 
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
    <div className="flex items-start gap-5">
      <div className="mt-1">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
          {label}
        </p>
        <p className="text-slate-700 font-semibold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}