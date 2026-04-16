"use client";
import React from 'react';
import { ArrowLeft } from "lucide-react"; // Icon import kiya

// Student ki structure define karein
interface Student {
  id: number;
  name: string;
  sapId: string;
  batch: string;
  semester: string;
}

// Props ki types define karein - onBack add kar diya
interface ChatStudentListProps {
  students: Student[];
  selectedId: number | null;
  onSelect: (student: Student) => void;
  onBack: () => void; // Parent dashboard pe wapas janay k liye
}

const ChatStudentList: React.FC<ChatStudentListProps> = ({ students, selectedId, onSelect, onBack }) => {
  return (
    <div className="h-full bg-white rounded-3xl p-4 flex flex-col border border-slate-100 shadow-sm overflow-hidden">
      
      {/* Header with Back Arrow */}

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar"> 
        {students.map((student) => {
          const isActive = selectedId === student.id;
          return (
            <button
              key={student.id}
              onClick={() => onSelect(student)}
              className={`w-full text-left transition-all duration-200 rounded-2xl border-2
                ${isActive ? "border-amber-400 bg-amber-50/30 shadow-md" : "border-transparent hover:bg-slate-50"}`}
            >
              <div className={`p-3 rounded-xl bg-white flex flex-col gap-1 border ${isActive ? "border-amber-100" : "border-slate-50"}`}>
                <p className="font-black text-[12.5px] text-[#1e3a5f] leading-tight truncate">
                  {student.name}
                </p>
                
                <div className={`flex mt-0.5 pt-1 border-t border-slate-50 opacity-75 
                  ${isActive ? "flex-row justify-between items-center gap-2" : "flex-col gap-0.5"}`}>
                  <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-500 whitespace-nowrap">
                    {student.sapId}
                  </p>
                  <p className="text-[8.5px] font-medium uppercase text-slate-400 whitespace-nowrap">
                    {isActive ? `• ${student.batch}` : `${student.batch} • Sem ${student.semester}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatStudentList;