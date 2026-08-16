/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { chatSocketService } from "@/src/services/socketService/chatService";
import { chatRepository } from "@/src/repositories/chatRepositpory/chatRepo";
import { ChatListItem } from "./chatType/chatTypes";
import { Message } from "@/src/models/messagesModel";
import { sessionManager } from "@/src/services/sessionManagement/sessionManager";

interface ChatMessagesResponse {
  chatId: number;
  messages: Message[];
  total: number;
}

interface ChatNotification {
  chatId: number;
  senderId: number;
  senderName?: string;
  message: string;
  fileAttachment?: string | null;
  timestamp: string;
}

interface TypingResponse {
  userId: number;
  isTyping: boolean;
}

interface SocketError {
  message: string;
}

export const useChat = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
      const currentUser = sessionManager.getCurrentUser<any>();
      const userId = currentUser?.data?.id || currentUser?.id;
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] =
    useState<ChatListItem | null>(null);

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [typingUserId, setTypingUserId] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  /*
   * CONNECT SOCKET
   */
  useEffect(() => {
    if (!userId) return;

    const socket = chatSocketService.connect();

    chatSocketService.registerUser(userId);

    const handleChats = (data: ChatListItem[]) => {
      setChats(data);
      setLoadingChats(false);
    };

    const handleMessages = (data: ChatMessagesResponse) => {
      setMessages([...data.messages]);
      setLoadingMessages(false);
    };

    const handleReceiveMessage = (message: Message) => {
      setMessages((previous) => {
        if (
          previous.some(
            (existing) => existing.id === message.id
          )
        ) {
          return previous;
        }

        return [...previous, message];
      });

      setChats((previous) =>
        previous.map((chat) => {
          if (chat.chatId !== message.chatId) {
            return chat;
          }

          return {
            ...chat,
            lastMessageText:
              message.text || "File attachment...",
            lastMessageAt:
              message.createdAt || new Date().toISOString(),
          };
        })
      );
    };

    const handleNotification = (
      notification: ChatNotification
    ) => {
      setChats((previous) =>
        previous.map((chat) => {
          if (
            chat.chatId !== notification.chatId
          ) {
            return chat;
          }

          return {
            ...chat,
            lastMessageText:
              notification.message ||
              "File attachment...",
            lastMessageAt:
              notification.timestamp,
            unreadCount:
              selectedChat?.chatId ===
              notification.chatId
                ? 0
                : (chat.unreadCount || 0) + 1,
          };
        })
      );
    };

    const handleTyping = (
      data: TypingResponse
    ) => {
      setTypingUserId(
        data.isTyping
          ? data.userId
          : null
      );
    };

    const handleError = (
      data: SocketError
    ) => {
      console.error(
        "Chat socket error:",
        data.message
      );

      setError(data.message);
      setLoadingChats(false);
      setLoadingMessages(false);
    };

    chatSocketService.on(
      "chatsList",
      handleChats
    );

    chatSocketService.on(
      "chatMessages",
      handleMessages
    );

    chatSocketService.on(
      "receiveMessage",
      handleReceiveMessage
    );

    chatSocketService.on(
      "newMessageNotification",
      handleNotification
    );

    chatSocketService.on(
      "userTyping",
      handleTyping
    );

    chatSocketService.on(
      "error",
      handleError
    );

    setError(null);
    setLoadingChats(true);

    chatSocketService.getUserChats(userId);

    return () => {
      socket.off(
        "chatsList",
        handleChats
      );

      socket.off(
        "chatMessages",
        handleMessages
      );

      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      socket.off(
        "newMessageNotification",
        handleNotification
      );

      socket.off(
        "userTyping",
        handleTyping
      );

      socket.off(
        "error",
        handleError
      );
    };
  }, [userId, selectedChat?.chatId]);

  const loadChats = useCallback(() => {
    if (!userId) return;

    setLoadingChats(true);
    setError(null);

    chatSocketService.getUserChats(userId);
  }, [userId]);

  /*
   * OPEN CHAT
   */
  const openChat = useCallback(
    (chat: ChatListItem) => {
      if (!userId) return;

      setSelectedChat(chat);
      setMessages([]);
      setTypingUserId(null);
      setLoadingMessages(true);
      setError(null);

      chatSocketService.getChatMessages(
        chat.chatId,
        userId
      );

      chatSocketService.markAsRead(
        chat.chatId,
        userId
      );

      setChats((previous) =>
        previous.map((item) =>
          item.chatId === chat.chatId
            ? {
                ...item,
                unreadCount: 0,
              }
            : item
        )
      );
    },
    [userId]
  );

  /*
   * ALIAS
   *
   * Your components were using selectChat.
   * Keep this alias so either name works.
   */
  const selectChat = openChat;

  /*
   * MARK CHAT AS READ
   */
  const markChatAsRead = useCallback(
    (chatId: number) => {
      if (!userId) return;

      chatSocketService.markAsRead(
        chatId,
        userId
      );

      setChats((previous) =>
        previous.map((chat) =>
          chat.chatId === chatId
            ? {
                ...chat,
                unreadCount: 0,
              }
            : chat
        )
      );
    },
    [userId]
  );

  /*
   * SEND MESSAGE
   */
  const sendMessage = useCallback(
    ({
      text,
      fileAttachment,
    }: {
      text?: string;
      fileAttachment?: string | null;
    }) => {
      if (!userId || !selectedChat) {
        return;
      }

      const cleanText =
        text?.trim() || "";

      const cleanFile =
        fileAttachment?.trim() || null;

      if (!cleanText && !cleanFile) {
        return;
      }

      chatSocketService.sendMessage({
        chatId: selectedChat.chatId,
        senderId: userId,
        receiverId: selectedChat.id,
        text: cleanText || null,
        fileAttachment: cleanFile,
      });
    },
    [userId, selectedChat]
  );

  /*
   * SEND TEXT ONLY
   *
   * Convenient method for components.
   */
  const sendTextMessage = useCallback(
    (text: string) => {
      return sendMessage({
        text,
      });
    },
    [sendMessage]
  );

  /*
   * TYPING
   */
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!userId || !selectedChat) {
        return;
      }

      chatSocketService.typing(
        selectedChat.chatId,
        userId,
        isTyping
      );
    },
    [userId, selectedChat]
  );

  /*
   * FILE UPLOAD
   */
  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return null;

      return await chatRepository.uploadFile(
        file
      );
    },
    []
  );

  /*
   * UPLOAD + SEND FILE
   */
  const sendFile = useCallback(
    async (file: File) => {
      if (!selectedChat) {
        throw new Error(
          "No chat selected"
        );
      }

      const fileUrl =
        await uploadFile(file);

      if (!fileUrl) {
        throw new Error(
          "File upload failed"
        );
      }

      sendMessage({
        fileAttachment: fileUrl.url,
      });

      return fileUrl;
    },
    [
      selectedChat,
      uploadFile,
      sendMessage,
    ]
  );

  /*
   * CLEAR SELECTED CHAT
   */
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