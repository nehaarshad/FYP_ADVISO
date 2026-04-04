import { Send } from "lucide-react";
import { useState } from "react";

type Student = {
  id: number;
  name: string;
  sapId: string;
  batch: string;
  semester: string;
};

type Message = {
  id: number;
  sender: "advisor" | "student";
  text: string;
  time: string;
};


const AdvisorChat: React.FC = () => {
  const students: Student[] = [
    {
      id: 1,
      name: "Ali Khan",
      sapId: "SAP-2021-001",
      batch: "Fall 2021",
      semester: "7th",
    },
    {
      id: 2,
      name: "Ayesha Malik",
      sapId: "SAP-2021-014",
      batch: "Fall 2021",
      semester: "7th",
    },
    {
      id: 3,
      name: "Usman Raza",
      sapId: "SAP-2022-021",
      batch: "Fall 2022",
      semester: "5th",
    },
  ];

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
        sender: "advisor",
      text: "Hello! I’m your advisor. Feel free to ask any questions.",
      time: "10:02 AM",
    },
    {
      id: 2,
      sender: "student",
      text: "Ok Sure",
      time: "10:01 AM",
    },
  ]);

  const handleSend = () => {
    if (!input.trim() || !selectedStudent) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "advisor",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex h-[650px] bg-[#0f172a] rounded-2xl shadow-lg overflow-hidden">

      {/* ================= LEFT: STUDENT LIST ================= */}
      <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">
          Students
        </h3>

        <div className="space-y-3">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`w-full text-left p-3 rounded-xl transition
                ${
                  selectedStudent?.id === student.id
                    ? "bg-amber-400 text-[#1e3a5f]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <p className="font-bold text-sm">{student.name}</p>
              <p className="text-[11px] opacity-70">SAP ID: {student.sapId}</p>
              <p className="text-[11px] opacity-70">
                {student.batch} • Semester {student.semester}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ================= RIGHT: CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {!selectedStudent ? (
          <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
            Select a student to start chat
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white font-bold">
                {selectedStudent.name}
              </h2>
              <p className="text-white/50 text-xs">
                {selectedStudent.sapId} • {selectedStudent.batch}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "advisor"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm
                      ${
                        msg.sender === "advisor"
                          ? "bg-amber-400 text-[#1e3a5f]"
                          : "bg-white/10 text-white"
                      }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[10px] mt-1 opacity-60">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl px-4 py-2 bg-white/5 text-white outline-none placeholder:text-white/40"
              />
              <button
                onClick={handleSend}
                className="bg-amber-400 p-3 rounded-xl text-[#1e3a5f] hover:scale-105 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvisorChat;