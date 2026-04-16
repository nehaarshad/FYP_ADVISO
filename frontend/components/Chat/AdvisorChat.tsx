"use client";
import React, { useState } from 'react';
import ChatStudentList from './ChatStudentList';
import ChatArea from './ChatArea';
import { ArrowLeft } from 'lucide-react';

export type Student = {
  id: number;
  name: string;
  sapId: string;
  batch: string;
  semester: string;
};

export type Message = {
  id: number;
  studentId: number; 
  sender: "advisor" | "student";
  text: string;
  time: string;
};

interface AdvisorChatProps {
  onBack?: () => void;
}

const AdvisorChat: React.FC<AdvisorChatProps> = ({ onBack }) => {
  const students: Student[] = [
    { id: 1, name: "Ali Khan", sapId: "SAP-2021-001", batch: "Fall 2021", semester: "7th" },
    { id: 2, name: "Ayesha Malik", sapId: "SAP-2021-014", batch: "Fall 2021", semester: "7th" },
  ];

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [allMessages, setAllMessages] = useState<Message[]>([
    { id: 1, studentId: 1, sender: "advisor", text: "Ali, please visit my office tomorrow.", time: "10:30 AM" },
    { id: 2, studentId: 1, sender: "student", text: "Okay sir, I will be there.", time: "10:35 AM" },
    { id: 3, studentId: 2, sender: "student", text: "Assalam-o-Alaikum Sir, I have a query about credits.", time: "09:00 AM" },
  ]);

  const addMessage = (text: string) => {
    if (!selectedStudent) return;
    const newMessage: Message = {
      id: Date.now(),
      studentId: selectedStudent.id,
      sender: "advisor",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setAllMessages((prev) => [...prev, newMessage]);
  };

  // Logic: If in a chat, go back to list. If in list, go back to dashboard.
  const handleBackAction = () => {
    if (selectedStudent) {
      setSelectedStudent(null);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto overflow-hidden p-4 md:p-0">
      
      {/* --- SINGLE BACK ARROW --- */}
      <div className="flex items-center">
        <button 
          onClick={handleBackAction} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors border border-slate-100 outline-none"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full md:h-[520px] bg-transparent w-full overflow-hidden">
        {/* LEFT: Student List (35%) */}
        <div className={`w-full md:w-[35%] h-full ${selectedStudent ? 'hidden md:block' : 'block'}`}>
          <ChatStudentList 
            students={students} 
            selectedId={selectedStudent?.id || null} 
            onSelect={setSelectedStudent} 
            onBack={handleBackAction} 
          />
        </div>

        {/* RIGHT: Chat Area (65%) */}
        <div className={`w-full md:w-[65%] h-full ${!selectedStudent ? 'hidden md:block' : 'block'}`}>
          <ChatArea 
            selectedStudent={selectedStudent} 
            messages={allMessages.filter(m => m.studentId === selectedStudent?.id)} 
            onSendMessage={addMessage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdvisorChat;