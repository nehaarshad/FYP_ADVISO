/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "./PageHeader";
import { SuccessMessage } from "../states/success";
import { GuidelinesFilters } from "./filteerGuidline";
import { GuidelinesList } from "./allGuidlineList";
import { GuidelineModal } from "./guidlineModal";
import { DeleteConfirmDialog } from "./deleteGuidline";
import { useGuidelineFilters } from "@/src/hooks/degreeGuidlineHook/useGuidlineFilter";
import { useSuccessMessage } from "@/src/hooks/states/useState";
import { useGuidelineForm } from "@/src/hooks/degreeGuidlineHook/useGuidlineFormHook";
import VideoPlayer from "../supportingVideos/videoPlayer";
import { PlayCircle, ChevronLeft, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { useSupportingVideos } from "@/src/hooks/suppportingVideo/supportingVideoHook";
import { useVideoModal } from "@/src/hooks/suppportingVideo/useSupportingVideo";
import VideoModal from "../supportingVideos/createVideoModal";
import { Program } from "../Roadmap/types";
import { useUserProfile } from "@/src/hooks/profileHook/useProfile";
import { useDegreeGuidelines } from "@/src/hooks/degreeGuidlineHook/degreeGuidlineHook";
import { usePrograms } from "@/src/hooks/programHook/useProgram";
import VideoCarousel from "../supportingVideos/videoCrausal";

export default function DegreeGuidelinesManagement({ onBack }: any) {
  // Hooks
  const {
    guidelines,
    isLoading,
    error,
    fetchGuidelines,
    createGuideline,
    updateGuideline,
    deleteGuideline,
    clearError,
  } = useDegreeGuidelines();

  const { programs, fetchPrograms, isLoading: isProgramsLoading } = usePrograms();
  const { userProfile } = useUserProfile();
  
  const {
    videos,
    isLoading: isVideosLoading,
    error: videosError,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
  } = useSupportingVideos();

  // Video Modal Hook
  const {
    isModalOpen: isVideoModalOpen,
    editingVideo,
    formData: videoFormData,
    formErrors: videoFormErrors,
    isLoading: isVideoLoading,
    uploadProgress,
    selectedFile,
    videoPreview,
    setIsModalOpen: setVideoModalOpen,
    setUploadProgress,
    handleCreate: handleVideoCreate,
    handleEdit: handleVideoEdit,
    handleInputChange: handleVideoInputChange,
    handleFileSelect: handleVideoFileSelect,
    handleRemoveFile: handleVideoRemoveFile,
    handleSubmit: handleVideoSubmit,
    resetForm: resetVideoForm,
  } = useVideoModal({
    createVideo,
    updateVideo,
    fetchVideos,
  });

  // Custom hooks for guidelines
  const {
    formData,
    formErrors,
    editingGuideline,
    isModalOpen,
    resetForm,
    handleInputChange,
    handleProgramSelection,
    handleCreate,
    handleEdit,
    handleSubmit,
    setFormErrors,
    setIsModalOpen,
  } = useGuidelineForm({ createGuideline, updateGuideline, fetchGuidelines });

  const {
    searchTerm,
    selectedProgramFilter,
    filteredGuidelines,
    programOptions,
    handleSearchChange,
    handleFilterChange,
  } = useGuidelineFilters({ guidelines, programs, userProfile });

  const { successMessage, setSuccessMessage } = useSuccessMessage();

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchGuidelines(undefined, undefined, true);
    fetchPrograms();
    fetchVideos(true);
  }, []);


  // Handle delete
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      const result = await deleteGuideline(id);
      if (result.success) {
        setShowDeleteConfirm(null);
        setSuccessMessage(result.message || "Guideline deleted successfully");
        await fetchGuidelines(undefined, undefined, true);
      } else {
        setFormErrors({ submit: result.error || "Failed to delete guideline" });
      }
    } catch (error: any) {
      setFormErrors({ submit: error.message || "An error occurred" });
    } finally {
      setIsDeleting(null);
    }
  };



  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50">
      <PageHeader
        onBack={onBack}
        onCreate={handleCreate}
        onUploadVideo={handleVideoCreate}
        isVideoModalOpen={isVideoModalOpen}
        onVideoModalClose={() => {
          setVideoModalOpen(false);
          resetVideoForm();
        }}
      />

      {successMessage && <SuccessMessage message={successMessage} />}

      <GuidelinesFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedProgram={selectedProgramFilter}
        onFilterChange={handleFilterChange}
        programOptions={programOptions}
      />

   {/* Video Carousel Section */}
<VideoCarousel onVideoUpdate={() => {
  // Refresh any other data that depends on videos
  fetchGuidelines(undefined, undefined, true);
}} />

      <GuidelinesList
        guidelines={filteredGuidelines}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          clearError();
          fetchGuidelines(undefined, undefined, true);
        }}
        onEdit={handleEdit}
        onDelete={setShowDeleteConfirm}
        onCreate={handleCreate}
        getProgramName={(programId) => {
          const program = programs.find((p:Program) => p.id === programId);
          return program ? program.programName : "All Programs";
        }}
      />

      {/* Guideline Modal */}
      <GuidelineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        editingGuideline={editingGuideline}
        formData={formData}
        formErrors={formErrors}
        programs={programs}
        isLoading={isLoading || isProgramsLoading}
        onInputChange={handleInputChange}
        onProgramSelection={handleProgramSelection}
        onSubmit={handleSubmit}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setVideoModalOpen(false);
          resetVideoForm();
        }}
        editingVideo={editingVideo}
        formData={videoFormData}
        formErrors={videoFormErrors}
        isLoading={isVideoLoading}
        uploadProgress={uploadProgress}
        onInputChange={handleVideoInputChange}
        onFileSelect={handleVideoFileSelect}
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await handleVideoSubmit(e);
          if (result?.success) {
            setVideoModalOpen(false);
            resetVideoForm();
            await fetchVideos(true);
            setSuccessMessage(result.message || "Video uploaded successfully");
          }
        }}
        onRemoveFile={handleVideoRemoveFile}
        selectedFile={selectedFile}
        videoPreview={videoPreview}
      />

      {/* Delete Confirmation Dialog - for Guidelines */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDelete(showDeleteConfirm!)}
        isDeleting={isDeleting === showDeleteConfirm}
      />
    </div>
  );
}