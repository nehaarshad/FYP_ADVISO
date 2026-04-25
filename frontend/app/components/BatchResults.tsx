/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/BatchResults.tsx
"use client";
import React, { useState } from 'react';
import { Trash2, Eye, GraduationCap, Upload, Loader2, AlertCircle, CheckCircle, X, Download } from "lucide-react";
import { useResults } from '@/src/hooks//resultHook/useResult';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export const BatchResults = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    programName: '',
    batchName: '',
    batchYear: '',
    sessionType: 'FALL',
    sessionYear: '2025'
  });
  const [uploadedResults, setUploadedResults] = useState<any[]>([]);
  
  const { uploadResults, isLoading, error, success, uploadProgress, clearSuccess } = useResults();
  const { programs } = usePrograms();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.programName || !formData.batchName || !formData.batchYear) {
      alert('Please fill all required fields');
      return;
    }
    
    const result = await uploadResults({
      file: selectedFile,
      sessionType: formData.sessionType,
      sessionYear: formData.sessionYear,
      programName: formData.programName,
      batchName: formData.batchName,
      batchYear: formData.batchYear
    });
    
    if (result.success) {
      setShowUploadModal(false);
      setSelectedFile(null);
      setFormData({
        programName: '',
        batchName: '',
        batchYear: '',
        sessionType: 'FALL',
        sessionYear: '2025'
      });
      // Add to uploaded results list
      setUploadedResults(prev => [...prev, {
        id: Date.now(),
        programName: formData.programName,
        batchName: formData.batchName,
        batchYear: formData.batchYear,
        session: `${formData.sessionType} ${formData.sessionYear}`,
        uploadedAt: new Date().toLocaleDateString()
      }]);
      setTimeout(clearSuccess, 3000);
    }
  };

  const handleViewResult = (result: any) => {
    // TODO: Implement view result details
    console.log('View result:', result);
  };

  const handleDeleteResult = (id: number) => {
    setUploadedResults(prev => prev.filter(r => r.id !== id));
  };

  return (
    <>
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic leading-none">Batch Results</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
              {uploadedResults.length} results uploaded
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all"
          >
            Upload Results
          </button>
        </div>

        <div className="space-y-4">
          {uploadedResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No results uploaded yet
            </div>
          ) : (
            uploadedResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-[#FDB813] transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] shadow-sm group-hover:bg-[#FDB813] transition-colors">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="font-black text-[#1e3a5f] text-sm uppercase">
                      {result.programName} - {result.batchName} {result.batchYear}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[9px] text-slate-400">{result.session}</span>
                      <span className="text-[9px] text-slate-400">Uploaded: {result.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Upload Batch Results</h3>
              <button  title='t' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Session Type</label>
                  <select
                   title='t'
                    value={formData.sessionType}
                    onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                    className="w-full p-2 bg-slate-50 rounded-lg text-sm mt-1"
                  >
                    <option value="FALL">FALL</option>
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Session Year</label>
                  <input
                    type="text"
                    value={formData.sessionYear}
                    onChange={(e) => setFormData({ ...formData, sessionYear: e.target.value })}
                    className="w-full p-2 bg-slate-50 rounded-lg text-sm mt-1"
                    placeholder="2025"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Program Name</label>
                <select
                 title='t'
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.programName}>{p.programName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Batch Name</label>
                  <select
                   title='t'
                    value={formData.batchName}
                    onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                    className="w-full p-2 bg-slate-50 rounded-lg text-sm mt-1"
                    required
                  >
                    <option value="">Select</option>
                    <option value="FALL">FALL</option>
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Batch Year</label>
                  <input
                    type="text"
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="w-full p-2 bg-slate-50 rounded-lg text-sm mt-1"
                    placeholder="2024"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Excel File</label>
                <input
                 title='t'
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1"
                  required
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#FDB813] h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-center text-slate-500">{uploadProgress}%</p>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs p-2 bg-red-50 rounded">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-xs p-2 bg-green-50 rounded">
                  <CheckCircle size={14} /> Results uploaded successfully!
                </div>
              )}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {isLoading ? 'Uploading...' : 'Upload Results'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}