import { User } from "./userModel";

export interface Chat {
  id: number;
  senderId: number;
  receiverId: number;
  batchId: number;

  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  sender?: User;
  receiver?: User;
  createdAt?: string;
  updatedAt?: string;
}