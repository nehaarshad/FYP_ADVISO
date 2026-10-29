// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// // components/ProfileView/route.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React from 'react';
// import { 
//   Mail, Building, IdCard, User, Globe, ShieldCheck, Loader2, AlertCircle,
//   Phone
// } from "lucide-react";
// import { useUserProfile } from '@/src/hooks/profileHook/useProfile';
// import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';
// import { useStudents } from '@/src/hooks/studentsHook/useStudents';

// export function ProfileView() {
//   const { userProfile, isLoading, error, getDisplayName, getEmail, getRoleDisplay } = useUserProfile();
//   const { advisors } = useAdvisors();
//   const { students } = useStudents();
  
//   // Get additional details if needed
//   const getAdditionalDetails = () => {
//     if (!userProfile) return null;
    
//     if (userProfile.role === 'advisor') {
//       const advisor = advisors.find(a => a.User?.sapid === userProfile.sapid);
//       return advisor;
//     }
    
//     if (userProfile.role === 'student') {
//       const student = students.find(s => s.User?.sapid === userProfile.sapid);
//       return student;
//     }
//     return userProfile;
//   };
  
//   const details = getAdditionalDetails();
  
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 size={40} className="animate-spin text-[#FDB813]" />
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center bg-red-50 p-8 rounded-2xl">
//           <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 font-bold">Error loading profile</p>
//           <p className="text-red-500 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }
  
// const profileData = {
//   name: getDisplayName(),
//   email: getEmail(),
//   id: userProfile?.sapid?.toString() || 'N/A',
//   dept: userProfile?.profile?.department  || (details as any)?.BatchModel?.ProgramModel?.programName || null,
//   role: getRoleDisplay(),
//   gender: (details as any)?.gender,
//   contactNumber: (details as any)?.contactNumber || userProfile?.profile?.contactNumber ,
//   registrationNumber: (details as any)?.registrationNumber,
//   currentSemester: (details as any)?.currentSemester,
// };

//   return (
//     <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
//         <div className="h-32 w-32 bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 rounded-full flex items-center justify-center text-[#1e3a5f] shadow-sm">
//           <User size={60} strokeWidth={1} />
//         </div>
        
//         <div className="text-center md:text-left">
//           <h2 className="text-4xl font-bold text-[#1e3a5f] tracking-tight mb-2">
//             {profileData.name}
//           </h2>
//           <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
//             <span className="px-3 py-1 bg-[#1e3a5f] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
//               {profileData.role}
//             </span>
//             <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
//               <ShieldCheck size={14} /> Official Profile
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Profile Details Grid */}
//       <div className="mt-12">
//         <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] mb-8">
//           Account Information
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
//           <InfoRow 
//             icon={<IdCard size={18} className="text-slate-300" />} 
//             label="SAP ID / Employee ID" 
//             value={profileData.id} 
//           />
//           <InfoRow 
//             icon={<Mail size={18} className="text-slate-300" />} 
//             label="Official Email" 
//             value={profileData.email} 
//           />
          
//           {profileData.dept && (
//             <InfoRow 
//             icon={<Building size={18} className="text-slate-300" />} 
//             label="Department / Program" 
//             value={profileData.dept} 
//           />
//           )}
          
//           {profileData.gender && (
//             <InfoRow 
//               icon={<User size={18} className="text-slate-300" />} 
//               label="Gender" 
//               value={profileData.gender} 
//             />
//           )}
          
//           {profileData.contactNumber && (
//             <InfoRow 
//               icon={<Phone size={18} className="text-slate-300" />} 
//               label="Contact Number" 
//               value={profileData.contactNumber.toString()} 
//             />
//           )}
          
//           {profileData.registrationNumber && (
//             <InfoRow 
//               icon={<IdCard size={18} className="text-slate-300" />} 
//               label="Registration Number" 
//               value={profileData.registrationNumber} 
//             />
//           )}
          
