/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseManagement/useCourseCatalog.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { courseCatalogRepository } from '@/src/repositories/sessionContentManagement/courseDetailsRepositories';
import { CourseCategory } from '@/src/models/courseCategoryModel';
import { UploadCourseDetailData } from '@/src/repositories/sessionContentManagement/types/uploadCourseDetail';

export const useCourseCatalog = () => {
  const [courses, setCourses] = useState<CourseCategory[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseCategory[]>([]);
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

  const filterByCategory = useCallback((categoryName: string) => {
    if (!categoryName) {
      setFilteredCourses(courses);
    } else {
      const filtered = courseCatalogRepository.getCoursesByCategory(courses, categoryName);
      setFilteredCourses(filtered);
    }
  }, [courses]);

  const clearFilters = useCallback(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const clearUploadSuccess = useCallback(() => setUploadSuccess(false), []);

  // Get unique categories
  const categories = [...new Set(courses.map(c => c.CategoryModel?.categoryName).filter(Boolean))];

  return {
    courses: filteredCourses,
    allCourses: courses,
    isLoading,
    error,
    uploadProgress,
    uploadSuccess,
    categories,
    fetchCourses,
    uploadCourseDetail,
    searchCourses,
    filterByCategory,
    clearFilters,
    clearUploadSuccess,
  };
};