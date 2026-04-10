export interface Roadmap {
  id: number;
  programId: number;
  versionName: string;
  isActive: boolean;
  totalCreditHours: number;
  roadmapFilePath: string;
  createdAt?: string;
  updatedAt?: string;
}