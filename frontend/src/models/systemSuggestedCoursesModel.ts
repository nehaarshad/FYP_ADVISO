/* eslint-disable @typescript-eslint/no-explicit-any */

import { CoursePriority } from '@/src/repositories/recommendationRepository/types/systemRespponse';
 
export interface CourseTimetable {
   id?: number; 
   day: string; 
   room?: string; 
   venue?: string; 
   type?: 'Lecture' | 'Lab' | string; 
   section?: string; 
   startTime: string; 
   endTime: string; 
   instructor: string; 
   createdAt?: string; 
   updatedAt?: string; 
   courseOfferingId?: number;
   } 
   
export interface LabDetails { 
  program: string; 
  courseName: string; 
  timetables: CourseTimetable[]; 
} 

export type NormalTimetableDetails = CourseTimetable[]; 

export interface CombinedTimetableDetails { 
  lecture?: CourseTimetable[]; 
  lab?: CourseTimetable[]; 
}

export interface ElectiveOption { 
  credits: number; 
  program: string; 
  semester: number; 
  timeSlot: string | null; 
  courseName: string; 
  isElective: boolean; 
  totalScore: number; 
  exactCredit: boolean; 
  matchReason: string; 
  isSameProgram: boolean; 
  actionRequired: string; 
  isSameSemester: boolean; 
  timetableDetails: CourseTimetable[];
} 

export interface CategorizedElectiveOptions { 
  bestMatch: { 
    credits: number; 
    program: string; 
    semester: number; 
    timeSlot: string | null; 
    courseName: string; 
    matchReason: string; 
  } | null; 
sameProgramSameSemester: ElectiveCategoryOption[]; 
otherProgramSameSemester: ElectiveCategoryOption[]; 
sameProgramOtherSemester: ElectiveCategoryOption[]; 
otherProgramOtherSemester: ElectiveCategoryOption[];
}

export interface ElectiveCategoryOption { 
  credits: number; 
  program: string; 
  semester: number; 
  timeSlot: string | null; 
  courseName: string; 
} 

export interface SuggestedCourseMetadata {
   batch?: string; 
   hasLab?: boolean; 
   program?: string; 
   labClash?: boolean; 
   fuzzyMatch?: boolean;
   isCombined?: boolean;
   isElective?: boolean; 
   labDetails?: LabDetails | null; 
   labProgram?: string; 
   labProgramId?: number; 
   needsReview?: boolean; 
   clashResolved?: boolean; 
   priorityOrder?: CoursePriority | string; 
   resolvesClash?: boolean; 
   actionRequired?: string; 
   creditMismatch?: boolean; 
   isNotSuggested?: boolean; 
   isOtherProgram?: boolean; 
   isOtherSemester?: boolean; 
   offeredProgramId?: number; 
   timeSlot?: string | null; 
   timetableDetails?: NormalTimetableDetails | CombinedTimetableDetails; 
   totalAlternatives?: number; 
   totalElectiveOptions?: number; 
   originalCourseName?: string; 
   electiveType?: string; 
   electiveOptions?: ElectiveOption[]; 
   requiredCredits?: number; 
   availableCredits?: number;
  recommendedAction?: string; 
  categorizedOptions?: CategorizedElectiveOptions; 
} 
  
export interface SubstituteCourse { 
  courseName: string; 
  credits: number; 
  category: string; 
}  

export interface ClashDetails { 
  clashesWith: string; 
  clashSlots: string; 
  detailedClashes: DetailedClash[]; 
} 

export interface DetailedClash { 
  courseName: string; 
  time: string; 
  day: string; 
  startTime: string; 
  endTime: string; 

} 

export interface ClashRecord { 
  credits: number; 
  program: string; 
  courseName: string; 
  timeSlot: string; 
  clashesWith: string; 
  reason: string; 
  isNotSuggested: boolean; 
  notSuggestedReason: string; 
  clashDetails: ClashDetails; 
} 

export interface AlternativeCourse { 
  courseName: string; 
  credits: number; 
  program: string; 
  timeSlot: string | null;
  reason: string; 
  actionRequired: string; 
  substituteCourses: string[]; 
  score: number; 
  bestMatchDetails: { 
    score: number; 
    sameSemester: boolean; 
    semester: number; 
    creditMatch: boolean; 
    isCore: boolean; 
    hasDependents: boolean; 
  }; 
allAlternatives?: { 
  available: unknown[]; 
  timeClashes: unknown[]; 
  notOffered: unknown[]; 
  summary: unknown; }; 
  totalAvailable: number; 
} 

export interface SuggestedCourse { 
  courseId: number | null; 
  courseName: string; 
  credits: number; 
  category: string; 
  reason: string | null; 
  isOffered: boolean; 
  offeredProgram: string | null; 
  timeSlot: string | null; 
  actionRequired: string; 
  priority?: CoursePriority | Uppercase<CoursePriority>; 
  substituteCourses?: SubstituteCourse[]; 
  clashRecord?: ClashRecord; 
  alternative?: AlternativeCourse; 
  isNotSuggested?: boolean; 
  notSuggestedReason?: string;  
  batch?: string; 
  hasLab?: boolean; 
  program?: string; 
  isElective?: boolean; 
  labDetails?: LabDetails | null; 
  labProgram?: string; 
  labProgramId?: number; 
  offeredProgramId?: number; 
  timetableDetails?: | NormalTimetableDetails | CombinedTimetableDetails; 
  originalCourseName?: string; 
  needsReview?: boolean; 
  electiveType?: string; 
  totalOptions?: number; 
  requiredCredits?: number; 
  availableCredits?: number; 
  recommendedAction?: string; 
  creditMismatch?: boolean; 
  isOtherProgram?: boolean; 
  isOtherSemester?: boolean; 
  electiveOptions?: ElectiveOption[]; 
  categorizedOptions?: CategorizedElectiveOptions; 
  totalAvailable?: number; 
  totalAlternatives?: number; 
  totalElectiveOptions?: number; 
}