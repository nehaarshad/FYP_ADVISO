/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { SupportingVideo } from "@/src/models/supportingVideoModel";

interface UseVideoModalProps {
  createVideo: (data: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateVideo: (id: number, data: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  fetchVideos: (forceRefresh?: boolean) => Promise<void>;
}

export const useVideoModal = ({
  createVideo,
  updateVideo,
  fetchVideos,
}: UseVideoModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SupportingVideo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ title: "", description: "" });
    setFormErrors({});
    setEditingVideo(null);
    setSelectedFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setIsLoading(false);
  }, []);

  // Open create modal
  const handleCreate = useCallback(() => {
    resetForm();
    setIsModalOpen(true);
  }, [resetForm]);

  // Open edit modal
  const handleEdit = useCallback((video: SupportingVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
    });
    setFormErrors({});
    setSelectedFile(null);
    setVideoPreview(null);
    setIsModalOpen(true);
  }, []);

  // Handle form input change
const handleInputChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  },
  [formErrors]
);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith("video/")) {
      setFormErrors((prev) => ({ ...prev, videoFile: "Please select a valid video file" }));
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        videoFile: "Video size must be less than 500MB",
      }));
      return;
    }

    setSelectedFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setFormErrors((prev) => ({ ...prev, videoFile: "" }));
  }, []);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setSelectedFile(null);
    setVideoPreview(null);
    if (editingVideo) {
      // Keep the existing video URL for editing
    }
  }, [videoPreview, editingVideo]);

  // Validate form
  const validateForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!editingVideo && !selectedFile) {
      errors.videoFile = "Video file is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.title, editingVideo, selectedFile]);

  // Handle submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      setUploadProgress(0);

      try {
        let result;
        if (editingVideo) {
          // For update, only include file if a new one is selected
          const updateData: any = {
            title: formData.title,
            description: formData.description,
          };
          if (selectedFile) {
            updateData.videoFile = selectedFile;
          }
          result = await updateVideo(editingVideo.id, updateData);
        } else {
          if (!selectedFile) {
            setFormErrors({ videoFile: "Video file is required" });
            setIsLoading(false);
            return;
          }
          result = await createVideo({
            title: formData.title,
            description: formData.description,
            videoFile: selectedFile,
          });
        }

        if (result.success) {
          setIsModalOpen(false);
          resetForm();
          await fetchVideos(true);
        } else {
          setFormErrors({ submit: result.error || "Failed to save video" });
        }
        return result
      } catch (error: any) {
        setFormErrors({ submit: error.message || "An error occurred" });
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
    [
      validateForm,
      editingVideo,
      formData.title,
      formData.description,
      selectedFile,
      createVideo,
      updateVideo,
      fetchVideos,
      resetForm,
    ]
  );

  return {
    isModalOpen,
    editingVideo,
    formData,
    formErrors,
    isLoading,
    uploadProgress,
    selectedFile,
    videoPreview,
    setIsModalOpen,
    setUploadProgress,
    handleCreate,
    handleEdit,
    handleInputChange,
    handleFileSelect,
    handleRemoveFile,
    handleSubmit,
    resetForm,
  };
};