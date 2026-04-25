"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'student' | 'advisor';
  time: string;
}

export const StudentChat = ({ onBack }: { onBack?: () => void }) => {
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
    <div className="flex flex-col h-[85vh] md:h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-t-[2rem] md:rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* --- HEADER --- */}
      <div className="bg-[#1e3a5f] p-4 md:p-5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Back Arrow - Consistent Style */}
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200/20 bg-white/10 shadow-sm rounded-full text-white transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <User size={22} className="text-blue-100" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#1e3a5f] rounded-full"></span>
          </div>
          
          <div>
            <h3 className="font-black uppercase tracking-tight text-[12px] md:text-[14px]">Dr. Sarah Khan</h3>
            <p className="text-[8px] md:text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none">Academic Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-blue-200">Status</span>
                <span className="text-[8px] font-bold text-green-400 uppercase">Online</span>
            </div>
            <HelpCircle size={20} className="text-amber-400 opacity-80 cursor-pointer hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/30 custom-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] relative`}>
                <div className={`px-4 md:px-5 py-3 rounded-[1.5rem] text-[12px] md:text-[13px] font-medium shadow-sm flex flex-col ${
                  msg.sender === 'student' 
                    ? 'bg-[#1e3a5f] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none border-l-4 border-l-amber-400'
                }`}>
                  <span className="leading-relaxed break-words">{msg.text}</span>
                  
                  <span className={`text-[8px] font-black uppercase mt-2 self-end opacity-60 ${
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
      <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-[12px] md:text-[13px] font-bold text-[#1e3a5f] outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-400/10 transition-all placeholder:text-slate-300"
            />
          </div>

          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 w-10 md:h-12 md:w-12 bg-amber-500 hover:bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all active:scale-90 disabled:opacity-30 disabled:shadow-none shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[8px] text-center text-slate-400 mt-3 uppercase font-bold tracking-widest">
          End-to-end encrypted with Academic Office
        </p>
      </div>
    </div>
  );
};