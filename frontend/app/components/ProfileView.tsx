"use client";
import React, { useState } from 'react';
import { Edit3, Save, Mail, Building, IdCard, ShieldCheck } from "lucide-react";

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aleena Ayub",
    email: "aleena.ayub@riphah.edu.pk",
    id: "RIU-COORD-2026",
    dept: "Computing & SE"
  });

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-8">
            <div className="h-24 w-24 bg-[#FDB813] rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-[#1e3a5f] shadow-lg">AA</div>
            <div>
              <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic leading-none">
                {isEditing ? <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="bg-slate-50 border-b-2 border-[#FDB813] outline-none px-2" /> : profile.name}
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic">Coordinator Profile</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all"
          >
            {isEditing ? <><Save size={16}/> Save</> : <><Edit3 size={16}/> Edit</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField icon={<IdCard size={18}/>} label="Coordinator ID" value={profile.id} isEditing={false} />
          <ProfileField icon={<Mail size={18}/>} label="Official Email" value={profile.email} isEditing={isEditing} onChange={(val: string) => setProfile({...profile, email: val})} />
          <ProfileField icon={<Building size={18}/>} label="Department" value={profile.dept} isEditing={isEditing} onChange={(val: string) => setProfile({...profile, dept: val})} />
          <ProfileField icon={<ShieldCheck size={18}/>} label="Access Level" value="Full System Administrative" isEditing={false} />
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, isEditing, onChange }: any) {
  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:border-[#FDB813] transition-all">
      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1e3a5f] group-hover:bg-[#FDB813]">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{label}</p>
        {isEditing ? (
          <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-[#1e3a5f]" />
        ) : (
          <p className="font-bold text-[#1e3a5f]">{value}</p>
        )}
      </div>
    </div>
  );
}