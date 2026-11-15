
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, User, Mail, Phone,
  CheckCircle, XCircle,
  Users, GraduationCap, Eye,
  Calendar, BookOpen
} from 'lucide-react';

interface AdvisorStudentListProps {
  students: any[];
  activeTab: string;
  isAdvisor?: boolean;
  onViewProfile: (student: any) => void;
  onRefresh: () => void;
}

export function AdvisorStudentList({
  students,
  activeTab,
  isAdvisor,
  onViewProfile,
  onRefresh
}: AdvisorStudentListProps) {
  const [searchInput, setSearchInput] = useState('');

  // Filter students based on activeTab
  let filteredStudents = [...students];

  if (activeTab === 'Regular') {
    filteredStudents = filteredStudents.filter(s =>
      s.StudentStatus?.currentStatus === 'Promoted' ||
      s.StudentStatus?.currentStatus === 'Regular' ||
      s.StudentStatus?.currentStatus === 'New Admission'
    );
  } else if (activeTab === 'Irregular') {
    filteredStudents = filteredStudents.filter(s =>
      s.StudentStatus?.currentStatus !== 'Promoted' &&
      s.StudentStatus?.currentStatus !== 'Regular' &&
      s.StudentStatus?.currentStatus !== 'New Admission'
    );
  }

  // Apply search filter
  if (searchInput) {
    const term = searchInput.toLowerCase();
    filteredStudents = filteredStudents.filter(s =>
      s.studentName?.toLowerCase().includes(term) ||
      s.User?.sapid?.toString().includes(term) ||
      s.email?.toLowerCase().includes(term)
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600 font-bold">No students found in this batch</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, SAP ID, or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FDB813] outline-none transition-all"
            />
          </div>

          <button
            onClick={() => {}}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-sm tracking-wider hover:bg-[#FDB813] transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                <th className="p-4 text-[17px] text-center font-bold text-[#1e3a5f] border-b border-r border-slate-300 last:border-r-0">
                  Student
                </th>
                <th className="p-4 text-[17px] text-center font-bold text-[#1e3a5f] border-b border-r border-slate-300 last:border-r-0">
                  Contact Details
                </th>
                <th className="p-4 text-[17px] text-center font-bold text-[#1e3a5f] border-b border-r border-slate-300 last:border-r-0">
                  Degree & Batch
                </th>
                <th className="p-4 text-[17px] text-center font-bold text-[#1e3a5f] border-b border-r border-slate-300 last:border-r-0">
                  Status
                </th>
                <th className="p-4 text-[17px] text-center font-bold text-[#1e3a5f] border-b border-r border-slate-300 last:border-r-0">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center ">
                    <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No students found</p>
                    <p className="text-slate-400 text-sm">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: any, index: number) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 border-b border-r border-slate-300">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                          <User
                            size={18}
                            className="text-[#1e3a5f] group-hover:text-white"
                          />
                        </div>

                        <div>
                          <p className="font-bold text-[#1B3555] text-sm tracking-tight">
                            {student.studentName}
                          </p>
                          <p className="text-[13px] font-semibold text-[#5e6d83]">
                            Sap id: {student.User?.sapid}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 border-b border-r border-slate-300">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          <p className="text-[13px] font-semibold text-[#5e6d83]">
                            {student.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          <p className="text-[13px] font-semibold text-[#5e6d83]">
                            {student.contactNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 border-b border-r border-slate-300">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={12} className="text-slate-400" />
                          <p className="text-[14px] font-bold text-[#1B3555]">
                            {student.BatchModel?.ProgramModel?.programName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-slate-400" />
                          <p className="text-[13px] font-semibold text-[#5e6d83]">
                            {student.BatchModel?.batchName} {student.BatchModel?.batchYear} | Sem {student.currentSemester}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 border-b border-r border-slate-300 text-center">
                      <span className={`inline-flex items-center gap-1 px-5 py-2 rounded-full text-[12px] font-bold ${
                        student.StudentStatus?.currentStatus === 'Promoted' ||
                        student.StudentStatus?.currentStatus === 'Regular' ||
                        student.StudentStatus?.currentStatus === 'New Admission'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.StudentStatus?.currentStatus === 'Promoted' ||
                        student.StudentStatus?.currentStatus === 'Regular' ||
                        student.StudentStatus?.currentStatus === 'New Admission' ||
                        student.StudentStatus === null ||
                        student.StudentStatus?.currentStatus === null ? (
                          <CheckCircle size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        {student.StudentStatus?.currentStatus || 'Active'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center border-b border-slate-300">
                      <button
                        onClick={() => onViewProfile(student)}
                        className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-[11px] font-bold hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center gap-2"
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
