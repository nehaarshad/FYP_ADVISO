export interface LLMRecommendationSummary { 
  totalRequiredCredits: number; 
  totalCreditsAllowed: number; 
  totalCoursesRecommended: number; 
  hasWarnings: boolean; 
  hasSpecialRequests: boolean; 
  priorityBreakdown: { 
    critical: number; 
    high: number; 
    medium: number; 
    low: number; 
  }; 
}