
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck,  } from 'lucide-react';

interface AdvisorDetailsModalProps {
  isOpen: boolean;
  advisor: any;
  onClose: () => void;
}

export function AdvisorDetailsModal({ isOpen, advisor, onClose, }: AdvisorDetailsModalProps) {
  if (!isOpen || !advisor) return null;


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
                  <ShieldCheck size={24} className="text-[#FDB813]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1e3a5f] uppercase italic">
                    {advisor.advisorName}
                  </h3>
                  <p className="text-[10px] text-slate-400">Advisor Profile</p>
                </div>
              </div>
              <button
                title="Close"
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
                  <InfoRow label="Full Name" value={advisor.advisorName} />
                  <InfoRow label="SAP ID" value={advisor.User?.sapid} />
                  <InfoRow label="Gender" value={advisor.gender} />
                  <InfoRow label="Email" value={advisor.email} />
                  <InfoRow label="Contact Number" value={advisor.contactNumber} />
                  <InfoRow 
                    label="Status" 
                    value={advisor.User?.isActive ? 'Active' : 'Inactive'}
                    valueClassName={advisor.User?.isActive ? 'text-green-600' : 'text-red-600'}
                  />
                </div>
              </div>

              {/* Batch Assignment */}
              {advisor.BatchAssignments && advisor.BatchAssignments.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                    Batch Assignment
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow 
                        label="Batch" 
                        value={`${advisor.BatchAssignments[0]?.BatchModel?.batchName} ${advisor.BatchAssignments[0]?.BatchModel?.batchYear}`}
                      />
                      <InfoRow 
                        label="Program" 
                        value={advisor.BatchAssignments[0]?.BatchModel?.ProgramModel?.programName}
                      />
                      <InfoRow 
                        label="Start Date" 
                        value={advisor.BatchAssignments[0]?.startDate ? new Date(advisor.BatchAssignments[0].startDate).toLocaleDateString() : 'N/A'}
                      />
                      <InfoRow 
                        label="Currently Advised" 
                        value={advisor.BatchAssignments[0]?.isCurrentlyAdvised ? 'Yes' : 'No'}
                      />
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
                  <InfoRow label="User ID" value={advisor.User?.id} />
                  <InfoRow 
                    label="Account Created" 
                    value={advisor.createdAt ? new Date(advisor.createdAt).toLocaleDateString() : 'N/A'} 
                  />
                  <InfoRow 
                    label="Last Updated" 
                    value={advisor.updatedAt ? new Date(advisor.updatedAt).toLocaleDateString() : 'N/A'} 
                  />
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
function InfoRow({ label, value, valueClassName = "text-slate-900" }: { label: string; value: any; valueClassName?: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold ${valueClassName}`}>{value || 'N/A'}</p>
    </div>
  );
}