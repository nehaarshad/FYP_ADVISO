/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { recommendationRepository } from '@/src/repositories/recommendationRepository/systemRecommendation';
import { useUserProfile } from '../profileHook/useProfile';
import { RawRecommendationApiResponse } from '@/src/models/rawRecommendationApiResponse';

// ✅ Updated interface matching the actual API response
interface StudentRecommendationData {
  id: number;
  courses: any[];
  notes: string | null;
  sentAt: string;
  sessionType: string;
  sessionYear: number;
  totalCredits: number;
  priorityWiseCourses: {
    critical: any[];
    high: any[];
    medium: any[];
    low: any[];
  };
  summary: {
    hasWarnings: boolean;
    priorityBreakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    totalRequiredCredits: number;
    totalCreditsAllowed: number;
    totalCoursesRecommended: number;
  };
}

interface StudentRecommendationState {
  recommendations: StudentRecommendationData | null;
  isLoading: boolean;
  error: string | null;
}

export const useStudentRecommendations = () => {
  const [state, setState] = useState<StudentRecommendationState>({
    recommendations: null,
    isLoading: false,
    error: null,
  });
  const { userProfile } = useUserProfile();

  const fetchStudentRecommendations = useCallback(async () => {
    const studentId = userProfile?.profile?.id;   
    console.log("student id ", studentId);
    
    if (!studentId) {
      setState(prev => ({ 
        ...prev, 
        error: 'Student profile not found. Please log in again.',
        isLoading: false 
      }));
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await recommendationRepository.getStudentRecommendations(studentId);
      
      console.log("Student recommendations response:", response);

      if (response.success && response.data) {
        // ✅ Explicitly typed as the RAW shape (see rawRecommendationApiResponse.ts).
        // This is the same fix applied in useCourseRecommendationHook.ts:
        // `recommendationData` was previously implicit `any`, which is how
        // `.recommendedCoursesSummary` (raw field name) and `.summary`
        // (mapped field name, used below and in components consuming this
        // hook) got confused. Type it here, and let TS flag it immediately
        // if that ever happens again.
        let recommendationData: RawRecommendationApiResponse | null = null;
        
        // ✅ Extract the recommendation object
        if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          recommendationData = response.data.data[0];
        } else if (response.data.data && !Array.isArray(response.data.data)) {
          recommendationData = response.data.data;
        } else if (response.data.courses) {
          recommendationData = response.data;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          recommendationData = response.data[0];
        }
        
        console.log("Extracted recommendation data:", recommendationData);

        if (recommendationData) {
          // ✅ Map the data to the expected structure
          const mappedData: StudentRecommendationData = {
            id: recommendationData.id || 0,
            // ✅ Create a courses array from priorityWiseCourses
            courses: [
              ...(recommendationData.priorityWiseCourses?.critical || []),
              ...(recommendationData.priorityWiseCourses?.high || []),
              ...(recommendationData.priorityWiseCourses?.medium || []),
              ...(recommendationData.priorityWiseCourses?.low || []),
            ],
            notes: recommendationData.notes || null,
            sentAt: recommendationData.createdAt || new Date().toISOString(),
            sessionType: recommendationData.Session?.sessionType || 'N/A',
            sessionYear: recommendationData.Session?.sessionYear || new Date().getFullYear(),
            totalCredits: recommendationData.totalCredits || recommendationData.recommendedCoursesSummary?.totalRequiredCredits || 0,
            // ✅ Store the raw data for detailed display
            priorityWiseCourses: recommendationData.priorityWiseCourses || {
              critical: [],
              high: [],
              medium: [],
              low: []
            },
            summary: {
              hasWarnings: recommendationData.recommendedCoursesSummary?.hasWarnings || false,
              priorityBreakdown: recommendationData.recommendedCoursesSummary?.priorityBreakdown || {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
              },
              totalRequiredCredits: recommendationData.recommendedCoursesSummary?.totalRequiredCredits || 0,
              totalCreditsAllowed: recommendationData.recommendedCoursesSummary?.totalCreditsAllowed || 0,
              totalCoursesRecommended: recommendationData.recommendedCoursesSummary?.totalCoursesRecommended || 0,
            }
          };

          console.log("Mapped recommendations:", mappedData);

          setState({
            recommendations: mappedData,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            recommendations: null,
            isLoading: false,
            error: 'No recommendations found for this student',
          });
        }
      } else {
        setState({
          recommendations: null,
          isLoading: false,
          error: response.error || 'Failed to load recommendations',
        });
      }
    } catch (err: any) {
      console.error('Fetch student recommendations error:', err);
      setState({
        recommendations: null,
        isLoading: false,
        error: err.message || 'Unexpected error loading recommendations',
      });
    }
  }, [userProfile]);

  const clearRecommendations = useCallback(() => {
    setState({
      recommendations: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchStudentRecommendations,
    clearRecommendations,
  };
};