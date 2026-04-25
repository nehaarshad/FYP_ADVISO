/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// components/ProfileView/route.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { 
  Mail, Building, IdCard, User, Globe, ShieldCheck, Loader2, AlertCircle,
  Phone
} from "lucide-react";
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';
import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';

export function ProfileView() {
  const { userProfile, isLoading, error, getDisplayName, getEmail, getRoleDisplay } = useUserProfile();
  const { advisors } = useAdvisors();
  const { students } = useStudents();
  
  // Get additional details if needed
  const getAdditionalDetails = () => {
    if (!userProfile) return null;
    
    if (userProfile.role === 'advisor') {
      const advisor = advisors.find(a => a.User?.sapid === userProfile.sapid);
      return advisor;
    }
    
    if (userProfile.role === 'student') {
      const student = students.find(s => s.User?.sapid === userProfile.sapid);
      return student;
    }
    return userProfile;
  };
  
  const details = getAdditionalDetails();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-[#FDB813]" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 p-8 rounded-2xl">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-bold">Error loading profile</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
const profileData = {
  name: getDisplayName(),
  email: getEmail(),
  id: userProfile?.sapid?.toString() || 'N/A',
  dept: userProfile?.profile?.department  || (details as any)?.BatchModel?.ProgramModel?.programName || null,
  role: getRoleDisplay(),
  gender: (details as any)?.gender,
  contactNumber: (details as any)?.contactNumber || userProfile?.profile?.contactNumber ,
  registrationNumber: (details as any)?.registrationNumber,
  currentSemester: (details as any)?.currentSemester,
};

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
        <div className="h-32 w-32 bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 rounded-full flex items-center justify-center text-[#1e3a5f] shadow-sm">
          <User size={60} strokeWidth={1} />
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-[#1e3a5f] tracking-tight mb-2">
            {profileData.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
            <span className="px-3 py-1 bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {profileData.role}
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
            label="SAP ID / Employee ID" 
            value={profileData.id} 
          />
          <InfoRow 
            icon={<Mail size={18} className="text-slate-300" />} 
            label="Official Email" 
            value={profileData.email} 
          />
          
          {profileData.dept && (
            <InfoRow 
            icon={<Building size={18} className="text-slate-300" />} 
            label="Department / Program" 
            value={profileData.dept} 
          />
          )}
          
          {profileData.gender && (
            <InfoRow 
              icon={<User size={18} className="text-slate-300" />} 
              label="Gender" 
              value={profileData.gender} 
            />
          )}
          
          {profileData.contactNumber && (
            <InfoRow 
              icon={<Phone size={18} className="text-slate-300" />} 
              label="Contact Number" 
              value={profileData.contactNumber.toString()} 
            />
          )}
          
          {profileData.registrationNumber && (
            <InfoRow 
              icon={<IdCard size={18} className="text-slate-300" />} 
              label="Registration Number" 
              value={profileData.registrationNumber} 
            />
          )}
          
          {profileData.currentSemester && (
            <InfoRow 
              icon={<User size={18} className="text-slate-300" />} 
              label="Current Semester" 
              value={`Semester ${profileData.currentSemester}`} 
            />
          )}
        </div>
      </div>

      {/* Footer */}
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
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}