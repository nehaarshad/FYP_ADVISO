/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseManagement/useCourseCatalog.ts
import { useState, useCallback, useRef } from 'react';
import { courseCatalogRepository } from '@/src/repositories/sessionContentManagement/courseDetailsRepositories';
import { CourseCategory } from '@/src/models/courseCategoryModel';
import { UploadCourseDetailData } from '@/src/repositories/sessionContentManagement/types/uploadCourseDetail';

interface CategoryInfo {
  categoryName: string;
  colorScheme: string;
}

export const useCourseCatalog = () => {
  const [courses, setCourses] = useState<CourseCategory[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseCategory[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, CategoryInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const hasFetched = useRef(false);

  const fetchCourses = useCallback(async (forceRefresh: boolean = false) => {
    if (hasFetched.current && !forceRefresh) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await courseCatalogRepository.getCoursesDetails(forceRefresh);
      if (response.success && response.data) {
        setCourses(response.data);
        setFilteredCourses(response.data);

        // Build categories map from CourseCategoryModels → CategoryModel
        const newMap = new Map<string, CategoryInfo>();
        response.data.forEach((course: CourseCategory) => {
          const categoryModels = (course as any).CourseCategoryModels;
          if (Array.isArray(categoryModels)) {
            categoryModels.forEach((ccm: any) => {
              const cat = ccm?.CategoryModel;
              if (cat?.categoryName && cat?.colorScheme) {
                if (!newMap.has(cat.categoryName)) {
                  newMap.set(cat.categoryName, {
                    categoryName: cat.categoryName,
                    colorScheme: cat.colorScheme,
                  });
                }
              }
            });
          }
        });
        setCategoriesMap(newMap);
        hasFetched.current = true;
      } else {
        throw new Error(response.error || 'Failed to fetch courses');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const searchCourses = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
    } else {
      const filtered = courseCatalogRepository.searchCourses(courses, searchTerm);
      setFilteredCourses(filtered);
    }
  }, [courses]);

  // src/hooks/courseDetailHook/useCourseDetails.ts
// Find the filterByCategory function and replace it with this:

const filterByCategory = useCallback((categoryName: string) => {
  if (!categoryName) {
    setFilteredCourses(courses);
  } else {
    // Filter courses based on category name
    const filtered = courses.filter((course: any) => {
      // New structure: course has CourseCategoryModels array
      if (course.CourseCategoryModels && Array.isArray(course.CourseCategoryModels)) {
        return course.CourseCategoryModels.some((ccm: any) => 
          ccm.CategoryModel?.categoryName === categoryName
        );
      }
      // Old structure: direct CategoryModel
      if (course.CategoryModel) {
        return course.CategoryModel.categoryName === categoryName;
      }
      return false;
    });
    setFilteredCourses(filtered);
  }
}, [courses]);

  const clearFilters = useCallback(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const clearUploadSuccess = useCallback(() => setUploadSuccess(false), []);

  // Convert FFRRGGBB / #RRGGBB → usable #RRGGBB hex
  const convertARGBToHex = useCallback((argb: string): string => {
    if (!argb) return '#64748b';
    if (argb.startsWith('#')) return argb;
    // Strip leading FF alpha channel (e.g. "FFFF0000" → "FF0000")
    const stripped = argb.length === 8 ? argb.substring(2) : argb;
    return `#${stripped}`;
  }, []);

  // Get color with opacity as rgba string
  const getColorWithOpacity = useCallback((colorScheme: string, opacity: number = 0.15): string => {
    const hex = convertARGBToHex(colorScheme);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }, [convertARGBToHex]);

  // Look up colorScheme by category name — returns raw colorScheme string or fallback
  const getCategoryColor = useCallback((categoryName: string): string => {
    if (!categoryName) return '#64748b';
    const found = categoriesMap.get(categoryName);
    return found?.colorScheme ?? '#64748b';
  }, [categoriesMap]);

  // Returns { color, backgroundColor, borderColor } style object for a category
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

  // All unique categories as a flat list of names (backward compat)
  const categories = Array.from(categoriesMap.keys());

  // All unique categories with resolved hex colors
  const categoriesWithColors = Array.from(categoriesMap.values()).map(cat => ({
    name: cat.categoryName,
    colorScheme: cat.colorScheme,
    hexColor: convertARGBToHex(cat.colorScheme),
  }));

  return {
    courses: filteredCourses,
    allCourses: courses,
    isLoading,
    error,
    uploadProgress,
    uploadSuccess,
    categories,
    categoriesMap,
    categoriesWithColors,
    fetchCourses,
    uploadCourseDetail,
    searchCourses,
    filterByCategory,
    clearFilters,
    clearUploadSuccess,
    getCategoryColor,
    convertARGBToHex,
    getColorWithOpacity,
    getCategoryStyle,
  };
};