import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Link2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Roadmap, AssignData } from './types';

interface AssignBatchModalProps {
  isOpen: boolean;
  roadmap: Roadmap | null;
  programName: string;
  isAssigning: boolean;
  onAssign: (data: AssignData) => Promise<{ success: boolean; message?: string; error?: string }>;
  onClose: () => void;
}

export function AssignBatchModal({ 
  isOpen, 
  roadmap, 
  programName, 
  isAssigning, 
  onAssign,
  onClose 
}: AssignBatchModalProps) {
  const [assignBatchName, setAssignBatchName] = useState('');
  const [assignBatchYear, setAssignBatchYear] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async () => {
    if (!roadmap || !assignBatchName || !assignBatchYear) {
      alert('Please fill all fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await onAssign({
        roadmapId: roadmap.id,
        batchName: assignBatchName,
        batchYear: assignBatchYear,
        programName
      });
      
      if (result.success) {
        // Show success message
        setStatusMessage(result.message || `✅ Successfully assigned "${roadmap.versionName}" to ${assignBatchName} ${assignBatchYear}!`);
        setShowSuccess(true);
        
        // Reset form
        setAssignBatchName('');
        setAssignBatchYear('');
        
        // Auto close after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setIsProcessing(false);
          onClose();
        }, 3000);
      } else {
        // Show error message
        setStatusMessage(result.error || '❌ Failed to assign roadmap. Please try again.');
        setShowError(true);
        
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setShowError(false);
          setIsProcessing(false);
        }, 3000);
      }
    } catch (error) {
      // Handle unexpected errors
      setStatusMessage('❌ An unexpected error occurred. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setIsProcessing(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    if (!isAssigning && !isProcessing) {
      setShowSuccess(false);
      setShowError(false);
      setAssignBatchName('');
      setAssignBatchYear('');
      onClose();
    }
  };

  const isDisabled = isAssigning || isProcessing || showSuccess || showError;

  return (
    <>
      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && roadmap && !showSuccess && !showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase italic text-[#1e3a5f]">
                    Assign to Batch
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {roadmap.versionName}
                  </p>
                </div>
                <button
                  title="close-assign-modal"
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  disabled={isDisabled}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Batch Name *
                  </label>
                  <select
                    title="assign-batch"
                    value={assignBatchName}
                    onChange={(e) => setAssignBatchName(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                    disabled={isDisabled}
                    required
                  >
                    <option value="">Select Batch</option>
                    <option value="FALL">FALL</option>
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Batch Year *
                  </label>
                  <input
                    type="text"
                    value={assignBatchYear}
                    onChange={(e) => setAssignBatchYear(e.target.value)}
                    placeholder="e.g., 2024"
                    className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mt-4">
                  <p className="text-xs text-slate-600">
                    <span className="font-bold">Program:</span> {programName}
                  </p>
                  <p className="text-xs text-slate-600">
                    <span className="font-bold">Roadmap:</span> {roadmap.versionName}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAssign}
                    disabled={isDisabled || !assignBatchName || !assignBatchYear}
                    className="flex-1 py-4 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {(isAssigning || isProcessing) ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Link2 size={16} />
                        Assign to Batch
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={isDisabled}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Modal - Centered */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
              >
                <CheckCircle size={72} className="text-green-500 mb-4" />
              </motion.div>
              <h4 className="text-2xl font-black text-green-600 mb-2">Success!</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {statusMessage}
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="mt-6 px-8 py-3 bg-green-500 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-green-600 transition-all"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Modal - Centered */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
              >
                <AlertCircle size={72} className="text-red-500 mb-4" />
              </motion.div>
              <h4 className="text-2xl font-black text-red-600 mb-2">Error</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {statusMessage}
              </p>
              <button
                onClick={() => {
                  setShowError(false);
                }}
                className="mt-6 px-8 py-3 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-red-600 transition-all"
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}