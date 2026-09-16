export type MeetingStatus = 'pending' | 'scheduled' | 'cancelled' | 'completed';

export interface BatchMeeting {
  id: number;
  advisorId: number;
  batchId: number;
  sessionId: number | null;
  day: string;
  startTime: string;   // "HH:MM:SS"
  endTime: string;     // "HH:MM:SS"
  date: string | null; // "YYYY-MM-DD"
  status: MeetingStatus;
  meetingSummary: string | null;
  createdAt?: string;
  updatedAt?: string;
}