import React, { useState } from 'react';
import { Send } from "lucide-react";

// Props Interface
interface Message {
  id: number;
  sender: "advisor" | "student";
  text: string;
  time: string;
}

interface ChatAreaProps {
  selectedStudent: { name: string; sapId: string; batch: string } | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedStudent, messages, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  if (!selectedStudent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-300">
        <Send size={30} className="mb-2 opacity-20 text-[#1e3a5f]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e3a5f]/40">Select a chat</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-white">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <h2 className="text-[#1e3a5f] font-bold text-sm uppercase tracking-tight">
            {selectedStudent.name}
          </h2> 
        </div>
        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5 ml-3.5 opacity-70">
          {selectedStudent.sapId} • {selectedStudent.batch}
        </p>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "advisor" ? "justify-end" : "justify-start"}`}>
            {/* items-baseline use kiya hai taake text aur time ek hi line mein horizontal rahein */}
            <div className={`max-w-[85%] p-3 px-4 rounded-xl flex items-baseline gap-3 shadow-sm transition-all
              ${msg.sender === "advisor"
                ? "bg-amber-400 text-[#1e3a5f] rounded-tr-none" 
                : "bg-slate-50 text-[#1e3a5f] border border-slate-100 rounded-tl-none" 
              }`}
            >
              {/* Message Text */}
              <p className="text-[13px] font-medium leading-relaxed">
                {msg.text}
              </p>

              {/* Horizontal Time - Small and Subtle */}
              <span className={`text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap opacity-50
                ${msg.sender === "advisor" ? "text-[#1e3a5f]" : "text-slate-400"}`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-50">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-[#1e3a5f] px-3 py-1 outline-none placeholder:text-slate-400 text-[13px] font-medium"
          />
          <button
            onClick={handleSend}
            className="bg-[#1e3a5f] p-2.5 rounded-xl text-white hover:bg-[#1e3a5f]/90 active:scale-95 transition-all shadow-md shadow-[#1e3a5f]/10"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;