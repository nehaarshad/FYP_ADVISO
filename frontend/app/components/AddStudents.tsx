/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React , {useState} from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Hash, Mail, ArrowRight, User, Phone, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { useAddStudent } from '@/src/hooks/studentsHook/addStudent';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export function AddStudent() {
  const [formData, setFormData] = useState({
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
  
  const { addStudent, isLoading, error, success } = useAddStudent();
  const { programs, programOptions, isLoading: programsLoading } = usePrograms();
  

  React.useEffect(() => {
   // fetchPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: name === "currentSemester" ? Number(value) : value
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addStudent({
      ...formData,
      password:  `sap${formData.sapid}`
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        
        <div className="flex items-center gap-4 mb-8 p-6 rounded-[2rem] bg-slate-50">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-[#1e3a5f] text-[#FDB813] shadow-sm">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic leading-none text-[#1e3a5f]">Enroll Student</h2>
            <p className="text-[10px] text-slate-400 mt-1">Create new student account</p>
          </div>
        </div>

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
              placeholder="e.g., Valeeja Jamil" 
              icon={<GraduationCap size={16}/>}
              value={formData.studentName}
              onChange={handleChange}
              required
            />
            <InputField 
              label="SAP ID / CMS *" 
              name="sapid"
              placeholder="49100" 
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
              placeholder="std@riphah.edu.pk" 
              icon={<Mail size={16}/>}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField 
              label="Contact Number" 
              name="contactNumber"
              placeholder="0300xxxxxxx" 
              icon={<Phone size={16}/>}
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Staus *</label>
              <select 
              title='status'
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer"
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
              placeholder="e.g., reason about student current status..." 
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Program *</label>
              <select 
              title='Program'
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer"
                required
              >
                <option value="" disabled>Select Program</option>
                {programs.map((p: any) => (
                  <option key={p.id} value={p.programName}>{p.programName}</option>
                ))}
              </select>
            </div>
            <InputField 
              label="Semester *" 
              name="currentSemester"
              placeholder="e.g., 1" 
              icon={<GraduationCap size={16}/>}
              value={formData.currentSemester}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Batch *</label>
              <select 
              title='batch'
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer"
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
                placeholder="2024" 
                icon={<Calendar size={16}/>}
                value={formData.batchYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          

          {/* Guardian Information */}
          <div className="border-t border-slate-100 pt-6 mt-4">
            <h3 className="text-sm font-black text-[#1e3a5f] mb-4">Guardian Information (Optional)</h3>
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
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
          >
            <ArrowRight size={18} /> {isLoading ? 'Registering...' : 'Register Student'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function InputField({ label, name, placeholder, icon, type = "text", value, onChange, required = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]">
          {icon}
        </div>
        <input 
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
        />
      </div>
    </div>
  );
}