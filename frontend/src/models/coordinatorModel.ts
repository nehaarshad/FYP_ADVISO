import {User} from "./userModel"
export interface Coordinator {
  id: number;
  coordinatorName: string;
  email: string;
  department: string;
  contactNumber: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  User: User
}