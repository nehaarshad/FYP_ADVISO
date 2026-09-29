
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Advisory/AdvisoryLogs.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Split,
  Target,
  GraduationCap,
} from "lucide-react";
import { useRecommendations } from "../../src/hooks/recommendationHook/useCourseRecommendationHook";
import { useUserProfile } from "@/src/hooks/profileHook/useProfile";

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
  selectionSource:
    | "RECOMMENDED"
    | "ALTERNATIVE_FOR_CLASH"
    | "ELECTIVE_OPTION"
    | "MANUAL_ADD";
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
    : tt?.lecture ?? [];

  const labSlots: any[] = Array.isArray(raw?.labSlots)
    ? raw.labSlots
    : Array.isArray(tt)
    ? []
    : tt?.lab ?? raw?.labDetails?.timetables ?? [];

  const instructors = Array.from(
    new Set(
      [...lectureSlots, ...labSlots]
        .map((s) => s?.instructor)
        .filter((x: any): x is string => !!x)
    )
  );

  return {
    courseId: raw?.courseId ?? null,
    courseName: raw?.courseName ?? "—",
    originalCourseName: raw?.originalCourseName ?? null,
    substituteFor: raw?._substituteFor ?? raw?.substituteFor ?? null,
    credits: raw?.credits ?? 0,
    category: raw?.category ?? "—",
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
      "RECOMMENDED",
    priority: raw?.priority ?? null,
    actionRequired: raw?.actionRequired ?? null,
  };
}

/* ─────────────────────────── source badge ─────────────────────────── */

