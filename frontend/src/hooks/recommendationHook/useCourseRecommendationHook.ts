/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { recommendationRepository } from '../../repositories/recommendationRepository/systemRecommendation';
import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';
import { FinalizeRecommendationPayload } from '@/src/repositories/recommendationRepository/types/finalizedRecommendation';
import { RecommendationState } from './states/recommendationState';
import { useUserProfile } from '../profileHook/useProfile';

const initialState: RecommendationState = {
  llmRecommendations: null,
  savedRecommendationId: null,
  allowedCreditHours: null,
  requiredCreditHours: null,
  totalCreditsAllowed: null,
  Session: null,
  sessionId: null,
  selectedCourses: [],
  advisoryLogs: [],
  isGenerating: false,
  isFinalizing: false,
  isLoadingLogs: false,
  generateError: null,
  finalizeError: null,
  logsError: null,
};


const selectionKey = (card: {
  courseId?: number | null;
  courseName: string;
  originalCourseName?: string | null;
  isElective?: boolean;
}) => {
  if (card.isElective && card.originalCourseName) {
    return `elective:${card.originalCourseName}`;
  }
  const canonical = card.originalCourseName ?? card.courseName;
  return card.courseId != null
    ? `id:${card.courseId}::${canonical}`
    : `name:${canonical}`;
};

const entryKey = (c: SuggestedCourse & { _parentKey?: string }) => {
  if (c._parentKey) return c._parentKey;
  return selectionKey({
    courseId: c.courseId,
    courseName: c.courseName,
    originalCourseName: c.originalCourseName,
    isElective: c._selectionSource === 'ELECTIVE_OPTION',
  });
};

const patchCombinedLabCredits = (arr: any[] = []): any[] =>
  arr.map(c => {
    const needsPatch =
      (c?.credits === 0 || c?.credits == null) &&
      (c?.hasLab === true ||
        c?.actionRequired === 'NEW_WITH_LAB' ||
        c?.actionRequired === 'RETAKE_WITH_LAB' ||
        c?.labDetails != null);
    return needsPatch ? { ...c, credits: 4 } : c;
  });

