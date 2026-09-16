export interface Student {
  id: number;
  userId: number;
  name: string;
  sapid?: number;
  batchId?: number;
  isCR?: boolean;
}

export interface BatchTimetable {
  id: number;
  batchId: number;
  userId: number;
  day: string;
  course: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  Student?: Student; // from include
}