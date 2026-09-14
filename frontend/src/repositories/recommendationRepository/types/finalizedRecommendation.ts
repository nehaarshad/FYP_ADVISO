import { Session } from "@/src/models/sessionModel";
import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";

export interface FinalizeRecommendationPayload {
  Session: null | Session;
  advisorId: number;
  studentId: number;
  sessionId: number;
  sessionalRecommendationId: number;   
  selectedCourses: SuggestedCourse[];  
}