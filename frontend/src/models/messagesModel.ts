import { User } from "./userModel";

export interface Message {
  id: number;
  senderId: number;
  fileAttachment: string | null;
  isRead: boolean;
  isSent: boolean;
  text: string | null;
  receiverId: number;
  chatId: number;
  senderName: string,
  senderRole: string,
  createdAt?: string;
  updatedAt?: string;

  sender?: User;
}