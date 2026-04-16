/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/roadmap/roadmapRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { Roadmap } from '@/src/models/RoadmapModel';

class RoadmapRepository extends BaseApiService {
  private static instance: RoadmapRepository;

  private constructor() {
    super();
  }

  static getInstance(): RoadmapRepository {
    if (!RoadmapRepository.instance) {
      RoadmapRepository.instance = new RoadmapRepository();
    }
    return RoadmapRepository.instance;
  }

  async getProgramRoadmaps(programName: string): Promise<ApiResponse<any>> {
    try {
      const url = AppApis.getProgramRoadmapsUrl.replace(':programName', programName);
      console.log("url to get program roadmap ", url)
      const response = await this.getApiResponse(url);
      console.log("roadmap response: ",response)
      return response;
    } catch (error) {
      console.error('Get program roadmaps error:', error);
      throw error;
    }
  }

  async getBatchRoadmap(batchName: string, batchYear: string, programName: string): Promise<ApiResponse<any>> {
    try {
      const url = AppApis.getSepecifBatchProgramRoadmapsUrl
        .replace(':batchName', batchName)
        .replace(':batchYear', batchYear)
        .replace(':programName', programName);
      const response = await this.getApiResponse(url);
      return response;
    } catch (error) {
      console.error('Get batch roadmap error:', error);
      throw error;
    }
  }

  async uploadRoadmap(file: File, programName: string, batchName?: string, batchYear?: string): Promise<ApiResponse<any>> {
    try {
      const additionalData: Record<string, string> = { programName };
      if (batchName) additionalData.batchName = batchName;
      if (batchYear) additionalData.batchYear = batchYear;
      
      const response = await this.postExcelFile(
        AppApis.uploadRoadmapUrl,
        file,
        'roadmapFile',
        additionalData
      );
      return response;
    } catch (error) {
      console.error('Upload roadmap error:', error);
      throw error;
    }
  }
}

export const roadmapRepository = RoadmapRepository.getInstance();