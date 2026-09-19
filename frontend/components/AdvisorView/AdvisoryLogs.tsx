/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Advisory/AdvisoryLogs.tsx
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Search, AlertCircle, BookOpen, ChevronDown, ChevronUp,
  Users, Calendar, Clock, Sparkles, Split, Target, GraduationCap,
} from 'lucide-react';
import { useRecommendations } from '../../src/hooks/recommendationHook/useCourseRecommendationHook';
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';


interface AdvisoryLogsProps {
  onBack?: () => void;
   onOpenStudentRecommendations?: () => void;
}

/* ─────────────────────────── types ─────────────────────────── */

interface NormalizedCourse {
  courseId: number | null;
  courseName: string;
  originalCourseName: string | null;
  substituteFor: string | null;
  credits: number;
  category: string;
  program: string | null;
  semester: number | null;
  batch: string | null;
  hasLab: boolean;
  isElective: boolean;
  lectureSlots: any[];
  labSlots: any[];
  instructors: string[];
  timeSlot: string | null;
  systemReason: string | null;
  selectionReason: string | null;
  selectionSource: 'RECOMMENDED' | 'ALTERNATIVE_FOR_CLASH' | 'ELECTIVE_OPTION' | 'MANUAL_ADD';
  priority: string | null;
  actionRequired: string | null;
}

/* ─────────────────────────── normalizer ─────────────────────────── */

function normalizeCourse(raw: any): NormalizedCourse {
  const tt = raw?.timetableDetails;

  const lectureSlots: any[] = Array.isArray(raw?.lectureSlots)
    ? raw.lectureSlots
    : Array.isArray(tt)
    ? tt
    : (tt?.lecture ?? []);

  const labSlots: any[] = Array.isArray(raw?.labSlots)
    ? raw.labSlots
    : Array.isArray(tt)
    ? []
    : (tt?.lab ?? raw?.labDetails?.timetables ?? []);

  const instructors = Array.from(
    new Set(
      [...lectureSlots, ...labSlots]
        .map(s => s?.instructor)
        .filter((x: any): x is string => !!x)
    )
  );

  return {
    courseId: raw?.courseId ?? null,
    courseName: raw?.courseName ?? '—',
    originalCourseName: raw?.originalCourseName ?? null,
    substituteFor: raw?._substituteFor ?? raw?.substituteFor ?? null,
    credits: raw?.credits ?? 0,
    category: raw?.category ?? '—',
    program: raw?.program ?? raw?.offeredProgram ?? null,
    semester: raw?.semester ?? null,
    batch: raw?.batch ?? null,
    hasLab: raw?.hasLab ?? labSlots.length > 0,
    isElective: raw?.isElective ?? false,
    lectureSlots,
    labSlots,
    instructors,
    timeSlot: raw?.timeSlot ?? null,
    systemReason: raw?.reason ?? raw?.systemReason ?? null,
    selectionReason: raw?._selectionReason ?? raw?.selectionReason ?? null,
    selectionSource:
      raw?._selectionSource ??
      raw?.selectionSource ??
      'RECOMMENDED',
    priority: raw?.priority ?? null,
    actionRequired: raw?.actionRequired ?? null,
  };
}

/* ─────────────────────────── source badge ─────────────────────────── */

