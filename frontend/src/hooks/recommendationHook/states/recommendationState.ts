import { LLMRecommendations } from "@/src/models/llmRecommendationModel";
import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";
import { AdvisoryLogEntry } from "@/src/repositories/recommendationRepository/types/advisoryLog";
import { PaginationMeta } from "./advisorylogdata";

export interface RecommendationState {
  llmRecommendations: LLMRecommendations | null;
  savedRecommendationId: number | null;
  allowedCreditHours: number | null;
  sessionId:number | null;
  selectedCourses: SuggestedCourse[];
  pagination: PaginationMeta | null;
  advisoryLogs: AdvisoryLogEntry[];
  isGenerating: boolean;  
  isFinalizing: boolean;  
  isLoadingLogs: boolean; 
  generateError: string | null;
  finalizeError: string | null;
  logsError: string | null;
}
