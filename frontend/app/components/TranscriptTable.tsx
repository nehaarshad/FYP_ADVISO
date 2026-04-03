import React from 'react';

interface TranscriptProps {
  transcript: any[];
}

// "export const" use kar rahe hain to import mein { } lagana hoga
export const TranscriptTable: React.FC<TranscriptProps> = ({ transcript }) => {
  if (!transcript) return null;
  return (
    <div className="space-y-8">
      {transcript.map((sem, idx) => (
        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
          <div className="flex justify-between items-end border-b-2 border-slate-50 pb-4 mb-6">
            <h3 className="text-lg font-black text-[#1e3a5f] uppercase italic">{sem.semester}</h3>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">SGPA</p>
              <p className="text-xl font-black text-amber-500">{sem.sgpa}</p>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <th className="pb-4">Course Name</th>
                <th className="pb-4 text-center">Credit</th>
                <th className="pb-4 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sem.courses.map((course: any, cIdx: number) => (
                <tr key={cIdx}>
                  <td className="py-4 text-xs font-bold text-slate-600 uppercase italic">{course.name}</td>
                  <td className="py-4 text-xs font-black text-slate-400 text-center">{course.cr}</td>
                  <td className="py-4 text-right">
                    <span className={`px-3 py-1 rounded-lg font-black text-[10px] ${course.grade === 'F' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-[#1e3a5f]'}`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};