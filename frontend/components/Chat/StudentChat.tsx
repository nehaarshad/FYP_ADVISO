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
  HelpCircle,
  ArrowLeft,
  Loader2,
  FileText,
  Download,
} from "lucide-react";

import {
  sessionManager,
} from "@/src/services/sessionManagement/sessionManager";

import {
  useChat,
} from "@/src/hooks/chatHook/useChat";

interface StudentChatProps {
  onBack?: () => void;
}

const StudentChat: React.FC<
  StudentChatProps
> = ({ onBack }) => {

      const currentUser = sessionManager.getCurrentUser<any>();
      console.log("current user in student chat: ", currentUser)
      const userId = currentUser?.data?.id || currentUser?.id;

  const {
    chats,
    messages,
    selectedChat,

    loadingChats,
    loadingMessages,

    typingUserId,

    loadChats,
    openChat,
    sendMessage,
    sendFile,
    markChatAsRead,
    setTyping,

    error,
  } = useChat();

  const [inputText, setInputText] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const typingTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /*
   * LOAD CHATS
   */
  useEffect(() => {
    if (!userId) return;

    loadChats();
  }, [userId, loadChats]);

  /*
   * AUTO SCROLL
   */
  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight;
  }, [
    messages,
    typingUserId,
  ]);

  /*
   * MARK AS READ
   */
  useEffect(() => {
    if (!selectedChat) return;

    markChatAsRead(
      selectedChat.chatId
    );
  }, [
    selectedChat,
    messages.length,
    markChatAsRead,
  ]);

  /*
   * OPEN STUDENT CHAT
   *
   * Backend normally returns one advisor
   * chat for the student.
   */
  useEffect(() => {
    if (!selectedChat) {
      if (chats.length > 0) {
        openChat(chats[0]);
      }
    }
  }, [
    chats,
    selectedChat,
    openChat,
  ]);

  /*
   * TYPING
   */
  const handleTyping = (
    value: string
  ) => {
    setInputText(value);

    if (!selectedChat) return;

    setTyping(
      value.trim().length > 0
    );

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        setTyping(false);
      }, 1000);
  };

  /*
   * SEND MESSAGE
   */
  const handleSendMessage = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    const cleanText =
      inputText.trim();

    if (
      !cleanText ||
      !selectedChat
    ) {
      return;
    }

    try {
      sendMessage({
        text: cleanText,
      });

      setInputText("");

      setTyping(false);
    } catch (error) {
      console.error(
        "Message sending failed:",
        error
      );
    }
  };

  /*
   * FILE SELECT
   */
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (
      !file ||
      !selectedChat
    ) {
      return;
    }

    try {
      setUploading(true);

      await sendFile(file);
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
   * LOGIN CHECK
   */
  if (!userId) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-sm text-slate-500">
          Please login to access chat.
        </p>
      </div>
    );
  }

  /*
   * LOADING
   */
  if (
    loadingChats &&
    !selectedChat
  ) {
    return (
      <div className="flex flex-col h-[85vh] md:h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-[2rem] items-center justify-center">
        <Loader2
          size={25}
          className="animate-spin text-[#1e3a5f]"
        />
      </div>
    );
  }

  /*
   * ERROR
   */
  if (error && !selectedChat) {
    return (
      <div className="flex flex-col h-[85vh] md:h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-xl items-center justify-center p-6">

        <p className="text-sm text-red-500 text-center">
          {error}
        </p>

        <button
          onClick={onBack}
          className="mt-5 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-[10px] font-bold"
        >
          Go Back
        </button>

      </div>
    );
  }

  /*
   * NO ADVISOR
   */
  if (!selectedChat) {
    return (
      <div className="flex flex-col h-[85vh] md:h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-xl items-center justify-center">

        <User
          size={35}
          className="text-slate-200 mb-3"
        />

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          No advisor assigned
        </p>

        <button
          onClick={onBack}
          className="mt-5 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-[10px] font-bold"
        >
          Go Back
        </button>

      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-t-[2rem] md:rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-[#1e3a5f] p-4 md:p-5 flex items-center justify-between text-white shrink-0">

        <div className="flex items-center gap-3 md:gap-4">

          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200/20 bg-white/10 shadow-sm rounded-full text-white transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative">

            <div className="h-10 w-10 md:h-12 md:w-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <User
                size={22}
                className="text-blue-100"
              />
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#1e3a5f] rounded-full" />

          </div>

          <div>

            <h3 className="font-black uppercase tracking-tight text-[12px] md:text-[14px]">
              {selectedChat.name}
            </h3>

            <p className="text-[8px] md:text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none">
              Academic Advisor
            </p>

          </div>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-black uppercase text-blue-200">
              Status
            </span>

            <span className="text-[8px] font-bold text-green-400 uppercase">
              Connected
            </span>
          </div>

          <HelpCircle
            size={20}
            className="text-amber-400 opacity-80"
          />

        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/30 custom-scrollbar scroll-smooth"
      >

        {loadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Loader2
              size={25}
              className="animate-spin text-[#1e3a5f]"
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Start a conversation with your advisor
            </p>

          </div>
        ) : (
          messages.map((msg) => {

            const isMine =
              Number(msg.senderId) ===
              Number(userId);

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div className="max-w-[85%] md:max-w-[75%] relative">

                  <div
                    className={`px-4 md:px-5 py-3 rounded-[1.5rem] text-[12px] md:text-[13px] font-medium shadow-sm flex flex-col ${
                      isMine
                        ? "bg-[#1e3a5f] text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none border-l-4 border-l-amber-400"
                    }`}
                  >

<span
  className={`text-[8px] font-black uppercase opacity-60 mt-2 self-start text-[#1e3a5f]`}
>
  {isMine
    ? null
    : msg.sender?.students?.[0]?.studentName ||
      msg.sender?.batchAdvisors?.[0]?.advisorName ||
      msg.sender?.sapid ||  
      "SAP ID"}
</span>
                    {/* TEXT */}
                    {msg.text && (
                      <span className="leading-relaxed break-words">
                        {msg.text}
                      </span>
                    )}

                    {/* FILE */}
                    {msg.fileAttachment && (
                      <a
                        href={
                          msg.fileAttachment
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 mt-2 p-2 rounded-xl border ${
                          isMine
                            ? "border-white/20 bg-white/10"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >

                        <FileText
                          size={18}
                        />

                        <span className="text-[10px] font-bold truncate">
                          Attachment
                        </span>

                        <Download
                          size={14}
                          className="ml-auto"
                        />

                      </a>
                    )}

                    {/* TIME */}
                    <span
                      className={`text-[8px] font-black uppercase mt-2 self-end opacity-60 ${
                        isMine
                          ? "text-blue-100"
                          : "text-slate-400"
                      }`}
                    >
                      {formatTime(
                        msg.createdAt
                      )}
                    </span>

                  </div>

                </div>

              </div>
            );
          })
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

      {/* INPUT */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">

        <form
          onSubmit={
            handleSendMessage
          }
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >

          {/* FILE */}
          <label className="cursor-pointer text-slate-400 hover:text-[#1e3a5f]">

            {uploading ? (
              <Loader2
                size={19}
                className="animate-spin"
              />
            ) : (
              <Paperclip size={19} />
            )}

            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={
                handleFileSelect
              }
            />

          </label>

          {/* INPUT */}
          <div className="flex-1 relative">

            <input
              type="text"
              value={inputText}
              onChange={(e) =>
                handleTyping(
                  e.target.value
                )
              }
              placeholder="Type your message here..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-[12px] md:text-[13px] font-bold text-[#1e3a5f] outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-400/10 transition-all placeholder:text-slate-300"
            />

          </div>

          {/* SEND */}
          <button
            type="submit"
            disabled={
              !inputText.trim()
            }
            className="h-10 w-10 md:h-12 md:w-12 bg-amber-500 hover:bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all active:scale-90 disabled:opacity-30 disabled:shadow-none shrink-0"
          >
            <Send size={20} />
          </button>

        </form>

        <p className="text-[8px] text-center text-slate-400 mt-3 uppercase font-bold tracking-widest">
          Academic Office Chat
        </p>

      </div>

    </div>
  );
};

export default StudentChat;