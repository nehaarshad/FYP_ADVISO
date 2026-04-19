import {User} from "./userModel";
import { StudentGuardian } from "./studentGuardianModel";
import { StudentStatus } from "./studentStatusModel";
import {Batch} from "./batchModel" 

export interface Student {
  id: number;
  studentName: string;
  email: string;
  registrationNumber: string | null;
  contactNumber: number | null;
  dateOfBirth: string | null;
  cnic: string | null;
  currentSemester: number;
  userId: number;
  batchId: number;
  createdAt?: string;
  updatedAt?: string;
  User?:User;
  StudentStatus?:StudentStatus;
  StudentGuardians?: StudentGuardian[];
  BatchModel?: Batch;
}