function SourceBadge({ source }: { source: NormalizedCourse['selectionSource'] }) {
  const styles: Record<string, string> = {
    RECOMMENDED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ALTERNATIVE_FOR_CLASH: 'bg-amber-50 text-amber-700 border-amber-200',
    ELECTIVE_OPTION: 'bg-purple-50 text-purple-700 border-purple-200',
    MANUAL_ADD: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const icons: Record<string, React.ReactNode> = {
    RECOMMENDED: <Target size={9} />,
    ALTERNATIVE_FOR_CLASH: <Split size={9} />,
    ELECTIVE_OPTION: <Sparkles size={9} />,
    MANUAL_ADD: <GraduationCap size={9} />,
  };
  return (
    <span
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase border ${styles[source]}`}
    >
      {icons[source]}
      {source.replace(/_/g, ' ')}
    </span>
  );
}

/* ─────────────────────────── course card ─────────────────────────── */

function CourseDetailCard({ course }: { course: NormalizedCourse }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl p-3 space-y-2 bg-white hover:border-slate-300 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-black text-xs text-[#1e3a5f] uppercase leading-tight truncate">
            {course.courseName}
          </p>
          {(course.substituteFor || course.originalCourseName) &&
            (course.substituteFor ?? course.originalCourseName) !== course.courseName && (
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                replaces: {course.substituteFor ?? course.originalCourseName}
              </p>
            )}
        </div>
        <span className="text-[10px] font-black text-[#1e3a5f] bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
          {course.credits} cr
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1">
        <SourceBadge source={course.selectionSource} />
        {course.category && (
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[8px] font-black uppercase">
            {course.category}
          </span>
        )}
        {course.program && (
          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[8px] font-black uppercase truncate max-w-[140px]">
            {course.program}
          </span>
        )}
        {course.semester != null && (
          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[8px] font-black uppercase">
            Sem {course.semester}
          </span>
        )}
        {course.hasLab && (
          <span className="px-1.5 py-0.5 bg-fuchsia-50 text-fuchsia-700 rounded-md text-[8px] font-black uppercase">
            + Lab
          </span>
        )}
      </div>

      {/* Schedules — lecture / lab */}
      {course.lectureSlots.length > 0 && (
        <div className="space-y-0.5">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
            Lecture
          </p>
          {course.lectureSlots.map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
              <Clock size={10} className="text-emerald-600 shrink-0" />
              <span className="truncate">
                {s.day} {s.startTime}–{s.endTime}
                {s.room || s.venue ? ` · ${s.room ?? s.venue}` : ''}
                {s.instructor ? ` · ${s.instructor}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {course.labSlots.length > 0 && (
        <div className="space-y-0.5 pt-1 border-t border-slate-100">
          <p className="text-[8px] font-black text-fuchsia-600 uppercase tracking-wider">
            Lab
          </p>
          {course.labSlots.map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-fuchsia-700 font-medium">
              <Clock size={10} className="shrink-0" />
              <span className="truncate">
                {s.day} {s.startTime}–{s.endTime}
                {s.room || s.venue ? ` · ${s.room ?? s.venue}` : ''}
                {s.instructor ? ` · ${s.instructor}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {course.lectureSlots.length === 0 && course.labSlots.length === 0 && (
        <p className="text-[9px] text-slate-400 italic">
          No timetable slots published for this offering.
        </p>
      )}

      {/* Instructors summary */}
      {course.instructors.length > 0 && (
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">
          Faculty: {course.instructors.join(' · ')}
        </p>
      )}

      {/* Advisor rationale (collapsible for long text) */}
      {course.selectionReason && (
        <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-2">
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="text-[8px] font-black text-amber-800 uppercase tracking-wider">
              Why this was selected
            </span>
            {expanded ? (
              <ChevronUp size={10} className="text-amber-700" />
            ) : (
              <ChevronDown size={10} className="text-amber-700" />
            )}
          </button>
          <p
            className={`text-[10px] text-amber-900 mt-1 leading-snug whitespace-pre-line ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {course.selectionReason}
          </p>
          {course.systemReason &&
            course.systemReason !== course.selectionReason &&
            course.selectionSource === 'RECOMMENDED' && (
              <p className="text-[9px] text-slate-500 italic mt-1.5 pt-1.5 border-t border-amber-100">
                System: {course.systemReason}
              </p>
            )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── student block ─────────────────────────── */

function StudentBlock({ log }: { log: any }) {
  const [open, setOpen] = useState(false);
  const courses: NormalizedCourse[] = useMemo(
    () => (log.recommendedCourses ?? []).map(normalizeCourse),
    [log.recommendedCourses]
  );

  const student = log.Student ?? {};
  const sapid = student?.User?.sapid ?? '—';
  const batch = student?.BatchModel;
  const program = batch?.ProgramModel?.programName ?? '—';

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      {/* Student header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-black text-xs shrink-0">
            {student?.studentName?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#1e3a5f] uppercase truncate">
              {student?.studentName ?? '—'}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase truncate">
              SAP {sapid} · Sem {student?.currentSemester ?? '—'} · {program}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-black text-[#1e3a5f] uppercase">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[9px] font-black text-amber-600 uppercase">
              {log.totalCredits ?? 0} cr
            </span>
          </div>
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Collapsible course list */}
      {open && (
        <div className="border-t border-slate-100 p-3 bg-slate-50/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {courses.map((c, i) => (
              <CourseDetailCard key={`${c.courseId ?? 'noid'}-${c.courseName}-${i}`} course={c} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              Finalized {new Date(log.updatedAt ?? log.createdAt).toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {log.notes && (
              <p className="text-[9px] text-slate-500 italic">
                Note: {log.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export const AdvisoryLogs: React.FC<AdvisoryLogsProps> = ({ onBack ,onOpenStudentRecommendations}) => {
  const { advisoryLogs, isLoadingLogs, logsError, fetchAdvisoryLogs } = useRecommendations();
  const [searchTerm, setSearchTerm] = useState('');
  const { userProfile } = useUserProfile();
  const role = userProfile?.role;

  useEffect(() => {
    fetchAdvisoryLogs();
  }, [fetchAdvisoryLogs]);

  const logsArray = Array.isArray(advisoryLogs) ? advisoryLogs : [];

  // ── Filter by search term ─────────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logsArray;
    const q = searchTerm.toLowerCase();
    return logsArray.filter((log: any) => {
      const name = log.Student?.studentName?.toLowerCase() ?? '';
      const sapid = String(log.Student?.User?.sapid ?? '');
      return name.includes(q) || sapid.includes(q);
    });
  }, [logsArray, searchTerm]);

  // ── Group by session → student ────────────────────────────────────────
  const groupedBySession = useMemo(() => {
    const sessions: Record<string, { sessionLabel: string; studentMap: Record<number, any[]> }> = {};

    for (const log of filteredLogs) {
     if(log.Session){
       const session = log.Session ?? {};
      const label = `${session.sessionType ?? 'UNKNOWN'} ${session.sessionYear ?? ''}`.trim();
      const studentId = log.studentId ?? 0;

      if (!sessions[label]) {
        sessions[label] = { sessionLabel: label, studentMap: {} };
      }
      if (!sessions[label].studentMap[studentId]) {
        sessions[label].studentMap[studentId] = [];
      }
      sessions[label].studentMap[studentId].push(log);
     }
    }

    // Sort students by name
    return Object.values(sessions)
      .sort((a, b) => b.sessionLabel.localeCompare(a.sessionLabel))
      .map(s => ({
        ...s,
        students: Object.values(s.studentMap)
          .flat()
          .sort((a: any, b: any) =>
            (a.Student?.studentName ?? '').localeCompare(b.Student?.studentName ?? '')
          ),
      }));
  }, [filteredLogs]);

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (isLoadingLogs) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button
          title="Back"
          onClick={onBack}
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────── */
  if (logsError) {
    return (
      <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button
          title="Back"
          onClick={onBack}
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center py-20">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
            Failed to Load Logs
          </p>
          <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs mb-6">
            {logsError}
          </p>
          <button
            onClick={fetchAdvisoryLogs}
            className="px-6 py-2.5 bg-[#1e3a5f] text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty ───────────────────────────────────────────────────────── */
  if (groupedBySession.length === 0) {
    return (
      <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6">
        <button
          title="Back"
          onClick={onBack}
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={22} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
            {searchTerm ? 'No matching records found' : 'No advisory logs yet'}
          </p>
        </div>
      </div>
    );
  }

  /* ── Main view ───────────────────────────────────────────────────── */
  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1300px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-5 mb-8">
        <button
          title="Back"
          onClick={onBack}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-colors w-fit border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase">
              Advisory Logs
            </h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Grouped by Session · {groupedBySession.length} session
              {groupedBySession.length !== 1 ? 's' : ''} · {filteredLogs.length} total record
              {(filteredLogs.length) !== 1 ? 's' : ''}
            </p>
          </div>

          {role=="advisor" ?
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search student or SAP ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[240px] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-amber-400 outline-none"
            />
          </div>
          :
                <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex p-1 bg-[#1e3a5f] text-white shadow-sm rounded-xl border border-slate-200">
              
                <button
                 onClick={onOpenStudentRecommendations}
                  className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all`}
                >
                  System Generated Recommendations
                </button>
            </div>
          </div>
}
        </div>
      </div>

      {/* Session sections */}
      <div className="space-y-8">
        {groupedBySession.map(session => (
          <div key={session.sessionLabel} className="space-y-3">
            {/* Session header */}
            <div className="flex items-center gap-3 sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 md:-mx-6 md:px-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-xl shadow-sm">
                <Calendar size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {session.sessionLabel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                <Users size={10} />
                {session.students.length} student{session.students.length !== 1 ? 's' : ''}
              </div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Students in this session */}
            <div className="space-y-3">
              {session.students.map((log: any) => (
                <StudentBlock key={log.id} log={log} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};