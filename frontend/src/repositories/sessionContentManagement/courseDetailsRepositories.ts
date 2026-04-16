/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from "@/src/services/baseApiServices/baseNetworkService/baseNetwork";
import { ApiResponse } from "@/src/services/baseApiServices/ApiResponseType/apiResponseType";
import APIs from "@/src/services/appApis/apiUrl"
import { UploadCourseDetailData } from "./types/uploadCourseDetail";

class CourseDetailsRepository extends BaseApiService {
  private static instance: CourseDetailsRepository;
  private coursesDetailsCache: any[] = [];

  private constructor() {
    super();
  }

  static getInstance(): CourseDetailsRepository {
    if (!CourseDetailsRepository.instance) {
      CourseDetailsRepository.instance = new CourseDetailsRepository();
    }
    return CourseDetailsRepository.instance;
  }

  // Course Details Methods
  async uploadCourseDetail(data: UploadCourseDetailData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        APIs.uploadCourseDetailUrl,
        data.file,
        "courseFile"
      );
      
      if (response.success) {
        this.coursesDetailsCache = [];
       
      }
      
      return response;
    } catch (error) {
      console.error('Upload course detail error:', error);
      throw error;
    }
  }

  async getCoursesDetails(forceRefresh: boolean = false): Promise<ApiResponse<any>> {
    const now = Date.now();
    if (!forceRefresh && this.coursesDetailsCache.length > 0) {
      console.log('Returning cached course details');
      return { success: true, data: this.coursesDetailsCache };
    }

    try {
      const response = await this.getApiResponse(APIs.getCourseDetailUrl);
      if (response.success && response.data) {
    //    this.coursesDetailsCache = response.data.data || response.data;
      }
      return response;
    } catch (error) {
      console.error('Get course details error:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.coursesDetailsCache = [];
  }
}

export const courseDetailsRepository = CourseDetailsRepository.getInstance();