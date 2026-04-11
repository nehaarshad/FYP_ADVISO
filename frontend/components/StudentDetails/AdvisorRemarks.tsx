"use client";
import React from 'react';
import { 
  Clock, FileText, ArrowLeft, MessageCircle, AlertCircle, Info, CheckCircle, Pin
} from 'lucide-react';

export const AdvisorRemarks = ({ onBack }: { onBack?: () => void }) => {
  const remarks = [
    {
      id: '1',
      category: 'RECOMMENDATION',
      title: 'SEMESTER 6 ELECTIVES',
      content: 'I highly recommend taking "Cloud Computing" based on your interest in backend development.',
      time: '10:30 AM',
      icon: <Info size={14} />,
      bgColor: 'bg-[#f0f9ff]', 
      borderColor: 'border-[#e0f2fe]',
      accentColor: 'text-[#0284c7]',
      tagBg: 'bg-white/50'
    },
    {
      id: '2',
      category: 'URGENT ACTION',
      title: 'INTERNSHIP DOCUMENTS',
      content: 'Please submit your updated CV and transcript to the placement office by Friday.',
      time: 'YESTERDAY',
      icon: <AlertCircle size={14} />,
      bgColor: 'bg-[#fef2f2]', 
      borderColor: 'border-[#fee2e2]',
      accentColor: 'text-[#dc2626]',
      tagBg: 'bg-white/50'
    },
    {
      id: '3',
      category: 'GENERAL GUIDANCE',
      title: 'PROBATION STATUS',
      content: 'Good job on improving your CGPA. Keep maintaining this pace in your core subjects.',
      time: '2 DAYS AGO',
      icon: <CheckCircle size={14} />,
      bgColor: 'bg-[#f0fdf4]', 
      borderColor: 'border-[#dcfce7]',
      accentColor: 'text-[#16a34a]',
      tagBg: 'bg-white/50'
    }
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto p-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          
          {/* SIMPLE BACK ARROW (NO BOX) */}
          {onBack && (
            <button 
              onClick={onBack} 
              className="h-8 w-8 flex items-center justify-center text-[#1e3a5f] hover:bg-slate-100 rounded-lg transition-all active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="h-11 w-11 bg-[#1e3a5f] rounded-xl flex items-center justify-center text-white shadow-md ml-1">
             <MessageCircle size={22} />
          </div>
          <div>
             <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic tracking-tight leading-none">Advisor Remarks</h2>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Guidance</p>
          </div>
        </div>

        <div className="h-1.5 w-12 bg-slate-100 rounded-full opacity-40"></div>
      </div>

      {/* --- FULL COLOR STICKY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remarks.map((item) => (
          <div 
            key={item.id} 
            className={`${item.bgColor} ${item.borderColor} border-2 rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] shadow-sm relative cursor-default transition-shadow hover:shadow-md`}
          >
            <div className={`absolute top-4 right-4 opacity-20 ${item.accentColor}`}>
                <Pin size={16} className="rotate-45" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-2.5 py-1 rounded-lg ${item.tagBg} flex items-center gap-2 border border-black/5`}>
                   <span className={`text-[8px] font-black uppercase tracking-widest ${item.accentColor}`}>{item.category}</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-[#1e3a5f] leading-tight mb-2 tracking-tight uppercase line-clamp-1">{item.title}</h3>
              <p className="text-[13px] font-bold text-slate-600/90 leading-snug italic">
                "{item.content}"
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
              <div className="flex items-center gap-1.5 text-slate-400/80">
                <Clock size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">{item.time}</span>
              </div>
              <div className={`${item.accentColor} opacity-40`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};