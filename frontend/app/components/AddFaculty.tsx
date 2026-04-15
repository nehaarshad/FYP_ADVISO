// components/AddFaculty.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Fingerprint, Mail, ShieldCheck, Phone } from 'lucide-react';
import { useAddAdvisor } from '@/src/hooks/advisorHooks/addAdvisor';

export function AddFaculty() {
  const [formData, setFormData] = useState({
    advisorName: '',
    sapid: '',
    email: '',
    gender: 'Male',
    contactNumber: '',
    password: ''
  });
  
  const { addAdvisor, isLoading, error, success } = useAddAdvisor();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addAdvisor({
      ...formData,
      password: formData.password || `sap${formData.sapid}`
    });
    
    if (result.success) {
      // Reset form
      setFormData({
        advisorName: '',
        sapid: '',
        email: '',
        gender: 'Male',
        contactNumber: '',
        password: ''
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 bg-[#1e3a5f]/5 p-6 rounded-[2.5rem] border border-[#1e3a5f]/10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-[#1e3a5f] text-[#FDB813] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <UserPlus size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic leading-none">Faculty Registration</h2>
            </div>
          </div>
          {success && (
            <div className="bg-green-500/20 text-green-600 px-4 py-2 rounded-xl text-xs font-bold">
              Advisor added successfully!
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Row 1: Name & SAP ID */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  name="advisorName"
                  value={formData.advisorName}
                  onChange={handleChange}
                  placeholder="Dr. Muhammad Arshad" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Employee / SAP ID</label>
              <div className="relative">
                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  name="sapid"
                  value={formData.sapid}
                  onChange={handleChange}
                  placeholder="49XXX" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Gender */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="faculty@riphah.edu.pk" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Gender</label>
              <select
                title='gender' 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Row 3: Contact Number & Designation */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="tel" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="0300xxxxxxx" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group opacity-80">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Set Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FDB813]" size={16} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="*********" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Advisor Profile'} <UserPlus size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}