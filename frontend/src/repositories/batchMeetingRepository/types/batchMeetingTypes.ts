import { MeetingStatus } from '../../../models/batchMeetingModel';

export interface MeetingSuggestion {
  day: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface CreateMeetingPayload {
  userId: number;
  day: string;
  startTime: string;
  endTime: string;
}

export interface UpdateMeetingPayload {
  userId: number;
  date?: string | null;
  status?: MeetingStatus;
  meetingSummary?: string | null;
}

export interface MeetingSuggestionsResponse {
  batchId: number;
  advisorId: number;
  suggestions: MeetingSuggestion[];
}