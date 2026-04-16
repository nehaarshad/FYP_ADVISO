"use client";
import React from "react";
import { ArrowLeft, Clock, Calendar, MapPin } from "lucide-react";

interface TimetableProps {
  onBack: () => void;
}

export const Timetable = ({ onBack }: TimetableProps) => {
  const schedule = [
    { day: "Monday", subject: "Software Architecture", time: "08:30 - 10:00", room: "Lab 04" },
    { day: "Monday", subject: "Human Computer Interaction", time: "11:30 - 01:00", room: "Room 102" },
    { day: "Tuesday", subject: "Professional Practices", time: "10:00 - 11:30", room: "Room 205" },
    { day: "Wednesday", subject: "Database Systems", time: "08:30 - 11:30", room: "Lab 02" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-1 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm p-5 md:p-8">
        <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase mb-6 md:mb-8 border-l-4 border-amber-500 pl-4">
          Weekly Timetable
        </h2>

        <div className="grid gap-3 md:gap-4">
          {schedule.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all group gap-4"
            >
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                {/* Icon Box */}
                <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm transition-colors">
                  <Clock size={18} className="md:w-5 md:h-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="font-black text-[#1e3a5f] uppercase text-xs md:text-sm leading-tight mb-1">
                    {item.subject}
                  </h4>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="shrink-0" /> {item.day}
                    </span>
                    <span className="hidden xs:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" /> {item.room}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Badge - Straight Text */}
              <div className="self-start md:self-center px-3 md:px-4 py-1.5 md:py-2 bg-white border border-slate-200 rounded-lg text-[10px] md:text-[11px] font-black text-[#1e3a5f] whitespace-nowrap shadow-sm">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};