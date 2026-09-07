/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseDetailHook/useCourseDetails.ts
import { DropdownCategory } from '@/components/courseComponents/types/courseoption';
import { useState, useCallback, useRef, useMemo } from 'react';
import { courseCatalogRepository } from '@/src/repositories/sessionContentManagement/courseDetailsRepositories';
import { UpdateCourseCredentialsData } from '@/src/repositories/sessionContentManagement/types/updateCourseDetailData';
import { UploadCourseDetailData } from '@/src/repositories/sessionContentManagement/types/uploadCourseDetail';
import { CourseCategory } from '@/src/models/courseCategoryModel';
import { DropdownCourse } from '@/components/courseComponents/types/courseoption';

export const useCourseCatalog = () => {
  const [courses, setCourses] = useState<CourseCategory[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseCategory[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, any>>(new Map());
  const [dropdownCourses, setDropdownCourses] = useState<DropdownCourse[]>([]);
  const [dropdownCategories, setDropdownCategories] = useState<DropdownCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasFetched = useRef(false);

  const loadDropdownCourses = useCallback(async (searchTerm?: string) => {
    try {
      const response = await courseCatalogRepository.getCoursesForDropdown(searchTerm);
      if (response.success && response.data) {
        setDropdownCourses(response.data);
      }
    } catch (error) {
      console.error('Error loading dropdown courses:', error);
    }
  }, []);

   const loadDropdownCategories = useCallback(async (searchTerm?: string) => {
    try {
      console.log('Loading categories for dropdown...');
      const response = await courseCatalogRepository.getCategoriesForDropdown(searchTerm);
      console.log('Categories response:', response);
      
      if (response.success && response.data) {
        console.log('Categories loaded:', response.data.length);
        setDropdownCategories(response.data);
      } else {
        console.warn('No categories found or error loading:', response.message);
        setDropdownCategories([]);
      }
    } catch (error) {
      console.error('Error loading dropdown categories:', error);
      setDropdownCategories([]);
    }
  }, []);

  /**
   * Fetch all courses
   */
  const fetchCourses = useCallback(async (forceRefresh: boolean = false) => {
    if (hasFetched.current && !forceRefresh) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await courseCatalogRepository.getCoursesDetails(forceRefresh);
      if (response.success && response.data) {
        setCourses(response.data);
        setFilteredCourses(response.data);

        // Build categories map from the data
        const newMap = new Map<string, any>();
        response.data.forEach((course: CourseCategory) => {
          const categoryModels = (course as any).CourseCategoryModels;
          if (Array.isArray(categoryModels)) {
            categoryModels.forEach((ccm: any) => {
              const cat = ccm?.CategoryModel;
              if (cat?.categoryName && cat?.colorScheme) {
                if (!newMap.has(cat.categoryName)) {
                  newMap.set(cat.categoryName, {
                    id: cat.id,
                    categoryName: cat.categoryName,
                    colorScheme: cat.colorScheme,
                  });
                }
              }
            });
          }
        });
        setCategoriesMap(newMap);

        // Load dropdown courses and categories
        await loadDropdownCourses();
        await loadDropdownCategories();

        hasFetched.current = true;
      } else {
        throw new Error(response.error || 'Failed to fetch courses');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadDropdownCourses, loadDropdownCategories]); // Empty dependency array is fine here

  /**
   * Upload course detail
   */
  const uploadCourseDetail = useCallback(async (data: UploadCourseDetailData) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await courseCatalogRepository.uploadCourseDetail(data);
      clearInterval(interval);
      setUploadProgress(100);

      if (response.success) {
        setUploadSuccess(true);
        await fetchCourses(true);
        return { success: true };
      } else {
        setError(response.error || 'Upload failed');
        return { success: false };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourses]);

  /**
   * Search courses by code or name
   */
  const searchCourses = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = courses.filter((course: any) => {
        const courseData = course.CoursesModel || course;
        const courseCode = courseData?.courseCode?.toLowerCase() || '';
        const courseName = courseData?.courseName?.toLowerCase() || '';
        return courseCode.includes(term) || courseName.includes(term);
      });
      setFilteredCourses(filtered);
    }
  }, [courses]);

  /**
   * Filter courses by category
   */
  const filterByCategory = useCallback((categoryName: string) => {
    if (!categoryName) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course: any) => {
        if (course.CourseCategoryModels && Array.isArray(course.CourseCategoryModels)) {
          return course.CourseCategoryModels.some((ccm: any) => 
            ccm.CategoryModel?.categoryName === categoryName
          );
        }
        if (course.CategoryModel) {
          return course.CategoryModel.categoryName === categoryName;
        }
        return false;
      });
      setFilteredCourses(filtered);
    }
  }, [courses]);

  /**
   * Update course credentials (Add-Only mode for categories)
   */
  const updateCourse = useCallback(async (
    courseId: number,
    data: UpdateCourseCredentialsData
  ) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await courseCatalogRepository.updateCourseCredentials(courseId, data);
      
      if (response.success) {
        // Refresh courses after update
        await fetchCourses(true);
        // Also refresh dropdown categories
        await loadDropdownCategories();
        return { 
          success: true, 
          data: response.data,
          message: response.message || 'Course updated successfully'
        };
      } else {
        setError(response.message || 'Failed to update course');
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  }, [fetchCourses]); // Removed loadDropdownCategories from deps

  /**
   * Add categories to a course (convenience method)
   */
  const addCategoriesToCourse = useCallback(async (
    courseId: number,
    categoryIds: number[]
  ) => {
    if (!categoryIds || categoryIds.length === 0) {
      return { success: false, error: 'No categories to add' };
    }

    return await updateCourse(courseId, { categoryIds });
  }, [updateCourse]);


  const getCourseCategories = useCallback((course: any): DropdownCategory[] => {
    if (!course) return [];
    
    const categories: DropdownCategory[] = [];
    if (course.CourseCategoryModels && Array.isArray(course.CourseCategoryModels)) {
      course.CourseCategoryModels.forEach((cc: any) => {
        if (cc.CategoryModel) {
          categories.push({
            id: cc.CategoryModel.id,
            categoryName: cc.CategoryModel.categoryName,
            colorScheme: cc.CategoryModel.colorScheme
          });
        }
      });
    }
    return categories;
  }, []);


  const getAvailableCategories = useCallback((course: any): DropdownCategory[] => {
    if (!course || !dropdownCategories.length) return dropdownCategories;
    
    const existingCategoryIds = getCourseCategories(course).map(cat => cat.id);
    return dropdownCategories.filter(cat => !existingCategoryIds.includes(cat.id));
  }, [dropdownCategories, getCourseCategories]);


  const clearFilters = useCallback(() => {
    setFilteredCourses(courses);
  }, [courses]);


  const clearUploadSuccess = useCallback(() => setUploadSuccess(false), []);


  const convertARGBToHex = useCallback((argb: string): string => {
    if (!argb) return '#64748b';
    if (argb.startsWith('#')) return argb;
    const stripped = argb.length === 8 ? argb.substring(2) : argb;
    return `#${stripped}`;
  }, []);


  const getColorWithOpacity = useCallback((colorScheme: string, opacity: number = 0.15): string => {
    const hex = convertARGBToHex(colorScheme);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }, [convertARGBToHex]);


  const getCategoryColor = useCallback((categoryName: string): string => {
    if (!categoryName) return '#64748b';
    const found = categoriesMap.get(categoryName);
    return found?.colorScheme ?? '#64748b';
  }, [categoriesMap]);

  const getCategoryStyle = useCallback((categoryName: string) => {
    const colorScheme = getCategoryColor(categoryName);
    const textColor = convertARGBToHex(colorScheme);
    const backgroundColor = getColorWithOpacity(colorScheme, 0.15);
    return {
      color: textColor,
      backgroundColor,
      borderColor: `${textColor}30`,
    };
  }, [getCategoryColor, convertARGBToHex, getColorWithOpacity]);


  const categories = useMemo(() => Array.from(categoriesMap.keys()), [categoriesMap]);


  const categoriesWithColors = useMemo(() => 
    Array.from(categoriesMap.values()).map(cat => ({
      name: cat.categoryName,
      colorScheme: cat.colorScheme,
      hexColor: convertARGBToHex(cat.colorScheme),
    })),
    [categoriesMap, convertARGBToHex]
  );

  return {
    // State
    courses: filteredCourses,
    allCourses: courses,
    dropdownCourses,
    dropdownCategories,
    isLoading,
    isUpdating,
    error,
    uploadProgress,
    uploadSuccess,
    categories,
    categoriesMap,
    categoriesWithColors,

    // Core functions
    fetchCourses,
    uploadCourseDetail,
    updateCourse,
    addCategoriesToCourse,
    
    // Search and filter
    searchCourses,
    filterByCategory,
    clearFilters,
    
    // Dropdown loading
    loadDropdownCourses,
    loadDropdownCategories,
    
    // Utility functions
    clearUploadSuccess,
    getCategoryColor,
    convertARGBToHex,
    getColorWithOpacity,
    getCategoryStyle,
    getCourseCategories,
    getAvailableCategories,
  };
};