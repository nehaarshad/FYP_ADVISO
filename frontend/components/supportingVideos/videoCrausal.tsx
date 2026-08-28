/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  PlayCircle, ChevronLeft, ChevronRight, Edit, Trash2, Plus,
  Loader2 
} from "lucide-react";
import VideoPlayer from "./videoPlayer";
import { useSupportingVideos } from "@/src/hooks/suppportingVideo/supportingVideoHook";
import { useUserProfile } from "@/src/hooks/profileHook/useProfile";
import VideoModal from "./createVideoModal";
import DeleteVideoDialog from "./deleteVideo";
import { useVideoModal } from "@/src/hooks/suppportingVideo/useSupportingVideo";

interface VideoCarouselProps {
  onVideoUpdate?: () => void;
}

export default function VideoCarousel({ onVideoUpdate }: VideoCarouselProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showVideoDeleteConfirm, setShowVideoDeleteConfirm] = useState<number | null>(null);
  const [isDeletingVideo, setIsDeletingVideo] = useState<number | null>(null);
  
  const {
    videos,
    isLoading: isVideosLoading,
    error: videosError,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
  } = useSupportingVideos();

  const { userProfile } = useUserProfile();

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

  // Prepare video guides
  const videoGuides = useMemo(() => {
    if (!videos || videos.length === 0) {
      return [
        {
          title: "How to navigate Graduation?",
          desc: "Watch this 2-minute guide to understand how to apply for your final degree and transcript.",
          tag: "Main Tutorial",
          videoUrl: null,
          id: null
        },
        {
          title: "Credit Hours Policy 2026",
          desc: "Detailed explanation of enrollment limits based on CGPA and special request procedures.",
          tag: "Academic Policy",
          videoUrl: null,
          id: null
        },
        {
          title: "Transcript & Degree Collection",
          desc: "Step-by-step process of clearance from different departments before the final award.",
          tag: "Clearance Guide",
          videoUrl: null,
          id: null
        }
      ];
    }

    return videos.map((video, index) => ({
      title: video.title,
      desc: video.description || "Watch this video guide for more information.",
      tag: index === 0 ? "Main Tutorial" : "Supporting Guide",
      videoUrl: video.videoUrl,
      id: video.id
    }));
  }, [videos]);

  // Video navigation
  const nextVideo = () => {
    if (videoGuides.length > 1) {
      setCurrentVideo((prev) => (prev + 1) % videoGuides.length);
    }
  };

  const prevVideo = () => {
    if (videoGuides.length > 1) {
      setCurrentVideo((prev) => (prev - 1 + videoGuides.length) % videoGuides.length);
    }
  };

  // Reset video index if videos change
  useEffect(() => {
    if (videoGuides.length > 0 && currentVideo >= videoGuides.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentVideo(0);
    }
  }, [videoGuides.length, currentVideo]);

  // Handle video delete
  const handleVideoDelete = async (id: number) => {
    if (!id) return;
    setIsDeletingVideo(id);
    try {
      const result = await deleteVideo(id);
      if (result.success) {
        setShowVideoDeleteConfirm(null);
        await fetchVideos(true);
        if (onVideoUpdate) onVideoUpdate();
      }
    } catch (error: any) {
      console.error("Delete video error:", error);
    } finally {
      setIsDeletingVideo(null);
    }
  };

  // Check if user has edit/delete permissions
  const canManageVideos = userProfile?.role === 'coordinator' || userProfile?.role === 'admin';

  return (
    <>
      <div className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto ">
          <div className="relative">
            {/* Desktop Navigation Buttons */}
            {videoGuides.length > 1 && (
              <>
                <button
                  onClick={prevVideo}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white border border-slate-200 rounded-full items-center justify-center text-[#1e3a5f] shadow-lg hover:bg-slate-50 transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
              </>
            )}

            <div className="bg-blue-950/100 rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Video Player */}
                <div className="w-full md:w-72 lg:w-80 flex-shrink-0">
                  {videoGuides[currentVideo]?.videoUrl ? (
                    <div className="relative">
                      <VideoPlayer
                        videoUrl={videoGuides[currentVideo].videoUrl}
                        title={videoGuides[currentVideo].title}
                        description={videoGuides[currentVideo].desc}
                        autoPlay={false}
                        className="w-full aspect-video rounded-xl"
                        allowDownload={false}
                        allowShare={false}
                        showControls={true}
                      />
                  
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-xl" />
                      <PlayCircle size={48} className="text-slate-300 group-hover:scale-110 transition-all z-10" />
                      <p className="absolute bottom-3 text-xs text-slate-400">No video available</p>
                      
                      {/* Coordinator can upload when no video */}
                      {canManageVideos && (
                        <button
                          onClick={handleVideoCreate}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                        >
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                            <Plus size={24} className="text-[#1e3a5f]" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      
                      <h3 className="text-lg font-bold text-white uppercase">
                        {videoGuides[currentVideo]?.title || "Video Guide"}
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        {videoGuides[currentVideo]?.desc || "Watch this video guide for more information."}
                      </p>
                    </div>
                    
                    {/* Coordinator/Admin Controls - Alternative position */}
                    {canManageVideos && videoGuides[currentVideo]?.videoUrl && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            const video = videos.find(v => v.id === videoGuides[currentVideo]?.id);
                            if (video) handleVideoEdit(video);
                          }}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Edit video"
                        >
                          <Edit size={16} className="text-[#1e3a5f]" />
                        </button>
                        <button
                          onClick={() => setShowVideoDeleteConfirm(videoGuides[currentVideo]?.id)}
                          className="p-2 bg-slate-100 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete video"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Navigation Dots */}
                  {videoGuides.length > 1 && (
                    <div className="flex justify-center md:justify-start gap-2 mt-4">
                      {videoGuides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentVideo(index)}
                          className={`h-2 rounded-full transition-all ${
                            currentVideo === index
                              ? "w-8 bg-[#1e3a5f]"
                              : "w-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  {videoGuides.length > 1 && (
                    <div className="flex md:hidden justify-center gap-4 mt-4">
                      <button
                        onClick={prevVideo}
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-xs text-slate-400">
                        {currentVideo + 1} / {videoGuides.length}
                      </span>
                      <button
                        onClick={nextVideo}
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop Navigation Buttons - Right */}
                {videoGuides.length > 1 && (
                  <button
                    onClick={nextVideo}
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white border border-slate-200 rounded-full items-center justify-center text-[#1e3a5f] shadow-lg hover:bg-slate-50 transition-all active:scale-90"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
            if (onVideoUpdate) onVideoUpdate();
          }
        }}
        onRemoveFile={handleVideoRemoveFile}
        selectedFile={selectedFile}
        videoPreview={videoPreview}
      />

      {/* Delete Video Dialog */}
      <DeleteVideoDialog
        isOpen={showVideoDeleteConfirm !== null}
        onClose={() => setShowVideoDeleteConfirm(null)}
        onConfirm={() => handleVideoDelete(showVideoDeleteConfirm!)}
        isDeleting={isDeletingVideo === showVideoDeleteConfirm}
        videoTitle={videos.find(v => v.id === showVideoDeleteConfirm)?.title}
      />
    </>
  );
}