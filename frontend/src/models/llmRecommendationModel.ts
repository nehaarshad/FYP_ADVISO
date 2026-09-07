/* eslint-disable @typescript-eslint/no-explicit-any */

import { SuggestedCourse } from "./systemSuggestedCoursesModel";


export interface PriorityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface LLMRecommendationSummary {
  totalRequiredCredits: number;
  totalCreditsAllowed: number;
  priorityBreakdown: PriorityBreakdown;
  hasWarnings: boolean;
  totalCoursesRecommended: number;
  hasSpecialRequests: boolean;
}

export interface LLMRecommendations {
  summary: LLMRecommendationSummary;
  recommendations: {
    critical: SuggestedCourse[];
    high: SuggestedCourse[];
    medium: SuggestedCourse[];
    low: SuggestedCourse[];
  };
  creditAllocationScenarios: any[]; // Update with proper type if available
  specialRequests: any[]; // Update with proper type if available
  detailedExplanation: string;
}