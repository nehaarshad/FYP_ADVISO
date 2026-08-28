// src/storage/supportingVideoStore/supportingVideoStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { SupportingVideo } from '@/src/models/supportingVideoModel';
import { CreateVideoData, supportingVideoRepository, UpdateVideoData } from '@/src/repositories/supportingVideosRepository/supportingVideoRepo';

interface SupportingVideoState {
  videos: SupportingVideo[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  uploadProgress: number;

  // Actions
  fetchVideos: (forceRefresh?: boolean) => Promise<void>;
  createVideo: (data: CreateVideoData) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateVideo: (id: number, data: UpdateVideoData) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteVideo: (id: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  getVideoById: (id: number) => SupportingVideo | undefined;
  clearError: () => void;
  clearCache: () => void;
  setUploadProgress: (progress: number) => void;
  resetUploadProgress: () => void;
}

export const useSupportingVideoStore = create<SupportingVideoState>((set, get) => ({
  videos: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  uploadProgress: 0,

  fetchVideos: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await supportingVideoRepository.getAllVideos(forceRefresh);
      
      if (response.success && response.data) {
        set({ 
          videos: response.data, 
          isLoading: false,
          lastFetched: Date.now()
        });
      } else {
        set({ 
          error: response.error || 'Failed to fetch videos', 
          isLoading: false,
          videos: []
        });
      }
    } catch (error: any) {
      console.error('Fetch videos error:', error);
      set({ 
        error: error.message || 'Failed to fetch videos', 
        isLoading: false,
        videos: []
      });
    }
  },

  createVideo: async (data: CreateVideoData) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const response = await supportingVideoRepository.createVideo(data);
      
      if (response.success) {
        // Refresh the videos list
        await get().fetchVideos(true);
        
        return { 
          success: true, 
          message: response.message || 'Video created successfully'
        };
      } else {
        set({ error: response.error || 'Failed to create video', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to create video'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to create video', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to create video'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  updateVideo: async (id: number, data: UpdateVideoData) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const response = await supportingVideoRepository.updateVideo(id, data);
      
      if (response.success) {
        // Refresh the videos list
        await get().fetchVideos(true);
        
        return { 
          success: true, 
          message: response.message || 'Video updated successfully'
        };
      } else {
        set({ error: response.error || 'Failed to update video', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to update video'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update video', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to update video'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVideo: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await supportingVideoRepository.deleteVideo(id);
      
      if (response.success) {
        // Remove from local state and refresh
        const { videos } = get();
        set({ 
          videos: videos.filter(v => v.id !== id),
          isLoading: false
        });
        
        // Refresh to ensure consistency
        await get().fetchVideos(true);
        
        return { 
          success: true, 
          message: response.message || 'Video deleted successfully'
        };
      } else {
        set({ error: response.error || 'Failed to delete video', isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Failed to delete video'
        };
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete video', isLoading: false });
      return { 
        success: false, 
        error: error.message || 'Failed to delete video'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  getVideoById: (id: number) => {
    const { videos } = get();
    return videos.find(video => video.id === id);
  },

  clearError: () => set({ error: null }),
  
  clearCache: () => {
    supportingVideoRepository.clearCache();
    set({ videos: [], lastFetched: null });
  },

  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
  
  resetUploadProgress: () => set({ uploadProgress: 0 }),
}));