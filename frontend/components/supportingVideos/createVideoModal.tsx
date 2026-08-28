/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  FileVideo,
  Loader2,
  AlertCircle,
  Check,
  Play,
  Pause,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { SupportingVideo } from "@/src/models/supportingVideoModel";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingVideo?: SupportingVideo | null;
  formData: {
    title: string;
    description: string;
  };
  formErrors: { [key: string]: string };
  isLoading: boolean;
  uploadProgress: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileSelect: (file: File) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onRemoveFile?: () => void;
  selectedFile?: File | null;
  videoPreview?: string | null;
}

export default function VideoModal({
  isOpen,
  onClose,
  editingVideo,
  formData,
  formErrors,
  isLoading,
  uploadProgress,
  onInputChange,
  onFileSelect,
  onSubmit,
  onRemoveFile,
  selectedFile,
  videoPreview,
}: VideoModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  
  const [localFormData, setLocalFormData] = useState({
    title: formData.title || "",
    description: formData.description || "",
  });

  useEffect(() => {
    setLocalFormData({
      title: formData.title || "",
      description: formData.description || "",
    });
  }, [formData.title, formData.description]);

  // Reset preview playing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPreviewPlaying(false);
      if (previewVideoRef.current) {
        previewVideoRef.current.pause();
      }
    }
  }, [isOpen]);

  // Handle local input change
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onInputChange(e);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  // Toggle preview play
  const togglePreviewPlay = () => {
    if (previewVideoRef.current) {
      if (isPreviewPlaying) {
        previewVideoRef.current.pause();
      } else {
        previewVideoRef.current.play();
      }
      setIsPreviewPlaying(!isPreviewPlaying);
    }
  };

  // Handle form submit
 const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
      const syntheticEvent = {
      target: { 
        name: 'title', 
        value: localFormData.title 
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Update title
    onInputChange(syntheticEvent);
    
    // Update description
    const descEvent = {
      target: { 
        name: 'description', 
        value: localFormData.description 
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onInputChange(descEvent);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    await onSubmit(e);
  };
  if (!isOpen) return null;

  const isEditing = !!editingVideo;
  const hasVideoFile = selectedFile || videoPreview || (isEditing && editingVideo?.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1e3a5f]/10 rounded-xl">
              <FileVideo size={20} className="text-[#1e3a5f]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight">
                {isEditing ? "Edit Video" : "Upload New Video"}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? "Update video details" : "Add a new supporting video"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-4 md:p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Submit Error */}
          {formErrors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{formErrors.submit}</span>
            </div>
          )}

          {/* Video Upload Area */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
              {isEditing ? "Video File (Optional)" : "Video File *"}
            </label>

            {hasVideoFile ? (
              // Video Preview
              <div className="relative rounded-xl overflow-hidden bg-slate-900">
                {videoPreview || (isEditing && editingVideo?.videoUrl) ? (
                  <>
                    <video
                      ref={previewVideoRef}
                      src={videoPreview || editingVideo?.videoUrl}
                      className="w-full max-h-64 object-contain"
                      onPlay={() => setIsPreviewPlaying(true)}
                      onPause={() => setIsPreviewPlaying(false)}
                      onEnded={() => setIsPreviewPlaying(false)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                      <button
                        type="button"
                        onClick={togglePreviewPlay}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        {isPreviewPlaying ? (
                          <Pause size={28} className="text-white" />
                        ) : (
                          <Play size={28} className="text-white" />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-slate-100">
                    <FileVideo size={48} className="text-slate-300" />
                  </div>
                )}

                {/* File Info Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <FileVideo size={16} />
                      <span className="text-xs font-medium truncate">
                        {selectedFile?.name || editingVideo?.title || "Video file"}
                      </span>
                      {selectedFile && (
                        <span className="text-[10px] text-white/60">
                          ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      )}
                    </div>
                    {onRemoveFile && (
                      <button
                        type="button"
                        onClick={onRemoveFile}
                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Upload Drop Zone
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[#1e3a5f] bg-[#1e3a5f]/5"
                    : formErrors.videoFile
                    ? "border-red-300 bg-red-50/50"
                    : "border-slate-300 hover:border-[#1e3a5f] hover:bg-slate-50/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      isDragging ? "bg-[#1e3a5f]/10" : "bg-slate-100"
                    }`}
                  >
                    <Upload
                      size={28}
                      className={isDragging ? "text-[#1e3a5f]" : "text-slate-400"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {isDragging ? "Drop your video here" : "Drag & drop your video here"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      or click to browse (MP4, WebM, MOV - Max 500MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-xs font-bold hover:bg-[#15304a] transition-colors"
                  >
                    Select Video
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileSelect(file);
                    }}
                    className="hidden"
                  />
                </div>
                {formErrors.videoFile && (
                  <p className="mt-3 text-xs text-red-500">{formErrors.videoFile}</p>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={localFormData.title}
              onChange={handleLocalInputChange}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] ${
                formErrors.title ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              }`}
              placeholder="Enter video title"
              disabled={isLoading}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={localFormData.description}
              onChange={handleLocalInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              placeholder="Enter video description (optional)"
              disabled={isLoading}
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Uploading...</span>
                <span className="text-slate-400 font-bold">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1e3a5f] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (uploadProgress > 0 && uploadProgress < 100)}
              className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl text-xs font-black uppercase hover:bg-[#15304a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Check size={18} />
              )}
              {isEditing ? "Update" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}