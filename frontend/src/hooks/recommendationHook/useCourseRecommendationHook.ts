/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/recommendations/useRecommendations.ts
import { useState, useCallback } from 'react';
import {recommendationRepository} from '../../repositories/recommendationRepository/systemRecommendation';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';
import { FinalizeRecommendationPayload } from '@/src/repositories/recommendationRepository/types/finalizedRecommendation';
import { RecommendationState } from './states/recommendationState';
import { useUserProfile } from '../profileHook/useProfile';
import { AdvisoryLogsResponseData } from './states/advisorylogdata';


const initialState: RecommendationState = {
  llmRecommendations: null,
  savedRecommendationId: null,
  allowedCreditHours: null,
  sessionId:null,
  selectedCourses: [],
  advisoryLogs: [],
  pagination:null,
  isGenerating: false,
  isFinalizing: false,
  isLoadingLogs: false,
  generateError: null,
  finalizeError: null,
  logsError: null,
};

export const useRecommendations = () => {
  const [state, setState] = useState<RecommendationState>(initialState);
  const { userProfile } = useUserProfile();


  const patch = (partial: Partial<RecommendationState>) =>
    setState(prev => ({ ...prev, ...partial }));

  const generateRecommendations = useCallback(
    async (studentId: number, sessionType: string, sessionYear: number) => {
      patch({ isGenerating: true, generateError: null, llmRecommendations: null });

      try {
        const response = await recommendationRepository.recommendCourses(studentId, {
          sessionType,
          sessionYear,
        });
        
        console.log("API Response:", response);

        if (response.success && response.data?.data) {
          const actualData = response.data.data;
          
          console.log("Extracted data:", actualData);
          
          const llmRecommendations = {
            summary: actualData.llmRecommendations.summary,
            recommendations: {
              critical: actualData.llmRecommendations.recommendations.critical || [],
              high: actualData.llmRecommendations.recommendations.high || [],
              medium: actualData.llmRecommendations.recommendations.medium || [],
              low: actualData.llmRecommendations.recommendations.low || [],
            },
            creditAllocationScenarios: actualData.llmRecommendations.creditAllocationScenarios || [],
            specialRequests: actualData.llmRecommendations.specialRequests || [],
            detailedExplanation: actualData.llmRecommendations.detailedExplanation,
          };

          patch({
            llmRecommendations,
            savedRecommendationId: actualData.savedRecommendationId,
            allowedCreditHours: actualData.allowedCreditHours,
            sessionId:actualData.sessionId,
            selectedCourses: [],   
          });
          console.log("After patch - llmRecommendations:", llmRecommendations);
              console.log("After patch - allRecommendedCourses will be:", [
                ...(llmRecommendations.recommendations.critical || []),
                ...(llmRecommendations.recommendations.high || []),
                ...(llmRecommendations.recommendations.medium || []),
                ...(llmRecommendations.recommendations.low || []),
              ]);
          console.log("State updated successfully");
        } else {
          patch({ 
            generateError: response.error || 'Failed to generate recommendations' 
          });
        }
      } catch (err: any) {
        console.error('Generation error:', err);
        patch({ 
          generateError: err.message || 'Unexpected error generating recommendations' 
        });
      } finally {
        patch({ isGenerating: false });
      }
    },
    []
  );

 // In useCourseRecommendationHook.ts
const toggleCourseSelection = useCallback((course: SuggestedCourse) => {
    console.log("Toggling course:", course.courseId, course.courseName);
    
    setState(prev => {
        const alreadySelected = prev.selectedCourses.some(
            c => c.courseId === course.courseId && c.courseName === course.courseName // Use both ID and name
        );
        
        console.log("Already selected:", alreadySelected);
        
        // In toggleCourseSelection — already correct on add, fix the filter:
            const newSelectedCourses = alreadySelected
        ? prev.selectedCourses.filter(
            c => !(c.courseId === course.courseId && c.courseName === course.courseName)
          )
        : [...prev.selectedCourses, course];
            
        console.log("New selected courses count:", newSelectedCourses.length);
        
        return {
            ...prev,
            selectedCourses: newSelectedCourses,
        };
    });
}, []);


const isCourseSelected = useCallback(
    (courseId: number, courseName: string) =>
      state.selectedCourses.some(
        c => c.courseId === courseId && c.courseName === courseName
      ),
    [state.selectedCourses]
);
  const totalSelectedCredits = state.selectedCourses.reduce(
    (sum, c) => sum + (c.credits || 0),
    0
  );

  const allRecommendedCourses: SuggestedCourse[] = state.llmRecommendations
    ? [
        ...(state.llmRecommendations.recommendations.critical || []).map((c: any) => ({
          ...c,
          priority: 'critical' as const,
        })),
        ...(state.llmRecommendations.recommendations.high || []).map((c: any) => ({
          ...c,
          priority: 'high' as const,
        })),
        ...(state.llmRecommendations.recommendations.medium || []).map((c: any) => ({
          ...c,
          priority: 'medium' as const,
        })),
        ...(state.llmRecommendations.recommendations.low || []).map((c: any) => ({
          ...c,
          priority: 'low' as const,
        })),
      ]
    : [];

  const finalizeRecommendations = useCallback(
    async (studentId: number, sessionId: number): Promise<boolean> => {
      if (state.selectedCourses.length === 0) return false;
      if (!state.savedRecommendationId) return false;

      const advisorId = userProfile?.profile?.id;   
    console.log("advisor id ",advisorId)
      if (!advisorId) {
        patch({ finalizeError: 'Advisor session not found. Please log in again.' });
        return false;
      }

      patch({ isFinalizing: true, finalizeError: null });

      try {
        const payload: FinalizeRecommendationPayload = {
          advisorId,
          studentId,
          sessionId,
          sessionalRecommendationId: state.savedRecommendationId,
          selectedCourses: state.selectedCourses,
        };

        const response = await recommendationRepository.finalizeRecommendation(payload);

        if (response.success) {
          patch({ selectedCourses: [] });
          return true;
        } else {
          patch({ finalizeError: response.error || 'Failed to finalize recommendations' });
          return false;
        }
      } catch (err: any) {
        patch({ finalizeError: err.message || 'Unexpected error finalizing recommendations' });
        return false;
      } finally {
        patch({ isFinalizing: false });
      }
    },
    [state.selectedCourses, state.savedRecommendationId]
  );

  const fetchAdvisoryLogs = useCallback(async () => {
    const advisorId = userProfile?.profile?.id;
 
    if (!advisorId) {
      patch({ logsError: 'Advisor profile not found. Please log in again.' });
      return;
    }
 
    patch({ isLoadingLogs: true, logsError: null });
 
    try {
      const response = await recommendationRepository.getAdvisoryLogs(advisorId);
 
      if (response.success && response.data) {
       const { logs, pagination } = response.data
 
        patch({
          advisoryLogs: logs,      // typed as AdvisoryLogEntry[]
          pagination,              // typed as PaginationMeta
          logsError: null,
        });
      } else {
        patch({
          advisoryLogs: [],
          logsError: response.error || 'Failed to load advisory logs',
        });
      }
    } catch (err: any) {
      console.error('Fetch logs error:', err);
      patch({
        advisoryLogs: [],
        logsError: err.message || 'Unexpected error loading logs',
      });
    } finally {
      patch({ isLoadingLogs: false });
    }
  }, [userProfile]); 

  const resetRecommendations = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    llmRecommendations: state.llmRecommendations,
    savedRecommendationId: state.savedRecommendationId,
    allowedCreditHours: state.allowedCreditHours,
    sessionId:state.sessionId,
    selectedCourses: state.selectedCourses,
    advisoryLogs: state.advisoryLogs,
    pagination:            state.pagination,
    allRecommendedCourses,
    totalSelectedCredits,

    // Loading
    isGenerating: state.isGenerating,
    isFinalizing: state.isFinalizing,
    isLoadingLogs: state.isLoadingLogs,

    // Errors
    generateError: state.generateError,
    finalizeError: state.finalizeError,
    logsError: state.logsError,

    // Actions
    generateRecommendations,
    toggleCourseSelection,
    isCourseSelected,
    finalizeRecommendations,
    fetchAdvisoryLogs,
    resetRecommendations,
  };
};