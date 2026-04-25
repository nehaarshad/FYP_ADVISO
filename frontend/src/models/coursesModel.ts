/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Course {
  id: number;
  courseCode: string | null;
  courseName: string;
  courseCredits: number;
  createdAt?: string;
  updatedAt?: string;
   prerequisites?: any[];
    usedAsPrerequisiteFor?: any[];
}