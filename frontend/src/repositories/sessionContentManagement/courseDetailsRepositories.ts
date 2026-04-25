/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/courseManagement/courseCatalogRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { CourseCategory } from '@/src/models/courseCategoryModel';

export interface UploadCourseDetailData {
  file: File;
}

class CourseCatalogRepository extends BaseApiService {
  private static instance: CourseCatalogRepository;
  private coursesCache: CourseCategory[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000;

  private constructor() {
    super();
  }

  static getInstance(): CourseCatalogRepository {
    if (!CourseCatalogRepository.instance) {
      CourseCatalogRepository.instance = new CourseCatalogRepository();
    }
    return CourseCatalogRepository.instance;
  }

  async uploadCourseDetail(data: UploadCourseDetailData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        AppApis.uploadCourseDetailUrl,
        data.file,
        'courseFile'
      );
      
      if (response.success) {
        this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Upload course detail error:', error);
      throw error;
    }
  }

  async getCoursesDetails(forceRefresh: boolean = false): Promise<ApiResponse<CourseCategory[]>> {
    const now = Date.now();
    if (!forceRefresh && this.coursesCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached course details');
      return { success: true, data: this.coursesCache };
    }

    try {
      const response = await this.getApiResponse<any>(AppApis.getCourseDetailUrl);
      
      if (response.success && response.data) {
        let coursesData: CourseCategory[] = [];
        if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          coursesData = response.data.data;
        } else {
          coursesData = [];
        }
        
        this.coursesCache = coursesData;
        this.lastFetchTime = now;
        return { success: true, data: coursesData };
      }
      return response;
    } catch (error) {
      console.error('Get courses details error:', error);
      throw error;
    }
  }

  // Helper methods for filtering
  getCoursesByCategory(courses: CourseCategory[], categoryName: string): CourseCategory[] {
    return courses.filter(course => 
      course.CategoryModel?.categoryName === categoryName
    );
  }

  getCoursesByProgram(courses: CourseCategory[], programName: string): CourseCategory[] {
    return courses;
  }

  searchCourses(courses: CourseCategory[], searchTerm: string): CourseCategory[] {
    const term = searchTerm.toLowerCase();
    return courses.filter(course =>
      course.CoursesModel?.courseCode?.toLowerCase().includes(term) ||
      course.CoursesModel?.courseName?.toLowerCase().includes(term) ||
      course.CategoryModel?.categoryName?.toLowerCase().includes(term)
    );
  }

  clearCache(): void {
    this.coursesCache = [];
    this.lastFetchTime = 0;
  }
}

export const courseCatalogRepository = CourseCatalogRepository.getInstance();