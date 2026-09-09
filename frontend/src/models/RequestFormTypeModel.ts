

export interface RequestForm {
  id: number;
  RequestType: string;
  formData: JSON,
  finalDecision: string,
  studentId:number,
  approvedById: number,
  preReviewedById: number,
  status: string,
  createdAt?: string;
  updatedAt?: string;
}