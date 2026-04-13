export interface BatchAssignment {
  id: number;
  advisorId: number;
  batchId: number;
  startDate: string;
  endDate: string | null;
  isCurrentlyAdvised: boolean;
  createdAt?: string;
  updatedAt?: string;
}