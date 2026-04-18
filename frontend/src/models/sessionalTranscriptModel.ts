import { TranscriptCourseDetail } from "./TranscriptCoursesDetailModel";

export interface SessionalTranscript {
  id: number;
  semesterEarnedCreditHours: string;
  semesterGPA: string;
  degreeTranscriptId: number;
  sessionId: number;
  createdAt?: string;
  updatedAt?: string;
  TranscriptCoursesDetails: TranscriptCourseDetail[];
}