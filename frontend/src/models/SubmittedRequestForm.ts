type RequestFormStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SubmittedRequestForm {
  id: number;
  status: RequestFormStatus;
  description: string;
  finalDecision: string;
  studentId: number;
  approvedById: number;
  preReviewedById: number;
  RequestFormTypeId: number;
  createdAt?: string;
  updatedAt?: string;
}