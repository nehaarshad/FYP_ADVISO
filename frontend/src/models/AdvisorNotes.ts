export interface AdvisorNotes {
  id: number;
  advisorId: number;
  noteContent: string;
  isPrivate: boolean;
  createdAt?: string;
  updatedAt?: string;
}