function SourceBadge({
  source,
}: {
  source: NormalizedCourse["selectionSource"];
}) {
  const styles: Record<string, string> = {
    RECOMMENDED:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    ALTERNATIVE_FOR_CLASH:
      "bg-amber-50 text-amber-700 border-amber-200",
    ELECTIVE_OPTION:
      "bg-purple-50 text-purple-700 border-purple-200",
    MANUAL_ADD:
      "bg-slate-100 text-slate-700 border-slate-200",
  };

  const icons: Record<string, React.ReactNode> = {
    RECOMMENDED: <Target size={12} />,
    ALTERNATIVE_FOR_CLASH: <Split size={12} />,
    ELECTIVE_OPTION: <Sparkles size={12} />,
    MANUAL_ADD: <GraduationCap size={12} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${styles[source]}`}
    >
      {icons[source]}
      {source.replace(/_/g, " ")}
    </span>
  );
}

/* ─────────────────────────── course card ─────────────────────────── */

function CourseDetailCard({
  course,
}: {
  course: NormalizedCourse;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        border border-slate-200 
        rounded-2xl 
        p-5 
        bg-white 
        shadow-sm
        hover:shadow-md
        hover:border-slate-300 
        transition-all
        flex
        flex-col
        gap-4
        w-full
      "
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-base text-[#1e3a5f] leading-snug tracking-tight">
            {course.courseName}
          </h4>

          {(course.substituteFor || course.originalCourseName) &&
            (course.substituteFor ?? course.originalCourseName) !==
              course.courseName && (
              <p className="text-xs text-slate-500 font-medium mt-1">
                Replaces:{" "}
                <span className="font-semibold text-slate-700">
                  {course.substituteFor ?? course.originalCourseName}
                </span>
              </p>
            )}
        </div>

        <span
          className="
            text-xs
            font-bold
            text-[#1e3a5f]
            bg-slate-100
            px-3
            py-1.5
            rounded-lg
            shrink-0
          "
        >
          {course.credits} Credits
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <SourceBadge source={course.selectionSource} />

        {course.category && (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
            {course.category}
          </span>
        )}

        {course.program && (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium">
            {course.program}
          </span>
        )}

        {course.semester != null && (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-medium">
            Semester {course.semester}
          </span>
        )}

        {course.hasLab && (
          <span className="px-2.5 py-1 bg-fuchsia-50 text-fuchsia-700 rounded-md text-[11px] font-medium">
            Lab Included
          </span>
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Schedules — lecture */}
      {course.lectureSlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 tracking-wider">
            LECTURE SCHEDULE
          </p>

          {course.lectureSlots.map((s: any, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
            >
              <Clock
                size={14}
                className="text-emerald-600 shrink-0 mt-0.5"
              />
              <span>
                <strong className="text-slate-900">{s.day}</strong> ({s.startTime} – {s.endTime})
                {s.room || s.venue ? ` · Room: ${s.room ?? s.venue}` : ""}
                {s.instructor ? ` · ${s.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Schedules — lab */}
      {course.labSlots.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-fuchsia-700 tracking-wider">
            LAB SCHEDULE
          </p>

          {course.labSlots.map((s: any, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-xs text-fuchsia-800 font-medium"
            >
              <Clock size={14} className="shrink-0 mt-0.5" />
              <span>
                <strong className="text-fuchsia-900">{s.day}</strong> ({s.startTime} – {s.endTime})
                {s.room || s.venue ? ` · Room: ${s.room ?? s.venue}` : ""}
                {s.instructor ? ` · ${s.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No timetable */}
      {course.lectureSlots.length === 0 &&
        course.labSlots.length === 0 && (
          <p className="text-xs text-slate-700 font-medium not-italic">
            No timetable slots published for this offering yet.
          </p>
        )}

      {/* Instructors summary */}
      {course.instructors.length > 0 && (
        <p className="text-xs text-slate-600 font-medium">
          <span className="font-semibold text-slate-800">Faculty:</span> {course.instructors.join(" · ")}
        </p>
      )}

      {/* Advisor rationale */}
      {course.selectionReason && (
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5 mt-auto">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between text-left gap-2"
          >
            <span className="text-xs font-bold text-amber-900">
              Why this was selected
            </span>
            {expanded ? (
              <ChevronUp size={14} className="text-amber-700 shrink-0" />
            ) : (
              <ChevronDown size={14} className="text-amber-700 shrink-0" />
            )}
          </button>

          <p
            className={`text-xs text-amber-900/90 mt-2 leading-relaxed whitespace-pre-line ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {course.selectionReason}
          </p>

          {course.systemReason &&
            course.systemReason !== course.selectionReason &&
            course.selectionSource === "RECOMMENDED" && (
              <p className="text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-amber-200/50">
                <span className="font-semibold text-slate-700">System:</span> {course.systemReason}
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
  const sapid = student?.User?.sapid ?? "—";
  const batch = student?.BatchModel;
  const program = batch?.ProgramModel?.programName ?? "—";

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all w-full">
      {/* Student header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full 
          flex 
          items-center 
          justify-between 
          gap-4 
          px-4 
          py-4 
          hover:bg-slate-50 
          transition-colors 
          text-left
        "
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div
            className="
              w-11 h-11 
              rounded-xl 
              bg-[#1e3a5f]/10 
              flex 
              items-center 
              justify-center 
              text-[#1e3a5f] 
              font-bold 
              text-base 
              shrink-0
            "
          >
            {student?.studentName?.charAt(0) ?? "?"}
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#1e3a5f] truncate">
              {student?.studentName ?? "—"}
            </h4>

            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              SAP: <strong className="text-slate-700">{sapid}</strong> · Semester {student?.currentSemester ?? "—"} · {program}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[#1e3a5f]">
              {courses.length} Course{courses.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs font-medium text-amber-600">
              {log.totalCredits ?? 0} Credits
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Collapsible course list */}
      {open && (
        <div className="border-t border-slate-100 p-2 sm:p-3 bg-slate-50/50 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 w-full">
            {courses.map((c, i) => (
              <CourseDetailCard
                key={`${c.courseId ?? "noid"}-${c.courseName}-${i}`}
                course={c}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 mt-4 border-t border-slate-200 px-1">
            <p className="text-xs text-slate-500 font-medium">
              Finalized on{" "}
              {new Date(
                log.updatedAt ?? log.createdAt
              ).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {log.notes && (
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">Note:</strong> {log.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export const AdvisoryLogs: React.FC<AdvisoryLogsProps> = ({
  onBack,
  onOpenStudentRecommendations,
}) => {
  const {
    advisoryLogs,
    isLoadingLogs,
    logsError,
    fetchAdvisoryLogs,
  } = useRecommendations();

  const [searchTerm, setSearchTerm] = useState("");

  const { userProfile } = useUserProfile();
  const role = userProfile?.role;
  const isAdvisor = role === "advisor";

  useEffect(() => {
    fetchAdvisoryLogs();
  }, [fetchAdvisoryLogs]);

  const logsArray = Array.isArray(advisoryLogs)
    ? advisoryLogs
    : [];

  /* ── Filter by search term ───────────────────────────────────────── */

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logsArray;

    const q = searchTerm.toLowerCase();

    return logsArray.filter((log: any) => {
      const name =
        log.Student?.studentName?.toLowerCase() ?? "";

      const sapid = String(
        log.Student?.User?.sapid ?? ""
      );

      return name.includes(q) || sapid.includes(q);
    });
  }, [logsArray, searchTerm]);

  /* ── Group by session → student ──────────────────────────────────── */

  const groupedBySession = useMemo(() => {
    const sessions: Record<
      string,
      {
        sessionLabel: string;
        studentMap: Record<number, any[]>;
      }
    > = {};

    for (const log of filteredLogs) {
      if (log.Session) {
        const session = log.Session ?? {};

        const label =
          `${session.sessionType ?? "UNKNOWN"} ${
            session.sessionYear ?? ""
          }`.trim();

        const studentId = log.studentId ?? 0;

        if (!sessions[label]) {
          sessions[label] = {
            sessionLabel: label,
            studentMap: {},
          };
        }

        if (!sessions[label].studentMap[studentId]) {
          sessions[label].studentMap[studentId] = [];
        }

        sessions[label].studentMap[studentId].push(log);
      }
    }

    return Object.values(sessions)
      .sort((a, b) =>
        b.sessionLabel.localeCompare(a.sessionLabel)
      )
      .map((s) => ({
        ...s,
        students: Object.values(s.studentMap)
          .flat()
          .sort((a: any, b: any) =>
            (a.Student?.studentName ?? "").localeCompare(
              b.Student?.studentName ?? ""
            )
          ),
      }));
  }, [filteredLogs]);

  /* ── Loading ─────────────────────────────────────────────────────── */

  if (isLoadingLogs) {
    return (
      <div className="w-full py-4 font-sans">
        <button
          title="Back"
          onClick={onBack}
          className="p-3 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-200 mb-6 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────── */

  if (logsError) {
    return (
      <div className="w-full py-4 font-sans">
        <button
          title="Back"
          onClick={onBack}
          className="p-3 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-200 mb-6 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center py-20">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-500">
            <AlertCircle size={28} />
          </div>

          <h3 className="text-base font-bold text-[#1e3a5f] mb-1">
            Failed to Load Logs
          </h3>

          <p className="text-xs text-slate-500 text-center max-w-xs mb-6">
            {logsError}
          </p>

          <button
            onClick={fetchAdvisoryLogs}
            className="px-6 py-2.5 bg-[#1e3a5f] text-white text-xs font-semibold rounded-xl hover:bg-amber-500 transition-all"
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
      <div className="w-full py-4 font-sans">
        <button
          title="Back"
          onClick={onBack}
          className="p-3 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-200 mb-6 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
            <BookOpen size={22} />
          </div>

          <p className="text-slate-500 font-semibold text-xs tracking-wide">
            {searchTerm
              ? "No matching records found"
              : "No advisory logs yet"}
          </p>
        </div>
      </div>
    );
  }

  /* ── Main view ───────────────────────────────────────────────────── */

  return (
    <div className="w-full py-4 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8 px-2">
        <button
          title="Back"
          onClick={onBack}
          className="
            p-3 
            hover:bg-slate-100 
            bg-white 
            shadow-sm 
            rounded-full 
            text-[#1e3a5f] 
            transition-colors 
            w-fit 
            border 
            border-slate-200
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
              Advisory Logs
            </h2>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Grouped by Session · {groupedBySession.length}{" "}
              session{groupedBySession.length !== 1 ? "s" : ""} ·{" "}
              {filteredLogs.length} total record
              {filteredLogs.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isAdvisor ? (
            <div className="relative w-full lg:w-auto">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search student or SAP ID..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="
                  w-full 
                  sm:w-[320px]
                  pl-10 
                  pr-4 
                  py-3 
                  bg-white 
                  border 
                  border-slate-200 
                  rounded-xl 
                  text-sm 
                  font-medium
                  text-slate-900
                  placeholder:text-slate-400
                  shadow-sm
                  focus:ring-2 
                  focus:ring-amber-400 
                  focus:border-transparent
                  outline-none
                  transition-all
                "
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenStudentRecommendations}
                className="px-5 py-2.5 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl transition-all hover:bg-amber-500 shadow-sm"
              >
                System Generated Recommendations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Session sections */}
      <div className="space-y-8 w-full">
        {groupedBySession.map((session) => (
          <div
            key={session.sessionLabel}
            className="space-y-4 w-full"
          >
            {/* Session header */}
            <div
              className="
                flex 
                flex-wrap 
                items-center 
                gap-3
                sticky 
                top-0 
                z-10 
                bg-slate-50/90 
                backdrop-blur-md 
                py-3 
                px-3
                border-y
                border-slate-200/60
                w-full
              "
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg shadow-sm">
                <Calendar size={13} />
                <span className="text-xs font-bold tracking-wide">
                  {session.sessionLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Users size={14} />
                {session.students.length} student
                {session.students.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Students in this session */}
            <div className="space-y-3 w-full">
              {session.students.map((log: any) => (
                <StudentBlock
                  key={log.id}
                  log={log}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};