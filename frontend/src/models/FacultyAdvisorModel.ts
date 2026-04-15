import {User} from "./userModel"
import { Batch } from "./batchModel";
export interface BatchAdvisor {
  id: number;
  advisorName: string;
  email: string;
  gender: string;
  contactNumber: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
   User:User;
   BatchModel: Batch;
}