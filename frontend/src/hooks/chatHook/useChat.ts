/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { chatSocketService } from "@/src/services/socketService/chatService";
import { chatRepository } from "@/src/repositories/chatRepositpory/chatRepo";
import { ChatListItem,SocketError ,StudentChatRoomResponse,TypingResponse,ChatNotification ,ChatMessagesResponse} from "./chatType/chatTypes";
import { Message } from "@/src/models/messagesModel";
import { sessionManager } from "@/src/services/sessionManagement/sessionManager";


export const useChat = () => {
  const currentUser = sessionManager.getCurrentUser<any>();
  const userId = currentUser?.data?.id || currentUser?.id;
  const userRole = currentUser?.data?.role || currentUser?.role;
  const isStudent = userRole === 'student';
  
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUserId, setTypingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /*
   * CONNECT SOCKET
   */
  useEffect(() => {
    if (!userId) return;

    const socket = chatSocketService.connect();
    chatSocketService.registerUser(userId);

    // ==========================================
    // ADVISOR CHATS LIST HANDLER (chatsList)
    // ==========================================
    const handleChatsList = (data: ChatListItem[]) => {
      console.log("📨 Received advisor chats list:", data);
      console.log("📊 Chat count:", data.length);
      
      setChats(data);
      setLoadingChats(false);
    };

    const handleStudentChatList = (data: StudentChatRoomResponse) => {
      console.log("🎓 Student chat room received:", data);
      console.log("📊 Total messages:", data.totalMessages);
      console.log("👤 Current advisor:", data.currentAdvisor);
      
      // Build chat list from student data
      const chatList: ChatListItem[] = [];
      
      if (data.currentAdvisor) {
        // Get unique chat IDs from messages
        const chatIds = new Set(data.messages.map(m => m.chatId));
        
        if (chatIds.size === 0) {
          // No messages yet, show current advisor with no chat
          chatList.push({
            id: data.currentAdvisor.userId,
            name: data.currentAdvisor.advisorName,
            chatId: null,
            advisorId: data.currentAdvisor.advisorId,
            advisorUserId: data.currentAdvisor.userId,
            isCurrentAdvisor: true,
            canSendMessages: data.canSendMessages,
            isReadOnly: !data.canSendMessages,
            lastMessageAt: null,
            lastMessageText: 'No messages yet',
            unreadCount: 0
          });
        } else {
          // For each chat, create a chat list item
          for (const chatId of chatIds) {
            const chatMessages = data.messages.filter(m => m.chatId === chatId);
            const lastMessage = chatMessages[chatMessages.length - 1];
            
            chatList.push({
              id: data.currentAdvisor.userId,
              name: data.currentAdvisor.advisorName,
              chatId: chatId,
              advisorId: data.currentAdvisor.advisorId,
              advisorUserId: data.currentAdvisor.userId,
              isCurrentAdvisor: true,
              canSendMessages: data.canSendMessages,
              isReadOnly: !data.canSendMessages,
              lastMessageAt: lastMessage?.createdAt || null,
              lastMessageText: lastMessage?.text || 'No messages yet',
              unreadCount: 0
            });
          }
        }
      }
      
      setChats(chatList);
      setMessages(data.messages || []);
      setLoadingChats(false);
      setLoadingMessages(false);
      
      // Auto-select the first chat if available
      if (chatList.length > 0 && !selectedChat) {
        console.log("📌 Auto-selecting first chat:", chatList[0]);
        setSelectedChat(chatList[0]);
      }
    };
    const handleMessages = (data: ChatMessagesResponse) => {
      console.log("💬 Received messages for chat:", data.chatId);
      console.log("📊 Message count:", data.messages.length);
      
      setMessages(data.messages || []);
      setLoadingMessages(false);
    };

    const handleReceiveMessage = (message: Message) => {
      console.log("📩 New message received:", message);
      
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Update chat list
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.chatId !== message.chatId) {
            return chat;
          }
          return {
            ...chat,
            lastMessageText: message.text || "File attachment...",
            lastMessageAt: message.createdAt || new Date().toISOString(),
          };
        })
      );
    };

    const handleNotification = (notification: ChatNotification) => {
      console.log("🔔 New notification:", notification);
      
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.chatId !== notification.chatId) {
            return chat;
          }
          return {
            ...chat,
            lastMessageText: notification.message || "File attachment...",
            lastMessageAt: notification.timestamp,
            unreadCount: selectedChat?.chatId === notification.chatId
              ? 0
              : (chat.unreadCount || 0) + 1,
          };
        })
      );
    };

    const handleTyping = (data: TypingResponse) => {
      setTypingUserId(data.isTyping ? data.userId : null);
    };

    const handleError = (data: SocketError) => {
      console.error("Chat socket error:", data.message);
      setError(data.message);
      setLoadingChats(false);
      setLoadingMessages(false);
    };

    const handleMessageSent = (data: { chatId: number; message: Message }) => {
      console.log("✅ Message sent confirmation:", data);
    };

    // Register event listeners
    chatSocketService.on("chatsList", handleChatsList);
    chatSocketService.on("studentChatList", handleStudentChatList);  // ✅ Key fix!
    chatSocketService.on("chatMessages", handleMessages);
    chatSocketService.on("receiveMessage", handleReceiveMessage);
    chatSocketService.on("newMessageNotification", handleNotification);
    chatSocketService.on("userTyping", handleTyping);
    chatSocketService.on("error", handleError);
    chatSocketService.on("messageSent", handleMessageSent);

    setError(null);
    setLoadingChats(true);

    // Load data based on user role
    if (isStudent) {
      console.log("🎓 Loading student chat data for user:", userId);
      chatSocketService.getStudentChats(userId);
    } else {
      console.log("👨‍🏫 Loading advisor chat data for user:", userId);
      chatSocketService.getAdvisorChats(userId);
    }

    return () => {
      socket.off("chatsList", handleChatsList);
      socket.off("studentChatList", handleStudentChatList);
      socket.off("chatMessages", handleMessages);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessageNotification", handleNotification);
      socket.off("userTyping", handleTyping);
      socket.off("error", handleError);
      socket.off("messageSent", handleMessageSent);
    };
  }, [userId, selectedChat?.chatId, isStudent]);

  const loadChats = useCallback(() => {
    if (!userId) return;
    setLoadingChats(true);
    setError(null);
    
    if (isStudent) {
      console.log("🔄 Reloading student chats...");
      chatSocketService.getStudentChats(userId);
    } else {
      console.log("🔄 Reloading advisor chats...");
      chatSocketService.getAdvisorChats(userId);
    }
  }, [userId, isStudent]);

