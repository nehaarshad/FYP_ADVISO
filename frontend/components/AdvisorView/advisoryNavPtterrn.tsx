/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { StudentProfile } from '../StudentDetails/StudentProfile';
import { AdvisoryLogs } from './AdvisoryLogs';
import { SessionPickerModal } from '../CourseRecommendation/sessionPickerModal';
import { GeneratingRecommendationsScreen } from '../CourseRecommendation/generationRecommendationScreen';
import SmartAdvisory from '../CourseRecommendation/smartAdvisory';
import { useRecommendations } from '../../src/hooks/recommendationHook/useCourseRecommendationHook';

type Screen = 'profile' | 'generating' | 'advisory' | 'logs';
 
interface AdvisoryParentScreenProps {
  student: any;           // your Student type
  onBack: () => void;     // goes back to student list
  isAdvisor: boolean;
  onViewTranscript: () => void;
}
 
export const AdvisoryParentScreen: React.FC<AdvisoryParentScreenProps> = ({
  student,
  onBack,
  isAdvisor,
  onViewTranscript,
}) => {
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('profile');
 
  // ── Session picker modal state ──────────────────────────────────────────────
  const [showSessionPicker, setShowSessionPicker] = useState(false);
 
  // ── Resolved session (set when advisor confirms session picker) ─────────────
  const [resolvedSession, setResolvedSession] = useState<{
    type: string;
    year: number;
    id: number;
  } | null>(null);
 
  // ── Hook lives at parent level so state survives screen transitions ─────────
  const hook = useRecommendations(); // Get all hook values
  
  // Destructure what you need for specific actions
  const {
    generateRecommendations,
    isGenerating,
    generateError,
    resetRecommendations,
    fetchAdvisoryLogs,
  } = hook;
 
  // ── Step 1: Advisor clicks "Recommend Courses" on StudentProfile ────────────
  const handleOpenRecommendCourses = () => {
    resetRecommendations();     // clear any previous session's data
    setShowSessionPicker(true);
  };
 
  // ── Step 2: Advisor confirms session in modal → trigger LLM ────────────────
  const handleSessionConfirm = async (sessionType: string, sessionYear: number) => {
    setShowSessionPicker(false);
    setScreen('generating');
 
    await generateRecommendations(student.id, sessionType, sessionYear);
 
    // After LLM resolves (success or error), move to advisory screen.
    setScreen('advisory');
 
    // Store session context for finalize call
    setResolvedSession({ type: sessionType, year: sessionYear, id: 0 });
  };
 
  // ── Step 6: Advisor sent courses → navigate to logs ────────────────────────
  const handleSentSuccess = async () => {
    await fetchAdvisoryLogs();
    setScreen('logs');
  };
 
  // ── Advisory Logs: back goes to profile ────────────────────────────────────
  const handleLogsBack = () => {
    setScreen('profile');
  };
 
  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Profile ── */}
      {screen === 'profile' && (
        <StudentProfile
          student={student}
          onBack={onBack}
          onViewTranscript={onViewTranscript}
          isAdvisor={isAdvisor}
          onNavigateToCourseRec={handleOpenRecommendCourses}
        />
      )}
 
      {/* ── Generating (waiting for LLM) ── */}
      {screen === 'generating' && (
        <GeneratingRecommendationsScreen
          studentName={student.studentName}
          sessionType={resolvedSession?.type ?? ''}
          sessionYear={resolvedSession?.year ?? new Date().getFullYear()}
        />
      )}
 
      {/* ── SmartAdvisory (AI output, course selection) ── */}
      {screen === 'advisory' && (
        <SmartAdvisory
          studentId={student.id}
          studentName={student.studentName}
          sessionId={hook.sessionId ?? 0}
          selectedBatch={`${student.BatchModel?.batchName}-${student.BatchModel?.batchYear}`}
          onBack={() => setScreen('profile')}
          onSentSuccess={handleSentSuccess}
          // Pass ALL hook values explicitly
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
 
      {/* ── Advisory Logs ── */}
      {screen === 'logs' && (
        <AdvisoryLogs onBack={handleLogsBack} />
      )}
 
      {/* ── Session Picker Modal (sits above any screen) ── */}
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