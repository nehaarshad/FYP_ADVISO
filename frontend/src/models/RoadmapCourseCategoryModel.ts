import { Category } from "./categoryModel";

export interface RoadmapCourseCategory {
  id: number;
  categoryId: number;
  roadmapId: number;
  requiredCredits: number;
  createdAt?: string;
  updatedAt?: string;
  CategoryModel:Category
}