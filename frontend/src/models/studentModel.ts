export interface Student {
  id: number;
  studentName: string;
  email: string;
  registrationNumber: string | null;
  contactNumber: number | null;
  dateOfBirth: string | null;
  cnic: string | null;
  currentSemester: number;
  userId: number;
  batchId: number;
  createdAt?: string;
  updatedAt?: string;
}