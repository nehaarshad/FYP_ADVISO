export interface FacultyRecommendation {
  id: number;
  subject: string;
  problem: string;
  solution: string;
  status: string;
  recommendedById: number;
  approvedById: number;
  recommendationCategoryId: number;
  createdAt?: string;
  updatedAt?: string;
}