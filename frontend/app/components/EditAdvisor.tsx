/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Layers, Mail, User, CheckCircle2, XCircle, Search, Save, Loader2, AlertCircle, Phone } from "lucide-react";
import { useUpdateAdvisor } from '@/src/hooks/advisorHooks/updateAdvisor';
import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';

export function EditAdvisor() {
  const [status, setStatus] = useState("Active");
  const [searchId, setSearchId] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { updateAdvisor, isLoading, error, success } = useUpdateAdvisor();
  const { advisors, getAdvisorBySapId, fetchAdvisors } = useAdvisors();

  // Handle search by SAP ID
  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter SAP ID");
      return;
    }
    
    setIsLoadingSearch(true);
    setSearchError(null);
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      // First ensure advisors are loaded
      if (!advisors || advisors.length === 0) {
        await fetchAdvisors(true);
      }
      
      const advisor = getAdvisorBySapId(parseInt(searchId));
      
      if (advisor) {
        setFormData({
          id: advisor.id,
          advisorName: advisor.advisorName || '',
          sapid: advisor.User?.sapid || '',
          email: advisor.email || '',
          gender: advisor.gender || 'Male',
          contactNumber: advisor.contactNumber || '',
          batchName: advisor.BatchAssignments?.[0]?.BatchModel?.batchName || '',
          batchYear: advisor.BatchAssignments?.[0]?.BatchModel?.batchYear || '',
          programName: advisor.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.programName || '',
          isCurrentlyAdvised: advisor.BatchAssignments?.[0]?.isCurrentlyAdvised || false
        });
        // Set status based on the fetched advisor's active status
        const initialStatus = advisor.User?.isActive ? "Active" : "Inactive";
        setStatus(initialStatus);
        setIsFound(true);
      } else {
        setSearchError("Advisor not found with this SAP ID");
        setIsFound(false);
        setFormData(null);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError(err.message || "Error searching advisor");
      setIsFound(false);
      setFormData(null);
    } finally {
      setIsLoadingSearch(false);
    }
  };

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
      
      // Refresh advisor data from backend
      await fetchAdvisors(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } else {
      setUpdateError(result.error || "Failed to update advisor");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto pb-10">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8 p-6 bg-[#1e3a5f] rounded-[2rem]">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-white/10 backdrop-blur-md text-[#FDB813] rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">Edit Advisor Profile</h2>
              <p className="text-[9px] text-white/50">Search and update advisor information</p>
            </div>
          </div>
    
          {isFound && (
            <div className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase flex items-center gap-2 ${
              status === "Active" ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`h-2 w-2 rounded-full ${status === "Active" ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              Status: {status}
            </div>
          )}
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-8 p-2 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center gap-2">
          <div className="pl-4 text-slate-400"><Search size={20} /></div>
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search Advisor by SAP ID (e.g. 49XXX)..." 
            className="flex-1 py-4 bg-transparent outline-none font-black text-sm text-[#1e3a5f] placeholder:text-slate-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={isLoadingSearch}
            className="bg-[#1e3a5f] text-white px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoadingSearch ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Fetch Advisor
          </button>
        </div>

        {/* Error Messages */}
        {searchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{searchError}</p>
          </div>
        )}

        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{updateError}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center gap-3">
            <CheckCircle2 className="text-green-500" size={20} />
            <p className="text-green-600 text-sm">Advisor updated successfully!</p>
          </div>
        )}

        {/* UPDATE FORM - Becomes visible after fetch */}
        {isFound && formData && (
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
                    title='gender'
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer text-[#1e3a5f]"
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
                  <input 
                    type="text"
                    name="batchName"
                    value={formData.batchName}
                    onChange={handleChange}
                    placeholder="e.g., SPRING"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
                  />
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
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                  Program
                </label>
                <div className="relative">
                  <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text"
                    name="programName"
                    value={formData.programName}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineering"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Activation Status */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
               Currently Advising Status
              </label>
              <div className="flex gap-3 h-[60px] bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100">
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

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-4 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isLoading ? 'Updating...' : 'Update Advisor Profile'}
            </button>
          </form>
        )}

        {/* No data found message */}
        {!isFound && searchId && !isLoadingSearch && !searchError && (
          <div className="text-center py-12">
            <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No advisor found. Try a different SAP ID.</p>
          </div>
        )}
      </div>
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
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none transition-all text-[#1e3a5f] focus:ring-2 ring-[#FDB813]/20" 
        />
      </div>
    </div>
  );
}
