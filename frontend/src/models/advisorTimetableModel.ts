export interface AdvisorTimetable {
  id: number;
  advisorId: number;
  day: string;
  course: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}