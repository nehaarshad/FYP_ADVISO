import { LLMRecommendations } from "@/src/models/llmRecommendationModel";
import { Session } from "@/src/models/sessionModel";
import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";
import { FinalizeRecommendationPayload } from "@/src/repositories/recommendationRepository/types/finalizedRecommendation";

export interface SelectedCourseEntry extends SuggestedCourse {
  _selectionReason?: string;
  _selectionSource?: 'RECOMMENDED' | 'ALTERNATIVE_FOR_CLASH' | 'ELECTIVE_OPTION' | 'MANUAL_ADD';
  _substituteFor?: string | null;
  _electiveOption?: Partial<SuggestedCourse>;
}

export interface RecommendationState {
  llmRecommendations: LLMRecommendations | null;
  Session:Session | null;
  savedRecommendationId: number | null;
  allowedCreditHours: number | null;
  requiredCreditHours: number | null;
  totalCreditsAllowed: number | null;
  sessionId: number | null;
  selectedCourses: SelectedCourseEntry[] | [];
  advisoryLogs: FinalizeRecommendationPayload[] | [];
  isGenerating: boolean;
  isFinalizing: boolean;
  isLoadingLogs: boolean;
  generateError: string | null;
  finalizeError: string | null;
  logsError: string | null;
}