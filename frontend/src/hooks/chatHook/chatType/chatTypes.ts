import { User } from "@/src/models/userModel";

export interface ChatListItem {
  id: number;
  name: string;

  chatId: number;

  sapId?: string;
  batch?: string;
  semester?: string;

  sender:User;
  receiver:User;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;

  lastMessageSender?: "You" | "Advisor" | "Student";

  unreadCount: number;
}

export interface SendMessagePayload {
  chatId: number;
  senderId: number;
  receiverId: number;
  text?: string | null;
  fileAttachment?: string | null;
}

export interface GetChatMessagesPayload {
  chatId: number;
  userId: number;
}

export interface RegisterUserPayload {
  userId: number;
}

export interface TypingPayload {
  chatId: number;
  userId: number;
  isTyping: boolean;
}

export interface ChatError {
  message: string;
}