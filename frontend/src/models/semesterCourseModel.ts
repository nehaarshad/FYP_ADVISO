import { CourseCategory } from "./courseCategoryModel";

export interface SemesterCourse {
  id: number;
  semesterRoadmapId: number;
  courseCategoryId: number;
  createdAt?: string;
  updatedAt?: string;
  CourseCategoryModel:CourseCategory
}