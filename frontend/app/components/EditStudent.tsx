/* eslint-disable react-hooks/set-state-in-effect */
// app/components/EditStudent.tsx (Fixed)
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { UserCog, Save, Hash, GraduationCap, Mail, CheckCircle2, AlertCircle, Loader2, X, Phone, Calendar, User } from "lucide-react";
import { useUpdateStudent } from '@/src/hooks/studentsHook/updateStudent';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { Student } from '@/src/models/studentModel';

interface EditStudentProp {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditStudent({ isOpen, student, onClose, onSuccess }: EditStudentProp) {
  const [status, setStatus] = useState("Active");
  const [formData, setFormData] = useState<any>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { updateStudent, isLoading, error } = useUpdateStudent();
  const { fetchStudents } = useStudents();

  // Populate form when student prop changes
  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        id: student.id,
        studentName: student.studentName || '',
        sapid: student.User?.sapid || '',
        email: student.email || '',
        contactNumber: student.contactNumber || '',
        programName: student.BatchModel?.ProgramModel?.programName || '',
        batchName: student.BatchModel?.batchName || '',
        batchYear: student.BatchModel?.batchYear || '',
        currentSemester: student.currentSemester || 1,
        registrationNumber: student.registrationNumber || '',
        dateOfBirth: student.dateOfBirth || '',
        cnic: student.cnic || '',
        currentStatus: student.StudentStatus?.currentStatus || 'Promoted',
        reason: student.StudentStatus?.reason || '',
        fullName: student.StudentGuardians?.[0]?.fullName || '',
        guardianemail: student.StudentGuardians?.[0]?.email || '',
        guardiancontactNumber: student.StudentGuardians?.[0]?.contactNumber || ''
      });
      const initialStatus = student.User?.isActive ? "Active" : "Inactive";
      setStatus(initialStatus);
      setUpdateSuccess(false);
      setUpdateError(null);
    }
  }, [student, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);
    
    const result = await updateStudent(formData.id, {
      studentName: formData.studentName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      programName: formData.programName,
      batchName: formData.batchName,
      batchYear: formData.batchYear,
      currentSemester: formData.currentSemester,
      registrationNumber: formData.registrationNumber,
      dateOfBirth: formData.dateOfBirth,
      cnic: formData.cnic,
      currentStatus: formData.currentStatus,
      reason: formData.reason,
      fullName: formData.fullName,
      guardianemail: formData.guardianemail,
      guardiancontactNumber: formData.guardiancontactNumber
    });
    
    if (result.success) {
      setUpdateSuccess(true);
      await fetchStudents(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } else {
      setUpdateError(result.error || "Failed to update student");
    }
  };

  if (!isOpen || !student) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <UserCog size={24} className="text-[#FDB813]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Edit Student Profile</h2>
              <p className="text-[10px] text-slate-400">Update student information</p>
            </div>
          </div>
          <button
          title='btn'
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status Badge */}
          {student && (
            <div className={`mb-6 inline-flex px-4 py-2 rounded-xl font-black text-[9px] uppercase items-center gap-2 ${
              status === "Active" ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
            }`}>
              <div className={`h-2 w-2 rounded-full ${status === "Active" ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              Account Status: {status}
            </div>
          )}

          {/* Messages */}
          {updateError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 text-sm">{updateError}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <p className="text-green-600 text-sm">Student updated successfully!</p>
            </div>
          )}

          {/* Form */}
          {formData && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <EditField 
                  label="Full Name" 
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  icon={<GraduationCap size={18}/>} 
                  required
                />
                <EditField 
                  label="Registration ID" 
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  icon={<Hash size={18}/>} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <EditField 
                  label="University Email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={18}/>} 
                  required
                />
                <EditField 
                  label="Contact Number" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  icon={<Phone size={18}/>} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5">Program *</label>
                  <select 
                    title="program name"
                    name="programName"
                    value={formData.programName}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer"
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="Computer Science">BS Computer Science</option>
                    <option value="Software Engineering">BS Software Engineering</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <EditField 
                    label="Batch Name" 
                    name="batchName"
                    value={formData.batchName}
                    onChange={handleChange}
                    icon={<Calendar size={18}/>} 
                  />
                  <EditField 
                    label="Batch Year" 
                    name="batchYear"
                    value={formData.batchYear}
                    onChange={handleChange}
                    icon={<Calendar size={18}/>} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <EditField 
                  label="Current Semester" 
                  name="currentSemester"
                  type="number"
                  value={formData.currentSemester}
                  onChange={handleChange}
                  icon={<GraduationCap size={18}/>} 
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5">Student Status</label>
                  <select 
                    title="status"
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer"
                  >
                    <option value="Promoted">Promoted</option>
                    <option value="Relegated">Relegated</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-black text-[#1e3a5f] mb-4">Guardian Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-6">
                  <EditField 
                    label="Guardian Name" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<User size={18}/>} 
                  />
                  <EditField 
                    label="Guardian Email" 
                    name="guardianemail"
                    type="email"
                    value={formData.guardianemail}
                    onChange={handleChange}
                    icon={<Mail size={18}/>} 
                  />
                  <EditField 
                    label="Guardian Contact" 
                    name="guardiancontactNumber"
                    value={formData.guardiancontactNumber}
                    onChange={handleChange}
                    icon={<Phone size={18}/>} 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isLoading ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditField({ label, name, value, onChange, icon, type = "text", placeholder = "", required = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest group-focus-within:text-[#FDB813] transition-colors">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813] transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none transition-all text-[#1e3a5f] focus:ring-2 ring-[#FDB813]/20" 
        />
      </div>
    </div>
  );
}