export interface BatchTimetableEntryInput {
  day: string;
  course: string;
  startTime: string;
  endTime: string;
}

export interface BatchTimetableEntryUpdate extends Partial<BatchTimetableEntryInput> {
  id: number;
}

export interface AddBatchTimetablePayload {
  userId: number;
  timetables: BatchTimetableEntryInput[];
}

export interface UpdateBatchTimetablePayload {
  userId: number;
  timetables: BatchTimetableEntryUpdate[];
}