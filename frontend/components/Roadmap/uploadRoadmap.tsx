import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Program, UploadData } from './types';

interface RoadmapUploadFormProps {
  programs: Program[];
  isLoading: boolean;
  uploadProgress: number;
  onUpload: (data: UploadData) => Promise<void>;
  onCancel: () => void;
}

export function RoadmapUploadForm({ 
  programs, 
  isLoading, 
  uploadProgress, 
  onUpload,
  onCancel 
}: RoadmapUploadFormProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgram, setUploadProgram] = useState('');
  const [uploadBatch, setUploadBatch] = useState('');
  const [uploadYear, setUploadYear] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadProgram) {
      alert('Please fill all required fields');
      return;
    }
    
    await onUpload({
      file: uploadFile,
      programName: uploadProgram,
      batchName: uploadBatch || undefined,
      batchYear: uploadYear || undefined
    });
    
    // Reset form on success (handled by parent)
    setUploadFile(null);
    setUploadProgram('');
    setUploadBatch('');
    setUploadYear('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Program Name *
            </label>
            <select
              title="program-select"
              value={uploadProgram}
              onChange={(e) => setUploadProgram(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
              required
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.programName}>{p.programName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Batch Name
              </label>
              <select
                title="batch-select"
                value={uploadBatch}
                onChange={(e) => setUploadBatch(e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
              >
                <option value="">Select Batch</option>
                <option value="FALL">FALL</option>
                <option value="SPRING">SPRING</option>
                <option value="SUMMER">SUMMER</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Batch Year
              </label>
              <input
                type="text"
                value={uploadYear}
                onChange={(e) => setUploadYear(e.target.value)}
                placeholder="e.g., 2024"
                className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
            Excel File *
          </label>
          <input
            title="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#FDB813]"
            required
          />
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#FDB813] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center text-slate-500">Uploading... {uploadProgress}%</p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-4 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload Roadmap'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}