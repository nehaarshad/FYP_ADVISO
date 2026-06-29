// components/StudentRecords.tsx (Updated for Bulk Upload)
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { useBulkUpload } from '@/src/hooks/contentUploader/bulkStudentUpload/useBulkStudentUpload';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export function StudentRecords() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    programName: '',
    batchName: '',
    batchYear: ''
  });
  
    const { programs, programOptions, isLoading: programsLoading } = usePrograms();
  const { bulkUpload, isLoading, error, success, uploadProgress } = useBulkUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: name === "currentSemester" ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    
    if (!formData.programName || !formData.batchName || !formData.batchYear) {
      alert('Please fill all required fields');
      return;
    }
    
    await bulkUpload({
      file: selectedFile,
      programName: formData.programName,
      batchName: formData.batchName,
      batchYear: formData.batchYear
    });
    
    if (success) {
      setSelectedFile(null);
      setFormData({ programName: '', batchName: '', batchYear: '' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="px-4">
        <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic tracking-tighter leading-none">
          Upload Student Records
        </h2>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Upload Type
          </label>
          <select className="w-full p-5mm bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none appearance-none cursor-pointer text-[#1e3a5f]">
            <option>New Student List (.csv)</option>
            <option>Batch Enrollment (.xlsx)</option>
            <option>Course Registration Data</option>
          </select>
        </div>
        {/* Action Button */}
        <button 
          className="w-full py-5 bg-[#1e3a5f] text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] active:scale-95 transition-all"
        >
          Process Records
        </button>
      </div>
    </motion.div>
  );
}