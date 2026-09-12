// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useState } from 'react';
// import { StudentProfile } from '../StudentDetails/StudentProfile';
// import { AdvisoryLogs } from './AdvisoryLogs';
// import { SessionPickerModal } from '../CourseRecommendation/sessionPickerModal';
// import { GeneratingRecommendationsScreen } from '../CourseRecommendation/generationRecommendationScreen';
// import SmartAdvisory from '../CourseRecommendation/smartAdvisory';
// import { useRecommendations } from '../../src/hooks/recommendationHook/useCourseRecommendationHook';

// type Screen = 'profile' | 'generating' | 'advisory' | 'logs';
 
// interface AdvisoryParentScreenProps {
//   student: any;           // your Student type
//   onBack: () => void;     // goes back to student list
//   isAdvisor: boolean;
//   onViewTranscript: () => void;
// }
 
// export const AdvisoryParentScreen: React.FC<AdvisoryParentScreenProps> = ({
//   student,
//   onBack,
//   isAdvisor,
//   onViewTranscript,
// }) => {
//   const [screen, setScreen] = useState<Screen>('profile');
 
//   const [showSessionPicker, setShowSessionPicker] = useState(false);
//   const [resolvedSession, setResolvedSession] = useState<{
//     type: string;
//     year: number;
//     id: number;
//   } | null>(null);
 
//   // ── Hook lives at parent level so state survives screen transitions ─────────
//   const hook = useRecommendations(); // Get all hook values
  
//   // Destructure what you need for specific actions
//   const {
//     generateRecommendations,
//     isGenerating,
//     generateError,
//     resetRecommendations,
//     fetchAdvisoryLogs,
//   } = hook;
 
//   const handleOpenRecommendCourses = () => {
//     resetRecommendations();     // clear any previous session's data
//     setShowSessionPicker(true);
//   };
 
//   const handleSessionConfirm = async (sessionType: string, sessionYear: number) => {
//     setShowSessionPicker(false);
//     setScreen('generating');
 
//     await generateRecommendations(student.id, sessionType, sessionYear);
 
//     // After LLM resolves (success or error), move to advisory screen.
//     setScreen('advisory');
 
//     // Store session context for finalize call
//     setResolvedSession({ type: sessionType, year: sessionYear, id: 0 });
//   };
 
//   // ── Step 6: Advisor sent courses → navigate to logs ────────────────────────
//   const handleSentSuccess = async () => {
//     await fetchAdvisoryLogs();
//     setScreen('logs');
//   };
 
//   // ── Advisory Logs: back goes to profile ────────────────────────────────────
//   const handleLogsBack = () => {
//     setScreen('profile');
//   };
 
//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── Profile ── */}
//       {screen === 'profile' && (
//         <StudentProfile
//           student={student}
//           onBack={onBack}
//           onViewTranscript={onViewTranscript}
//           isAdvisor={isAdvisor}
//           onNavigateToCourseRec={handleOpenRecommendCourses}
//         />
//       )}
 
//       {/* ── Generating (waiting for LLM) ── */}
//       {screen === 'generating' && (
//         <GeneratingRecommendationsScreen
//           studentName={student.studentName}
//           sessionType={resolvedSession?.type ?? ''}
//           sessionYear={resolvedSession?.year ?? new Date().getFullYear()}
//         />
//       )}
 
//       {/* ── SmartAdvisory (AI output, course selection) ── */}
//       {screen === 'advisory' && (
//         <SmartAdvisory
//           studentId={student.id}
//           studentName={student.studentName}
//           sessionId={hook.sessionId ?? 0}
//           selectedBatch={`${student.BatchModel?.batchName}-${student.BatchModel?.batchYear}`}
//           onBack={() => setScreen('profile')}
//           onSentSuccess={handleSentSuccess}
//           // Pass ALL hook values explicitly
//           llmRecommendations={hook.llmRecommendations}
//           allRecommendedCourses={hook.allRecommendedCourses}
//           selectedCourses={hook.selectedCourses}
//           totalSelectedCredits={hook.totalSelectedCredits}
//           allowedCreditHours={hook.allowedCreditHours}
//           isFinalizing={hook.isFinalizing}
//           finalizeError={hook.finalizeError}
//           generateError={generateError}
//           toggleCourseSelection={hook.toggleCourseSelection}
//           isCourseSelected={hook.isCourseSelected}
//           finalizeRecommendations={hook.finalizeRecommendations}
//         />
//       )}
 
//       {/* ── Advisory Logs ── */}
//       {screen === 'logs' && (
//         <AdvisoryLogs onBack={handleLogsBack} />
//       )}
 
//       {/* ── Session Picker Modal (sits above any screen) ── */}
//       <SessionPickerModal
//         isOpen={showSessionPicker}
//         studentName={student?.studentName ?? ''}
//         isGenerating={isGenerating}
//         onConfirm={handleSessionConfirm}
//         onClose={() => setShowSessionPicker(false)}
//       />
//     </>
//   );
// };


