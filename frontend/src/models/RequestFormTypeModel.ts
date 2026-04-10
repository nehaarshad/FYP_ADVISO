 type RequestType = 
  | 'Semester Freezing'
  | 'Semester Unfreezing'
  | 'Course Offering Request'
  | 'Courses Registeration Request'
  | 'Extra Credit Enrollment Request';

export interface RequestFormType {
  id: number;
  RequestType: RequestType;
  formData: JSON; 
  createdAt?: string;
  updatedAt?: string;
}