import { Session } from "@/src/models/sessionModel";
import { CourseTimetable } from "@/src/models/systemSuggestedCoursesModel";

export interface FinalizedCourse {
  courseId: number | null;
  courseName: string;
  originalCourseName?: string | null;
  program: string | null;             // owning program
  offeredProgram: string | null;      // where it's actually taught
  semester: number | null;            // semester the course belongs to
  batch?: string | null;
  category: string;
  credits: number;
  lectureSlots: CourseTimetable[];
  labSlots: CourseTimetable[];
  instructors: string[];              
  timeSlot: string | null;          
  systemReason: string | null;        
  selectionReason: string;          
  selectionSource:
    | 'RECOMMENDED'                  
    | 'ALTERNATIVE_FOR_CLASH'       
    | 'ELECTIVE_OPTION'               
    | 'MANUAL_ADD';                   
  priority?: string | null;
  actionRequired?: string;
  hasLab?: boolean;
  isElective?: boolean;
  substituteFor?: string | null;     
}

export interface FinalizeRecommendationPayload {
  advisorId: number;
  studentId: number;
  Session?: Session | null ;
  sessionId: number;
  sessionalRecommendationId: number;
  selectedCourses: FinalizedCourse[]; 
  notes?: string | null;
}