"use client";

import React, { useState } from "react";
import { 
  BookOpen, Clock, Snowflake, FileStack, 
  GraduationCap, ArrowLeft, Send, ChevronRight 
} from "lucide-react";

export default function SubmitRequest() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const requestCards = [
    { id: "course-offering", title: "Course Offering", icon: <BookOpen size={23} />, desc: "Request to offer a specific course for the upcoming semester.", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "credit-hours", title: "Credit Hours", icon: <Clock size={23} />, desc: "Apply for additional credit hours or limit adjustments.", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "freeze", title: "Freeze/Unfreeze", icon: <Snowflake size={23} />, desc: "Apply for a semester freeze or resume your studies.", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "transfer", title: "Credit Transfer", icon: <FileStack size={23} />, desc: "Transfer credits from another department or university.", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "audit", title: "Degree Audit", icon: <GraduationCap size={23} />, desc: "A final review of your credits and degree requirements.", color: "bg-rose-50 text-rose-600 border-rose-100" }
  ];

  if (selectedRequest) {
    return (
      <div className="w-full animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setSelectedRequest(null)} 
          className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a5f] font-black text-[10px] uppercase mb-8 transition-colors outline-none group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Requests
        </button>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-8 italic">
            {requestCards.find(r => r.id === selectedRequest)?.title} Form
          </h2>
          <div className="space-y-6">
            <textarea 
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-amber-400 outline-none transition-all h-40 shadow-inner" 
              placeholder="Please provide details about your request..." 
            />
            <button className="w-full bg-[#1e3a5f] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#2a5288] hover:shadow-lg transition-all active:scale-[0.98]">
              <Send size={18} /> Submit to Coordinator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700 space-y-4">
      <div className="mb-6">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Select Request Type</h2>
      </div>

      {/* Grid for All Cards - No Slider */}
      <div className="grid grid-cols-1 gap-4">
        {requestCards.map((card) => (
          <div 
            key={card.id} 
            onClick={() => setSelectedRequest(card.id)} 
            className="group bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex items-center gap-6"
          >
            {/* Left Side: Icon */}
            <div className={`shrink-0 w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
              {card.icon}
            </div>

            {/* Middle: Content */}
            <div className="flex-1">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase italic leading-none mb-2">
                {card.title}
              </h3>
              <p className="text-slate-500 text-[11px] font-bold leading-tight max-w-xl">
                {card.desc}
              </p>
            </div>

            {/* Right Side: Indicator */}
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}