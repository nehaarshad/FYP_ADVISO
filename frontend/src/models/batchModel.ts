import {Program} from "./programModel"
import {BatchAssignment} from "./batchAssignmentModel"
export interface Batch {
  id: number;
  programId: number;
  roadmapId: number | null;
  batchName: string;
  batchYear: string;
  totalStudent: number | null;
  createdAt?: string;
  updatedAt?: string;
  ProgramModel: Program;
  BatchAssignments:BatchAssignment[];
}