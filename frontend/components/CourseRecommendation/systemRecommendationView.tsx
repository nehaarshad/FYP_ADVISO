/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, Calendar, ChevronDown, ChevronUp,
  Clock, Loader2, AlertCircle, CheckCircle2, ShieldAlert,
  Sparkles, Info, Target, Split, Layers, Search,
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
  critical: { title: "Critical Priority",  badge: "bg-red-100 text-red-700 border-red-200",       dot: "bg-red-500"    },
  high:     { title: "High Priority",      badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  medium:   { title: "Medium Priority",    badge: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
  low:      { title: "Low Priority",       badge: "bg-green-100 text-green-700 border-green-200",   dot: "bg-green-500"  },
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

  // Auto-open the newest session
  useEffect(() => {
    if (!openSession && groupedBySession.length > 0) {
     
    }
  }, [groupedBySession, openSession]);

  const toggleSession = (key: string) =>
    setOpenSession(prev => (prev === key ? null : key));

  const toggleCourse = (key: string) =>
    setExpandedCourseKeys(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  // Search filter — match session label or any course name inside
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
      <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
          >
            <ArrowLeft size={20} />
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
      <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex flex-col items-center py-20">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
            Failed to Load Recommendations
          </p>
          <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs mb-6">{error}</p>
          <button
            onClick={fetchStudentRecommendations}
            className="px-6 py-2.5 bg-[#1e3a5f] text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-500 transition-all"
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
      <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={22} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
            {searchTerm ? "No matching courses found" : "No recommendations yet"}
          </p>
        </div>
      </div>
    );
  }

  /* ─── Main view ─── */
  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 mb-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-colors w-fit border border-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
              My Recommendations
            </h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {groupedBySession.length} session{groupedBySession.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search course..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[240px] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-amber-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Session list */}
      <div className="space-y-6">
        {filteredSessions.map(session => {
          const isOpen = openSession === session.key;

          // Aggregate counts across records (usually one record per session)
          const totals = session.records.reduce(
            (acc, rec) => {
              acc.courses +=
                rec.priorityWiseCourses.critical.length +
                rec.priorityWiseCourses.high.length +
                rec.priorityWiseCourses.medium.length +
                rec.priorityWiseCourses.low.length;
              acc.credits += rec.summary.totalCoursesRecommended
                ? 0
                : 0;
              return acc;
            },
            { courses: 0, credits: 0 }
          );

          const firstRec = session.records[0];

          return (
            <div
              key={session.key}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              {/* Session header */}
              <button
                type="button"
                onClick={() => toggleSession(session.key)}
                className="w-full flex items-center justify-between gap-3 px-4 md:px-5 py-4 hover:bg-slate-50/70 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight truncate">
                      {session.label}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {totals.courses} course{totals.courses !== 1 ? "s" : ""} recommended
                      {firstRec?.summary.totalCreditsAllowed != null &&
                        ` · cap ${firstRec.summary.totalCreditsAllowed} cr`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {firstRec?.summary.hasWarnings && (
                    <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[9px] font-black uppercase">
                      <AlertCircle size={10} /> Warnings
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </button>

              {/* Session body */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/40 p-4 md:p-5 space-y-5">
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
    <div className="space-y-5">
      {/* Recommendation explanation */}
      {record.detailedExplanation && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">
          <Info size={14} className="shrink-0 mt-0.5 text-amber-600" />
          <p className="text-[11px] font-bold leading-relaxed">{record.detailedExplanation}</p>
        </div>
      )}

      {/* Priority summary chips */}
      <div className="flex flex-wrap gap-2">
        {(["critical", "high", "medium", "low"] as PriorityKey[]).map(p => {
          const count = grouped[p].length;
          if (!count) return null;
          const meta = PRIORITY_META[p];
          return (
            <span
              key={p}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase ${meta.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.title} · {count}
            </span>
          );
        })}
      </div>

      {/* Course sections */}
      {(["critical", "high", "medium", "low"] as PriorityKey[]).map(p => {
        const courses: SuggestedCourse[] = grouped[p];
        if (!courses.length) return null;
        const meta = PRIORITY_META[p];

        return (
          <div key={p} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {meta.title} ({courses.length})
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Footer meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
        <p className="text-[9px] font-bold text-slate-400 uppercase">
          {record.sentAt
            ? `Sent ${new Date(record.sentAt).toLocaleString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}`
            : "—"}
        </p>
        {record.notes && (
          <p className="text-[9px] text-slate-500 italic">Note: {record.notes}</p>
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
    <div className="border border-emerald-100 rounded-2xl p-4 bg-white shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-bold uppercase border border-emerald-100">
              {course.category || "ELIGIBLE"}
            </span>
            {isElective && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded-md text-[9px] font-bold text-purple-600 uppercase border border-purple-100">
                <Sparkles size={10} /> {electives.length || (course as any).totalOptions || 0} options
              </span>
            )}
            {course.actionRequired && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-md text-[9px] font-bold text-blue-600 uppercase border border-blue-100">
                <Target size={10} /> {String(course.actionRequired).replace(/_/g, " ")}
              </span>
            )}
          </div>
          <h4 className="font-bold text-gray-900 text-sm uppercase leading-tight truncate">
            {courseName}
          </h4>
          {course.originalCourseName && course.originalCourseName !== course.courseName && (
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              replaces: {course.originalCourseName}
            </p>
          )}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
          {credits} cr
        </span>
      </div>

      {/* System reason */}
      {course.reason && (
        <div className="text-[11px] bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="font-medium">{course.reason}</p>
        </div>
      )}

      {/* Lecture schedule */}
      {lectureSlots.length > 0 && (
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Lecture</p>
          {lectureSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
              <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue ?? "—"})
                {l.instructor ? ` · ${l.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Lab schedule */}
      {labSlots.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-xl text-purple-900 space-y-1">
          <span className="text-[9px] font-black uppercase block">Lab</span>
          {labSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px] font-medium">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue})
                {l.instructor ? ` · ${l.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Elective options (read-only list) */}
      {electives.length > 0 && (
        <div className="pt-2 border-t border-gray-100 space-y-1.5">
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-[10px] font-black text-purple-700 uppercase tracking-wider"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={10} /> Elective options ({electives.length})
            </span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {isExpanded && (
            <div className="space-y-1.5">
              {electives.map((opt: ElectiveOption, i: number) => (
                <div key={i} className="bg-white border border-purple-100 rounded-lg p-2 text-[10px]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-800 truncate">{opt.courseName}</p>
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                      {opt.credits} cr
                    </span>
                  </div>
                  {opt.matchReason && (
                    <p className="text-gray-500 mt-0.5">{opt.matchReason}</p>
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
    <div className="border-2 border-red-200 bg-red-50/40 rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
          <ShieldAlert size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-bold uppercase">
              {(course as any).notSuggestedReason === "LAB_CLASH_UNRESOLVED"
                ? "Lab Clash"
                : "Time Clash"}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[9px] font-bold uppercase">
              {(course as any).priority ?? "CRITICAL"}
            </span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm uppercase leading-tight truncate">
            {courseName}
          </h4>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
          {credits} cr
        </span>
      </div>

      {/* Reason */}
      <div className="text-[11px] bg-white p-2.5 rounded-xl border border-red-100 text-red-700 flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">
          {course.reason || (course as any).notSuggestedReason || "Schedule conflict detected."}
        </p>
      </div>

      {/* Suggested alternative */}
      {alt && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-800 uppercase tracking-wider">
            <Split size={12} className="text-blue-600" />
            Suggested Alternative
          </div>
          <div className="bg-white border border-blue-100 rounded-lg p-2">
            <p className="font-bold text-gray-900 text-xs uppercase truncate">
              {alt.courseName}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">
                {alt.credits} cr
              </span>
              {alt.bestMatchDetails?.semester != null && (
                <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-bold uppercase">
                  Sem {alt.bestMatchDetails.semester}
                </span>
              )}
              {alt.score != null && (
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold uppercase">
                  Score {alt.score}
                </span>
              )}
            </div>
            {alt.reason && (
              <p className="text-[10px] text-gray-500 mt-1.5 leading-snug">{alt.reason}</p>
            )}
          </div>
        </div>
      )}

      {/* Clash details expander */}
      {clashArray.length > 0 && (
        <div>
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-[10px] bg-white border border-red-200 text-red-800 px-2.5 py-1.5 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            <span>
              {isExpanded ? "Hide" : "View"} clash details ({clashArray.length})
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-1.5 p-2.5 bg-white border border-red-200 rounded-xl text-[10px] space-y-1 text-gray-700">
              <p className="font-bold text-red-900 uppercase">
                Conflicting with: {(course as any).clashRecord?.clashesWith ?? "—"}
              </p>
              {clashArray.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-1 text-gray-600">
                  <Clock size={11} className="text-red-500" />
                  <span>
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