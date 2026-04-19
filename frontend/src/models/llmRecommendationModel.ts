import { CreditAllocationScenario } from "../repositories/recommendationRepository/types/creditAllocation";
import { SpecialRequest } from "../repositories/recommendationRepository/types/specialRequest";
import { LLMRecommendationSummary } from "./llmRecommendationSummary";
import { SuggestedCourse } from "./systemSuggestedCoursesModel";

export interface LLMRecommendations {
  summary: LLMRecommendationSummary;
  recommendations: {
    critical: SuggestedCourse[];
    high: SuggestedCourse[];
    medium: SuggestedCourse[];
    low: SuggestedCourse[];
  };
  creditAllocationScenarios: CreditAllocationScenario[];
  specialRequests: SpecialRequest[];
  detailedExplanation: string;
}
 