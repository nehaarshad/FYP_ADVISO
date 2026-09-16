export interface TimetableStudent {
  id: number;
  studentName: string;
  userId: number;
}

export interface TimetableEntry {
  id: number;
  day: string;
  course: string;
  startTime: string;
  endTime: string;
  userId?: number;   // batch only
  advisorId?: number;   // advisor only
  batchId?: number;     // batch only
   Student?: TimetableStudent;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetableEntryInput {
  day: string;
  course: string;
  startTime: string;
  endTime: string;
}

export interface TimetableEntryUpdate extends Partial<TimetableEntryInput> {
  id: number;
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type Day = (typeof DAYS)[number];

export const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

// For grid columns
export const WORK_DAYS: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const formatTime = (t: string): string => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};