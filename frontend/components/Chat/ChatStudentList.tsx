import React from 'react';

interface Student {
  id: number;
  name: string;
  sapId: string;
  batch: string;
  semester: string;
}

interface ChatStudentListProps {
  students: Student[];
  selectedId: number | null;
  onSelect: (student: Student) => void;
}

const ChatStudentList: React.FC<ChatStudentListProps> = ({ students, selectedId, onSelect }) => {
  return (
    /* Width ko mazeed kam kiya aur padding tight kar di */
    <div className="w-[28%] bg-white rounded-2xl p-4 overflow-y-auto border border-slate-100 flex flex-col gap-2 shadow-sm">
      <h3 className="text-[#1e3a5f] font-bold text-[9px] mb-5 uppercase tracking-[0.2em] opacity-40 px-1 leading-none">
        Conversations
      </h3>

      <div className="space-y-2"> 
        {students.map((student) => {
          const isActive = selectedId === student.id;
          return (
            <button
              key={student.id}
              onClick={() => onSelect(student)}
              /* Background ab white hi rahega, sirf border yellow (amber-400) hoga */
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 border-2
                ${isActive
                  ? "bg-white border-amber-400 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                }`}
            >
              <div className="flex flex-col gap-0.5">
                <p className="font-black text-[12.5px] text-[#1e3a5f] leading-tight">
                  {student.name}
                </p>
                <div className="flex flex-col opacity-70">
                  <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">
                    {student.sapId}
                  </p>
                  <p className="text-[9px] font-medium uppercase text-slate-400">
                    {student.batch} • Sem {student.semester}
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