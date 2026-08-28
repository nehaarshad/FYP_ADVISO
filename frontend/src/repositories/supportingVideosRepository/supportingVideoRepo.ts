// src/repositories/supportingVideoRepository/supportingVideoRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { SupportingVideo } from '@/src/models/supportingVideoModel';

export interface CreateVideoData {
  title: string;
  description: string;
  videoFile: File;
}

export interface UpdateVideoData {
  title?: string;
  description?: string;
  videoFile?: File;
}

class SupportingVideoRepository extends BaseApiService {
  private static instance: SupportingVideoRepository;
  private videosCache: SupportingVideo[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): SupportingVideoRepository {
    if (!SupportingVideoRepository.instance) {
      SupportingVideoRepository.instance = new SupportingVideoRepository();
    }
    return SupportingVideoRepository.instance;
  }

  // Get all videos with caching
  async getAllVideos(forceRefresh: boolean = false): Promise<ApiResponse<SupportingVideo[]>> {
    const now = Date.now();
    
    if (!forceRefresh && this.videosCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached videos', this.videosCache.length);
      return {
        success: true,
        data: this.videosCache,
        message: 'Videos retrieved from cache'
      };
    }

    try {
      const response = await this.getApiResponse<{ data: SupportingVideo[], success: boolean }>(AppApis.getAllVideos);
      console.log('Get videos response:', response);
      
      if (response.success && response.data) {
        let videosData: SupportingVideo[] = [];
        
        if (Array.isArray(response.data)) {
          videosData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          videosData = response.data.data;
        } else {
          videosData = [];
        }
        
        this.videosCache = videosData;
        this.lastFetchTime = now;
        
        return {
          success: true,
          data: videosData,
          message: 'Videos retrieved successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch videos',
        data: []
      };
    }
  }

  // Create video with file upload
  async createVideo(data: CreateVideoData): Promise<ApiResponse<SupportingVideo>> {
    try {
      console.log('Creating video:', data.title);
      
      const formData = {
        'title': data.title,
        'description': data.description 
      }
      
      const response = await this.postExcelFile<{ message: string, success: boolean, data?: SupportingVideo }>(
        AppApis.createVideo,
        data.videoFile,
        'videoFile',
        formData
      );
      
      console.log('Create video response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          data: response.data?.data,
          message: response.data?.message || 'Video created successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to create video');
      }
    } catch (error) {
      console.error('Create video error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create video'
      };
    }
  }

  // Update video with optional file upload
  async updateVideo(id: number, data: UpdateVideoData): Promise<ApiResponse<SupportingVideo>> {
    try {
      console.log('Updating video:', id,data);
          const url=AppApis.updateVideo.replace(':id',id.toString())
      const formData = {
        'title':data.title,
        'description':data.description

      }
      console.log(formData)
    
      const response = await this.updateApiWithJson<{ message: string, success: boolean, data?: SupportingVideo }>(
        url,
        formData
      );
      
      console.log('Update video response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          data: response.data?.data,
          message: response.data?.message || 'Video updated successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to update video');
      }
    } catch (error) {
      console.error('Update video error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update video'
      };
    }
  }

  // Delete video
  async deleteVideo(id: number): Promise<ApiResponse<void>> {
    try {
      console.log('Deleting video:', id);
      const url=AppApis.deleteVideo.replace(':id',id.toString())
      const response = await this.deleteApiResponse<{ message: string, success: boolean }>(
      url
      );
      
      console.log('Delete video response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          message: response.data?.message || 'Video deleted successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Delete video error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete video'
      };
    }
  }

  // Clear cache
  clearCache(): void {
    this.videosCache = [];
    this.lastFetchTime = 0;
    console.log('Video cache cleared');
  }

  // Get cached videos without fetching
  getCachedVideos(): SupportingVideo[] {
    return this.videosCache;
  }
}

export const supportingVideoRepository = SupportingVideoRepository.getInstance();