// src/hooks/suppportingVideo/supportingVideoHook.ts
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateVideoData, UpdateVideoData } from '@/src/repositories/supportingVideosRepository/supportingVideoRepo';
import { useSupportingVideoStore } from '@/src/storage/supportingVideoStore/supportingVideoStore';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';

export const useSupportingVideos = () => {
  const store = useSupportingVideoStore();
  const { userProfile } = useUserProfile();
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const hasFetched = useRef<boolean>(false);

  // Fetch videos on mount
  useEffect(() => {
    if (!hasFetched.current) {
      fetchVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVideos = useCallback(async (forceRefresh: boolean = false) => {
    if (hasFetched.current && !forceRefresh) return;
    
    try {
      await store.fetchVideos(forceRefresh);
      hasFetched.current = true;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  }, [store]);

  const createVideo = useCallback(async (data: CreateVideoData) => {
    const progressInterval = setInterval(() => {
      store.setUploadProgress(Math.min(store.uploadProgress + 10, 90));
    }, 300);
    
    const result = await store.createVideo(data);
    
    clearInterval(progressInterval);
    store.setUploadProgress(100);
    
    if (result.success) {
      hasFetched.current = true;
    }
    
    setTimeout(() => store.resetUploadProgress(), 1000);
    
    return result;
  }, [store]);

  const updateVideo = useCallback(async (id: number, data: UpdateVideoData) => {
    const progressInterval = setInterval(() => {
      store.setUploadProgress(Math.min(store.uploadProgress + 10, 90));
    }, 300);
    
    const result = await store.updateVideo(id, data);
    
    clearInterval(progressInterval);
    store.setUploadProgress(100);
    
    if (result.success) {
      hasFetched.current = true;
    }
    
    setTimeout(() => store.resetUploadProgress(), 1000);
    
    return result;
  }, [store]);

  const deleteVideo = useCallback(async (id: number) => {
    const result = await store.deleteVideo(id);
    
    if (result.success) {
      if (selectedVideoId === id) {
        setSelectedVideoId(null);
      }
    }
    
    return result;
  }, [store, selectedVideoId]);

  const getVideoById = useCallback((id: number) => {
    return store.getVideoById(id);
  }, [store]);

  const selectVideo = useCallback((id: number | null) => {
    setSelectedVideoId(id);
  }, []);

  const clearError = useCallback(() => store.clearError(), [store]);

  const clearCache = useCallback(() => {
    store.clearCache();
    hasFetched.current = false;
  }, [store]);

  // Get filtered videos based on user role
  const getFilteredVideos = useCallback(() => {
    const role = userProfile?.role;
    return store.videos.filter((video: any) => {
      if (!video.targetAudience) return true;
      if (video.targetAudience === 'all') return true;
      if (video.targetAudience === role) return true;
      if (role === 'coordinator' || role === 'admin') return true;
      return false;
    });
  }, [store.videos, userProfile]);

  return {
    // State
    videos: store.videos,
    filteredVideos: getFilteredVideos(),
    isLoading: store.isLoading,
    error: store.error,
    uploadProgress: store.uploadProgress,
    selectedVideoId,
    
    // Actions
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    selectVideo,
    clearError,
    clearCache,
  };
};