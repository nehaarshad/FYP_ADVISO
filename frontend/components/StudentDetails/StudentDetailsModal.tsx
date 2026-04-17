// components/students/StudentDetailsModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, BookOpen, GraduationCap, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

interface StudentDetailsModalProps {
  isOpen: boolean;
  student: any;
  onClose: () => void;
}

export function StudentDetailsModal({ isOpen, student, onClose }: StudentDetailsModalProps) {
  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                  <GraduationCap size={24} className="text-[#FDB813]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1e3a5f] uppercase italic">
                    {student.studentName}
                  </h3>
                  <p className="text-[10px] text-slate-400">Student Profile</p>
                </div>
              </div>
              <button
               title='btn'
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Full Name" value={student.studentName} />
                  <InfoRow label="SAP ID" value={student.User?.sapid} />
                  <InfoRow label="Registration No" value={student.registrationNumber || 'N/A'} />
                  <InfoRow label="Email" value={student.email} />
                  <InfoRow label="Contact Number" value={student.contactNumber || 'N/A'} />
                  <InfoRow label="CNIC" value={student.cnic || 'N/A'} />
                  <InfoRow label="Date of Birth" value={student.dateOfBirth || 'N/A'} />
                  <InfoRow 
                    label="Status" 
                    value={student.User?.isActive ? 'Active' : 'Inactive'}
                    valueClassName={student.User?.isActive ? 'text-green-600' : 'text-red-600'}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                  Academic Information
                </h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow 
                      label="Program" 
                      value={student.BatchModel?.ProgramModel?.programName || 'N/A'}
                    />
                    <InfoRow 
                      label="Batch" 
                      value={`${student.BatchModel?.batchName || ''} ${student.BatchModel?.batchYear || ''}`}
                    />
                    <InfoRow 
                      label="Current Semester" 
                      value={student.currentSemester || 'N/A'}
                    />
                    <InfoRow 
                      label="Student Status" 
                      value={student.StudentStatus?.currentStatus || 'N/A'}
                    />
                    {student.StudentStatus?.reason && (
                      <InfoRow 
                        label="Status Reason" 
                        value={student.StudentStatus.reason}
                        className="col-span-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              {student.StudentGuardians && student.StudentGuardians.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                    Guardian Information
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow label="Guardian Name" value={student.StudentGuardians[0]?.fullName || 'N/A'} />
                      <InfoRow label="Guardian Email" value={student.StudentGuardians[0]?.email || 'N/A'} />
                      <InfoRow label="Guardian Contact" value={student.StudentGuardians[0]?.contactNumber || 'N/A'} />
                    </div>
                  </div>
                </div>
              )}

              {/* System Information */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                  System Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="User ID" value={student.User?.id} />
                  <InfoRow label="Account Created" value={new Date(student.createdAt).toLocaleDateString()} />
                  <InfoRow label="Last Updated" value={new Date(student.updatedAt).toLocaleDateString()} />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper Component
function InfoRow({ label, value, valueClassName = "text-slate-900", className = "" }: { label: string; value: any; valueClassName?: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold ${valueClassName}`}>{value || 'N/A'}</p>
    </div>
  );
}