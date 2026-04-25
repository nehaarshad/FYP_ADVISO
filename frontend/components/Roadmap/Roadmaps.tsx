/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, FileText, ExternalLink, Trash2, 
  Filter, ChevronDown, CheckCircle2, Eye, X,
  BookOpen, GraduationCap, Clock, Calendar, Layers,
  Loader2, AlertCircle
} from "lucide-react";
import { useRoadmap } from '@/src/hooks/contentUploader/roadmapUploader/roadmapHook';
import { usePrograms } from '@/src/hooks/programHook/useProgram';
import { RoadmapDetailView } from './RoadmapView';

export function RoadmapSection() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgram, setUploadProgram] = useState('');
  const [uploadBatch, setUploadBatch] = useState('');
  const [uploadYear, setUploadYear] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isSwitchingProgram, setIsSwitchingProgram] = useState(false);
  
  const { programRoadmaps, isLoading, error, fetchProgramRoadmaps, uploadRoadmap, uploadProgress, clearError } = useRoadmap();
  const { programs, fetchPrograms } = usePrograms();
  
  const roadmapsCache = useRef<Map<string, any[]>>(new Map());

  useEffect(() => {
     clearError()
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0].programName);
    }
  }, [programs, selectedProgram]);

  useEffect(() => {
    const loadRoadmaps = async () => {
      if (selectedProgram) {
        setIsSwitchingProgram(true);
        
      
          // Fetch fresh data
          await fetchProgramRoadmaps(selectedProgram, true);
    
        
        setIsSwitchingProgram(false);
      }
    };
    
    loadRoadmaps();
  }, [selectedProgram, fetchProgramRoadmaps]);

  // Cache roadmaps whenever they change
  useEffect(() => {
    if (selectedProgram && programRoadmaps.length > 0) {
      roadmapsCache.current.set(selectedProgram, [...programRoadmaps]);
    }
  }, [selectedProgram, programRoadmaps]);

  const handleProgramChange = useCallback(async (programName: string) => {
    if (programName === selectedProgram) return;
    
    // Clear current roadmaps immediately to show loading state
    setSelectedProgram(programName);
  }, [selectedProgram]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadProgram) {
      alert('Please fill all required fields');
      return;
    }
    
    const result = await uploadRoadmap({
      file: uploadFile,
      programName: uploadProgram,
      batchName: uploadBatch || undefined,
      batchYear: uploadYear || undefined
    });
    
    if (result.success) {
      setUploadFile(null);
      setUploadProgram('');
      setUploadBatch('');
      setUploadYear('');
      setShowUploadForm(false);
      
      // Clear cache for this program and refresh
      roadmapsCache.current.delete(selectedProgram);
      if (selectedProgram) {
        await fetchProgramRoadmaps(selectedProgram, true);
      }
    }
  };

  const handleViewRoadmap = (roadmap: any) => {
    setSelectedRoadmap(roadmap);
    setShowDetailView(true);
  };

  // Get unique roadmaps (by version name)
  const uniqueRoadmaps = programRoadmaps.reduce((acc: any[], current: any) => {
    if (!acc.find(item => item.versionName === current.versionName)) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Show loading state
  if ((isLoading || isSwitchingProgram) && programRoadmaps.length === 0 && selectedProgram) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading roadmaps for {selectedProgram}...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e3a5f]">
              Roadmap Management
            </h2>
            <p className="text-slate-500 text-sm mt-1">View, filter and manage academic roadmaps</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all flex items-center gap-2"
          >
            <CloudUpload size={16} />
            {showUploadForm ? 'Cancel' : 'Upload New Roadmap'}
          </button>
        </div>

        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Program Name *
                    </label>
                    <select
                      title='p'
                      value={uploadProgram}
                      onChange={(e) => setUploadProgram(e.target.value)}
                      className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                      required
                    >
                      <option value="">Select Program</option>
                      {programs.map((p: any) => (
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
                        title='b'
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
                    title='f'
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
                    onClick={() => {
                      setShowUploadForm(false);
                      setUploadFile(null);
                      setUploadProgram('');
                      setUploadBatch('');
                      setUploadYear('');
                    }}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Program Selector */}
              <select
                title='prog'
                value={selectedProgram}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                disabled={isSwitchingProgram}
              >
                {programs.length === 0 ? (
                  <option value="">Loading programs...</option>
                ) : (
                  programs.map((p: any) => (
                    <option key={p.id} value={p.programName}>{p.programName}</option>
                  ))
                )}
              </select>
              
            </div>
            
            {error && (
              <div className="text-red-500 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
                <button onClick={clearError} className="text-red-600 underline">Dismiss</button>
              </div>
            )}
          </div>
        </div>

        {/* No Program Selected Message */}
        {!selectedProgram && programs.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No programs available</p>
            <p className="text-slate-400 text-sm">Please add a program first to upload roadmaps</p>
          </div>
        )}

        {/* Roadmaps List */}
        {selectedProgram && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black uppercase italic text-sm text-[#1e3a5f]">
                {selectedProgram} Roadmaps ({uniqueRoadmaps.length})
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {uniqueRoadmaps.length === 0 && !isLoading && !isSwitchingProgram ? (
                <div className="p-12 text-center">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold">No roadmaps found for {selectedProgram}</p>
                  <p className="text-slate-400 text-sm">Upload a roadmap to get started</p>
                </div>
              ) : (
                uniqueRoadmaps.map((roadmap: any) => (
                  <RoadmapCard
                    key={roadmap.id}
                    roadmap={roadmap}
                    onView={() => handleViewRoadmap(roadmap)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Roadmap Detail Modal */}
      <RoadmapDetailView
        isOpen={showDetailView}
        roadmap={selectedRoadmap}
        onClose={() => setShowDetailView(false)}
      />
    </>
  );
}

// Roadmap Card Component
function RoadmapCard({ roadmap, onView }: { roadmap: any; onView: () => void }) {
  const categories = roadmap.RoadmapCourseCategoryModels || [];
  const semesters = roadmap.SemesterRoadmapModels || [];
  
  return (
    <div className="p-6 hover:bg-slate-50/50 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
            <BookOpen size={22} className="text-[#1e3a5f] group-hover:text-white" />
          </div>
          <div>
            <h4 className="font-black text-[#1e3a5f] text-base uppercase tracking-tight">
              {roadmap.versionName}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <GraduationCap size={10} /> {roadmap.totalCreditHours} Credits
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <Layers size={10} /> {categories.length} Categories
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <Calendar size={10} /> {semesters.length} Semesters
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onView}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#1e3a5f] hover:text-white transition-all flex items-center gap-2"
        >
          <Eye size={14} /> View Details
        </button>
      </div>
    </div>
  );
}