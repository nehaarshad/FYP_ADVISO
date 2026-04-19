export interface SuggestedCourse {
  courseId: number;
  courseName: string;
  credits: number;
  category: string;
  reason: string;
  isOffered: boolean;
  offeredProgram: string | null;
  timeSlot: string | null;
  actionRequired: 'RETAKE' | 'REQUEST_SPECIAL_OFFERING' | 'SUBSTITUTE' | 'IMPROVEMENT_RECOMMENDED' | 'NEW';
  substituteCourses?: SubstituteCourse[];
  priority?: 'critical' | 'high' | 'medium' | 'low';
}
 export interface SubstituteCourse {
  courseName: string;
  credits: number;
  category: string;
}