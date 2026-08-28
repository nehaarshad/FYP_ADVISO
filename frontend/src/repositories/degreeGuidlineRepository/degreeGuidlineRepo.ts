// src/repositories/degreeGuidelinesRepository/degreeGuidelinesRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { DegreeGuidlineModel } from '@/src/models/degreeGuidlineModel';

export interface CreateDegreeGuidelineData {
  title: string;
  description: string;
  programIds: number[];
}

export interface UpdateDegreeGuidelineData {
  title?: string;
  description?: string;
  programIds?: number[];
}

class DegreeGuidelinesRepository extends BaseApiService {
  private static instance: DegreeGuidelinesRepository;
  private guidelinesCache: DegreeGuidlineModel[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): DegreeGuidelinesRepository {
    if (!DegreeGuidelinesRepository.instance) {
      DegreeGuidelinesRepository.instance = new DegreeGuidelinesRepository();
    }
    return DegreeGuidelinesRepository.instance;
  }

  // Get all guidelines with caching
  async getAllGuidelines(
    forceRefresh: boolean = false
  ): Promise<ApiResponse<DegreeGuidlineModel[]>> {
    const now = Date.now();

    if (!forceRefresh && this.guidelinesCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached guidelines', this.guidelinesCache.length);
      return {
        success: true,
        data: this.guidelinesCache,
        message: 'Guidelines retrieved from cache'
      };
    }

    try {
    
      const url = AppApis.getAllGuidelines;
      
      const response = await this.getApiResponse<{ data: DegreeGuidlineModel[], success: boolean }>(url);
      console.log('Get guidelines response:', response);
      
      if (response.success && response.data) {
        let guidelinesData: DegreeGuidlineModel[] = [];
        
        if (Array.isArray(response.data)) {
          guidelinesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          guidelinesData = response.data.data;
        } else {
          guidelinesData = [];
        }
        
        this.guidelinesCache = guidelinesData;
        this.lastFetchTime = now;
        
        return {
          success: true,
          data: guidelinesData,
          message: 'Guidelines retrieved successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to fetch guidelines');
      }
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch guidelines',
        data: []
      };
    }
  }

  // Create degree guideline with multiple programs
  async createGuideline(data: CreateDegreeGuidelineData): Promise<ApiResponse<DegreeGuidlineModel>> {
    try {
      console.log('Creating guideline:', data);
      const response = await this.postApiWithJson<{ message: string, success: boolean, data?: DegreeGuidlineModel }>(
        AppApis.createGuideline,
        data
      );
      
      console.log('Create guideline response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          data: response.data?.data,
          message: response.data?.message || 'Guideline created successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to create guideline');
      }
    } catch (error) {
      console.error('Create guideline error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create guideline'
      };
    }
  }

  // Update degree guideline
  async updateGuideline(id: number, data: UpdateDegreeGuidelineData): Promise<ApiResponse<DegreeGuidlineModel>> {
    try {
      const url=AppApis.updateGuideline.replace(':id',id.toString())

      console.log('Updating guideline:', id, data,url);
      const response = await this.updateApiWithJson<{ message: string, success: boolean, data?: DegreeGuidlineModel }>(
       url,
        data
      );
      
      console.log('Update guideline response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          data: response.data?.data,
          message: response.data?.message || 'Guideline updated successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to update guideline');
      }
    } catch (error) {
      console.error('Update guideline error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update guideline'
      };
    }
  }

  // Delete degree guideline
  async deleteGuideline(id: number): Promise<ApiResponse<void>> {
    try {
      console.log('Deleting guideline:', id);
          const url=AppApis.deleteGuideline.replace(':id',id.toString())

      const response = await this.deleteApiResponse<{ message: string, success: boolean }>(
        url
      );
      
      console.log('Delete guideline response:', response);
      
      if (response.success) {
        this.clearCache();
        return {
          success: true,
          message: response.data?.message || 'Guideline deleted successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to delete guideline');
      }
    } catch (error) {
      console.error('Delete guideline error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete guideline'
      };
    }
  }

  // Clear cache
  clearCache(): void {
    this.guidelinesCache = [];
    this.lastFetchTime = 0;
    console.log('Guidelines cache cleared');
  }

  // Get cached guidelines without fetching
  getCachedGuidelines(): DegreeGuidlineModel[] {
    return this.guidelinesCache;
  }
}

export const degreeGuidelinesRepository = DegreeGuidelinesRepository.getInstance();