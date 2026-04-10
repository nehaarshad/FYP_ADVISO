export interface TranscriptCourseDetail {
  id: number;
  courseName: string;
  courseCode: string;
  courseCategory: string;
  points: string;
  grade: string;
  marks: string;
  earnedCreditHours: string;
  totalCreditHours: string;
  sessionalTranscriptId: number;
  createdAt?: string;
  updatedAt?: string;
}