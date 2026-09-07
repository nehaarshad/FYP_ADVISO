/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/recommendations/useRecommendations.ts
import { useState, useCallback } from 'react';
import { recommendationRepository } from '../../repositories/recommendationRepository/systemRecommendation';
import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';
import { FinalizeRecommendationPayload } from '@/src/repositories/recommendationRepository/types/finalizedRecommendation';
import { RecommendationState } from './states/recommendationState';
import { useUserProfile } from '../profileHook/useProfile';

const initialState: RecommendationState = {
  llmRecommendations: null,
  savedRecommendationId: null,
  allowedCreditHours: null,
  sessionId: null,
  selectedCourses: [],
  pagination: null,
  advisoryLogs: [],
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
      patch({
        isGenerating: true,
        generateError: null,
        llmRecommendations: null,
      });

      try {
        const response = await recommendationRepository.recommendCourses(studentId, {
          sessionType,
          sessionYear,
        });

        console.log('Recommendation API Response:', response);

        // Handle the actual response structure
        if (response.success && response.data) {
          const responseData = response.data.data;
          console.log('Recommendation Data:', responseData);

          // Map the API response to LLMRecommendations format
          const llmRecommendations = {
            summary: {
              hasWarnings: responseData.recommendedCoursesSummary?.hasWarnings || false,
              priorityBreakdown: responseData.recommendedCoursesSummary?.priorityBreakdown || {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
              },
              totalRequiredCredits: responseData.recommendedCoursesSummary?.totalRequiredCredits || 0,
              totalCreditsAllowed: responseData.recommendedCoursesSummary?.totalCreditsAllowed || 
                                 responseData.totalCreditsAllowed || 18,
              totalCoursesRecommended: responseData.recommendedCoursesSummary?.totalCoursesRecommended || 0,
              hasSpecialRequests: responseData.recommendedCoursesSummary?.hasSpecialRequests || false,
            },
            recommendations: {
              critical: responseData.priorityWiseCourses?.critical || [],
              high: responseData.priorityWiseCourses?.high || [],
              medium: responseData.priorityWiseCourses?.medium || [],
              low: responseData.priorityWiseCourses?.low || [],
            },
            priorityWiseCourses: {
              critical: responseData.priorityWiseCourses?.critical || [],
              high: responseData.priorityWiseCourses?.high || [],
              medium: responseData.priorityWiseCourses?.medium || [],
              low: responseData.priorityWiseCourses?.low || [],
            },
            creditAllocationScenarios: [],
            specialRequests: [],
            detailedExplanation: responseData.recommendationText || 
                               'Recommendations generated successfully.',
          };

          console.log('Mapped recommendation state:', llmRecommendations);

          patch({
            llmRecommendations,
            savedRecommendationId: responseData.id || null,
            allowedCreditHours: responseData.totalCreditsAllowed || 
                              responseData.recommendedCoursesSummary?.totalCreditsAllowed || 18,
            sessionId: responseData.sessionId || null,
            selectedCourses: [],
          });

          console.log('Recommendation state updated successfully');
        } else {
          patch({
            generateError: response.error || 'Failed to generate recommendations',
          });
        }
      } catch (err: any) {
        console.error('Generation error:', err);
        patch({
          generateError: err.message || 'Unexpected error generating recommendations',
        });
      } finally {
        patch({ isGenerating: false });
      }
    },
    []
  );

  const toggleCourseSelection = useCallback((course: SuggestedCourse) => {
    console.log("Toggling course:", course.courseId, course.courseName);

    setState(prev => {
      const alreadySelected = prev.selectedCourses.some(
        c => c.courseId === course.courseId && c.courseName === course.courseName
      );

      console.log("Already selected:", alreadySelected);

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
    (courseId: number | null, courseName: string) => {
      if (courseId === null) {
        // For courses without ID (like Applied Physics), use courseName only
        return state.selectedCourses.some(c => c.courseName === courseName);
      }
      return state.selectedCourses.some(
        c => c.courseId === courseId && c.courseName === courseName
      );
    },
    [state.selectedCourses]
  );

  const totalSelectedCredits = state.selectedCourses.reduce(
    (sum, c) => sum + (c.credits || 0),
    0
  );

  // Get all recommended courses with priority labels
  const allRecommendedCourses: SuggestedCourse[] = state.llmRecommendations
    ? [
        ...(state.llmRecommendations.recommendations.critical || []).map((c: SuggestedCourse) => ({
          ...c,
          priority: 'critical' as const,
        })),
        ...(state.llmRecommendations.recommendations.high || []).map((c: SuggestedCourse) => ({
          ...c,
          priority: 'high' as const,
        })),
        ...(state.llmRecommendations.recommendations.medium || []).map((c: SuggestedCourse) => ({
          ...c,
          priority: 'medium' as const,
        })),
        ...(state.llmRecommendations.recommendations.low || []).map((c: SuggestedCourse) => ({
          ...c,
          priority: 'low' as const,
        })),
      ]
    : [];

  // Get courses by priority
  const getCoursesByPriority = useCallback((priority: string) => {
    if (!state.llmRecommendations) return [];
    const priorityMap: Record<string, SuggestedCourse[]> = {
      critical: state.llmRecommendations.recommendations.critical || [],
      high: state.llmRecommendations.recommendations.high || [],
      medium: state.llmRecommendations.recommendations.medium || [],
      low: state.llmRecommendations.recommendations.low || [],
    };
    return priorityMap[priority] || [];
  }, [state.llmRecommendations]);

  // Get priority breakdown with counts
  const getPriorityBreakdown = useCallback(() => {
    if (!state.llmRecommendations) return null;
    return state.llmRecommendations.summary.priorityBreakdown;
  }, [state.llmRecommendations]);

  const finalizeRecommendations = useCallback(
    async (studentId: number, sessionId: number): Promise<boolean> => {
      if (state.selectedCourses.length === 0) {
        patch({ finalizeError: 'Please select at least one course' });
        return false;
      }
      
      if (!state.savedRecommendationId) {
        patch({ finalizeError: 'No recommendation found to finalize' });
        return false;
      }

      const advisorId = userProfile?.profile?.id;
      console.log("advisor id ", advisorId);

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
    [state.selectedCourses, state.savedRecommendationId, userProfile]
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
        const { logs, pagination } = response.data;

        patch({
          advisoryLogs: logs,
          pagination,
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

  // Helper to get warning message
  const getWarningMessage = useCallback(() => {
    if (state.llmRecommendations?.summary?.hasWarnings) {
      return state.llmRecommendations.detailedExplanation || 'Some courses have warnings. Please review them carefully.';
    }
    return null;
  }, [state.llmRecommendations]);

  return {
    // State
    llmRecommendations: state.llmRecommendations,
    savedRecommendationId: state.savedRecommendationId,
    allowedCreditHours: state.allowedCreditHours,
    sessionId: state.sessionId,
    selectedCourses: state.selectedCourses,
    advisoryLogs: state.advisoryLogs,
    pagination: state.pagination,
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
    getCoursesByPriority,
    getPriorityBreakdown,
    getWarningMessage,
  };
};