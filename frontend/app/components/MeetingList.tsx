"use client";
import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  day: string;
  date: string; 
  time: string;
  room: string;
  studentName: string;
}

export const MeetingList = () => {
  // Titles updated to "Academic Meeting" and dates adjusted for status
  const [advisorMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Academic Meeting', day: 'Monday', date: 'Mar 10, 2026', time: '10:30 AM', room: 'Room 204', studentName: 'Ahmed Ali' },
    { id: '2', title: 'Academic Meeting', day: 'Tuesday', date: 'Mar 15, 2026', time: '02:00 PM', room: 'Online (Zoom)', studentName: 'Sara Khan' },
    { id: '3', title: 'Academic Meeting', day: 'Wednesday', date: 'May 12, 2026', time: '11:00 AM', room: 'Lab 02', studentName: 'Zainab Bibi' },
    { id: '4', title: 'Academic Meeting', day: 'Thursday', date: 'May 20, 2026', time: '09:30 AM', room: 'Room 101', studentName: 'Usman Sheikh' },
    { id: '5', title: 'Academic Meeting', day: 'Friday', date: 'Jun 05, 2026', time: '03:00 PM', room: 'Advisor Office', studentName: 'Hania Amir' },
  ]);

  return (
    // 'overflow-hidden' ensures no scrolling on the main container
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
      <h2 className="text-3xl font-black text-[#1e3a5f] uppercase not-italic tracking-tight mb-8">
        Advisory Meetings
      </h2>

      <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
        <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-[0.2em] mb-8">
          Meetings with Batch Advisor
        </h3>

        {/* space-y-4 keeps things tight to fit the screen */}
        <div className="space-y-4">
          {advisorMeetings.map((meet) => {
            const isDone = new Date(meet.date) < new Date();

            return (
              <div 
                key={meet.id} 
                className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-6">
                  {/* Date Badge */}
                  <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-sm group-hover:bg-[#1e3a5f] group-hover:text-white transition-all duration-300">
                    <span className="text-[10px] font-black uppercase text-slate-800 group-hover:text-amber-400">
                      {meet.day.substring(0, 3)}
                    </span>
                    <span className="text-2xl font-black leading-none text-[#1e3a5f] group-hover:text-white">
                      {meet.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>

                  {/* Meeting Details */}
                  <div>
                    <p className="text-sm font-black text-[#1e3a5f] uppercase group-hover:text-amber-600 transition-colors">
                      {meet.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                      Student: {meet.studentName}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-5 mt-2">
                      <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
                        <Clock size={12} className="text-amber-500" /> {meet.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
                        <Calendar size={12} className="text-amber-500" /> {meet.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#1e3a5f] text-[10px] font-black">
                        <MapPin size={12} className="text-amber-500" /> {meet.room}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center">
                  <span className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isDone 
                      ? 'bg-green-100 text-green-700 border-green-200 shadow-sm' 
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};