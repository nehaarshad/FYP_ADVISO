import { Message } from "@/src/models/messagesModel";
import { User } from "@/src/models/userModel";

export interface ChatListItem {
  id: number;                   // User ID of the other person
  name: string;                // Display name
  chatId: number | null;       // Chat ID (null if no chat yet)
  
  // Advisor specific fields
  advisorId?: number;
  advisorUserId?: number;
  
  // Student specific fields
  studentId?: number;
  registrationNumber?: string;
  batchId?: number;
  semester?: number;
  
  // Status flags
  isCurrentAdvisor?: boolean;    // For students - is this the current advisor
  isCurrentStudent?: boolean;    // For advisors - is this student in active batch
  canSendMessages?: boolean;     // Can send messages
  isReadOnly?: boolean;          // Read-only mode
  
  // Message data
  sender?: User;
  receiver?: User;
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
export interface ChatMessagesResponse {
  chatId: number;
  messages: Message[];
  total: number;
  chatInfo?: {
    senderId: number;
    receiverId: number;
    otherUserId: number;
    isStudent: boolean;
  };
}

export interface ChatNotification {
  chatId: number;
  senderId: number;
  senderName?: string;
  message: string;
  fileAttachment?: string | null;
  timestamp: string;
}

export interface TypingResponse {
  userId: number;
  isTyping: boolean;
}

export interface SocketError {
  message: string;
}

export interface StudentChatRoomResponse {
  student: {
    userId: number;
    studentId: number;
    studentName: string;
  };
  currentAdvisor: {
    advisorId: number;
    userId: number;
    advisorName: string;
  } | null;
  canSendMessages: boolean;
  totalMessages: number;
  messages: Message[];
}