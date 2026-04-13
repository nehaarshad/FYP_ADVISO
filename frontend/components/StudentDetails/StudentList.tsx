"use client";
import React from 'react';
import { ChevronRight, User } from 'lucide-react';
// --- 1. CURRENT BATCH (FALL 2024) - 10 STUDENTS ---
const currentBatchData = [
  { id: 'c1', name: 'Ahmed Ali', status: 'Irregular', academicStatus: 'Ungraduated', code: '10293', cgpa: '2.85' },
  { id: 'c2', name: 'Sara Khan', status: 'Regular', academicStatus: 'Ungraduated', code: '55821', cgpa: '3.42' },
  { id: 'c3', name: 'Zainab Bibi', status: 'Regular', academicStatus: 'Ungraduated', code: '39402', cgpa: '3.15' },
  { id: 'c4', name: 'Hamza Sheikh', status: 'Regular', academicStatus: 'Ungraduated', code: '99201', cgpa: '2.90' },
  { id: 'c5', name: 'Dua Fatima', status: 'Regular', academicStatus: 'Ungraduated', code: '22831', cgpa: '3.75' },
  { id: 'c6', name: 'Fahad Mustafa', status: 'Irregular', academicStatus: 'Ungraduated', code: '44512', cgpa: '2.10' },
  { id: 'c7', name: 'Zoya Ahmed', status: 'Regular', academicStatus: 'Ungraduated', code: '11203', cgpa: '3.88' },
  { id: 'c8', name: 'Usman Ghani', status: 'Regular', academicStatus: 'Ungraduated', code: '66782', cgpa: '3.25' },
  { id: 'c9', name: 'Eshal Malik', status: 'Irregular', academicStatus: 'Ungraduated', code: '33491', cgpa: '1.95' },
  { id: 'c10', name: 'Bilal Nasir', status: 'Regular', academicStatus: 'Ungraduated', code: '88902', cgpa: '3.50' },
];

const historicalData: Record<string, any[]> = {
  // --- 2. FALL 2023 - 10 STUDENTS ---
  'Fall 2023': [
    { id: 'f1', name: 'Valeeja Jamil', status: 'Regular', academicStatus: 'Graduated', code: '48291', cgpa: '3.89' },
    { id: 'f2', name: 'Bilal Hassan', status: 'Irregular', academicStatus: 'Ungraduated', code: '77492', cgpa: '2.10' },
    { id: 'f3', name: 'Hassan Raza', status: 'Regular', academicStatus: 'Ungraduated', code: '12930', cgpa: '3.10' },
    { id: 'f4', name: 'Rida Zehra', status: 'Irregular', academicStatus: 'Suspended', code: '90021', cgpa: '1.80' },
    { id: 'f5', name: 'Omer Shah', status: 'Irregular', academicStatus: 'Pending Fees', code: '55612', cgpa: '2.40' },
    { id: 'f6', name: 'Sana Javed', status: 'Regular', academicStatus: 'Graduated', code: '77210', cgpa: '3.65' },
    { id: 'f7', name: 'Asad Vasti', status: 'Regular', academicStatus: 'Graduated', code: '33411', cgpa: '3.40' },
    { id: 'f8', name: 'Muneeb Butt', status: 'Irregular', academicStatus: 'Ungraduated', code: '11902', cgpa: '2.20' },
    { id: 'f9', name: 'Hira Mani', status: 'Regular', academicStatus: 'Graduated', code: '55672', cgpa: '3.55' },
    { id: 'f10', name: 'Babar Azam', status: 'Regular', academicStatus: 'Graduated', code: '10101', cgpa: '3.99' },
  ],
  // --- 3. SPRING 2023 - 10 STUDENTS ---
  'Spring 2023': [
    { id: 's1', name: 'Meerab Jan', status: 'Regular', academicStatus: 'Graduated', code: '11029', cgpa: '3.95' },
    { id: 's2', name: 'Zohaib Ali', status: 'Regular', academicStatus: 'Graduated', code: '33201', cgpa: '2.95' },
    { id: 's3', name: 'Kashif Abbasi', status: 'Irregular', academicStatus: 'Freeze', code: '22109', cgpa: '2.15' },
    { id: 's4', name: 'Nimra Khan', status: 'Regular', academicStatus: 'Graduated', code: '44561', cgpa: '3.20' },
    { id: 's5', name: 'Talat Hussain', status: 'Regular', academicStatus: 'Graduated', code: '66712', cgpa: '3.45' },
    { id: 's6', name: 'Maya Ali', status: 'Regular', academicStatus: 'Graduated', code: '99021', cgpa: '3.70' },
    { id: 's7', name: 'Feroze Khan', status: 'Irregular', academicStatus: 'Ungraduated', code: '33412', cgpa: '1.50' },
    { id: 's8', name: 'Sajal Aly', status: 'Regular', academicStatus: 'Graduated', code: '11290', cgpa: '3.80' },
    { id: 's9', name: 'Ahad Raza', status: 'Regular', academicStatus: 'Graduated', code: '44321', cgpa: '3.10' },
    { id: 's10', name: 'Kubra Khan', status: 'Regular', academicStatus: 'Graduated', code: '55610', cgpa: '3.35' },
  ]
};

interface StudentListProps {
  selectedBatch: string;
  activeTab: string;
  onViewProfile: (student: any) => void;
}

export const StudentList = ({ selectedBatch, activeTab, onViewProfile }: StudentListProps) => {
  // Batch selection logic
  const batchData = selectedBatch === 'Fall 2024' 
    ? currentBatchData 
    : historicalData[selectedBatch] || [];

  // Filter logic (Total / Regular / Irregular)
  const filteredStudents = batchData.filter(student => {
    if (activeTab === 'Total') return true;
    return student.status === activeTab;
  });

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Details</th>
            <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Roll Code</th>
            <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
            <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#1e3a5f] flex items-center justify-center font-bold group-hover:bg-amber-400 group-hover:text-white transition-all">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight">{student.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{student.academicStatus}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    #{student.code}
                  </span>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    student.status === 'Regular' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => onViewProfile(student)} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#1e3a5f] rounded-xl text-[9px] font-black uppercase hover:bg-[#1e3a5f] hover:text-white transition-all shadow-sm"
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-20 text-center">
                <div className="flex flex-col items-center justify-center opacity-40">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 animate-spin mb-4" />
                  <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    No {activeTab !== 'Total' ? activeTab : ''} Students Found
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};