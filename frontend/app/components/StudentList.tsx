"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';

// Current Advisory Data
const currentBatchData = [
  { id: 'c1', name: 'Ahmed Ali', status: 'Irregular', academicStatus: 'Ungraduated', code: '10293', cgpa: '2.85' },
  { id: 'c2', name: 'Sara Khan', status: 'Regular', academicStatus: 'Ungraduated', code: '55821', cgpa: '3.42' },
  { id: 'c3', name: 'Zainab Bibi', status: 'Regular', academicStatus: 'Ungraduated', code: '39402', cgpa: '3.15' },
  { id: 'c4', name: 'Hamza Sheikh', status: 'Regular', academicStatus: 'Ungraduated', code: '99201', cgpa: '2.90' },
  { id: 'c5', name: 'Dua Fatima', status: 'Regular', academicStatus: 'Ungraduated', code: '22831', cgpa: '3.75' },
];

// Historical Batches Data
const historicalData: Record<string, any[]> = {
  'Fall 2023': [
    { 
      id: 'f1', name: 'Valeeja Jamil', academicStatus: 'Graduated', code: '48291', status: 'Regular', cgpa: '3.89',
      transcript: [
        { 
          semester: 'Semester 1', sgpa: '3.90', 
          courses: [
            { name: 'Introduction to SE', cr: '3', grade: 'A' },
            { name: 'Calculus', cr: '3', grade: 'A-' }
          ] 
        }
      ]
    },
    { id: 'f2', name: 'Ahmed Ali', academicStatus: 'Graduated', code: '10293', status: 'Regular', cgpa: '3.10' },
    { id: 'f3', name: 'Sara Khan', academicStatus: 'Graduated', code: '55821', status: 'Regular', cgpa: '3.45' },
    { id: 'f4', name: 'Zainab Bibi', academicStatus: 'Graduated', code: '39402', status: 'Regular', cgpa: '3.20' },
    { id: 'f5', name: 'Hamza Sheikh', academicStatus: 'Freeze', code: '99201', status: 'Irregular', cgpa: '2.50' },
    { id: 'f6', name: 'Dua Fatima', academicStatus: 'Ungraduated', code: '22831', status: 'Regular', cgpa: '3.60' },
    { id: 'f7', name: 'Bilal Hassan', academicStatus: 'Ungraduated', code: '77492', status: 'Irregular', cgpa: '2.10' },
  ],
  'Spring 2022': [
    { id: 's1', name: 'Meerab Jan', academicStatus: 'Graduated', code: '11029', status: 'Regular', cgpa: '3.95' },
    { id: 's2', name: 'Usman Pirzada', academicStatus: 'Graduated', code: '64532', status: 'Regular', cgpa: '3.30' },
    { id: 's3', name: 'Eshal Malik', academicStatus: 'Graduated', code: '88371', status: 'Regular', cgpa: '3.15' },
    { id: 's4', name: 'Hassan Raza', academicStatus: 'Graduated', code: '12930', status: 'Regular', cgpa: '3.40' },
    { id: 's5', name: 'Ayesha Khan', academicStatus: 'Graduated', code: '44521', status: 'Regular', cgpa: '3.65' },
    { id: 's6', name: 'Zohaib Ali', academicStatus: 'Graduated', code: '33201', status: 'Regular', cgpa: '2.95' },
    { id: 's7', name: 'Rida Zehra', academicStatus: 'Suspended', code: '90021', status: 'Irregular', cgpa: '1.80' },
    { id: 's8', name: 'Omer Shah', academicStatus: 'Pending Fees', code: '55612', status: 'Irregular', cgpa: '2.40' },
  ]
};

interface StudentListProps {
  selectedBatch: string;
  activeTab: string;
  onViewProfile: (student: any) => void;
}

export const StudentList = ({ selectedBatch, activeTab, onViewProfile }: StudentListProps) => {
  const batchData = selectedBatch === 'Fall 2024' ? currentBatchData : historicalData[selectedBatch] || [];

  const filteredStudents = batchData.filter(student => {
    if (activeTab === 'Total') return true;
    return student.status === activeTab;
  });

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
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
                    <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      {/* Removed 'italic' here */}
                      <p className="text-sm font-black text-[#1e3a5f] uppercase">{student.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{student.academicStatus}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-xs font-mono font-bold text-slate-400">
                  <span className="bg-slate-100 px-2 py-1 rounded-md">#{student.code}</span>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    student.status === 'Regular' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {student.status || 'N/A'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => onViewProfile(student)} 
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-[9px] font-black uppercase hover:bg-amber-400 hover:text-[#1e3a5f] transition-all shadow-sm hover:shadow-md"
                  >
                    VIEW PROFILE <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 opacity-20">
                   <div className="w-12 h-12 rounded-full border-4 border-dashed border-slate-400 animate-spin" />
                   <p className="text-slate-500 font-black uppercase text-[11px] tracking-[0.3em]">No Records Found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};