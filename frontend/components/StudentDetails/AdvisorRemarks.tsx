"use client";
import React from 'react';
import { 
  Clock, ArrowLeft, AlertCircle, Info, CheckCircle, Pin
} from 'lucide-react';

interface AdvisorRemarksProps {
  onBack?: () => void;
}

export const AdvisorRemarks = ({ onBack }: AdvisorRemarksProps) => {
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
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-2">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          
          {onBack && (
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
             <h2 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tight leading-none">
               Advisor Remarks
             </h2>
             <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
               Academic Guidance
             </p>
          </div>
        </div>

        <div className="hidden sm:block h-1.5 w-12 bg-slate-100 rounded-full opacity-40"></div>
      </div>

      {/* --- STATIC GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {remarks.map((item) => (
          <div 
            key={item.id} 
            className={`${item.bgColor} ${item.borderColor} border-2 rounded-[1.5rem] p-5 md:p-6 flex flex-col justify-between min-h-[190px] md:min-h-[220px] shadow-sm relative cursor-default`}
          >
            {/* Pin Icon */}
            <div className={`absolute top-4 right-4 opacity-20 ${item.accentColor}`}>
                <Pin size={16} className="rotate-45" />
            </div>

            <div>
              {/* Category Tag */}
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className={`px-2 md:px-2.5 py-1 rounded-lg ${item.tagBg} flex items-center gap-2 border border-black/5`}>
                   <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${item.accentColor}`}>
                     {item.category}
                   </span>
                </div>
              </div>

              {/* Title & Content */}
              <h3 className="text-base md:text-lg font-black text-[#1e3a5f] leading-tight mb-2 tracking-tight uppercase line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs md:text-[13px] font-bold text-slate-600/90 leading-snug">
                "{item.content}"
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 md:mt-6 pt-4 border-t border-black/5">
              <div className="flex items-center gap-1.5 text-slate-400/80">
                <Clock size={12} />
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">
                  {item.time}
                </span>
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