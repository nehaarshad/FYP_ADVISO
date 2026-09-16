export interface AdvisorTimetableEntryInput {
  day: string;
  course: string;
  startTime: string;
  endTime: string;
}

export interface AdvisorTimetableEntryUpdate extends Partial<AdvisorTimetableEntryInput> {
  id: number;
}

export interface AddAdvisorTimetablePayload {
  userId: number;
  timetables: AdvisorTimetableEntryInput[];
}

export interface UpdateAdvisorTimetablePayload {
  userId: number;
  timetables: AdvisorTimetableEntryUpdate[];
}