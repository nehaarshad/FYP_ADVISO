
// components/StudentRecords.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, BookOpen, Layers, Calendar, FileText, ChevronDown } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 -mt-6"
    >
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-4 ml-1">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
            <Upload size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">Upload Student Records</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Bulk upload students via Excel spreadsheet</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-10 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <p className="text-green-600 text-sm font-medium">Students uploaded successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Program Name (Full Width) */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
              Program Name *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813] z-10 pointer-events-none">
                <BookOpen size={16} />
              </div>
              <select 
                title='Program'
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-10 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f] appearance-none"
              >
                <option value="" disabled className="text-slate-400 font-normal">Select Program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.programName}>
                    {program.programName}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Row 2: Batch Name & Batch Year */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
                Batch Name *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813] z-10 pointer-events-none">
                  <Layers size={16} />
                </div>
                <select 
                  title='batch'
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-10 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f] appearance-none"
                >
                  <option value="" disabled className="text-slate-400 font-normal">Select Batch</option>
                  <option value="FALL">FALL</option>
                  <option value="SPRING">SPRING</option>
                  <option value="SUMMER">SUMMER</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
                Batch Year *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]">
                  <Calendar size={16} />
                </div>
                <input
                  type="text"
                  value={formData.batchYear}
                  onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Excel File Upload */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
              Excel File *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813] z-10 pointer-events-none">
                <FileText size={16} />
              </div>
              <input
                title='studentFile'
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f] file:ml-2 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#FDB813] hover:file:text-[#1e3a5f] cursor-pointer"
              />
              {selectedFile && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-600 ml-4">
                  <FileSpreadsheet size={16} />
                  <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 ml-4 mt-1">Supported format: .xlsx, .xls (Max 5MB)</p>
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#FDB813] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center font-bold text-slate-500">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isLoading || !selectedFile}
              className="px-12 py-4 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Processing...' : 'Process Records'} <Upload size={16} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}