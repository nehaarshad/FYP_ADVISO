import { SemesterCourse } from "./semesterCourseModel";

export interface SemesterRoadmap {
  id: number;
  roadmapId: number;
  semesterNo: string;
  totalCreditHours: number;
  createdAt?: string;
  updatedAt?: string;
  SemesterCourseModel:SemesterCourse
}