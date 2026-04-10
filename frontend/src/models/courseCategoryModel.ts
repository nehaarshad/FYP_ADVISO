export interface CourseCategory {
  id: number;
  courseId: number;
  categoryId: number | null;
  createdAt?: string;
  updatedAt?: string;
}