export const useRecommendations = () => {
  const [state, setState] = useState<RecommendationState>(initialState);
  const { userProfile } = useUserProfile();

  const patch = useCallback(
    (partial: Partial<RecommendationState>) =>
      setState(prev => ({ ...prev, ...partial })),
    []
  );

  const generateRecommendations = useCallback(
    async (studentId: number, sessionType: string, sessionYear: number) => {
      patch({
        isGenerating: true,
        generateError: null,
        llmRecommendations: null,
        selectedCourses: [],
      });

      try {
        const response = await recommendationRepository.recommendCourses(studentId, {
          sessionType,
          sessionYear,
        });

        if (!response.success || !response.data) {
          patch({ generateError: response.error || 'Failed to generate recommendations' });
          return;
        }

        const responseData = response.data.data ?? response.data;
        console.log(responseData)

        const critical = patchCombinedLabCredits(responseData.priorityWiseCourses?.critical ?? []);
        const high     = patchCombinedLabCredits(responseData.priorityWiseCourses?.high     ?? []);
        const medium   = patchCombinedLabCredits(responseData.priorityWiseCourses?.medium   ?? []);
        const low      = patchCombinedLabCredits(responseData.priorityWiseCourses?.low      ?? []);

        const summary = {
          hasWarnings:            responseData.recommendedCoursesSummary?.hasWarnings ?? false,
          hasSpecialRequests:     responseData.recommendedCoursesSummary?.hasSpecialRequests ?? false,
          priorityBreakdown:      responseData.recommendedCoursesSummary?.priorityBreakdown ?? {
            critical: critical.length, high: high.length, medium: medium.length, low: low.length,
          },
          totalCreditsAllowed:    responseData.totalCreditsAllowed
                                    ?? responseData.recommendedCoursesSummary?.totalCreditsAllowed
                                    ?? 18,
          totalRequiredCredits:   responseData.recommendedCoursesSummary?.totalRequiredCredits ?? null,
          totalCoursesRecommended:
            responseData.recommendedCoursesSummary?.totalCoursesRecommended
            ?? critical.length + high.length + medium.length + low.length,
        };

        const llmRecommendations = {
          summary,
          recommendationText: responseData.recommendationText ?? '',
          detailedExplanation: responseData.recommendationText ?? 'Recommendations generated.',
          recommendations: { critical, high, medium, low },
          priorityWiseCourses: { critical, high, medium, low },
          creditAllocationScenarios: responseData.creditAllocationScenarios ?? [],
          specialRequests: responseData.specialRequests ?? [],
          raw: responseData,
        };

        patch({
          llmRecommendations,
          savedRecommendationId: responseData.id || null,
          allowedCreditHours: responseData.totalCreditsAllowed ||
                            responseData.recommendedCoursesSummary?.totalCreditsAllowed || 18,
          requiredCreditHours: responseData.recommendedCoursesSummary?.totalRequiredCredits ?? null,
          sessionId: responseData.sessionId || null,
          Session: responseData.SessionModel ?? null,
          selectedCourses: [],
        });
      } catch (err: any) {
        patch({ generateError: err?.message ?? 'Unexpected error generating recommendations' });
      } finally {
        patch({ isGenerating: false });
      }
    },
    [patch]
  );

  const toggleCourseSelection = useCallback(
    (course: SuggestedCourse, override?: Partial<SuggestedCourse>) => {
      const parentKey = selectionKey({
        courseId: course.courseId,
        courseName: course.courseName,
        originalCourseName: course.originalCourseName,
        isElective: course._selectionSource === 'ELECTIVE_OPTION',
      });

      const candidate = {
        ...(override ? { ...course, ...override } : { ...course }),
        _parentKey: parentKey,
      } as SuggestedCourse;

      setState(prev => {
        const already = prev.selectedCourses.some(c => entryKey(c) === parentKey);

        const selectedCourses = already
          ? prev.selectedCourses.filter(c => entryKey(c) !== parentKey)
          : [...prev.selectedCourses, candidate];

        return { ...prev, selectedCourses };
      });
    },
    []
  );

  const upsertCourseSelection = useCallback(
    (
      course: SuggestedCourse,
      override?: Partial<SuggestedCourse>,
      parentKeyOverride?: string
    ) => {
      const parentKey =
        parentKeyOverride ??
        selectionKey({
          courseId: course.courseId,
          courseName: course.courseName,
          originalCourseName: course.originalCourseName,
          isElective: course._selectionSource === 'ELECTIVE_OPTION',
        });

      const candidate = {
        ...(override ? { ...course, ...override } : { ...course }),
        _parentKey: parentKey,
      } as SuggestedCourse;

      setState(prev => {
        const idx = prev.selectedCourses.findIndex(c => entryKey(c) === parentKey);

        if (idx === -1) {
          return { ...prev, selectedCourses: [...prev.selectedCourses, candidate] };
        }
        const next = [...prev.selectedCourses];
        next[idx] = candidate;
        return { ...prev, selectedCourses: next };
      });
    },
    []
  );

  const updateSelectedCourse = useCallback(
    (original: SuggestedCourse, override: Partial<SuggestedCourse>) => {
      const key = entryKey(original);
      setState(prev => ({
        ...prev,
        selectedCourses: prev.selectedCourses.map(c =>
          entryKey(c) === key ? { ...c, ...override } : c
        ),
      }));
    },
    []
  );

  const isCourseSelected = useCallback(
    (courseId: number | null, courseName: string, originalCourseName?: string | null) => {
      const canonical = originalCourseName ?? courseName;

      return state.selectedCourses.some(c => {
        // Elective — match parent slot name
        if (c._selectionSource === 'ELECTIVE_OPTION') {
          return c.originalCourseName === canonical;
        }

        // Substitute / alternative — match on stored _parentKey
        if ((c as any)._parentKey) {
          const expected =
            courseId != null
              ? `id:${courseId}::${canonical}`
              : `name:${canonical}`;
          if ((c as any)._parentKey === expected) return true;
        }

        // Regular — match by id+canonical, or canonical-only when id null
        const cCanonical = c.originalCourseName ?? c.courseName;
        if (courseId == null) return cCanonical === canonical;
        return c.courseId === courseId && cCanonical === canonical;
      });
    },
    [state.selectedCourses]
  );

  const clearSelection = useCallback(() => patch({ selectedCourses: [] }), [patch]);

  const totalSelectedCredits = useMemo(
    () => state.selectedCourses.reduce((sum, c) => sum + (c.credits ?? 0), 0),
    [state.selectedCourses]
  );

  const allRecommendedCourses: SuggestedCourse[] = useMemo(() => {
    if (!state.llmRecommendations) return [];
    const { recommendations } = state.llmRecommendations;
    return [
      ...(recommendations.critical ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'critical' as const })),
      ...(recommendations.high     ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'high'     as const })),
      ...(recommendations.medium   ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'medium'   as const })),
      ...(recommendations.low      ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'low'      as const })),
    ];
  }, [state.llmRecommendations]);

  const getCoursesByPriority = useCallback(
    (priority: string) =>
      state.llmRecommendations?.recommendations?.[priority as keyof typeof state.llmRecommendations.recommendations] ?? [],
    [state.llmRecommendations]
  );

  const getPriorityBreakdown = useCallback(
    () => state.llmRecommendations?.summary.priorityBreakdown ?? null,
    [state.llmRecommendations]
  );

  const finalizeRecommendations = useCallback(
    async (studentId: number, sessionId: number): Promise<boolean> => {
      if (!state.selectedCourses.length) {
        patch({ finalizeError: 'Please select at least one course' });
        return false;
      }
      if (!state.savedRecommendationId) {
        patch({ finalizeError: 'No recommendation found to finalize' });
        return false;
      }
      const advisorId = userProfile?.profile?.id;
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
          Session: state.Session,
        };
        const response = await recommendationRepository.finalizeRecommendation(payload);

        if (response.success) {
          patch({ selectedCourses: [] });
          return true;
        }
        patch({ finalizeError: response.error || 'Failed to finalize recommendations' });
        return false;
      } catch (err: any) {
        patch({ finalizeError: err?.message ?? 'Unexpected error finalizing recommendations' });
        return false;
      } finally {
        patch({ isFinalizing: false });
      }
    },
    [state.selectedCourses, state.savedRecommendationId, state.Session, userProfile, patch]
  );

  const fetchAdvisoryLogs = useCallback(async () => {
    const advisorId = userProfile?.profile?.id;
    if (!advisorId) { patch({ logsError: 'Advisor profile not found. Please log in again.' }); return; }
    patch({ isLoadingLogs: true, logsError: null });
    try {
      const response = await recommendationRepository.getAdvisoryLogs(advisorId);
      if (response.success && response.data) {
        patch({ advisoryLogs: response.data, logsError: null });
      } else {
        patch({ advisoryLogs: [], logsError: response.error || 'Failed to load advisory logs' });
      }
    } catch (err: any) {
      patch({ advisoryLogs: [], logsError: err?.message ?? 'Unexpected error loading logs' });
    } finally {
      patch({ isLoadingLogs: false });
    }
  }, [userProfile, patch]);

  const resetRecommendations = useCallback(() => setState(initialState), []);

  const getWarningMessage = useCallback(
    () => state.llmRecommendations?.summary?.hasWarnings
      ? state.llmRecommendations.detailedExplanation
      : null,
    [state.llmRecommendations]
  );

  return {
    llmRecommendations: state.llmRecommendations,
    savedRecommendationId: state.savedRecommendationId,
    allowedCreditHours: state.allowedCreditHours,
    requiredCreditHours: state.requiredCreditHours,
    sessionId: state.sessionId,
    selectedCourses: state.selectedCourses,
    advisoryLogs: state.advisoryLogs,
    allRecommendedCourses,
    totalSelectedCredits,

    isGenerating: state.isGenerating,
    isFinalizing: state.isFinalizing,
    isLoadingLogs: state.isLoadingLogs,

    generateError: state.generateError,
    finalizeError: state.finalizeError,
    logsError: state.logsError,

    generateRecommendations,
    toggleCourseSelection,
    upsertCourseSelection,
    updateSelectedCourse,
    clearSelection,
    isCourseSelected,
    finalizeRecommendations,
    fetchAdvisoryLogs,
    resetRecommendations,
    getCoursesByPriority,
    getPriorityBreakdown,
    getWarningMessage,
  };
};