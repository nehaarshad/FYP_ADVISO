/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { RecommendCoursesPayload } from "./types/coursespayload"
import { RecommendCoursesResponse } from './types/systemRespponse';
import { FinalizeRecommendationPayload } from './types/finalizedRecommendation';
import { AdvisoryLogEntry } from './types/advisoryLog';
import { FinalizedRecommendation } from './types/finalizedRecommedation';
import { AdvisoryLogsResponseData } from '@/src/hooks/recommendationHook/states/advisorylogdata';

class RecommendationRepository extends BaseApiService {
  private static instance: RecommendationRepository;
 
  private constructor() {
    super();
  }
 
  static getInstance(): RecommendationRepository {
    if (!RecommendationRepository.instance) {
      RecommendationRepository.instance = new RecommendationRepository();
    }
    return RecommendationRepository.instance;
  }
 
  async recommendCourses( studentId: number,payload: RecommendCoursesPayload): Promise<ApiResponse<RecommendCoursesResponse>> {
    try {
      const url = AppApis.recommendSessionalCoursesUrl.replace(':id', studentId.toString());
      
      const response = await this.postApiWithJson<RecommendCoursesResponse>(url, payload);
      return response;
    } catch (error) {
      console.error('Recommend courses error:', error);
      throw error;
    }
  }
 
  async finalizeRecommendation(payload: FinalizeRecommendationPayload): Promise<ApiResponse<FinalizedRecommendation>> {
    try {
      const response = await this.postApiWithJson<FinalizedRecommendation>(
        AppApis.finalizeSessionalCourseRecommendationUrl,
        payload
      );
      return response;
    } catch (error) {
      console.error('Finalize recommendation error:', error);
      throw error;
    }
  }
  async getAdvisoryLogs(advisorId: number): Promise<ApiResponse<any>> {
    try {
      const url = AppApis.getAdvisoryLogsUrl.replace(':advisorId', advisorId.toString());
      console.log("getting advisory log, ", url,)
      const response = await this.getApiResponse<any>(url);
      console.log (response.data)
      return response.data;
    } catch (error) {
      console.error('Get advisory logs error:', error);
      throw error;
    }
  }

  async getRecommendationById(recommendationId: number ): Promise<ApiResponse<RecommendCoursesResponse>> {
    try {
      const url = AppApis.getRecommendationByIdUrl.replace(':id', recommendationId.toString());
      const response = await this.getApiResponse<RecommendCoursesResponse>(url);
      return response;
    } catch (error) {
      console.error('Get recommendation by ID error:', error);
      throw error;
    }
  }

   async getStudentRecommendations(recommendationId: number ): Promise<ApiResponse<any>> {
    try {
      const url = AppApis.getStudentRecommendationsUrl.replace(':studentId', recommendationId.toString());
      const response = await this.getApiResponse<any>(url);
      return response;
    } catch (error) {
      console.error('Get recommendation by ID error:', error);
      throw error;
    }
  }

}
 
export const recommendationRepository = RecommendationRepository.getInstance();