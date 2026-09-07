/* eslint-disable @typescript-eslint/no-explicit-any */
import { SuggestedCourse, SuggestedCourseMetadata } from '@/src/models/systemSuggestedCoursesModel';


export type CoursePriority = 'critical' | 'high' | 'medium' | 'low';

export interface PriorityBreakdown { 
  critical: number; 
  high: number; 
  medium: number; 
  low: number; 
} 

export interface RecommendationSummary { 
  hasWarnings: boolean; 
  priorityBreakdown: PriorityBreakdown; 
  hasSpecialRequests: boolean; 
  totalCreditsAllowed: number; 
  totalRequiredCredits: number; 
  totalCoursesRecommended: number; 
} 

export interface LLMRecommendationSummary { 
  totalRequiredCredits: number; 
  totalCreditsAllowed: number; 
  priorityBreakdown: PriorityBreakdown;
 }
 
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

export interface CreditAllocationScenario { 
  scenario: number; 
  totalCredits: number; 
  courses: string[]; 
  description: string; 
} 

export interface SpecialRequest { 
  courseName: string; 
  reason: string; 
  message: string; 
} 

export interface RecommendationData { 
  id: number; 
  recommendationText: string; 
  recommendedCoursesSummary: RecommendationSummary; 
  priorityWiseCourses: { 
    low: SuggestedCourse[]; 
    high: SuggestedCourse[];
    medium: SuggestedCourse[]; 
    critical: SuggestedCourse[];
  }; 
  totalCreditsAllowed: number;
  sessionId: number; 
  studentId: number; 
  createdAt: string; 
  updatedAt: string; 
  SuggestedCourses: SavedSuggestedCourse[]; 
  llmRecommendations?: LLMRecommendations; 
  allowedCreditHours?: number; 
  savedRecommendationId?: number; 
}

export interface SavedSuggestedCourse { 
  id: number; 
  courseName: string; 
  courseCode: string | null; 
  credits: number; 
  category: string; 
  sessionalRecommendationId: number; 
  priority: CoursePriority | Uppercase<CoursePriority>; 
  reason: string | null; 
  isOffered: boolean; 
  offeredProgram: string | null; 
  timeSlot: string | null; 
  metadata: SuggestedCourseMetadata; 
  createdAt: string; 
  updatedAt: string; 
  courseId: number | null;
 } 
 
 export interface RecommendCoursesResponse { 
  success: boolean;
  data: RecommendationData;
  error?: string; 
}