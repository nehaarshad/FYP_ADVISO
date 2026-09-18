
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Layers, Mail, User, CheckCircle2, XCircle, Save, Loader2, AlertCircle, Phone, X, History } from "lucide-react";
import { useUpdateAdvisor } from '@/src/hooks/advisorHooks/updateAdvisor';
import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';
import { usePrograms } from '@/src/hooks/programHook/useProgram';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import { advisorProfileRepository } from '@/src/repositories/userProfileData/advisorsRepository/advisorRepository';

interface EditAdvisorProp {
  isOpen: boolean;
  advisor: BatchAdvisor | null;
  onClose: () => void;
}

export function EditAdvisor({ isOpen, advisor, onClose }: EditAdvisorProp) {
  const [status, setStatus] = useState("Active");
  const [formData, setFormData] = useState<any>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { programs } = usePrograms();
  const { updateAdvisor, isLoading, error } = useUpdateAdvisor();
  const { fetchAdvisors } = useAdvisors();

  useEffect(() => {
    if (advisor && isOpen) {
      const currentAssignment = advisor.BatchAssignments?.find(
        (assignment: any) => assignment.isCurrentlyAdvised === true
      );
      
      const activeAssignment = currentAssignment || advisor.BatchAssignments?.[0];
      
      setFormData({
        id: advisor.id,
        advisorName: advisor.advisorName || '',
        sapid: advisor.User?.sapid || '',
        email: advisor.email || '',
        gender: advisor.gender || 'Male',
        contactNumber: advisor.contactNumber || '',
        batchName: activeAssignment?.BatchModel?.batchName || '',
        batchYear: activeAssignment?.BatchModel?.batchYear || '',
        programName: activeAssignment?.BatchModel?.ProgramModel?.programName || '',
        isCurrentlyAdvised: activeAssignment?.isCurrentlyAdvised || false
      });
      
      const initialStatus = activeAssignment?.isCurrentlyAdvised ? "Active" : "Inactive";
      setStatus(initialStatus);
      setUpdateSuccess(false);
      setUpdateError(null);
    }
  }, [advisor?.id, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);
    
    const result = await updateAdvisor(formData.id, {
      advisorName: formData.advisorName,
      email: formData.email,
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      batchName: formData.batchName,
      batchYear: formData.batchYear,
      programName: formData.programName,
      isCurrentlyAdvised: status === "Active"
    });
    
    if (result.success) {
      setUpdateSuccess(true);
      advisorProfileRepository.clearCache();
      
      // Close modal immediately to prevent any visual flicker or lag
      onClose(); 

      // Refresh list quietly in the background
      fetchAdvisors(true);    
    } else {
      setUpdateError(result.error || "Failed to update advisor");
    }
  };

  if (!isOpen || !advisor) return null;

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
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-[#FDB813]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Edit Advisor Profile</h2>
              <p className="text-[10px] text-slate-400">Update advisor information & view history</p>
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
          <div className={`mb-6 inline-flex px-4 py-2 rounded-xl font-black text-[9px] uppercase items-center gap-2 ${
            status === "Active" ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
          }`}>
            <div className={`h-2 w-2 rounded-full ${status === "Active" ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            Current Status: {status}
          </div>

          {/* Error Messages */}
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
              <p className="text-green-600 text-sm">Advisor updated successfully!</p>
            </div>
          )}

          {/* Update Form */}
          {formData && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row 1: Advisor Name & Email */}
              <div className="grid grid-cols-2 gap-6">
                <EditField 
                  label="Advisor Name" 
                  name="advisorName"
                  value={formData.advisorName}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  required
                />
                <EditField 
                  label="Email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={18} />}
                  required
                />
              </div>

              {/* Row 2: Gender & Contact Number */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                    Gender *
                  </label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      title="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer text-[#1e3a5f]"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <EditField 
                  label="Contact Number" 
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                  required
                />
              </div>
             
              <h3 className="text-sm font-black text-[#1e3a5f] mb-4">Assign Batch</h3>
            
              {/* Row 3: Batch Assignment */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                    Batch Name
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      title="batch"
                      name="batchName"
                      value={formData.batchName}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                    >
                      <option value="">Select Batch</option>
                      <option value="FALL">FALL</option>
                      <option value="SPRING">SPRING</option>
                      <option value="SUMMER">SUMMER</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                    Batch Year
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      name="batchYear"
                      value={formData.batchYear}
                      onChange={handleChange}
                      placeholder="e.g., 2024"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                    Program
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      title="Program"
                      name="programName"
                      value={formData.programName}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
                    >
                      <option value="">Select Program</option>
                      {programs.map((program: any) => (
                        <option key={program.id} value={program.programName}>
                          {program.programName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Previous Batch Assignments History Section */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest flex items-center gap-1.5">
                  <History size={14} /> Previous Assessment
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-40 overflow-y-auto space-y-2">
                  {advisor.BatchAssignments && advisor.BatchAssignments.length > 0 ? (
                    advisor.BatchAssignments.map((assignment: any, index: number) => {
                      const batchModel = assignment.BatchModel;
                      const programName = batchModel?.ProgramModel?.programName || 'N/A';
                      const batchName = batchModel?.batchName || 'Unknown Batch';
                      const batchYear = batchModel?.batchYear || '';
                      const isCurrent = assignment.isCurrentlyAdvised;

                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-[#1e3a5f]"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-2.5 w-2.5 rounded-full ${isCurrent ? 'bg-green-500' : 'bg-slate-300'}`} />
                            <div>
                              <p>{programName} - <span className="text-slate-500">{batchName} {batchYear}</span></p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] uppercase font-black ${
                            isCurrent ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isCurrent ? 'Current Active' : 'Previous'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-3 font-medium">No previous batch history found.</p>
                  )}
                </div>
              </div>

              {/* Row 4: Activation Status */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                  Currently Advising Status
                </label>
                <div className="flex gap-3 h-[60px] bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setStatus("Active")} 
                    className={`flex-1 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
                      status === "Active" 
                        ? 'bg-white text-green-600 shadow-md' 
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 size={14} /> ACTIVE
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStatus("Inactive")} 
                    className={`flex-1 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
                      status === "Inactive" 
                        ? 'bg-white text-red-600 shadow-md' 
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    <XCircle size={14} /> INACTIVE
                  </button>
                </div>
              </div>

              {/* Buttons */}
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
                  {isLoading ? 'Updating...' : 'Update Advisor'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Reusable EditField component
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