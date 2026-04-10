export interface Message {
  id: number;
  senderId: number;
  fileAttachment: string | null;
  isRead: boolean;
  isSent: boolean;
  text: string | null;
  receiverId: number;
  chatId: number;
  createdAt?: string;
  updatedAt?: string;
}