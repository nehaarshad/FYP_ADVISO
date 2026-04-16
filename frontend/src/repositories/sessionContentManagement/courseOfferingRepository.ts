/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from "@/src/services/baseApiServices/baseNetworkService/baseNetwork";
import { UploadCourseOfferingData } from "./types/uploadCourseOffering";
import { ApiResponse } from "@/src/services/baseApiServices/ApiResponseType/apiResponseType";
import APIs from "@/src/services/appApis/apiUrl"

class CourseOfferingRepository extends BaseApiService {
  private static instance: CourseOfferingRepository;
  private courseOfferingsCache: any[] = [];
  private timetablesCache: any[] = [];
  private coursesDetailsCache: any[] = [];

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
        APIs.uploadCourseOfferingUrl,
        data.file,
        "courseOfferingFile",
        {
          sessionType: data.sessionType,
          sessionYear: data.sessionYear,
          programName: data.programName
        }
      );
      
      if (response.success) {
        // Invalidate cache
        this.courseOfferingsCache = [];
      }
      
      return response;
    } catch (error) {
      console.error('Upload course offering error:', error);
      throw error;
    }
  }

  async getCourseOfferings(forceRefresh: boolean = false): Promise<ApiResponse<any>> {
    const now = Date.now();
    if (!forceRefresh && this.courseOfferingsCache.length > 0 ) {
      console.log('Returning cached course offerings',this.courseOfferingsCache);
      return { success: true, data: this.courseOfferingsCache };
    }

    try {
      const response = await this.getApiResponse(APIs.getCourseOfferingUrl);
      if (response.success && response.data) {
     //   this.courseOfferingsCache = response.data.data || response.data;
      }
      return response;
    } catch (error) {
      console.error('Get course offerings error:', error);
      throw error;
    }
  }


  clearCache(): void {
    this.courseOfferingsCache = [];
  }
}

export const courseOfferingRepository = CourseOfferingRepository.getInstance();