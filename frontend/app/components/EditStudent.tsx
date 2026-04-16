/* eslint-disable @typescript-eslint/no-explicit-any */
'use-client'
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { UserCog, Search, Save, Hash, GraduationCap, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUpdateStudent } from '@/src/hooks/studentsHook/updateStudent';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';

export function EditStudent() {
  const [searchSapId, setSearchSapId] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const { updateStudent, isLoading, error, success } = useUpdateStudent();
  const { students, getStudentBySapId } = useStudents();

  const handleSearch = async () => {
    if (!searchSapId.trim()) {
      setSearchError("Please enter SAP ID");
      return;
    }
    
    setIsLoadingSearch(true);
    setSearchError(null);
    
    try {
      const student = getStudentBySapId(parseInt(searchSapId));
      
      if (student) {
        setFormData({
          id: student.id,
          studentName: student.studentName,
          sapid: student.User.sapid,
          email: student.email,
          contactNumber: student.contactNumber || '',
          programName: student.BatchModel?.ProgramModel?.programName || '',
          batchName: student.BatchModel?.batchName || '',
          batchYear: student.BatchModel?.batchYear || '',
          currentSemester: student.currentSemester,
          registrationNumber: student.registrationNumber || '',
          dateOfBirth: student.dateOfBirth || '',
          cnic: student.cnic || '',
          currentStatus: student.StudentStatus?.currentStatus || 'Promoted',
          reason: student.StudentStatus?.reason || '',
          fullName: student.StudentGuardians?.[0]?.fullName || '',
          guardianemail: student.StudentGuardians?.[0]?.email || '',
          guardiancontactNumber: student.StudentGuardians?.[0]?.contactNumber || ''
        });
        setIsFound(true);
      } else {
        setSearchError("Student not found with this SAP ID");
        setIsFound(false);
      }
    } catch (err: any) {
      setSearchError(err.message || "Error searching student");
      setIsFound(false);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Optionally refresh or show success message
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        
        <div className="flex justify-between items-center mb-8 p-6 bg-[#1e3a5f] rounded-[2rem]">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-white/10 backdrop-blur-md text-[#FDB813] rounded-2xl flex items-center justify-center">
              <UserCog size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">Edit Student Profile</h2>
              <p className="text-[9px] text-white/50">Search and update student information</p>
            </div>
          </div>
          
          {isFound && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
              <CheckCircle2 size={14} /> Record Loaded
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-8 p-2 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center gap-2">
          <div className="pl-4 text-slate-400"><Search size={20} /></div>
          <input 
            type="text" 
            value={searchSapId}
            onChange={(e) => setSearchSapId(e.target.value)}
            placeholder="Search by SAP ID (e.g. 49100)..." 
            className="flex-1 py-4 bg-transparent outline-none font-black text-sm text-[#1e3a5f] placeholder:text-slate-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={isLoadingSearch}
            className="bg-[#1e3a5f] text-white px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoadingSearch ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Fetch Data
          </button>
        </div>

        {searchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{searchError}</p>
          </div>
        )}

        {/* Update Form */}
        {isFound && formData && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <EditField 
                label="Full Name" 
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                icon={<GraduationCap size={18}/>} 
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
              />
              <EditField 
                label="Contact Number" 
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                icon={<Mail size={18}/>} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5">Program</label>
                <select 
                  title='program name'
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer"
                >
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
                  icon={<Hash size={18}/>} 
                />
                <EditField 
                  label="Batch Year" 
                  name="batchYear"
                  value={formData.batchYear}
                  onChange={handleChange}
                  icon={<Hash size={18}/>} 
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
                  title='status'
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/30 cursor-pointer"
                >
                  <option value="Promoted">Promoted</option>
                  <option value="Relegated">Relegated</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-black text-[#1e3a5f] mb-4">Guardian Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <EditField 
                  label="Guardian Name" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  icon={<GraduationCap size={18}/>} 
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
                  icon={<Mail size={18}/>} 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#1e3a5f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-4 mt-6 disabled:opacity-50"
            >
              <Save size={20} /> {isLoading ? 'Updating...' : 'Update Student Record'}
            </button>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            {success && <p className="text-green-500 text-center text-sm">Student updated successfully!</p>}
          </form>
        )}
      </div>
    </motion.div>
  );
}

function EditField({ label, name, value, onChange, icon, type = "text", readOnly = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
        <input 
          title='field'
          type={type}
          name={name}
          value={value}
          placeholder=''
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full pl-12 pr-6 py-4 rounded-[1.5rem] font-bold text-xs outline-none transition-all ${
            readOnly ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-[#1e3a5f] focus:ring-2 ring-[#FDB813]/20'
          }`} 
        />
      </div>
    </div>
  );
}