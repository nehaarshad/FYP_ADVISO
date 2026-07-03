/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { CourseCategory } from '@/src/models/courseCategoryModel';
import { UploadCourseDetailData } from './types/uploadCourseDetail';
import { UpdateCourseCredentialsData } from './types/updateCourseDetailData';
import { DropdownCourse } from '@/components/courseComponents/types/courseoption';

class CourseCatalogRepository extends BaseApiService {
  private static instance: CourseCatalogRepository;
  private coursesCache: CourseCategory[] = [];
  private dropdownCache: DropdownCourse[] = [];
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
        
        // Update dropdown cache
        this.updateDropdownCache(coursesData);
        
        return { success: true, data: coursesData };
      }
      return response;
    } catch (error) {
      console.error('Get courses details error:', error);
      throw error;
    }
  }

  private updateDropdownCache(coursesData: CourseCategory[]): void {
    this.dropdownCache = coursesData.map((course: any) => {
      const courseData = course.CoursesModel || course;
      return {
        id: course.id || courseData.id,
        courseCode: courseData.courseCode || 'N/A',
        courseName: courseData.courseName || 'Unknown'
      };
    });
  }

  async getCoursesForDropdown(searchTerm?: string): Promise<ApiResponse<DropdownCourse[]>> {
    try {
      // If we have cached data and no search term, return cached
      if (!searchTerm && this.dropdownCache.length > 0) {
        return { success: true, data: this.dropdownCache };
      }

      // Fetch fresh data
      const response = await this.getApiResponse<any>(AppApis.getCourseDetailUrl);
      
      if (response.success && response.data) {
        let coursesData: any[] = [];
        if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          coursesData = response.data.data;
        } else {
          coursesData = [];
        }

        // Transform to dropdown format
        let dropdownData = coursesData.map((course: any) => {
          const courseData = course.CoursesModel || course;
          return {
            id: course.id || courseData.id,
            courseCode: courseData.courseCode || 'N/A',
            courseName: courseData.courseName || 'Unknown'
          };
        });

        // Apply search filter if searchTerm is provided
        if (searchTerm && searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase().trim();
          dropdownData = dropdownData.filter((course: DropdownCourse) =>
            course.courseCode?.toLowerCase().includes(term) ||
            course.courseName?.toLowerCase().includes(term)
          );
        }

        // Update cache if no search term
        if (!searchTerm) {
          this.dropdownCache = dropdownData;
        }

        return { success: true, data: dropdownData };
      }
      return response;
    } catch (error) {
      console.error('Get courses for dropdown error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch courses',
        data: []
      };
    }
  }


  async updateCourseCredentials(
    courseId: number,
    data: UpdateCourseCredentialsData
  ): Promise<ApiResponse<any>> {
    try {
      if (!courseId) {
        return {
          success: false,
          message: 'Course ID is required',
        };
      }

      const { courseCode, courseName, courseCredits, prerequisiteIds } = data;
      if (
        courseCode === undefined && 
        courseName === undefined && 
        courseCredits === undefined &&
        prerequisiteIds === undefined
      ) {
        return {
          success: false,
          message: 'At least one field is required to update'
        };
      }

      const url = AppApis.updateCourseDetailUrl.replace(':courseId', courseId.toString());
      const response = await this.updateApiWithJson<ApiResponse<any>>(
        url,
        {
          "courseCode": courseCode,
          "courseName": courseName,
          "courseCredits": courseCredits,
          "prerequisiteIds": prerequisiteIds
        }
      );

      // Clear cache on successful update
      if (response.success) {
        this.clearCache();
      }

      return response;
    } catch (error) {
      console.error('Update course credentials error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update course credentials',
        data: null as any
      };
    }
  }

  clearCache(): void {
    this.coursesCache = [];
    this.dropdownCache = [];
    this.lastFetchTime = 0;
  }

  getDropdownCache(): DropdownCourse[] {
    return this.dropdownCache;
  }
}

export const courseCatalogRepository = CourseCatalogRepository.getInstance();