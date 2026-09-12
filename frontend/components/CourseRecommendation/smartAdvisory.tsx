/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  ArrowLeft, CheckCircle, Layers, Target, BookOpen,
  Clock, Loader2, AlertCircle, Info, ShieldAlert, ChevronDown, ChevronUp
} from 'lucide-react';

interface SmartAdvisoryProps {
  studentId: number;
  studentName: string;
  sessionId: number;         
  selectedBatch: string;
  onBack: () => void;
  onSentSuccess: () => void;
  llmRecommendations: any;
  allRecommendedCourses: any[];
  selectedCourses: any[];
  totalSelectedCredits: number;
  allowedCreditHours: number | null;
  isFinalizing: boolean;
  finalizeError: string | null;
  generateError: string | null;
  toggleCourseSelection: (course: any) => void;
  isCourseSelected: (courseId: number | null, courseName: string) => boolean;
  finalizeRecommendations: (studentId: number, sessionId: number) => Promise<boolean>;
}

export default function SmartAdvisory({
  studentId,
  studentName,
  sessionId,
  selectedBatch,
  onBack,
  onSentSuccess,
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
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  const [selectedElectiveOptions, setSelectedElectiveOptions] = useState<{ [key: string]: any }>({});
  const [openElectiveDropdowns, setOpenElectiveDropdowns] = useState<{ [key: string]: boolean }>({});
  
  const toggleCourseExpand = (index: number) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectElectiveOption = (courseName: string, option: any) => {
    setSelectedElectiveOptions(prev => ({ ...prev, [courseName]: option }));
    setOpenElectiveDropdowns(prev => ({ ...prev, [courseName]: false }));
  };

  const toggleDropdown = (courseName: string) => {
    setOpenElectiveDropdowns(prev => ({ ...prev, [courseName]: !prev[courseName] }));
  };
  
  const handleSendToStudent = async () => {
    setLocalError(null);
    
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
 
  const isOverCredit = allowedCreditHours !== null && totalSelectedCredits > allowedCreditHours;

  const groupedCourses = {
    critical: llmRecommendations.recommendations?.critical || [],
    high: llmRecommendations.recommendations?.high || [],
    medium: llmRecommendations.recommendations?.medium || [],
    low: llmRecommendations.recommendations?.low || [],
  };

  const summary = llmRecommendations.summary || {
    priorityBreakdown: {
      critical: groupedCourses.critical.length,
      high: groupedCourses.high.length,
      medium: groupedCourses.medium.length,
      low: groupedCourses.low.length
    },
    totalCoursesRecommended: allRecommendedCourses.length
  };
 
  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 space-y-8 bg-gray-50 min-h-screen rounded-2xl shadow-sm animate-in fade-in duration-500">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              title="back"
              onClick={onBack}
              className="p-2 hover:bg-slate-100 bg-white shadow-sm rounded-full text-black transition-colors w-fit mb-3 border border-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
              <BookOpen className="text-blue-600" /> System <span className="text-amber-500">Recommendations</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium uppercase tracking-widest">
              {studentName} · Batch: {selectedBatch} | Session ID: <span className="font-medium text-gray-700">{sessionId}</span> | Student ID: <span className="font-medium text-gray-700">{studentId}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
              isOverCredit ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-900'
            }`}>
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total Credits</p>
                <p className="text-lg font-bold">
                  {totalSelectedCredits} / <span className="text-blue-500">{allowedCreditHours ?? '—'} Allowed</span>
                  {isOverCredit && <span className="text-xs text-red-500 block font-black">⚠ Over Limit</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase">
              {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        {llmRecommendations.detailedExplanation && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="font-bold text-xs md:text-sm leading-relaxed">{llmRecommendations.detailedExplanation}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-red-600 uppercase">Critical Priority</span>
            <p className="text-2xl font-bold text-red-700 mt-1">{summary.priorityBreakdown?.critical ?? groupedCourses.critical.length}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-orange-600 uppercase">High Priority</span>
            <p className="text-2xl font-bold text-orange-700 mt-1">{summary.priorityBreakdown?.high ?? groupedCourses.high.length}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-yellow-600 uppercase">Medium Priority</span>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{summary.priorityBreakdown?.medium ?? groupedCourses.medium.length}</p>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-green-600 uppercase">Total Recommended</span>
            <p className="text-2xl font-bold text-green-700 mt-1">{summary.totalCoursesRecommended ?? allRecommendedCourses.length}</p>
          </div>
        </div>
      </div>
 
      <div className="space-y-6">
        <CourseSection 
          title="Critical Priority (Retakes & Core Roadmaps)" 
          courses={groupedCourses.critical} 
          badgeColor="bg-red-100 text-red-700 border-red-200" 
          selectedElectiveOptions={selectedElectiveOptions} 
          openDropdowns={openElectiveDropdowns} 
          toggleDropdown={toggleDropdown} 
          selectOption={handleSelectElectiveOption}
          isCourseSelected={isCourseSelected}
          toggleCourseSelection={toggleCourseSelection}
          expandedCourses={expandedCourses}
          toggleCourseExpand={toggleCourseExpand}
        />
        <CourseSection 
          title="High Priority Courses" 
          courses={groupedCourses.high} 
          badgeColor="bg-orange-100 text-orange-700 border-orange-200" 
          selectedElectiveOptions={selectedElectiveOptions} 
          openDropdowns={openElectiveDropdowns} 
          toggleDropdown={toggleDropdown} 
          selectOption={handleSelectElectiveOption}
          isCourseSelected={isCourseSelected}
          toggleCourseSelection={toggleCourseSelection}
          expandedCourses={expandedCourses}
          toggleCourseExpand={toggleCourseExpand}
        />
        <CourseSection 
          title="Medium Priority / Electives & Clashes" 
          courses={groupedCourses.medium} 
          badgeColor="bg-yellow-100 text-yellow-800 border-yellow-200" 
          selectedElectiveOptions={selectedElectiveOptions} 
          openDropdowns={openElectiveDropdowns} 
          toggleDropdown={toggleDropdown} 
          selectOption={handleSelectElectiveOption}
          isCourseSelected={isCourseSelected}
          toggleCourseSelection={toggleCourseSelection}
          expandedCourses={expandedCourses}
          toggleCourseExpand={toggleCourseExpand}
        />
        {groupedCourses.low.length > 0 && (
          <CourseSection 
            title="Low Priority Courses" 
            courses={groupedCourses.low} 
            badgeColor="bg-green-100 text-green-700 border-green-200" 
            selectedElectiveOptions={selectedElectiveOptions} 
            openDropdowns={openElectiveDropdowns} 
            toggleDropdown={toggleDropdown} 
            selectOption={handleSelectElectiveOption}
            isCourseSelected={isCourseSelected}
            toggleCourseSelection={toggleCourseSelection}
            expandedCourses={expandedCourses}
            toggleCourseExpand={toggleCourseExpand}
          />
        )}
      </div>
 
      {llmRecommendations.specialRequests?.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">
            Special Offering Requests
          </p>
          <div className="space-y-3">
            {llmRecommendations.specialRequests.map((req: any, i: any) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-bold text-[#1e3a5f] uppercase">{req.courseName}</p>
                <p className="text-xs text-slate-600 font-medium mt-1">{req.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {(finalizeError || localError) && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs font-bold text-red-600">{finalizeError || localError}</p>
        </div>
      )}
 
      <div className="bg-[#1e3a5f] p-6 md:p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-b-4 border-amber-400">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl uppercase tracking-tighter font-black">
            Finalize Recommendation
          </h3>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1">
            {selectedCourses.length === 0
              ? 'Select courses above to continue'
              : `Sending ${selectedCourses.length} course${selectedCourses.length !== 1 ? 's' : ''} · ${totalSelectedCredits} credit hrs`
            }
          </p>
          {isOverCredit && (
            <p className="text-red-400 text-xs font-bold uppercase mt-1">
              ⚠ Over allowed credit limit — review selection
            </p>
          )}
        </div>
 
        <button
          onClick={handleSendToStudent}
          disabled={selectedCourses.length === 0 || isFinalizing}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-4 bg-amber-500 text-slate-900 text-xs font-black uppercase rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
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

function CourseSection({ 
  title, 
  courses, 
  badgeColor, 
  selectedElectiveOptions, 
  openDropdowns, 
  toggleDropdown, 
  selectOption,
  isCourseSelected,
  toggleCourseSelection,
  expandedCourses,
  toggleCourseExpand
}: any) {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">{title}</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${badgeColor}`}>
          {courses.length} Course{courses.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course: any, idx: number) => {
          const isSelected = isCourseSelected(course.courseId, course.courseName);
          const isAvailable = course.isOffered === true && course.actionRequired !== 'REQUEST_SPECIAL_OFFERING';
          const isClashCourse = course.isNotSuggested || course.notSuggestedReason === 'TIME_CLASH';

          if (isClashCourse) {
            return (
              <ClashCourseCard
                key={`clash-${course.courseId ?? idx}-${course.courseName}`}
                course={course}
                isExpanded={expandedCourses.has(idx)}
                onToggle={() => toggleCourseExpand(idx)}
              />
            );
          }

          const currentSelectedElective = selectedElectiveOptions[course.courseName] || course.categorizedOptions?.bestMatch;
          const isOpen = openDropdowns[course.courseName] || false;

          return (
            <div 
              key={`${course.courseId}-${course.courseName}-${idx}`} 
              onClick={() => {
                if (isAvailable) {
                  toggleCourseSelection(course);
                }
              }}
              className={`border-2 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all ${
                !isAvailable
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'border-amber-500 bg-amber-50/20 shadow-md cursor-pointer'
                  : 'border-gray-200 bg-white hover:border-amber-300 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                  isSelected && isAvailable
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : !isAvailable
                    ? 'bg-gray-100 border-gray-200 text-gray-300'
                    : 'border-gray-200 text-gray-300'
                }`}>
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-bold text-gray-600 uppercase">
                      <Layers size={10} /> {course.category}
                    </span>
                    {course.actionRequired && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-md text-[9px] font-bold text-blue-600 uppercase border border-blue-100">
                        <Target size={10} />
                        {course.actionRequired.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base uppercase leading-tight">{course.courseName}</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
                  {course.credits} Credits
                </span>
              </div>

              <div className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600 flex items-start gap-2">
                {course.actionRequired === 'UNRESOLVED_CLASH' ? (
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                )}
                <p className="font-medium">{course.reason}</p>
              </div>

              {course.labDetails && (
                <div className="text-xs bg-purple-50 border border-purple-100 p-2.5 rounded-xl text-purple-900 font-medium">
                  <span className="font-bold block mb-0.5">Lab Included:</span>
                  {course.labDetails.courseName} — {course.labDetails.timetables?.[0]?.day} ({course.labDetails.timetables?.[0]?.startTime} - {course.labDetails.timetables?.[0]?.endTime}) at {course.labDetails.timetables?.[0]?.venue}
                </div>
              )}

              {course.timetableDetails && !Array.isArray(course.timetableDetails) && course.timetableDetails.lecture && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-700">Lecture Schedule:</p>
                  {course.timetableDetails.lecture.map((l: any, lIdx: number) => (
                    <div key={lIdx} className="flex items-center gap-1 text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{l.day}: {l.startTime} - {l.endTime} ({l.venue}) | Instr: {l.instructor}</span>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(course.timetableDetails) && course.timetableDetails.length > 0 && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-700">Schedule:</p>
                  {course.timetableDetails.map((t: any, tIdx: number) => (
                    <div key={tIdx} className="flex items-center gap-1 text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{t.day}: {t.startTime} - {t.endTime} ({t.room || t.venue})</span>
                    </div>
                  ))}
                </div>
              )}

              {course.electiveOptions && course.electiveOptions.length > 0 && (
                <div className="relative pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Selected Elective Option:</p>
                  <button 
                    type="button"
                    onClick={() => toggleDropdown(course.courseName)}
                    className="w-full flex items-center justify-between text-xs bg-blue-50 border border-blue-200 text-blue-900 px-3 py-2 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                  >
                    <span className="truncate">{currentSelectedElective?.courseName || "Select an elective option"}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                      {course.electiveOptions.map((opt: any, optIdx: number) => (
                        <div 
                          key={optIdx}
                          onClick={() => selectOption(course.courseName, opt)}
                          className="p-2.5 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                        >
                          <p className="font-bold text-gray-800">{opt.courseName}</p>
                          <p className="text-gray-500 text-[11px] mt-0.5 font-medium">{opt.matchReason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                {!course.isOffered ? (
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Clock size={12} /> Not Offered
                  </div>
                ) : course.actionRequired === 'REQUEST_SPECIAL_OFFERING' ? (
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[10px] uppercase bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <Clock size={12} /> Request Special
                  </div>
                ) : (
                  <div className="text-green-700 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                    Eligible
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClashCourseCard({ course, isExpanded, onToggle }: any) {
  return (
    <div className="border-2 border-red-200 bg-red-50/30 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-100 border-2 border-red-200 flex items-center justify-center shrink-0 text-red-600">
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-bold uppercase">
              Time Clash
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base uppercase leading-tight">{course.courseName}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
          {course.credits} Credits
        </span>
      </div>

      <div className="text-xs bg-red-50 p-3 rounded-xl border border-red-100 text-red-700 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <p className="font-medium">{course.reason || course.notSuggestedReason || "This course has a schedule clash with another selected course."}</p>
      </div>

      {course.clashRecord && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-xs bg-white border border-red-200 text-red-800 px-3 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            <span>View Clash Details</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-2 p-3 bg-white border border-red-200 rounded-xl text-xs space-y-1 text-gray-700">
              <p className="font-bold text-red-900">Clashing with:</p>
              <p>{course.clashRecord.conflictingCourseName || "Another Course"}</p>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <Clock size={12} />
                <span>{course.clashRecord.day} ({course.clashRecord.startTime} - {course.clashRecord.endTime})</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}