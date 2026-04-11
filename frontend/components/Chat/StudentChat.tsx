"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'student' | 'advisor';
  time: string;
}

export const StudentChat = ({ onBack }: { onBack?: () => void }) => {
  // Sirf pehla welcome message rakha hai, baqi delete kar diye
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      text: "Hello Ahmed! I'm your Academic Advisor. How can I help you today with your courses or roadmap?", 
      sender: 'advisor', 
      time: '09:00 AM' 
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto bg-white rounded-[1.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* --- HEADER --- */}
      <div className="bg-[#1e3a5f] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <User size={18} className="text-blue-100" />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-[#1e3a5f] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-black uppercase italic tracking-tight text-[11px]">Dr. Sarah Khan</h3>
            <p className="text-[8px] font-bold text-blue-300 uppercase tracking-widest leading-none">Academic Advisor</p>
          </div>
        </div>
        <HelpCircle size={18} className="text-amber-400 opacity-80" />
      </div>

      {/* --- MESSAGES AREA --- */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] relative group`}>
                <div className={`px-4 pt-2.5 pb-1.5 rounded-[1.2rem] text-[11px] font-medium shadow-sm flex flex-col ${
                  msg.sender === 'student' 
                    ? 'bg-[#1e3a5f] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none border-l-4 border-l-amber-400'
                }`}>
                  {/* Message Text */}
                  <span className="leading-relaxed pr-8">{msg.text}</span>
                  
                  {/* Time Inside Message (Bottom Right) */}
                  <span className={`text-[7px] font-black uppercase mt-1 self-end opacity-60 ${
                    msg.sender === 'student' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- INPUT AREA --- */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <button type="button" className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors">
            <Paperclip size={16} />
        </button>
        
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your query..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-lg py-2 px-4 text-[11px] font-bold text-[#1e3a5f] outline-none focus:border-amber-400 transition-all placeholder:text-slate-300"
        />

        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="h-9 w-9 bg-amber-500 hover:bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center shadow-md transition-all active:scale-90 disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};