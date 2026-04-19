import { SessionalTranscript } from "./sessionalTranscriptModel";

export interface DegreeTranscript {
  id: number;
  totalEarnedCreditHours: string;
  currentCGPA: string;
  studentId: number;
  createdAt?: string;
  updatedAt?: string;
  SessionalTranscripts: SessionalTranscript[];
}