//           {profileData.currentSemester && (
//             <InfoRow 
//               icon={<User size={18} className="text-slate-300" />} 
//               label="Current Semester" 
//               value={`Semester ${profileData.currentSemester}`} 
//             />
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-20 pt-8 border-t border-slate-50 text-center">
//         <p className="text-[10px] text-slate-300 font-medium uppercase tracking-[0.2em]">
//           Adviso Academic Management System • 2026
//         </p>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
//   return (
//     <div className="flex items-start gap-5">
//       <div className="mt-1">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
//           {label}
//         </p>
//         <p className="text-slate-700 font-semibold tracking-tight">
//           {value || 'N/A'}
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import React from 'react';
import { 
  Mail, Building, IdCard, User, ShieldCheck, Loader2, AlertCircle, Phone, BookOpen, GraduationCap
} from "lucide-react";
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';
import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';

export function ProfileView() {
  const { userProfile, isLoading, error, getDisplayName, getEmail, getRoleDisplay } = useUserProfile();
  const { advisors } = useAdvisors();
  const { students } = useStudents();
  
  const getAdditionalDetails = () => {
    if (!userProfile) return null;
    
    if (userProfile.role === 'advisor') {
      return advisors.find(a => a.User?.sapid === userProfile.sapid);
    }
    
    if (userProfile.role === 'student') {
      return students.find(s => s.User?.sapid === userProfile.sapid);
    }
    return userProfile;
  };
  
  const details = getAdditionalDetails() as Record<string, any> | null;
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <Loader2 size={44} className="animate-spin text-[#1e3a5f] mb-3" />
        <p className="text-slate-500 text-sm font-medium">Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50/80 border border-red-200 p-8 rounded-3xl max-w-md shadow-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-bold text-lg">Error Loading Profile</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }
  
  const profileData = {
    name: getDisplayName(),
    email: getEmail(),
    id: userProfile?.sapid?.toString() || 'N/A',
    dept: userProfile?.profile?.department || details?.BatchModel?.ProgramModel?.programName || null,
    role: getRoleDisplay(),
    gender: details?.gender,
    contactNumber: details?.contactNumber || userProfile?.profile?.contactNumber,
    registrationNumber: details?.registrationNumber,
    currentSemester: details?.currentSemester,
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8">
      
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7d] p-8 text-white shadow-xl mb-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar Icon */}
          <div className="h-28 w-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
            <User size={56} strokeWidth={1.5} />
          </div>
          
          {/* Main User Details */}
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <ShieldCheck size={14} />
              <span>{profileData.role}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {profileData.name}
            </h2>
            
            <p className="text-slate-200 text-sm flex items-center justify-center md:justify-start gap-2">
              <Mail size={15} className="text-amber-300" />
              {profileData.email}
            </p>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Profile Details Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Account & Academic Details
          </h3>
          <span className="text-xs font-medium text-slate-400">Official Record</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DetailCard 
            icon={<IdCard className="text-[#1e3a5f]" size={20} />} 
            label="SAP ID / Employee ID" 
            value={profileData.id} 
          />
          <DetailCard 
            icon={<Mail className="text-[#1e3a5f]" size={20} />} 
            label="Official Email" 
            value={profileData.email} 
          />
          
          {profileData.dept && (
            <DetailCard 
              icon={<Building className="text-[#1e3a5f]" size={20} />} 
              label="Department / Program" 
              value={profileData.dept} 
            />
          )}
          
          {profileData.registrationNumber && (
            <DetailCard 
              icon={<GraduationCap className="text-[#1e3a5f]" size={20} />} 
              label="Registration Number" 
              value={profileData.registrationNumber} 
            />
          )}

          {profileData.currentSemester && (
            <DetailCard 
              icon={<BookOpen className="text-[#1e3a5f]" size={20} />} 
              label="Current Semester" 
              value={`Semester ${profileData.currentSemester}`} 
            />
          )}
          
          {profileData.contactNumber && (
            <DetailCard 
              icon={<Phone className="text-[#1e3a5f]" size={20} />} 
              label="Contact Number" 
              value={profileData.contactNumber.toString()} 
            />
          )}

          {profileData.gender && (
            <DetailCard 
              icon={<User className="text-[#1e3a5f]" size={20} />} 
              label="Gender" 
              value={profileData.gender} 
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-medium tracking-wider">
          Adviso Academic Management System • 2026
        </p>
      </div>
    </div>
  );
}

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-slate-800 font-semibold text-sm truncate">
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}