/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { ArrowLeft } from "lucide-react";

import ChatStudentList from "./ChatStudentList";
import ChatArea from "./ChatArea";

import { sessionManager } from "@/src/services/sessionManagement/sessionManager";
import { useChat } from "@/src/hooks/chatHook/useChat";

interface AdvisorChatProps {
  onBack?: () => void;
}

const AdvisorChat: React.FC<
  AdvisorChatProps
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
    error,

    loadChats,
    openChat,
    sendMessage,
    sendFile,
    markChatAsRead,
    setTyping,
  } = useChat();

  const [
    isMobileChatOpen,
    setIsMobileChatOpen,
  ] = useState(false);

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
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto overflow-hidden p-4 md:p-0">

      {/* BACK BUTTON */}
      <div className="flex items-center">
        <button
          onClick={handleBackAction}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors border border-slate-100 outline-none"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 h-full md:h-[520px] bg-transparent w-full overflow-hidden">

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
            selectedChatId={
              selectedChat?.chatId ?? null
            }
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
            onMarkAsRead={
              markChatAsRead
            }
            onTyping={setTyping}
            onBack={() =>
              setIsMobileChatOpen(false)
            }
          />
        </div>

      </div>
    </div>
  );
};

export default AdvisorChat;