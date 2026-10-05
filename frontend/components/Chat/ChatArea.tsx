
// export default ChatArea;
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  User,
  Paperclip,
  Loader2,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";

import { ChatListItem } from "@/src/hooks/chatHook/chatType/chatTypes";
import { Message } from "@/src/models/messagesModel";
import { sessionManager } from "@/src/services/sessionManagement/sessionManager";

interface ChatAreaProps {
  chat: ChatListItem | null;
  messages: Message[];
  receiverId: number;

  loading: boolean;
  typingUserId: number | null;

  onSendMessage: (data: {
    receiverId: number;
    text?: string;
    fileAttachment?: string | null;
  }) => void;

  onSendFile: (
    file: File
  ) => Promise<string | null>;

  onMarkAsRead: (
    chatId: number
  ) => void;

  onTyping: (
    isTyping: boolean
  ) => void;

  onBack?: () => void;
}

const ChatArea: React.FC<
  ChatAreaProps
> = ({
  chat,
  messages,
  receiverId,
  loading,
  typingUserId,
  onSendMessage,
  onSendFile,
  onMarkAsRead,
  onTyping,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get current logged-in advisor ID to reliably detect "my message"
  const currentUser = sessionManager.getCurrentUser<any>();
  const currentUserId = currentUser?.data?.id || currentUser?.id;

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight;
  }, [
    messages,
    typingUserId,
  ]);

  useEffect(() => {
    if (!chat) return;

    onMarkAsRead(
      chat.chatId!
    );
  }, [
    chat,
    messages.length,
    onMarkAsRead,
  ]);

  const handleSend = () => {
    const cleanText = input.trim();

    if (!cleanText) return;

    onSendMessage({
      receiverId,
      text: cleanText,
    });

    setInput("");
    onTyping(false);
  };

  const handleInputChange = (
    value: string
  ) => {
    setInput(value);

    onTyping(
      value.trim().length > 0
    );

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        onTyping(false);
      }, 1000);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      await onSendFile(file);
    } catch (error) {
      console.error(
        "File upload failed:",
        error
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const formatTime = (
    date?: string
  ) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* NO CHAT SELECTED */
  if (!chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <User
            size={28}
            className="text-amber-500"
          />
        </div>
        <h3 className="text-[#1e3a5f] font-bold text-sm uppercase tracking-tight mb-1">
          No Conversation Selected
        </h3>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest max-w-xs">
          Choose a student from the inbox list to start or view messages
        </p>
      </div>
    );
  }

  const initials = chat.name
    ? chat.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

      {/* CHAT HEADER */}
      <div className="px-6 py-3.5 border-b border-slate-100 bg-white shrink-0 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button 
              onClick={onBack} 
              className="md:hidden p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2c4c78] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            {initials}
          </div>

          <div>
            <h2 className="text-[#1e3a5f] font-bold text-[13.5px] uppercase tracking-tight">
              {chat.name}
            </h2>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">
              Semester {chat.semester || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES CONTAINER */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-slate-100/60 via-slate-50 to-slate-100/60 custom-scrollbar"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2
              size={24}
              className="animate-spin text-[#1e3a5f]"
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl shadow-xs border border-slate-200/60">
              No messages yet. Send a message to start conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            // Check if message is sent by current advisor (via ID or role)
            const senderId = message.senderId || message.sender?.id;
            const role = message.sender?.role?.toLowerCase();
            const isMine = (currentUserId && senderId === currentUserId) || role === 'advisor' || role === 'admin';

            const uniqueKey = chat.chatId ? `chat-${chat.chatId}` : `user-${chat.id}`;

            return (
              <div
                key={uniqueKey + "-" + message.id}
                className={`flex w-full ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl shadow-sm transition-all ${
                    isMine
                      ? "bg-[#1e3a5f] text-white rounded-br-xs" // Advisor (Blue)
                      : "bg-white text-[#1e3a5f] border border-slate-200/80 rounded-bl-xs" // Student (White)
                  }`}
                >
                  {/* TEXT */}
                  {message.text && (
                    <p className="text-[13px] font-medium leading-snug break-words">
                      {message.text}
                    </p>
                  )}

                  {/* FILE ATTACHMENT */}
                  {message.fileAttachment && (
                    <a
                      href={message.fileAttachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 mt-2 p-2 rounded-xl border transition-all ${
                        isMine
                          ? "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#1e3a5f]"
                      }`}
                    >
                      <FileText size={15} className="shrink-0" />
                      <span className="text-[10px] font-bold truncate flex-1">
                        Attachment File
                      </span>
                      <Download size={12} className="shrink-0 opacity-80" />
                    </a>
                  )}

                  {/* TIME */}
                  <div className="flex justify-end mt-1">
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider ${
                        isMine ? "text-amber-300/80" : "text-slate-400"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* TYPING INDICATOR */}
        {typingUserId && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-10 shadow-sm">
        <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80 items-center focus-within:border-amber-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-50/50 transition-all shadow-xs">
          
          <label className="p-2 cursor-pointer text-slate-400 hover:text-[#1e3a5f] transition-colors rounded-xl hover:bg-slate-200/50">
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-amber-500" />
            ) : (
              <Paperclip size={18} />
            )}
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>

          <input
            type="text"
            placeholder={`Reply to ${chat.name}...` }
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-transparent text-[#1e3a5f] px-2 py-1.5 outline-none placeholder:text-slate-400 text-[13px] font-medium"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#1e3a5f] p-2.5 rounded-xl text-white hover:bg-amber-500 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-[#1e3a5f] cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;