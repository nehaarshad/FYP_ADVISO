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

interface ChatAreaProps {
  chat: ChatListItem | null;
  messages: Message[];
  currentUserId: number;

  loading: boolean;
  typingUserId: number | null;

  onSendMessage: (data: {
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
  currentUserId,
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

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight;
  }, [
    messages,
    typingUserId,
  ]);

  /*
   * MARK READ
   */
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

    const canSend = true;


  /*
   * SEND
   */
  const handleSend = () => {
    const cleanText =
      input.trim();

    if (!cleanText) return;

    onSendMessage({
      text: cleanText,
    });

    setInput("");
    onTyping(false);
  };

  /*
   * TYPING
   */
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

  /*
   * FILE
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

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

  /*
   * FORMAT TIME
   */
  const formatTime = (
    date?: string
  ) => {
    if (!date) return "";

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
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

  /*
   * NO CHAT
   */
  if (!chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">

        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <User
            size={24}
            className="opacity-20 text-[#1e3a5f]"
          />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e3a5f]/30 text-center px-10">
          Select a student from the list
          <br />
          to view conversation
        </p>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

    <div className="px-6 py-4 border-b border-slate-50 bg-white shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2 bg-slate-50 rounded-full">
              <ArrowLeft size={17} />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-[#1e3a5f] font-black text-[14px] uppercase tracking-tight">
                {chat.name}
              </h2>
            </div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5 ml-4 opacity-70">
               Semester {chat.semester}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
      >

        {loading ? (
          <div className="h-full flex items-center justify-center">

            <Loader2
              size={25}
              className="animate-spin text-[#1e3a5f]"
            />

          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              No messages yet
            </p>

          </div>
        ) : (
          messages.map(
            (message) => {
              const isMine = message.sender?.role == 'advisor'
                  const uniqueKey = chat.chatId ? `chat-${chat.chatId}` : `user-${chat.id}`;
        

              return (
                <div
                  key={
                    uniqueKey + "-" + message.id
                  }
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                    

                  <div
                    className={`max-w-[75%] p-3 px-4 rounded-2xl flex flex-col shadow-sm ${
                      isMine
                        ? "bg-[#1e3a5f] text-white rounded-tr-none"
                        : "bg-white text-[#1e3a5f] border border-slate-100 rounded-tl-none"
                    }`}
                  >

<span
  className={`text-[8px] font-black uppercase  mt-2 self-start underline
  ${
                      isMine
                        ? "text-amber-400"
                        : "text-[#1e3a5f]   "    }
                     `}
>
  {isMine
    ? message.sender?.students?.[0]?.studentName ||
      message.sender?.batchAdvisors?.[0]?.advisorName ||
      message.sender?.sapid ||  
      "SAP ID"
    : message.sender?.students?.[0]?.studentName ||
      message.sender?.batchAdvisors?.[0]?.advisorName ||
      message.sender?.sapid ||  
      "SAP ID"}
</span>
                    {/* TEXT */}
                    {message.text && (
                      <p className="text-[12.5px] font-medium leading-relaxed break-words">
                        {message.text}
                      </p>
                    )}

                    {/* FILE */}
                    {message.fileAttachment && (
                      <a
                        href={
                          message.fileAttachment
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 mt-2 p-2 rounded-xl border ${
                          isMine
                            ? "border-white/20 bg-white/10"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >

                        <FileText
                          size={16}
                        />

                        <span className="text-[9px] font-bold truncate">
                          Attachment
                        </span>

                        <Download
                          size={13}
                          className="ml-auto"
                        />

                      </a>
                    )}

                    {/* TIME */}
                    <span
                      className={`text-[7px] font-black uppercase opacity-80 mt-2 self-end ${
                        isMine
                          ? "text-amber-400"
                          : "text-slate-400"
                      }`}
                    >
                      {formatTime(
                        message.createdAt
                      )}
                    </span>

                  </div>

                </div>
              );
            }
          )
        )}

        {/* TYPING */}
        {typingUserId && (
          <div className="flex justify-start">

            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3">

              <div className="flex gap-1">

                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />

                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />

                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />

              </div>

            </div>

          </div>
        )}

      </div>

  {/* INPUT - Always enabled for advisors */}
      <div className="p-4 bg-white border-t border-slate-50 shrink-0">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 items-center focus-within:border-amber-400 transition-all">
          <label className="p-2 cursor-pointer text-slate-400 hover:text-[#1e3a5f]">
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Paperclip size={16} />
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
            placeholder={`Reply to ${chat.name}...`}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-transparent text-[#1e3a5f] px-2 py-1.5 outline-none placeholder:text-slate-400 text-[12.5px] font-medium"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#1e3a5f] p-2.5 rounded-xl text-white hover:bg-amber-500 active:scale-90 transition-all shadow-lg disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;