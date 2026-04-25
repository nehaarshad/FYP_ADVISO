import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";

export interface FinalizeRecommendationPayload {
  advisorId: number;
  studentId: number;
  sessionId: number;
  sessionalRecommendationId: number;   
  selectedCourses: SuggestedCourse[];  
}