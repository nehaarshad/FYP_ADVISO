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
  
  // Student ka reply yahan add kiya hai
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "advisor", text: "Assalam-o-Alaikum, please visit my office tomorrow.", time: "10:30 AM" },
    { id: 2, sender: "student", text: "Walaikum Assalam Sir, I will be there at 11:00 AM. Is that okay?", time: "10:35 AM" },
  ]);

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: "advisor",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex gap-4 h-[550px] max-w-5xl mx-auto bg-transparent w-full">
      <ChatStudentList 
        students={students} 
        selectedId={selectedStudent?.id || null} 
        onSelect={setSelectedStudent} 
      />
      <ChatArea 
        selectedStudent={selectedStudent} 
        messages={messages} 
        onSendMessage={addMessage} 
      />
    </div>
  );
};

export default AdvisorChat;