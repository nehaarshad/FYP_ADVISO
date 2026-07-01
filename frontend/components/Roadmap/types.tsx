/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Roadmap {
  id: number;
  versionName: string;
  totalCreditHours: number;
  roadmapFilePath: string;
  RoadmapCourseCategoryModels?: any[];
  SemesterRoadmapModels?: any[];
}

export interface Program {
  id: number;
  programName: string;
}

export interface UploadData {
  file: File;
  programName: string;
  batchName?: string;
  batchYear?: string;
}

export interface AssignData {
  roadmapId: number;
  batchName: string;
  batchYear: string;
  programName: string;
}