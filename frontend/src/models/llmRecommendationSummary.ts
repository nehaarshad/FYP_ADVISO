export interface LLMRecommendationSummary {
  totalRequiredCredits: number;
  totalCreditsAllowed: number;
  priorityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}
 