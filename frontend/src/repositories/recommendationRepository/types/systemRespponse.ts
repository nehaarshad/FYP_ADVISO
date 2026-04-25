/* eslint-disable @typescript-eslint/no-explicit-any */
import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';
import { CreditAllocationScenario } from './creditAllocation';
import { SpecialRequest } from './specialRequest';

export interface RecommendCoursesResponse {
  success: boolean;
  data: {
    llmRecommendations: {
      summary: {
        totalRequiredCredits: number;
        totalCreditsAllowed: number;
        priorityBreakdown: {
          critical: number;
          high: number;
          medium: number;
          low: number;
        };
      };
      recommendations: {
        critical: SuggestedCourse[];
        high: SuggestedCourse[];
        medium: SuggestedCourse[];
        low: SuggestedCourse[];
      };
      creditAllocationScenarios: CreditAllocationScenario[];
      specialRequests: SpecialRequest[];
      detailedExplanation: string;
    };
    savedRecommendationId: number;
    allowedCreditHours: number;
    sessionId:number;
  };
  error?: string;
}