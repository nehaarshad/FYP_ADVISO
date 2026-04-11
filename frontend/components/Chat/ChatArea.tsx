import React, { useState } from 'react';
import { Send, User } from "lucide-react";

// 1. Interfaces define karein taake 'any' type ka error khatam ho jaye
interface Student {
  id: number;
  name: string;
  sapId: string;
  batch: string;
  semester: string;
}

interface Message {
  id: number;
  studentId: number;
  sender: "advisor" | "student";
  text: string;
  time: string;
}

interface ChatAreaProps {
  selectedStudent: Student | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

// 2. React.FC ke saath interface apply karein
const ChatArea: React.FC<ChatAreaProps> = ({ selectedStudent, messages, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  if (!selectedStudent) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-300">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <User size={24} className="opacity-20 text-[#1e3a5f]" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e3a5f]/30 text-center px-10">
          Select a student from the list<br/>to view conversation
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <h2 className="text-[#1e3a5f] font-black text-[14px] uppercase tracking-tight">
            {selectedStudent.name}
          </h2> 
        </div>
        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5 ml-4 opacity-70">
          {selectedStudent.sapId} • {selectedStudent.batch}
        </p>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "advisor" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 px-4 rounded-2xl flex items-end gap-3 shadow-sm
              ${msg.sender === "advisor"
                ? "bg-[#1e3a5f] text-white rounded-tr-none" 
                : "bg-white text-[#1e3a5f] border border-slate-100 rounded-tl-none" 
              }`}
            >
              <p className="text-[12.5px] font-medium leading-relaxed">{msg.text}</p>
              <span className={`text-[7px] font-black uppercase opacity-60 mb-[-2px] whitespace-nowrap
                ${msg.sender === "advisor" ? "text-amber-400" : "text-slate-400"}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-50 shrink-0">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 items-center focus-within:border-amber-400 transition-all">
          <input
            type="text"
            placeholder={`Reply to ${selectedStudent.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-[#1e3a5f] px-3 py-1.5 outline-none placeholder:text-slate-400 text-[12.5px] font-medium"
          />
          <button
            onClick={handleSend}
            className="bg-[#1e3a5f] p-2.5 rounded-xl text-white hover:bg-amber-500 active:scale-90 transition-all shadow-lg"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;