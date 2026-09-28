
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, Calendar, ChevronDown, ChevronUp,
  Clock, AlertCircle, CheckCircle2, ShieldAlert,
  Sparkles, Info, Target, Split, Search,
} from "lucide-react";
import type {
  SuggestedCourse,
  ElectiveOption,
  CourseTimetable,
  CombinedTimetableDetails,
  NormalTimetableDetails,
} from "@/src/models/systemSuggestedCoursesModel";
import { useStudentRecommendations } from "@/src/hooks/recommendationHook/useStudentRecommendation";

interface StudentRecommendationViewProps {
  onBack?: () => void;
}

const PRIORITY_META = {
  critical: { title: "Critical Priority",  badge: "bg-rose-50 text-rose-800 border-rose-200/80 font-semibold",     dot: "bg-rose-500"    },
  high:     { title: "High Priority",      badge: "bg-amber-50 text-amber-800 border-amber-200/80 font-semibold", dot: "bg-amber-500" },
  medium:   { title: "Medium Priority",    badge: "bg-blue-50 text-blue-800 border-blue-200/80 font-semibold",    dot: "bg-blue-500"    },
  low:      { title: "Low Priority",       badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold",  dot: "bg-emerald-500"  },
} as const;

type PriorityKey = keyof typeof PRIORITY_META;

export const StudentRecommendationView: React.FC<StudentRecommendationViewProps> = ({ onBack }) => {
  const {
    groupedBySession,
    isLoading,
    error,
    fetchStudentRecommendations,
  } = useStudentRecommendations();

  const [searchTerm, setSearchTerm] = useState("");
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [expandedCourseKeys, setExpandedCourseKeys] = useState<Set<string>>(new Set());

  useEffect(() => { fetchStudentRecommendations(); }, [fetchStudentRecommendations]);

  const toggleSession = (key: string) =>
    setOpenSession(prev => (prev === key ? null : key));

  const toggleCourse = (key: string) =>
    setExpandedCourseKeys(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const filteredSessions = useMemo(() => {
    if (!searchTerm.trim()) return groupedBySession;
    const q = searchTerm.toLowerCase();
    return groupedBySession
      .map(session => {
        const matchingRecords = session.records.filter(rec => {
          const all = [
            ...rec.priorityWiseCourses.critical,
            ...rec.priorityWiseCourses.high,
            ...rec.priorityWiseCourses.medium,
            ...rec.priorityWiseCourses.low,
          ];
          return all.some((c: any) =>
            (c.courseName ?? "").toLowerCase().includes(q) ||
            (c.originalCourseName ?? "").toLowerCase().includes(q)
          );
        });
        return { ...session, records: matchingRecords };
      })
      .filter(s => s.records.length > 0);
  }, [groupedBySession, searchTerm]);

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="w-full px-0 py-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-xs rounded-xl text-slate-800 border border-slate-200 mb-6 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="w-full px-0 py-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-xs rounded-xl text-slate-800 border border-slate-200 mb-6 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex flex-col items-center py-20">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
            <AlertCircle size={26} className="text-rose-500" />
          </div>
          <p className="text-xs font-semibold text-slate-900 tracking-tight mb-1">
            Failed to Load Recommendations
          </p>
          <p className="text-xs text-slate-700 text-center max-w-xs mb-6">{error}</p>
          <button
            onClick={fetchStudentRecommendations}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition-all shadow-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ─── Empty ─── */
  if (filteredSessions.length === 0) {
    return (
      <div className="w-full px-0 py-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-xs rounded-xl text-slate-800 border border-slate-200 mb-6 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
            <BookOpen size={20} className="text-slate-500" />
          </div>
          <p className="text-slate-800 font-semibold text-xs">
            {searchTerm ? "No matching courses found" : "No recommendations yet"}
          </p>
        </div>
      </div>
    );
  }

  /* ─── Main view ─── */
  return (
    <div className="animate-in fade-in duration-300 w-full min-w-full px-0 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-2 px-0 w-full">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 bg-white shadow-xs rounded-xl text-slate-800 transition-colors w-fit border border-slate-200"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              System Recommendations
            </h2>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              {groupedBySession.length} session{groupedBySession.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search course..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[280px] pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-500 shadow-xs transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Session list - Main Cards */}
      <div className="space-y-4 w-full min-w-full">
        {filteredSessions.map(session => {
          const isOpen = openSession === session.key;
          const totals = session.records.reduce(
            (acc, rec) => {
              acc.courses +=
                rec.priorityWiseCourses.critical.length +
                rec.priorityWiseCourses.high.length +
                rec.priorityWiseCourses.medium.length +
                rec.priorityWiseCourses.low.length;
              return acc;
            },
            { courses: 0, credits: 0 }
          );

          const firstRec = session.records[0];

          return (
            <div
              key={session.key}
              className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs w-full block transition-all"
            >
              {/* Session header */}
              <button
                type="button"
                onClick={() => toggleSession(session.key)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-slate-900 tracking-tight truncate">
                      {session.label}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700 truncate mt-0.5">
                      {totals.courses} course{totals.courses !== 1 ? "s" : ""} recommended
                      {firstRec?.summary.totalCreditsAllowed != null &&
                        ` · Cap: ${firstRec.summary.totalCreditsAllowed} cr`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {firstRec?.summary.hasWarnings && (
                    <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-[10px] font-semibold">
                      <AlertCircle size={12} /> Warnings
                    </span>
                  )}
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Session body */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-5 w-full">
                  {session.records.map(rec => (
                    <SessionRecord
                      key={rec.id ?? Math.random()}
                      record={rec}
                      expandedCourseKeys={expandedCourseKeys}
                      toggleCourse={toggleCourse}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────── Single Session Record ─────────────────────────── */

const SessionRecord: React.FC<{
  record: any;
  expandedCourseKeys: Set<string>;
  toggleCourse: (k: string) => void;
}> = ({ record, expandedCourseKeys, toggleCourse }) => {
  const grouped = {
    critical: record.priorityWiseCourses.critical ?? [],
    high:     record.priorityWiseCourses.high     ?? [],
    medium:   record.priorityWiseCourses.medium   ?? [],
    low:      record.priorityWiseCourses.low      ?? [],
  };

  return (
    <div className="space-y-5 w-full">
      {record.detailedExplanation && (
        <div className="flex items-start gap-2.5 bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 text-slate-900 w-full shadow-2xs">
          <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
          <p className="text-xs font-semibold leading-relaxed">{record.detailedExplanation}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 w-full">
        {(["critical", "high", "medium", "low"] as PriorityKey[]).map(p => {
          const count = grouped[p].length;
          if (!count) return null;
          const meta = PRIORITY_META[p];
          return (
            <span
              key={p}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${meta.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.title} · {count}
            </span>
          );
        })}
      </div>

      {(["critical", "high", "medium", "low"] as PriorityKey[]).map(p => {
        const courses: SuggestedCourse[] = grouped[p];
        if (!courses.length) return null;
        const meta = PRIORITY_META[p];

        return (
          <div key={p} className="space-y-3 w-full">
            <div className="flex items-center gap-2 w-full">
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                {meta.title} ({courses.length})
              </h3>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5 w-full">
              {courses.map((course, idx) => {
                const key = `${record.id}-${p}-${course.courseId ?? "noid"}-${course.courseName}-${idx}`;
                const isClash =
                  course.isNotSuggested ||
                  (course as any).notSuggestedReason === "TIME_CLASH" ||
                  !!(course as any).clashRecord;

                return isClash ? (
                  <ReadOnlyClashCard
                    key={key}
                    course={course}
                    isExpanded={expandedCourseKeys.has(key)}
                    onToggle={() => toggleCourse(key)}
                  />
                ) : (
                  <ReadOnlyCourseCard
                    key={key}
                    course={course}
                    isExpanded={expandedCourseKeys.has(key)}
                    onToggle={() => toggleCourse(key)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 w-full">
        <p className="text-[11px] text-slate-700 font-semibold">
          {record.sentAt
            ? `Sent: ${new Date(record.sentAt).toLocaleString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}`
            : "—"}
        </p>
        {record.notes && (
          <p className="text-[11px] text-slate-800 font-semibold italic">Note: {record.notes}</p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────── Read-Only Regular Course Card ─────────────────────────── */

const ReadOnlyCourseCard: React.FC<{
  course: SuggestedCourse;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ course, isExpanded, onToggle }) => {
  const courseName = course.courseName || course.originalCourseName;
  const credits = course.credits ?? 3;
  const electives = (course as any).electiveOptions ?? [];
  const isElective = electives.length > 0 || course.isElective;

  const lectureSlots: CourseTimetable[] = Array.isArray(course.timetableDetails)
    ? (course.timetableDetails as NormalTimetableDetails)
    : ((course.timetableDetails as CombinedTimetableDetails | undefined)?.lecture ?? []);

  const labSlots: CourseTimetable[] = Array.isArray(course.timetableDetails)
    ? []
    : ((course.timetableDetails as CombinedTimetableDetails | undefined)?.lab ??
       course.labDetails?.timetables ??
       []);

  return (
    <div className="border border-slate-300 rounded-2xl p-4 bg-white shadow-2xs space-y-3 w-full hover:border-slate-400 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-semibold border border-slate-200">
              {course.category || "ELIGIBLE"}
            </span>
            {isElective && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50/80 rounded-md text-[10px] font-semibold text-indigo-900 border border-indigo-200">
                <Sparkles size={11} className="text-indigo-600" /> {electives.length || (course as any).totalOptions || 0} options
              </span>
            )}
            {course.actionRequired && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 rounded-md text-[10px] font-semibold text-sky-900 border border-sky-200">
                <Target size={11} className="text-sky-600" /> {String(course.actionRequired).replace(/_/g, " ")}
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug break-words">
            {courseName}
          </h4>
          {course.originalCourseName && course.originalCourseName !== course.courseName && (
            <p className="text-[11px] text-slate-700 font-medium mt-0.5">
              Replaces: {course.originalCourseName}
            </p>
          )}
        </div>
        
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-900 rounded-xl shrink-0 border border-slate-300">
          {credits} CR
        </span>
      </div>

      {course.reason && (
        <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <p className="font-medium">{course.reason}</p>
        </div>
      )}

      {lectureSlots.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Lecture</p>
          {lectureSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="break-words">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue ?? "—"})
                {l.instructor ? ` · ${l.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {labSlots.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Lab</span>
          {labSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 shrink-0 text-slate-500" />
              <span className="break-words">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue})
                {l.instructor ? ` · ${l.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {electives.length > 0 && (
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-xs font-bold text-indigo-700 hover:text-indigo-800 py-1 px-1 rounded transition-colors"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={12} /> Elective options ({electives.length})
            </span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isExpanded && (
            <div className="space-y-1.5">
              {electives.map((opt: ElectiveOption, i: number) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs space-y-1 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 break-words">{opt.courseName}</p>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded shrink-0 border border-slate-200">
                      {opt.credits} CR
                    </span>
                  </div>
                  {opt.matchReason && (
                    <p className="text-slate-700 font-medium text-[11px]">{opt.matchReason}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── Read-Only Clash Course Card ─────────────────────────── */

const ReadOnlyClashCard: React.FC<{
  course: SuggestedCourse;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ course, isExpanded, onToggle }) => {
  const courseName = course.originalCourseName || course.courseName;
  const credits = course.credits ?? 3;
  const alt = (course as any).alternative;
  const clashArray = (course as any).clashRecord?.clashDetails?.detailedClashes ?? [];

  return (
    <div className="border border-rose-300 bg-rose-50/30 rounded-2xl p-4 space-y-3 w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
          <ShieldAlert size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-semibold border border-rose-200">
              {(course as any).notSuggestedReason === "LAB_CLASH_UNRESOLVED"
                ? "Lab Clash"
                : "Time Clash"}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-semibold border border-slate-200">
              {(course as any).priority ?? "CRITICAL"}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug break-words">
            {courseName}
          </h4>
        </div>
        
        <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-900 rounded-xl shrink-0 border border-rose-200">
          {credits} CR
        </span>
      </div>

      <div className="text-xs bg-white p-2.5 rounded-xl border border-rose-200 text-slate-900 flex items-start gap-2 shadow-2xs">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">
          {course.reason || (course as any).notSuggestedReason || "Schedule conflict detected."}
        </p>
      </div>

      {alt && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Split size={13} className="text-slate-600" />
            Suggested Alternative
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-slate-900 text-xs break-words">
                {alt.courseName}
              </p>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded shrink-0 border border-slate-200">
                {alt.credits} CR
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {alt.bestMatchDetails?.semester != null && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-medium border border-slate-200">
                  Sem {alt.bestMatchDetails.semester}
                </span>
              )}
              {alt.score != null && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-medium border border-slate-200">
                  Score {alt.score}
                </span>
              )}
            </div>
            {alt.reason && (
              <p className="text-[11px] text-slate-700 font-medium leading-snug">{alt.reason}</p>
            )}
          </div>
        </div>
      )}

      {clashArray.length > 0 && (
        <div>
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-xs bg-white border border-rose-200 text-rose-900 px-3 py-2 rounded-xl font-semibold hover:bg-rose-50/50 transition-colors shadow-2xs"
          >
            <span>
              {isExpanded ? "Hide" : "View"} clash details ({clashArray.length})
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2 p-2.5 bg-white border border-rose-200 rounded-xl text-xs space-y-1 text-slate-800 shadow-2xs">
              <p className="font-bold text-rose-950">
                Conflicting with: {(course as any).clashRecord?.clashesWith ?? "—"}
              </p>
              {clashArray.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-800 font-semibold text-[11px]">
                  <Clock size={11} className="text-rose-500" />
                  <span className="break-words">
                    {c.day} {c.startTime && c.endTime ? `${c.startTime}–${c.endTime}` : c.time}
                    {c.venue ? ` (${c.venue})` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentRecommendationView;