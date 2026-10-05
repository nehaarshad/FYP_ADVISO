
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { ArrowLeft, MessageSquare } from "lucide-react";

import ChatStudentList from "./ChatStudentList";
import ChatArea from "./ChatArea";

import { sessionManager } from "@/src/services/sessionManagement/sessionManager";
import { useChat } from "@/src/hooks/chatHook/useChat";
import { motion } from "framer-motion";

interface AdvisorChatProps {
  onBack?: () => void;
}

const AdvisorChat: React.FC<AdvisorChatProps> = ({ onBack }) => {
  const currentUser = sessionManager.getCurrentUser<any>();
  const userId = currentUser?.data?.id || currentUser?.id;

  const {
    chats,
    messages,
    selectedChat,
    loadingChats,
    loadingMessages,
    typingUserId,
    error,
    loadChats,
    openChat,
    sendMessage,
    sendFile,
    markChatAsRead,
    setTyping,
  } = useChat();

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  /*
   * LOAD CHAT LIST
   */
  useEffect(() => {
    if (!userId) return;
    loadChats();
  }, [userId, loadChats]);

  /*
   * SELECT CHAT
   */
  const handleSelectChat = async (
    chat: (typeof chats)[number]
  ) => {
    setIsMobileChatOpen(true);
    openChat(chat);
  };

  /*
   * BACK
   */
  const handleBackAction = () => {
    if (isMobileChatOpen) {
      setIsMobileChatOpen(false);
      return;
    }
    onBack?.();
  };

  /*
   * LOGIN CHECK
   */
  if (!userId) {
    return (
      <div className="w-full flex items-center justify-center p-10">
        <p className="text-sm text-slate-500">
          Please login to access chat.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col gap-5 w-full max-w-6xl mx-auto overflow-hidden p-4 md:p-6 pt-4 md:pt-2 -mt-2"
    >
      {/* HEADER SECTION */}
    {/* HEADER SECTION */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-8">
          <button
            onClick={handleBackAction}
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors border border-slate-100 outline-none cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3 pt-6">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#1e3a5f] text-[#FDB813] shadow-md">
              <MessageSquare size={20} />
            </div>
            <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">
                Inbox 
              </h2>
              <p className="text-xs text-slate-400">
                Manage student conversations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2 text-xs">
          {error}
        </div>
      )}

      {/* CHAT BOX CONTAINER - Transparent wrapper taake inner cards cleanly align hon */}
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)] md:h-[540px] w-full">

        {/* CHAT LIST */}
        <div
          className={`w-full md:w-[35%] h-full ${
            isMobileChatOpen
              ? "hidden md:block"
              : "block"
          }`}
        >
          <ChatStudentList
            chats={chats}
            selectedChatId={selectedChat?.chatId ?? selectedChat?.id ?? null}
            loading={loadingChats}
            onSelect={handleSelectChat}
          />
        </div>

        {/* CHAT AREA */}
        <div
          className={`w-full md:w-[65%] h-full ${
            !isMobileChatOpen
              ? "hidden md:block"
              : "block"
          }`}
        >
          <ChatArea
            chat={selectedChat}
            messages={messages}
            receiverId={selectedChat?.id ?? 0}
            loading={loadingMessages}
            typingUserId={typingUserId}
            onSendMessage={sendMessage}
            onSendFile={(file) => sendFile(file, selectedChat?.id ?? 0).then((result) => result?.url ?? null)}
            onMarkAsRead={markChatAsRead}
            onTyping={setTyping}
            onBack={() =>
              setIsMobileChatOpen(false)
            }
          />
        </div>

      </div>
    </motion.div>
  );
};

export default AdvisorChat;