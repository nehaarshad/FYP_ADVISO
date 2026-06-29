// components/students/StudentList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, User, Mail, Phone, 
  CheckCircle, XCircle, 
  Users, GraduationCap, Eye, Edit,
  Loader2, AlertCircle, Calendar, BookOpen
} from 'lucide-react';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { StudentDetailsModal } from './StudentDetailsModal';
import { EditStudent } from '@/app/components/EditStudent';


export function StudentList({ selectedBatch, activeTab, onViewProfile }: { selectedBatch: string, activeTab: string, onViewProfile: (s: any) => void }){
  const [searchInput, setSearchInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>(activeTab === 'Total' ? 'all' : activeTab === 'Regular' ? 'active' : 'inactive');
  const [filterBatch, setFilterBatch] = useState(selectedBatch);
  const [filterProgram, setFilterProgram] = useState('');
   const [showEditModal, setShowEditModal] = useState(false);
 
  const {
    students,
    isLoading,
    error,
    searchStudents,
    fetchStudents,
    batchNames,
    programs,
    statistics,
  } = useStudents();

  const handleSearch = () => {
    searchStudents(searchInput);
  };

  const handleViewDetails = (student: any) => {
    onViewProfile(student);
  };

const editStudent = (std: any) => {
    setSelectedStudent(std);
    setShowEditModal(true);
  };

  // Apply filters
  let filteredStudents = students;
  if (filterStatus !== 'all') {
    filteredStudents = filteredStudents.filter(s => 
      filterStatus === 'active' ? s.User?.isActive : !s.User?.isActive
    );
  }
  if (filterBatch) {
    filteredStudents = filteredStudents.filter((s) => {
      return s.BatchModel?.batchName === filterBatch;
    });
  }
  if (filterProgram) {
    filteredStudents = filteredStudents.filter((s: any) => s.BatchModel?.ProgramModel?.programName === filterProgram);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-2">Error loading students</p>
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={() => fetchStudents(true)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, SAP ID, or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FDB813] outline-none transition-all"
            />
          </div>
          
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all"
          >
            Search
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
          <select
            title="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            title="Batch"
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="">All Batches</option>
            {batchNames.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>

          <select
            title="Program"
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="">All Programs</option>
            {programs.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Academic Info</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No students found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                          <User size={18} className="text-[#1e3a5f] group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-black text-[#1e3a5f] text-sm uppercase tracking-tight">
                            {student.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            SAP ID: {student.User?.sapid}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          <p className="text-[11px] text-slate-600">{student.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          <p className="text-[11px] text-slate-600">{student.contactNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={12} className="text-slate-400" />
                          <p className="text-[11px] font-bold text-[#1e3a5f]">
                            {student.BatchModel?.ProgramModel?.programName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-slate-400" />
                          <p className="text-[9px] text-slate-400">
                            {student.BatchModel?.batchName} {student.BatchModel?.batchYear} | Sem {student.currentSemester}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        student.User?.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.User?.isActive ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        {student.User?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>editStudent(student)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#FDB813] hover:bg-slate-100 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={showDetailsModal}
        student={selectedStudent}
        onClose={() => setShowDetailsModal(false)}
      />
      <EditStudent
          isOpen={showEditModal}
          student={selectedStudent}  // Change from advisor to student
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchStudents(true);
          }}
        />
    </div>
  );
}