const openChat = useCallback(
  (chat: ChatListItem) => {
    console.log("🔓 Opening chat:", chat);
    console.log("📊 Chat ID:", chat.chatId);
    console.log("👤 Student ID:", chat.studentId);

    setSelectedChat(chat);
    setTypingUserId(null);
    setError(null);

    console.log("✅ selectedChat set");

    if (chat.chatId) {
      console.log("📥 About to load messages...");
      console.log("📥 studentId:", chat.studentId);

      setLoadingMessages(true);
      setMessages([]);

      console.log("📡 Calling getChatMessages...");

      chatSocketService.getChatMessages(chat.studentId!);

      console.log("📡 getChatMessages called");

      chatSocketService.markAsRead(chat.chatId, userId);

      console.log("✅ markAsRead called");

      setChats((previous) =>
        previous.map((item) =>
          item.chatId === chat.chatId
            ? { ...item, unreadCount: 0 }
            : item
        )
      );

      console.log("✅ openChat completed");
    } else {
      console.log("📝 New chat — no chatId");

      setMessages([]);
      setLoadingMessages(false);
    }
  },
  [userId]
);

  const selectChat = openChat;

  const markChatAsRead = useCallback(
    (chatId: number) => {
      if (!userId || !chatId) return;

      chatSocketService.markAsRead(chatId, userId);

      setChats((previous) =>
        previous.map((chat) =>
          chat.chatId === chatId
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    },
    [userId]
  );

  const sendMessage = useCallback(
    ({
      text,
      fileAttachment,
    }: {
      text?: string;
      fileAttachment?: string | null;
    }) => {
      if (!userId || !selectedChat) {
        console.warn("⚠️ Cannot send: No user or selected chat");
        return;
      }

      const cleanText = text?.trim() || "";
      const cleanFile = fileAttachment?.trim() || null;

      if (!cleanText && !cleanFile) {
        console.warn("⚠️ Cannot send: Empty message");
        return;
      }

      const chatIdToSend = selectedChat.chatId || 0;

      console.log("📤 Sending message:", {
        chatId: chatIdToSend,
        senderId: userId,
        receiverId: selectedChat.id,
        hasText: !!cleanText,
        hasFile: !!cleanFile
      });

      // Optimistically add message to UI
      if (chatIdToSend !== 0) {
        const optimisticMessage: Message = {
          id: Date.now(),
          chatId: chatIdToSend,
          senderId: userId,
          receiverId: selectedChat.id,
          text: cleanText || null,
          fileAttachment: cleanFile || null,
          isRead: false,
          isSent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sender: {
            id: userId,
            role: isStudent ? 'student' : 'advisor',
            students: isStudent ? [{ studentName: 'You' }] : [],
            batchAdvisors: !isStudent ? [{ advisorName: 'You' }] : []
          }
        } as any;

        setMessages((prev) => [...prev, optimisticMessage]);
      }

      chatSocketService.sendMessage({
        chatId: chatIdToSend,
        receiverId: selectedChat.id,
        text: cleanText || null,
        fileAttachment: cleanFile,
      });
    },
    [userId, selectedChat, isStudent]
  );

  const sendTextMessage = useCallback(
    (text: string) => {
      return sendMessage({ text });
    },
    [sendMessage]
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!userId || !selectedChat || !selectedChat.chatId) {
        return;
      }

      chatSocketService.typing(selectedChat.chatId, userId, isTyping);
    },
    [userId, selectedChat]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return null;
      return await chatRepository.uploadFile(file);
    },
    []
  );

  const sendFile = useCallback(
    async (file: File) => {
      if (!selectedChat) {
        throw new Error("No chat selected");
      }

      const fileUrl = await uploadFile(file);

      if (!fileUrl) {
        throw new Error("File upload failed");
      }

      sendMessage({
        fileAttachment: fileUrl.url,
      });

      return fileUrl;
    },
    [selectedChat, uploadFile, sendMessage]
  );

  const closeChat = useCallback(() => {
    setSelectedChat(null);
    setMessages([]);
    setTypingUserId(null);
  }, []);

  return {
    chats,
    messages,
    selectedChat,
    loadingChats,
    loadingMessages,
    typingUserId,
    error,
    loadChats,
    openChat,
    selectChat,
    sendMessage,
    sendTextMessage,
    sendFile,
    uploadFile,
    markChatAsRead,
    setTyping,
    closeChat,
    setSelectedChat,
  };
};