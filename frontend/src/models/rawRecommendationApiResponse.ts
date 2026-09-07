/* eslint-disable @typescript-eslint/no-explicit-any */


export interface RawPriorityWiseCourses {
  critical: any[];
  high: any[];
  medium: any[];
  low: any[];
}

export interface RawRecommendedCoursesSummary {
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
  hasSpecialRequests?: boolean;
}

export interface RawRecommendationApiResponse {
  id: number;
  recommendationText: string;
  recommendedCoursesSummary: RawRecommendedCoursesSummary;
  priorityWiseCourses: RawPriorityWiseCourses;
  totalCreditsAllowed?: number;
  sessionId?: number;
  studentId?: number;
  createdAt?: string;
  updatedAt?: string;
  notes?: string | null;
  totalCredits?: number;
  Session?: {
    sessionType: string;
    sessionYear: number;
  };
  SuggestedCourses?: any[];
}