/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { StudentProfile } from '../StudentDetails/StudentProfile';
import { AdvisoryLogs } from './AdvisoryLogs';
import SmartAdvisory from '../CourseRecommendation/SmartAdvisory';
import { useRecommendations } from '../../src/hooks/recommendationHook/useCourseRecommendationHook';
import { Loader2, Sparkles, X, Calendar } from 'lucide-react';

type Screen = 'profile' | 'generating' | 'advisory' | 'logs';
 
interface AdvisoryParentScreenProps {
  student: any;
  onBack: () => void;
  isAdvisor: boolean;
  onViewTranscript: () => void;
}
 
export const AdvisoryParentScreen: React.FC<AdvisoryParentScreenProps> = ({
  student,
  onBack,
  isAdvisor,
  onViewTranscript,
}) => {
  const [screen, setScreen] = useState<Screen>('profile');
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [resolvedSession, setResolvedSession] = useState<{
    type: string;
    year: number;
    id: number;
  } | null>(null);
 
  const hook = useRecommendations();
  
  const {
    generateRecommendations,
    isGenerating,
    generateError,
    resetRecommendations,
    fetchAdvisoryLogs,
  } = hook;
 
  const handleOpenRecommendCourses = () => {
    resetRecommendations();
    setShowSessionPicker(true);
  };
 
  const handleSessionConfirm = async (sessionType: string, sessionYear: number) => {
    setShowSessionPicker(false);
    setScreen('generating');
 
    await generateRecommendations(student.id, sessionType, sessionYear);
    setScreen('advisory');
    setResolvedSession({ type: sessionType, year: sessionYear, id: 0 });
  };
 
  const handleSentSuccess = async () => {
    await fetchAdvisoryLogs();
    setScreen('logs');
  };
 
  const handleLogsBack = () => {
    setScreen('profile');
  };
 
  return (
    <>
      {screen === 'profile' && (
        <StudentProfile
          student={student}
          onBack={onBack}
          onViewTranscript={onViewTranscript}
          isAdvisor={isAdvisor}
          onNavigateToCourseRec={handleOpenRecommendCourses}
        />
      )}
 
      {screen === 'generating' && (
        <div className="w-full flex flex-col items-center justify-center py-28 px-4 bg-gray-50 min-h-[60vh] rounded-2xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm animate-pulse">
            <Sparkles size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight mb-2">
            Generating Smart Recommendations
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center max-w-sm mb-6">
            Analyzing academic history for {student?.studentName || 'the student'} ({resolvedSession?.type} {resolvedSession?.year})...
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
            <Loader2 size={16} className="animate-spin text-amber-500" />
            Processing AI Advisory...
          </div>
        </div>
      )}
 
      {screen === 'advisory' && (
        <SmartAdvisory
          studentId={student.id}
          studentName={student.studentName}
          sessionId={hook.sessionId ?? 0}
          selectedBatch={`${student.BatchModel?.batchName}-${student.BatchModel?.batchYear}`}
          onBack={() => setScreen('profile')}
          onSentSuccess={handleSentSuccess}
          llmRecommendations={hook.llmRecommendations}
          allRecommendedCourses={hook.allRecommendedCourses}
          selectedCourses={hook.selectedCourses}
          totalSelectedCredits={hook.totalSelectedCredits}
          allowedCreditHours={hook.allowedCreditHours}
          isFinalizing={hook.isFinalizing}
          finalizeError={hook.finalizeError}
          generateError={generateError}
          toggleCourseSelection={hook.toggleCourseSelection}
          isCourseSelected={hook.isCourseSelected}
          finalizeRecommendations={hook.finalizeRecommendations}
        />
      )}
 
      {screen === 'logs' && (
        <AdvisoryLogs onBack={handleLogsBack} />
      )}

      {/* Inline Session Picker Modal */}
      <SessionPickerModal
        isOpen={showSessionPicker}
        studentName={student?.studentName ?? ''}
        isGenerating={isGenerating}
        onConfirm={handleSessionConfirm}
        onClose={() => setShowSessionPicker(false)}
      />
    </>
  );
};

// ── Inline Session Picker Component ──
function SessionPickerModal({ isOpen, studentName, isGenerating, onConfirm, onClose }: any) {
  const [sessionType, setSessionType] = useState('Fall');
  const [sessionYear, setSessionYear] = useState(new Date().getFullYear());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-black text-[#1e3a5f] text-base uppercase tracking-tight">Select Academic Session</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{studentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Session Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Fall', 'Spring', 'Summer'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSessionType(type)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase transition-all border ${
                    sessionType === type
                      ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                      : 'bg-gray-50 text-slate-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Session Year</label>
            <input
              type="number"
              value={sessionYear}
              onChange={(e) => setSessionYear(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-slate-600 text-xs font-black uppercase rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onConfirm(sessionType, sessionYear)}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}