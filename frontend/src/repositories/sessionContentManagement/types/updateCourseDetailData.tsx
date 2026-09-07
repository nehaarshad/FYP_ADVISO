export interface UpdateCourseCredentialsData {
  courseCode?: string;
  courseName?: string;
  courseCredits?: string;
  prerequisiteIds?: number[];
  categoryIds ?: number[];
}