
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Hash, Mail, User, Phone, Calendar, AlertCircle, ArrowLeft } from "lucide-react";
import { useAddStudent } from '@/src/hooks/studentsHook/addStudent';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

interface AddStudentProps {
  onBack?: () => void;
}

export function AddStudent({ onBack }: AddStudentProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    sapid: '',
    email: '',
    contactNumber: '',
    password: '',
    programName: '',
    batchName: '',
    batchYear: '',
    currentSemester: 1 as number | '',
    registrationNumber: '',
    dateOfBirth: '',
    cnic: '',
    currentStatus: 'Promoted',
    reason: '',
    fullName: '',
    guardianemail: '',
    guardiancontactNumber: ''
  });
  
  const { addStudent, isLoading, error, success } = useAddStudent();
  const { programs } = usePrograms();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "currentSemester" ? (value === "" ? "" : Number(value)) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addStudent({
      ...formData,
      currentSemester: Number(formData.currentSemester) || 1,
      password: `sap${formData.sapid}`
    });
    
    if (result.success) {
      setFormData({
        studentName: '',
        sapid: '',
        email: '',
        contactNumber: '',
        password: '',
        programName: '',
        batchName: '',
        batchYear: '',
        currentSemester: 1,
        registrationNumber: '',
        dateOfBirth: '',
        cnic: '',
        currentStatus: 'Promoted',
        reason: '',
        fullName: '',
        guardianemail: '',
        guardiancontactNumber: ''
      });
    }
  };

  return (
    /* Yahan max-w-4xl ko max-w-5xl (ya max-w-6xl) kar diya hai aur px-4 add kiya hai taake outer space kam ho jaye */
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 -mt-6">
      
      {/* Top Header Section (Back Button + Modern Styled Heading) */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-4">
          <div className="h-13 w-13 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200">
            <GraduationCap size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">Enroll Student</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Register a new student account and profile</p>
          </div>
        </div>      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-green-500" size={20} />
            <p className="text-green-600 text-sm">Student added successfully!</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <InputField 
              label="Student Name *" 
              name="studentName"
              placeholder="Full Name" 
              icon={<GraduationCap size={16}/>}
              value={formData.studentName}
              onChange={handleChange}
              required
            />
            <InputField 
              label="SAP ID / CMS *" 
              name="sapid"
              placeholder="xxxxx" 
              icon={<Hash size={16}/>}
              value={formData.sapid}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <InputField 
              label="Official Email *" 
              name="email"
              placeholder="xxxxx@riphah.edu.pk" 
              icon={<Mail size={16}/>}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField 
              label="Contact Number" 
              name="contactNumber"
              placeholder="xxxxxxxxxxx" 
              icon={<Phone size={16}/>}
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">Status *</label>
              <select 
                title='status'
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                required
              >
                <option value="">Select Status</option>
                <option key="Regular" value="Regular">New Admission</option>
                <option key="Promoted" value="Promoted">Promoted</option>
                <option key="Promoted on 1st Prob" value="Promoted on 1st Prob">Promoted on 1st Prob</option>
                <option key="Promoted on 2nd Prob" value="Promoted on 2nd Prob">Promoted on 2nd Prob</option>
                <option key="Relegated" value="Relegated">Relegated</option>
              </select>
            </div>
            <InputField 
              label="Reason" 
              name="reason"
              placeholder="Reason about student current status..." 
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          {/* Program & Semester Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">Program *</label>
              <select 
                title='Program'
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                required
              >
                <option value="" disabled>Select Program</option>
                {programs.map((p: any) => (
                  <option key={p.id} value={p.programName}>{p.programName}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">Semester *</label>
              <select 
                title='Semester'
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Batch & Batch Year Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">Batch *</label>
              <select 
                title='batch'
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                required
              >
                <option value="">Select Batch</option>
                <option key="FALL" value="FALL">FALL</option>
                <option key="SPRING" value="SPRING">SPRING</option>
                <option key="SUMMER" value="SUMMER">SUMMER</option>
              </select>
            </div>
            <InputField 
              label="Batch Year *" 
              name="batchYear"
              placeholder="" 
              icon={<Calendar size={16}/>}
              value={formData.batchYear}
              onChange={handleChange}
              required
            />
          </div>

          {/* Guardian Information */}
          <div className="border-t border-slate-100 pt-6 mt-4">
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-4">Guardian Information (Optional)</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputField 
                label="Guardian Name" 
                name="fullName"
                placeholder="Full name" 
                icon={<User size={16}/>}
                value={formData.fullName}
                onChange={handleChange}
              />
              <InputField 
                label="Guardian Email" 
                name="guardianemail"
                placeholder="guardian@email.com" 
                icon={<Mail size={16}/>}
                type="email"
                value={formData.guardianemail}
                onChange={handleChange}
              />
              <InputField 
                label="Guardian Contact" 
                name="guardiancontactNumber"
                placeholder="0300xxxxxxx" 
                icon={<Phone size={16}/>}
                value={formData.guardiancontactNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Button aligned to end (right) */}
          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={isLoading}
              className="px-12 py-4 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function InputField({ label, name, placeholder, icon, type = "text", value, onChange, required = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]">
          {icon}
        </div>
        <input 
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
        />
      </div>
    </div>
  );
}