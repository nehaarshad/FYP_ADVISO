/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { CourseOffering } from '@/src/models/courseOfferingModel';
import { UploadCourseOfferingData } from './types/uploadCourseOffering';

class CourseOfferingRepository extends BaseApiService {
  private static instance: CourseOfferingRepository;
  private offeringsCache: CourseOffering[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000;

  private constructor() {
    super();
  }

  static getInstance(): CourseOfferingRepository {
    if (!CourseOfferingRepository.instance) {
      CourseOfferingRepository.instance = new CourseOfferingRepository();
    }
    return CourseOfferingRepository.instance;
  }

  async uploadCourseOffering(data: UploadCourseOfferingData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        AppApis.uploadCourseOfferingUrl,
        data.file,
        'courseOfferingFile',
        {
          sessionType: data.sessionType,
          sessionYear: data.sessionYear,
          programName: data.programName
        }
      );
      
      if (response.success) {
        this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Upload course offering error:', error);
      throw error;
    }
  }

  async getCourseOfferings(forceRefresh: boolean = false): Promise<ApiResponse<CourseOffering[]>> {
    const now = Date.now();
    if (!forceRefresh && this.offeringsCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached course offerings');
      return { success: true, data: this.offeringsCache };
    }

    try {
      const response = await this.getApiResponse<any>(AppApis.getCourseOfferingUrl);
      
      if (response.success && response.data) {
        let offeringsData: CourseOffering[] = [];
        if (Array.isArray(response.data)) {
          offeringsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          offeringsData = response.data.data;
        } else {
          offeringsData = [];
        }
        
        this.offeringsCache = offeringsData;
        this.lastFetchTime = now;
        return { success: true, data: offeringsData };
      }
      return response;
    } catch (error) {
      console.error('Get course offerings error:', error);
      throw error;
    }
  }

  getOfferingsBySession(offerings: CourseOffering[], sessionType: string, sessionYear: string): CourseOffering[] {
    return offerings.filter(offering => 
      offering.SessionModel?.sessionType === sessionType && 
      offering.SessionModel?.sessionYear === parseInt(sessionYear)
    );
  }

  getOfferingsByProgram(offerings: CourseOffering[], programName: string): CourseOffering[] {
    return offerings.filter(offering => 
      offering.ProgramModel?.programName === programName
    );
  }

  getOfferingsByBatch(offerings: CourseOffering[], batchName: string, batchYear: string): CourseOffering[] {
    return offerings.filter(offering => 
      offering.BatchModel?.batchName === batchName && 
      offering.BatchModel?.batchYear === batchYear
    );
  }

  clearCache(): void {
    this.offeringsCache = [];
    this.lastFetchTime = 0;
  }
}

export const courseOfferingRepository = CourseOfferingRepository.getInstance();