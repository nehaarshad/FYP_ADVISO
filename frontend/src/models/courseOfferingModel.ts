export interface CourseOffering {
  id: number;
  courseName: string;
  credits: number;
  courseCategory: string;
  sessionId: number | null;
  batchId: number | null;
  programId: number | null;
  createdAt?: string;
  updatedAt?: string;
}