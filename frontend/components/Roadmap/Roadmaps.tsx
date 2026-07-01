/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRoadmap } from '@/src/hooks/contentUploader/roadmapUploader/roadmapHook';
import { usePrograms } from '@/src/hooks/programHook/useProgram';
import { RoadmapDetailView } from './RoadmapView';
import { RoadmapHeader } from './header';
import { RoadmapUploadForm } from './uploadRoadmap';
import { RoadmapFilter } from './filterRoadmap';
import { RoadmapCard } from './roadmapCard';
import { AssignBatchModal } from './assignToBatch';
import { EmptyState } from '../states/emptystate';
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
  
  return result; // Return the result so the modal can show the message
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
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <RoadmapHeader 
          showUploadForm={showUploadForm}
          onToggleUpload={() => setShowUploadForm(!showUploadForm)}
        />

        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <RoadmapUploadForm
              programs={programs}
              isLoading={isLoading}
              uploadProgress={uploadProgress}
              onUpload={handleUpload}
              onCancel={() => {
                setShowUploadForm(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Filter */}
        <RoadmapFilter
          programs={programs}
          selectedProgram={selectedProgram}
          onProgramChange={handleProgramChange}
          error={error}
          onClearError={clearError}
          isSwitchingProgram={isSwitchingProgram}
        />

        {/* No Program State */}
        {!selectedProgram && programs.length === 0 && (
          <EmptyState
            title="No programs available"
            message="Please add a program first to upload roadmaps"
          />
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
                <EmptyState
                  title={`No roadmaps found for ${selectedProgram}`}
                  message="Upload a roadmap to get started"
                />
              ) : (
                uniqueRoadmaps.map((roadmap) => (
                  <RoadmapCard
                    key={roadmap.id}
                    roadmap={roadmap}
                    onView={() => handleViewRoadmap(roadmap)}
                    onAssign={() => {
                      setSelectedRoadmapForAssign(roadmap);
                      setShowAssignModal(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <RoadmapDetailView
        isOpen={showDetailView}
        roadmap={selectedRoadmap}
        onClose={() => setShowDetailView(false)}
      />

      {/* Assign Modal */}
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