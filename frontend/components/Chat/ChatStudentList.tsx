"use client";

import React from "react";
import {
  MessageCircle,
  Loader2,
} from "lucide-react";

import { ChatListItem } from "@/src/hooks/chatHook/chatType/chatTypes";

interface ChatStudentListProps {
  chats: ChatListItem[];
  selectedChatId: number | null;
  loading: boolean;
  onSelect: (
    chat: ChatListItem
  ) => void;
}

const ChatStudentList: React.FC<
  ChatStudentListProps
> = ({
  chats,
  selectedChatId,
  loading,
  onSelect,
}) => {
  
  return (
    <div className="h-full bg-white rounded-3xl p-4 flex flex-col border border-slate-100 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-2 pb-4">

        <div>
          <h2 className="text-[#1e3a5f] text-sm font-black uppercase tracking-tight">
            Inbox
          </h2>

          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
            Your conversations
          </p>
        </div>

        <MessageCircle
          size={18}
          className="text-amber-500"
        />

      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">

        {loading ? (
          <div className="h-full flex items-center justify-center">

            <Loader2
              size={22}
              className="animate-spin text-[#1e3a5f]"
            />

          </div>
        ) : chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-5">

            <MessageCircle
              size={30}
              className="text-slate-200 mb-3"
            />

            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              No conversations yet
            </p>

          </div>
        ) : (
          chats.map((chat) => {

            const isActive =
              selectedChatId ===
              chat.chatId;

            return (
              <button
                key={chat.chatId}
                onClick={() =>
                  onSelect(chat)
                }
                className={`w-full text-left transition-all duration-200 rounded-2xl border-2 ${
                  isActive
                    ? "border-amber-400 bg-amber-50/30 shadow-md"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >

                <div
                  className={`p-3 rounded-xl bg-white flex flex-col gap-1 border ${
                    isActive
                      ? "border-amber-100"
                      : "border-slate-50"
                  }`}
                >

                  {/* NAME + UNREAD */}
                  <div className="flex items-center justify-between gap-2">

                    <p className="font-black text-[12.5px] text-[#1e3a5f] leading-tight truncate">
                          {chat.name ||
                              "Student"}
                        </p>

                    {!!chat.unreadCount && (
                      <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[8px] font-black">
                        {chat.unreadCount}
                      </span>
                    )}

                  </div>

                  {/* LAST MESSAGE */}
                  <p className="text-[9px] text-slate-400 truncate">
                    {chat.lastMessageText ||
                      "No messages yet"}
                  </p>

                </div>

              </button>
            );
          })
        )}

      </div>

    </div>
  );
};

export default ChatStudentList;