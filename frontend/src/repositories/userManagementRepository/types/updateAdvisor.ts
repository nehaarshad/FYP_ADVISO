export interface UpdateAdvisorData {
  advisorName: string;
  email: string;
  gender: string;
  contactNumber: string;
  batchName?: string;
  batchYear?: string;
  programName?: string;
  isCurrentlyAdvised?: boolean;
}