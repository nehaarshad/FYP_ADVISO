export interface CoursePrerequisite {
  id: number;
  courseid: number;
  preReqCourseId: number | null;
  createdAt?: string;
  updatedAt?: string;
}