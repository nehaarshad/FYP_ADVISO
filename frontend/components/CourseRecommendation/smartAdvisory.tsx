/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  ArrowLeft, CheckCircle, Layers, Target, BookOpen,
  Clock, Loader2, AlertCircle, Zap, Info
} from 'lucide-react';
import { SuggestedCourse } from '../../src/models/systemSuggestedCoursesModel'

// Priority config — maps LLM priority string to visual treatment
const PRIORITY_CONFIG = {
  critical: { label: 'Critical',  bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500',    border: 'border-red-200'   },
  high:     { label: 'High',      bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500', border: 'border-orange-200'},
  medium:   { label: 'Medium',    bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400',   border: 'border-blue-200'  },
  low:      { label: 'Low',       bg: 'bg-slate-50',  text: 'text-slate-500',  dot: 'bg-slate-400',  border: 'border-slate-200' },
};
 
interface SmartAdvisoryProps {
  studentId: number;
  studentName: string;
  sessionId: number;         
  selectedBatch: string;
  onBack: () => void;
  onSentSuccess: () => void;
  // Hook values passed from parent
  llmRecommendations: any;
  allRecommendedCourses: any[];
  selectedCourses: any[];
  totalSelectedCredits: number;
  allowedCreditHours: number | null;
  isFinalizing: boolean;
  finalizeError: string | null;
  generateError: string | null;
  toggleCourseSelection: (course: any) => void;
isCourseSelected: (courseId: number, courseName: string) => boolean;
  finalizeRecommendations: (studentId: number, sessionId: number) => Promise<boolean>;
}

export default function SmartAdvisory({
  studentId,
  studentName,
  sessionId,
  selectedBatch,
  onBack,
  onSentSuccess,
  // Hook props
  llmRecommendations,
  allRecommendedCourses,
  selectedCourses,
  totalSelectedCredits,
  allowedCreditHours,
  isFinalizing,
  finalizeError,
  generateError,
  toggleCourseSelection,
  isCourseSelected,
  finalizeRecommendations,
}: SmartAdvisoryProps) {
  
  const [localError, setLocalError] = useState<string | null>(null);
  
  // ── Finalize & send with validation ────────────────────────────────────────
  const handleSendToStudent = async () => {
    // Clear any previous local errors
    setLocalError(null);
    
    // Validation checks
    if (selectedCourses.length === 0) {
      setLocalError("Please select at least one course to send.");
      return;
    }
    
    if (!studentId) {
      setLocalError("Student ID is missing. Please go back and try again.");
      return;
    }
    
    if (!sessionId || sessionId === 0) {
      setLocalError("Session ID is missing. Please go back and select a session.");
      return;
    }
    
    try {
      const success = await finalizeRecommendations(studentId, sessionId);
      if (success) {
        onSentSuccess();
      }
    } catch (err: any) {
      setLocalError(err.message || "Failed to send recommendations. Please try again.");
    }
  };
 
  // ── Canary states ──────────────────────────────────────────────────────────
  if (generateError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 px-4">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">Generation Failed</p>
        <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs mb-6">{generateError}</p>
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-[#1e3a5f] transition-colors">
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }
 
  if (!llmRecommendations || allRecommendedCourses.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-amber-400" />
      </div>
    );
  }
 
  // Credit guard — warn but don't hard block (advisor decision)
  const isOverCredit = allowedCreditHours !== null && totalSelectedCredits > allowedCreditHours;
 
  return (
    <div className="w-full space-y-6 px-2 sm:px-4 md:px-0 animate-in fade-in duration-500">
 
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
        <button
          title='back'
          onClick={onBack}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit"
        >
          <ArrowLeft size={20} />
        </button>
 
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">
            System <span className="text-amber-500">Recommendations</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            {studentName} · Batch: {selectedBatch}
          </p>
        </div>
 
        {/* Credit summary bar */}
        <div className="flex flex-wrap gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase ${
            isOverCredit ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-600'
          }`}>
            <Zap size={12} />
            Selected: {totalSelectedCredits} / {allowedCreditHours ?? '—'} Credit Hrs
            {isOverCredit && ' ⚠ Over Limit'}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border-2 border-amber-100 text-[10px] font-black uppercase text-amber-700">
            {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>
 
      {/* ── LLM explanation strip ── */}
      {llmRecommendations.detailedExplanation && (
        <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-2xl p-4 flex gap-3">
          <Info size={16} className="text-[#1e3a5f] shrink-0 mt-0.5" />
          <p className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-relaxed">
            {llmRecommendations.detailedExplanation}
          </p>
        </div>
      )}
 
      {/* ── Course List ── */}
      <div className="space-y-4">
        {allRecommendedCourses.map((course: SuggestedCourse & { priority?: string }) => {
          const isSelected = isCourseSelected(course.courseId, course.courseName);
          const isAvailable = course.isOffered === true && course.actionRequired !== 'REQUEST_SPECIAL_OFFERING';
          const priority = (course.priority || 'medium') as keyof typeof PRIORITY_CONFIG;
          const pConf = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
 
          return (
            <div
              key={`${course.courseId}-${course.courseName}`}
              onClick={() => {
                // Only allow selection if course is available
                if (isAvailable) {
                  toggleCourseSelection(course);
                }
              }}
              className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all ${
                !isAvailable
                  ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'border-amber-500 bg-amber-50/10 shadow-lg scale-[1.01] cursor-pointer'
                  : 'border-slate-100 bg-white hover:border-amber-200 cursor-pointer'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
 
                {/* Checkbox - visually show state but don't allow click separately */}
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                  isSelected && isAvailable
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : !isAvailable
                    ? 'bg-slate-100 border-slate-200 text-slate-300'
                    : 'border-slate-200 text-slate-200'
                }`}>
                  <CheckCircle size={20} className="md:w-6 md:h-6" />
                </div>
 
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-lg text-[8px] md:text-[9px] font-black text-slate-600 uppercase">
                      <Layers size={10} /> {course.category}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase border ${pConf.bg} ${pConf.text} ${pConf.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pConf.dot}`} />
                      {pConf.label} Priority
                    </span>
                    {course.actionRequired && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-lg text-[8px] md:text-[9px] font-black text-blue-600 uppercase border border-blue-100">
                        <Target size={10} />
                        {course.actionRequired.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
 
                  <h3 className="text-base md:text-lg font-black text-[#1e3a5f] uppercase leading-tight">
                    {course.courseName}
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    {course.credits} Credit Hours
                    {course.offeredProgram && ` · ${course.offeredProgram}`}
                    {course.timeSlot && ` · ${course.timeSlot}`}
                  </p>
 
                  {/* Reason box */}
                  <div className="mt-3 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[8px] md:text-[9px] font-black text-[#1e3a5f] uppercase mb-1 flex items-center gap-1">
                      <BookOpen size={10} /> System Reasoning:
                    </p>
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-relaxed">
                      {course.reason} 
                    </p>
                  </div>
                </div>
 
                {/* Status badge */}
                <div className="md:text-right shrink-0">
                  {!course.isOffered ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-black text-[9px] uppercase bg-slate-100 px-3 md:px-4 py-2 rounded-xl">
                      <Clock size={12} /> Not Offered
                    </div>
                  ) : course.actionRequired === 'REQUEST_SPECIAL_OFFERING' ? (
                    <div className="flex items-center gap-2 text-amber-600 font-black text-[9px] uppercase bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                      <Clock size={12} /> Request Special
                    </div>
                  ) : (
                    <div className="text-green-600 font-black text-[9px] uppercase bg-green-50 px-3 md:px-4 py-2 rounded-xl text-center border border-green-100">
                      Eligible
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
 
      {/* ── Special Requests section ── */}
      {llmRecommendations.specialRequests?.length > 0 && (
        <div className="bg-amber-50 rounded-[1.8rem] p-6 border border-amber-100">
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3">
            Special Offering Requests
          </p>
          <div className="space-y-3">
            {llmRecommendations.specialRequests.map((req: any, i: any) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-amber-100">
                <p className="text-[10px] font-black text-[#1e3a5f] uppercase">{req.courseName}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">{req.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* ── Error Display ── */}
      {(finalizeError || localError) && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-[10px] font-bold text-red-600">{finalizeError || localError}</p>
        </div>
      )}
 
      {/* ── Finalize CTA ── */}
      <div className="bg-[#1e3a5f] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-b-[6px] border-amber-400">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl uppercase tracking-tighter font-black">
            Finalize Recommendation
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            {selectedCourses.length === 0
              ? 'Select courses above to continue'
              : `Sending ${selectedCourses.length} course${selectedCourses.length !== 1 ? 's' : ''} · ${totalSelectedCredits} credit hrs`
            }
          </p>
          {isOverCredit && (
            <p className="text-red-400 text-[9px] font-black uppercase mt-1">
              ⚠ Over allowed credit limit — review selection
            </p>
          )}
        </div>
 
        <button
          onClick={handleSendToStudent}
          disabled={selectedCourses.length === 0 || isFinalizing}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-4 bg-amber-500 text-slate-900 text-[10px] md:text-[11px] font-black uppercase rounded-xl md:rounded-2xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
        >
          {isFinalizing ? (
            <><Loader2 size={14} className="animate-spin" /> Sending...</>
          ) : (
            'Send Advice to Student'
          )}
        </button>
      </div>
    </div>
  );
}