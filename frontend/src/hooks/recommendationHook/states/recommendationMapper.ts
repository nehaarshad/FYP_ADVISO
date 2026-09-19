/* eslint-disable @typescript-eslint/no-explicit-any */

import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';

export interface NormalizedRecommendation {
  id: number | null;
  sessionId: number | null;
  savedRecommendationId: number | null;

  summary: {
    hasWarnings: boolean;
    hasSpecialRequests: boolean;
    priorityBreakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    totalCreditsAllowed: number;
    totalRequiredCredits: number | null;
    totalCoursesRecommended: number;
  };

  recommendationText: string;
  detailedExplanation: string;

  recommendations: {
    critical: any[];
    high: any[];
    medium: any[];
    low: any[];
  };
  priorityWiseCourses: {
    critical: any[];
    high: any[];
    medium: any[];
    low: any[];
  };

  creditAllocationScenarios: any[];
  specialRequests: any[];

  Session: any | null;
  sessionType: string | null;
  sessionYear: number | null;

  notes: string | null;
  sentAt: string | null;

  raw: any;
}

export const extractRecommendationPayload = (response: any): any | null => {
  if (!response?.success || !response?.data) return null;

  const d = response.data;

  if (d.data && Array.isArray(d.data) && d.data.length > 0) return d.data[0];
  if (d.data && !Array.isArray(d.data)) return d.data;
  if (d.courses) return d;                       // flat shape
  if (Array.isArray(d) && d.length > 0) return d[0];

  return null;
};

const resolveSession = (src: any): {
  sessionObj: any | null;
  sessionType: string | null;
  sessionYear: number | null;
} => {
  if (!src) return { sessionObj: null, sessionType: null, sessionYear: null };

  const sessionObj =
    src.Session ??
    src.SessionModel ??
    src.session ??
    src.sessionModel ??
    null;

  const sessionType =
    sessionObj?.sessionType ??
    sessionObj?.session_type ??
    sessionObj?.type ??
    src.sessionType ??
    src.session_type ??
    null;

  const rawYear =
    sessionObj?.sessionYear ??
    sessionObj?.session_year ??
    sessionObj?.year ??
    src.sessionYear ??
    src.session_year ??
    null;

  const sessionYear =
    rawYear != null && !Number.isNaN(Number(rawYear))
      ? Number(rawYear)
      : null;

  return { sessionObj, sessionType, sessionYear };
};


export const normalizeRecommendation = (
  responseData: any
): NormalizedRecommendation | null => {
  if (!responseData) return null;

  const critical = responseData.priorityWiseCourses?.critical ?? [];
  const high     = responseData.priorityWiseCourses?.high     ?? [];
  const medium   = responseData.priorityWiseCourses?.medium   ?? [];
  const low      = responseData.priorityWiseCourses?.low      ?? [];

  const summarySrc = responseData.recommendedCoursesSummary ?? {};

  const totalCreditsAllowed =
    responseData.totalCreditsAllowed ??
    summarySrc.totalCreditsAllowed ??
    18;

  const totalRequiredCredits =
    summarySrc.totalRequiredCredits ??
    responseData.totalRequiredCredits ??
    null;

  const priorityBreakdown =
    summarySrc.priorityBreakdown ?? {
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
    };

  const totalCoursesRecommended =
    summarySrc.totalCoursesRecommended ??
    critical.length + high.length + medium.length + low.length;

  const recommendationText =
    responseData.recommendationText ?? 'Recommendations generated.';

  // ✅ Robust session resolution
  const { sessionObj, sessionType, sessionYear } = resolveSession(responseData);

  return {
    id: responseData.id ?? null,
    sessionId: responseData.sessionId ?? null,
    savedRecommendationId: responseData.id ?? null,

    summary: {
      hasWarnings: summarySrc.hasWarnings ?? false,
      hasSpecialRequests: summarySrc.hasSpecialRequests ?? false,
      priorityBreakdown,
      totalCreditsAllowed,
      totalRequiredCredits,
      totalCoursesRecommended,
    },

    recommendationText,
    detailedExplanation: recommendationText,

    // Same arrays referenced under both keys for backward compatibility
    recommendations: { critical, high, medium, low },
    priorityWiseCourses: { critical, high, medium, low },

    creditAllocationScenarios: responseData.creditAllocationScenarios ?? [],
    specialRequests: responseData.specialRequests ?? [],

    Session: sessionObj,
    sessionType,
    sessionYear,

    notes: responseData.notes ?? null,
    sentAt: responseData.createdAt ?? responseData.updatedAt ?? null,

    raw: responseData,
  };
};


export const normalizeFromResponse = (response: any): NormalizedRecommendation | null => {
  const payload = extractRecommendationPayload(response);
  if (!payload) {
    if (response?.data && !response.data.data) {
      return normalizeRecommendation(response.data);
    }
    return null;
  }
  return normalizeRecommendation(payload);
};

export const buildAllRecommendedCourses = (
  normalized: NormalizedRecommendation | null
): SuggestedCourse[] => {
  if (!normalized) return [];
  const { recommendations } = normalized;
  return [
    ...(recommendations.critical ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'critical' as const })),
    ...(recommendations.high     ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'high'     as const })),
    ...(recommendations.medium   ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'medium'   as const })),
    ...(recommendations.low      ?? []).map((c: SuggestedCourse) => ({ ...c, priority: 'low'      as const })),
  ];
};