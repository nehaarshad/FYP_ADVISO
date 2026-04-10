export interface AdvisorDecision {
  id: number;
  issueDescription: string;
  decisionTaken: string;
  specialNotes: string | null;
  advisorId: number;
  studentId: number;
  createdAt?: string;
  updatedAt?: string;
}