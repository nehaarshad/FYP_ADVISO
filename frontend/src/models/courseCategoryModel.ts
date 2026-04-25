import { Category } from "./categoryModel";
import { Course } from "./coursesModel";

export interface CourseCategory {
  id: number;
  courseId: number;
  categoryId: number | null;
  createdAt?: string;
  updatedAt?: string;
  CoursesModel:Course;
  CategoryModel:Category
}
