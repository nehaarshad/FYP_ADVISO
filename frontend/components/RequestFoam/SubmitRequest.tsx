"use client";

import React, { useState } from "react";
import { 
  BookOpen, Clock, Snowflake, FileStack, 
  GraduationCap, ArrowLeft, ChevronRight, Construction 
} from "lucide-react";

interface SubmitRequestProps {
  onBack: () => void;
}

export default function SubmitRequest({ onBack }: SubmitRequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const requestCards = [
    { id: "course-offering", title: "Course Offering", icon: BookOpen, desc: "Request to offer a specific course for the upcoming semester.", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "credit-hours", title: "Credit Hours", icon: Clock, desc: "Apply for additional credit hours or limit adjustments.", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "freeze", title: "Freeze/Unfreeze", icon: Snowflake, desc: "Apply for a semester freeze or resume your studies.", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "transfer", title: "Credit Transfer", icon: FileStack, desc: "Transfer credits from another department or university.", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "audit", title: "Degree Audit", icon: GraduationCap, desc: "A final review of your credits and degree requirements.", color: "bg-rose-50 text-rose-600 border-rose-100" }
  ];

  if (selectedRequest) {
    return (
      <div className="w-full animate-in slide-in-from-right duration-500 max-w-full mx-auto px-4 text-center">
        <div className="flex justify-start mb-8">
          <button 
            onClick={() => setSelectedRequest(null)} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 p-10 md:p-16 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
            <Construction size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-3">
            Coming Soon
          </h2>
          <p className="text-slate-500 font-bold text-xs md:text-sm max-w-xs">
            This feature is currently under development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700 space-y-6 px-4">
      
      {/* Header Section */}
      <div className="flex items-center gap-5">
        {onBack && (
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">Submit Request</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Administration</p>
        </div>
      </div>

      {/* Full Width Grid - Badi width (weight) ke liye */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {requestCards.map((card) => {
          const IconComponent = card.icon;
          
          return (
            <div 
              key={card.id} 
              onClick={() => setSelectedRequest(card.id)} 
              className="group bg-white border border-slate-100 rounded-[1.2rem] md:rounded-[1.5rem] p-4 md:p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex items-center gap-4 md:gap-6 w-full"
            >
              {/* Icon Box */}
              <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 ${card.color} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm`}>
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-[10px] md:text-xs font-bold leading-tight">
                  {card.desc}
                </p>
              </div>

              {/* Action Icon */}
              <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}