/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useRoadmap } from '@/src/hooks/contentUploader/roadmapUploader/roadmapHook';
import { usePrograms } from '@/src/hooks/programHook/useProgram';
import { RoadmapDetailView } from './RoadmapView';
import { RoadmapUploadForm } from './uploadRoadmap';
import { RoadmapCard } from './roadmapCard';
import { AssignBatchModal } from './assignToBatch';
import { LoadingState } from '../states/loadingState';
import { Roadmap, UploadData, AssignData } from './types';

export function RoadmapSection() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isSwitchingProgram, setIsSwitchingProgram] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoadmapForAssign, setSelectedRoadmapForAssign] = useState<Roadmap | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { 
    programRoadmaps, 
    isLoading, 
    error, 
    fetchProgramRoadmaps, 
    uploadRoadmap, 
    uploadProgress, 
    clearError,
    assignRoadmapToBatch 
  } = useRoadmap();
  
  const { programs, fetchPrograms } = usePrograms();
  const roadmapsCache = useRef<Map<string, Roadmap[]>>(new Map());

  // Fetch programs on mount
  useEffect(() => {
    clearError();
    fetchPrograms();
  }, [clearError, fetchPrograms]);

  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0].programName);
    }
  }, [programs, selectedProgram]);

  // Fetch roadmaps when program changes
  useEffect(() => {
    const loadRoadmaps = async () => {
      if (selectedProgram) {
        setIsSwitchingProgram(true);
        await fetchProgramRoadmaps(selectedProgram, true);
        setIsSwitchingProgram(false);
      }
    };
    loadRoadmaps();
  }, [selectedProgram, fetchProgramRoadmaps]);

  // Cache roadmaps
  useEffect(() => {
    if (selectedProgram && programRoadmaps.length > 0) {
      roadmapsCache.current.set(selectedProgram, [...programRoadmaps]);
    }
  }, [selectedProgram, programRoadmaps]);

  const handleProgramChange = useCallback((programName: string) => {
    if (programName === selectedProgram) return;
    setSelectedProgram(programName);
  }, [selectedProgram]);

  const handleUpload = async (data: UploadData) => {
    const result = await uploadRoadmap(data);
    if (result.success) {
      setShowUploadForm(false);
      roadmapsCache.current.delete(selectedProgram);
      if (selectedProgram) {
        await fetchProgramRoadmaps(selectedProgram, true);
      }
    }
  };

  const handleAssign = async (data: AssignData) => {
    const result = await assignRoadmapToBatch(data);
    
    if (result.success) {
      setShowAssignModal(false);
      setSelectedRoadmapForAssign(null);
      await fetchProgramRoadmaps(selectedProgram, true);
    }
    
    return result; 
  };

  const handleViewRoadmap = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowDetailView(true);
  };

  // Get unique roadmaps
  const uniqueRoadmaps = programRoadmaps.reduce((acc: Roadmap[], current: Roadmap) => {
    if (!acc.find(item => item.versionName === current.versionName)) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Loading state
  if ((isLoading || isSwitchingProgram) && programRoadmaps.length === 0 && selectedProgram) {
    return <LoadingState message={`Loading roadmaps for ${selectedProgram}...`} />;
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* SINGLE MAIN CARD - EXACT MATCH WITH COURSE OFFERINGS */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-6">
            <div>
              {/* Yahan Heading ko update kiya hai (normal aur chota) */}
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                Roadmap Management
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                View, filter and manage academic roadmaps
              </p>
            </div>

            <button 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all"
            >
              Upload New Roadmap
            </button>
          </div>

          {/* UPLOAD FORM (Shows when clicked) */}
          <AnimatePresence>
            {showUploadForm && (
              <div className="mb-6">
                <RoadmapUploadForm
                  programs={programs}
                  isLoading={isLoading}
                  uploadProgress={uploadProgress}
                  onUpload={handleUpload}
                  onCancel={() => setShowUploadForm(false)}
                />
              </div>
            )}
          </AnimatePresence>

          {/* FILTER SECTION - EXACT MATCH WITH COURSE OFFERINGS */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-[#1e3a5f]" />
              <h3 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
                Filter Roadmaps
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                title="Select Program"
                value={selectedProgram}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none min-w-[200px]"
              >
                {programs.map((p: any) => (
                  <option key={p.id} value={p.programName}>{p.programName}</option>
                ))}
              </select>
            </div>
            
            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 mt-2">
            {!selectedProgram && programs.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No programs available. Please add a program first.
              </div>
            )}

            {selectedProgram && (
              <div>
                {/* List Heading */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider">
                    {selectedProgram} Roadmaps ({uniqueRoadmaps.length})
                  </h3>
                </div>
                
                {/* Empty State or Cards */}
                {uniqueRoadmaps.length === 0 && !isLoading && !isSwitchingProgram ? (
                  <div className="text-center py-12 text-slate-400">
                    No roadmaps found for {selectedProgram.toLowerCase()}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uniqueRoadmaps.map((roadmap) => (
                      <RoadmapCard
                        key={roadmap.id}
                        roadmap={roadmap}
                        onView={() => handleViewRoadmap(roadmap)}
                        onAssign={() => {
                          setSelectedRoadmapForAssign(roadmap);
                          setShowAssignModal(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modals */}
      <RoadmapDetailView
        isOpen={showDetailView}
        roadmap={selectedRoadmap}
        onClose={() => setShowDetailView(false)}
      />

      <AssignBatchModal
        isOpen={showAssignModal}
        roadmap={selectedRoadmapForAssign}
        programName={selectedProgram}
        isAssigning={isAssigning}
        onAssign={handleAssign}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRoadmapForAssign(null);
        }}
      />
    </>
  );
}