// components/StudentRecords.tsx (Updated for Bulk Upload)
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { useBulkUpload } from '@/src/hooks/contentUploader/bulkStudentUpload/useBulkStudentUpload';

export function StudentRecords() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    programName: '',
    batchName: '',
    batchYear: ''
  });
  
  const { bulkUpload, isLoading, error, success, uploadProgress } = useBulkUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <p className="text-green-600 text-sm font-medium">Students uploaded successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Program Name *
            </label>
            <input
              type="text"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
              placeholder="e.g., Software Engineering"
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none text-[#1e3a5f]"
              required
            />
          </div>

          {/* Batch Name and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Batch Name *
              </label>
              <input
                type="text"
                value={formData.batchName}
                onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                placeholder="e.g., SPRING"
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none text-[#1e3a5f]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Batch Year *
              </label>
              <input
                type="text"
                value={formData.batchYear}
                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                placeholder="e.g., 2023"
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none text-[#1e3a5f]"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Excel File *
            </label>
            <div className="relative">
              <input
                title='studentFile'
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none text-[#1e3a5f] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#FDB813] hover:file:text-[#1e3a5f]"
                required
              />
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <FileSpreadsheet size={16} />
                  <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#FDB813] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-slate-500">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !selectedFile}
            className="w-full py-5 bg-[#1e3a5f] text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <Upload size={18} />
            {isLoading ? 'Processing...' : 'Process Records'}
          </button>
        </form>

        <div className="text-xs text-center text-slate-400">
          Supported format: .xlsx, .xls (Max 5MB)
        </div>
      </div>
    </motion.div>
  );
}