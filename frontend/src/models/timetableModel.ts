export interface Timetable {
  id: number;
  courseOfferingId: number;
  day: string;
  venue: string;
  instructor: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}