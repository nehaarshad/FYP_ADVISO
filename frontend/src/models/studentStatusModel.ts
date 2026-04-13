export interface StudentStatus {
  id: number;
  currentStatus: string;
  reason: string | null;
  studentId: number;
  createdAt?: string;
  updatedAt?: string;
}