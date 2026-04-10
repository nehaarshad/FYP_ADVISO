export interface BatchMeeting {
  id: number;
  advisorId: number;
  batchId: number;
  sessionId: number;
  startTime: string;
  endTime: string;
  endDate: string | null;
  status: string;
  day: string;
  date: string;
  meetingSummary: string | null;
  createdAt?: string;
  updatedAt?: string;
}