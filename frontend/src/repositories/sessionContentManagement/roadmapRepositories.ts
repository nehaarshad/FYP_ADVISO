/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/roadmap/roadmapRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { Roadmap } from '@/src/models/RoadmapModel';

export interface UploadRoadmapData {
  file: File;
  programName: string;
  batchName?: string;
  batchYear?: string;
}

class RoadmapRepository extends BaseApiService {
  private static instance: RoadmapRepository;
  private programRoadmapsCache: Roadmap[] = [];
  private batchRoadmapCache: Roadmap | null = null;
  private lastFetchTime: { [key: string]: number } = {};
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): RoadmapRepository {
    if (!RoadmapRepository.instance) {
      RoadmapRepository.instance = new RoadmapRepository();
    }
    return RoadmapRepository.instance;
  }

  async uploadRoadmap(data: UploadRoadmapData): Promise<ApiResponse<Roadmap>> {
    try {
      const additionalData: Record<string, string> = {
        programName: data.programName
      };
      if (data.batchName) additionalData.batchName = data.batchName;
      if (data.batchYear) additionalData.batchYear = data.batchYear;
      
      const response = await this.postExcelFile(
        AppApis.uploadRoadmapUrl,
        data.file,
        'roadmapFile',
        additionalData
      ) as ApiResponse<Roadmap>;
      
      if (response.success) {
        // Clear cache after upload
        this.programRoadmapsCache = [];
        this.batchRoadmapCache = null;
        this.lastFetchTime = {};
        this.getProgramRoadmaps(data.programName,true)
      }
      
      return response;
    } catch (error) {
      console.error('Upload roadmap error:', error);
      throw error;
    }
  }

  async getProgramRoadmaps(programName: string, forceRefresh: boolean = false): Promise<ApiResponse<Roadmap[]>> {
    const cacheKey = `program_${programName}`;
    const now = Date.now();
    
    if (!forceRefresh && this.programRoadmapsCache.length > 0 && 
        (now - this.lastFetchTime[cacheKey]) < this.cacheDuration) {
      console.log('Returning cached program roadmaps');
      return { success: true, data: this.programRoadmapsCache };
    }

    try {
         const encodedProgramName = encodeURIComponent(programName);
      const url = AppApis.getProgramRoadmapsUrl.replace(':programName', encodedProgramName);
      console.log("get prog roadmap ", url)
      const response = await this.getApiResponse(url);
      
      if (response.success && response.data) {
        let roadmapsData = [];
        if (Array.isArray(response.data)) {
          roadmapsData = response.data;
        } else if (response.data !== null && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as { data: unknown }).data)) {
          roadmapsData = response.data.data as unknown as any[];
        } else {
          roadmapsData = [response.data];
        }
        
        this.programRoadmapsCache = roadmapsData;
        this.lastFetchTime[cacheKey] = now;
        return { success: true, data: roadmapsData };
      }
      return response as ApiResponse<Roadmap[]>;
    } catch (error) {
      console.error('Get program roadmaps error:', error);
      throw error;
    }
  }

  async getBatchRoadmap(batchName: string, batchYear: string, programName: string, forceRefresh: boolean = false): Promise<ApiResponse<any>> {
    const cacheKey = `batch_${batchName}_${batchYear}_${programName}`;
    const now = Date.now();
    
    if (!forceRefresh && this.batchRoadmapCache && 
        (now - this.lastFetchTime[cacheKey]) < this.cacheDuration) {
      console.log('Returning cached batch roadmap');
      return { success: true, data: this.batchRoadmapCache };
    }

    try {
      const url = AppApis.getSepecifBatchProgramRoadmapsUrl
        .replace(':batchName', batchName)
        .replace(':batchYear', batchYear)
        .replace(':programName', programName);
      
      const response = await this.getApiResponse(url);
      
      if (response.success && response.data) {
        const roadmapData = response.data as Roadmap;
        this.batchRoadmapCache = roadmapData;
        this.lastFetchTime[cacheKey] = now;
        return { success: true, data: roadmapData };
      }
      return response;
    } catch (error) {
      console.error('Get batch roadmap error:', error);
      throw error;
    }
  }

// In roadmapRepository.ts, enhance the clearCache method:
clearCache(programName?: string, batchKey?: string): void {
  if (programName) {
    // Clear specific program cache
    const programCacheKey = `program_${programName}`;
    delete this.lastFetchTime[programCacheKey];
    this.programRoadmapsCache = [];
  } else {
    this.programRoadmapsCache = [];
  }
  
  if (batchKey) {
    delete this.lastFetchTime[batchKey];
    this.batchRoadmapCache = null;
  } else if (!programName) {
    // Only clear all if no specific parameters
    this.batchRoadmapCache = null;
    this.lastFetchTime = {};
  }
}
}

export const roadmapRepository = RoadmapRepository.getInstance();