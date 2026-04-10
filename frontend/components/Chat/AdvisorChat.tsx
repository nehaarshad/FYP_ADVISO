"use client";
import React, { useState } from 'react';
import ChatStudentList from './ChatStudentList';
import ChatArea from './ChatArea';

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

const AdvisorChat: React.FC = () => {
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

  return (
    /* Height h-[450px] ki hai aur max-width 5xl taake box zyada phila hua na lage */
    <div className="flex gap-3 h-[450px] max-w-5xl mx-auto bg-transparent w-full overflow-hidden">
      {/* LEFT: Student List (30% - Thoda aur narrow kiya) */}
      <div className="w-[30%] h-full shrink-0">
        <ChatStudentList 
          students={students} 
          selectedId={selectedStudent?.id || null} 
          onSelect={setSelectedStudent} 
        />
      </div>

      {/* RIGHT: Chat Area (70% - Space optimize ki hai) */}
      <div className="w-[70%] h-full shrink-0">
        <ChatArea 
          selectedStudent={selectedStudent} 
          messages={allMessages.filter(m => m.studentId === selectedStudent?.id)} 
          onSendMessage={addMessage} 
        />
      </div>
    </div>
  );
};

export default AdvisorChat;