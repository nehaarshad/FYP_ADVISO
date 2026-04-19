/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { recommendationRepository } from '@/src/repositories/recommendationRepository/systemRecommendation';
import { useUserProfile } from '../profileHook/useProfile';

// Interface matching your API response structure
interface StudentRecommendationData {
  id: number;
  courses: any[];
  notes: string | null;
  sentAt: string;
  sessionType: string;
  sessionYear: number;
  totalCredits: number;
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
        let recommendationsData = null;
        
        // Based on your API response: response.data.data is an array with the recommendation object
        if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          // Extract the first recommendation object from the array
          recommendationsData = response.data.data[0];
          console.log("Extracted recommendations data:", recommendationsData);
          console.log("Courses:", recommendationsData?.courses);
        } 
        // Fallback: if data is directly the object with courses
        else if (response.data.courses) {
          recommendationsData = response.data;
        }
        // Fallback: if response.data is an array directly
        else if (Array.isArray(response.data) && response.data.length > 0) {
          recommendationsData = response.data[0];
        }
        
        if (recommendationsData && recommendationsData.courses) {
          setState({
            recommendations: recommendationsData,
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