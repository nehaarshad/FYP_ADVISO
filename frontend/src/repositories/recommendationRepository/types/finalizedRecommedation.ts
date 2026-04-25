import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";

export interface FinalizedRecommendation {
  id: number;
  advisorId: number;
  studentId: number;
  sessionId: number;
  recommendedCourses: SuggestedCourse[]; 
  createdAt: string;
  updatedAt: string;
}
 