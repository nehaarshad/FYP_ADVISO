import { Session } from "@/src/models/sessionModel";
import { Student } from "@/src/models/studentModel";
import { SuggestedCourse } from "@/src/models/systemSuggestedCoursesModel";

 
export interface AdvisoryLogEntry {
  id: number;
  advisorId: number;
  studentId: number;
  sessionId: number;
  sessionalRecommendationId: number;
  recommendedCourses: SuggestedCourse[];   // JSON column — array of course objects
  totalCredits: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  Student: Student;    
  Session: Session;      
}