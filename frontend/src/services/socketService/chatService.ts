import { io, Socket } from "socket.io-client";

class ChatSocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/auth\/?$/, "");

    if (!socketUrl) {
      throw new Error("Socket URL is not configured");
    }

    this.socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  getSocket(): Socket {
    if (!this.socket) {
      return this.connect();
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  registerUser(userId: number): void {
    this.getSocket().emit("registerUser", userId);
  }

  getUserChats(userId: number): void {
    this.getSocket().emit("getUserChats", userId);
  }

  getChatMessages(chatId: number, userId: number): void {
    this.getSocket().emit("getChatMessages", {
      chatId,
      userId,
    });
  }

  sendMessage(data: {
    chatId: number;
    senderId: number;
    receiverId: number;
    text?: string | null;
    fileAttachment?: string | null;
  }): void {
    this.getSocket().emit("sendMessage", data);
  }

  markAsRead(chatId: number, userId: number): void {
    this.getSocket().emit("markAsRead", {
      chatId,
      userId,
    });
  }

  typing(
    chatId: number,
    userId: number,
    isTyping: boolean
  ): void {
    this.getSocket().emit("typing", {
      chatId,
      userId,
      isTyping,
    });
  }

  on<T>(event: string, callback: (data: T) => void): void {
    this.getSocket().on(event, callback);
  }

  off<T>(event: string, callback: (data: T) => void): void {
    this.getSocket().off(event, callback);
  }
}

export const chatSocketService = new ChatSocketService();