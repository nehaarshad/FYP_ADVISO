import { Batch } from "./batchModel";
import { Program } from "./programModel";
import { Session } from "./sessionModel";

export interface CourseOffering {
  id: number;
  courseName: string;
  credits: number;
  courseCategory: string;
  sessionId: number | null;
  batchId: number | null;
  programId: number | null;
  createdAt?: string;
  updatedAt?: string;
  BatchModel:Batch;
  ProgramModel:Program;
  SessionModel:Session
}