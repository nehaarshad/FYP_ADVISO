/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ShieldAlert, AlertCircle, ChevronDown, ChevronUp, Clock,
  CheckCircle2, BookOpen, Layers,
  Loader2, Sparkles, Split, ListChecks, Target, Info,
} from "lucide-react";
import { useRecommendations } from "@/src/hooks/recommendationHook/useCourseRecommendationHook";
import type {
  SuggestedCourse,
  ElectiveOption,
  CourseTimetable,
  CombinedTimetableDetails,
  NormalTimetableDetails,
} from "@/src/models/systemSuggestedCoursesModel";

export interface DashboardSummary {
  recommendationText: string;
  creditLimits: { allowed: number; required: number | null; difference: number | null };
  totalCoursesRecommended: number;
  hasWarnings: boolean;
  hasSpecialRequests: boolean;
}

export interface CourseSectionData {
  critical: SuggestedCourse[];
  high: SuggestedCourse[];
  medium: SuggestedCourse[];
  low: SuggestedCourse[];
}

interface UseCourseDataArgs {
  studentId: number;
  sessionType: string;
  sessionYear: number;
  autoGenerate?: boolean;
}

function useCourseData({
  studentId,
  sessionType,
  sessionYear,
  autoGenerate = true,
}: UseCourseDataArgs) {
  const rec = useRecommendations();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [electiveChoice, setElectiveChoice] = useState<Record<string, ElectiveOption>>({});
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

  const { generateRecommendations } = rec;

  useEffect(() => {
    if (!autoGenerate || !studentId || !sessionType || !sessionYear) return;
    generateRecommendations(studentId, sessionType, sessionYear);
  }, [studentId, sessionType, sessionYear, autoGenerate, generateRecommendations]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const selectElectiveOption = useCallback(
    (courseName: string, option: ElectiveOption) => {
      setElectiveChoice(prev => ({ ...prev, [courseName]: option }));
      setOpenDropdown(prev => ({ ...prev, [courseName]: false }));
    },
    []
  );

  const summary: DashboardSummary | null = useMemo(() => {
    if (!rec.llmRecommendations) return null;
    const s = rec.llmRecommendations.summary;
    const allowed = rec.allowedCreditHours ?? 18;
    const required = rec.requiredCreditHours ?? null;
    return {
      recommendationText: rec.llmRecommendations.detailedExplanation ?? "",
      creditLimits: {
        allowed,
        required,
        difference: required != null ? allowed - required : null,
      },
      totalCoursesRecommended: s.totalCoursesRecommended ?? 0,
      hasWarnings: s.hasWarnings ?? false,
      hasSpecialRequests: s.hasSpecialRequests ?? false,
    };
  }, [rec.llmRecommendations, rec.allowedCreditHours, rec.requiredCreditHours]);

  const grouped: CourseSectionData = useMemo(() => {
    const r = rec.llmRecommendations?.recommendations;
    return {
      critical: r?.critical ?? [],
      high: r?.high ?? [],
      medium: r?.medium ?? [],
      low: r?.low ?? [],
    };
  }, [rec.llmRecommendations]);

  return {
    // data
    summary,
    sessionId: rec.sessionId,
    grouped,
    allCourses: rec.allRecommendedCourses,
    llmRecommendations: rec.llmRecommendations,
    selectedCourses: rec.selectedCourses,
    totalSelectedCredits: rec.totalSelectedCredits,
    allowedCreditHours: rec.allowedCreditHours,
    requiredCreditHours: rec.requiredCreditHours,

    // state
    isGenerating: rec.isGenerating,
    isFinalizing: rec.isFinalizing,
    generateError: rec.generateError,
    finalizeError: rec.finalizeError,
    expandedId,
    electiveChoice,
    openDropdown,

    // actions
    toggleExpand,
    toggleDropdown,
    selectElectiveOption,
    toggleCourseSelection: rec.toggleCourseSelection,
    upsertCourseSelection: rec.upsertCourseSelection,
    isCourseSelected: rec.isCourseSelected,
    finalizeRecommendations: rec.finalizeRecommendations,
    resetRecommendations: rec.resetRecommendations,
    generateRecommendations: rec.generateRecommendations,
  };
}

/* ─────────────────────────────────────────────── DashboardHeader ─────────────────────────────────────────────── */

function DashboardHeader({
  summary,
  isGenerating,
  onRegenerate,
}: {
  summary: DashboardSummary;
  isGenerating: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Layers size={14} />
          <span>Academic Advising Portal</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Semester Recommendation &amp; Clash Resolution
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          {summary.recommendationText || "Recommendations loaded."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase hover:bg-indigo-100 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isGenerating ? "Regenerating…" : "Regenerate"}
        </button>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl shrink-0">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Credit Hours</p>
            <p className="text-lg font-black text-gray-900">
              {summary.creditLimits.allowed} Allowed
              {summary.creditLimits.required != null && (
                <span className="text-xs font-bold text-gray-500 ml-1">
                  / {summary.creditLimits.required} req.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── CourseSection ─────────────────────────────────────────────── */

export function CourseSection({
  title, courses, badgeColor,
  selectedElectiveOptions, openDropdowns, toggleDropdown, selectOption,
  isCourseSelected, toggleCourseSelection, upsertCourseSelection,
  expandedCourses, toggleCourseExpand,
}: {
  title: string;
  courses: SuggestedCourse[];
  badgeColor: string;
  selectedElectiveOptions: Record<string, ElectiveOption>;
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (courseName: string) => void;
  selectOption: (courseName: string, option: ElectiveOption) => void;
  isCourseSelected: (courseId: number | null, courseName: string) => boolean;
  toggleCourseSelection: (course: SuggestedCourse, override?: Partial<SuggestedCourse>) => void;
  upsertCourseSelection: (course: SuggestedCourse, override?: Partial<SuggestedCourse>) => void;
  expandedCourses: Set<string>;
  toggleCourseExpand: (key: string) => void;
}) {
  if (!courses?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">{title}</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${badgeColor}`}>
          {courses.length} Course{courses.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, idx) => {
          const key = `${course.courseId ?? 'noid'}-${course.originalCourseName ?? course.courseName}-${idx}`;
          const isClash =
            course.isNotSuggested ||
            course.notSuggestedReason === 'TIME_CLASH' ||
            !!course.clashRecord;

          if (isClash) {
            const substitute = (course as any).substituteDetails as
              | {
                  courseName: string;
                  credits?: number;
                  timeSlot?: string | null;
                  timetableDetails?: any[];
                  reason?: string;
                  offering?: {
                    id?: number;
                    courseCategory?: string;
                    ProgramModel?: { programName?: string };
                    BatchModel?: { batchName?: string; batchYear?: string };
                  };
                }
              | undefined;

            const substituteSelected =
              !!substitute &&
              isCourseSelected(substitute.offering?.id ?? null, substitute.courseName);

            const primarySelected = isCourseSelected(course.courseId, course.courseName);

            return (
              <ClashCourseCard
                key={key}
                course={course}
                isExpanded={expandedCourses.has(key)}
                onToggle={() => toggleCourseExpand(key)}

                /* ── select the CLASHED COURSE itself ── */
                primarySelected={primarySelected}
                onSelectPrimary={() => {
                  toggleCourseSelection(course, {
                    _selectionSource: 'RECOMMENDED',
                    _selectionReason:
                      `Advisor accepted "${course.originalCourseName ?? course.courseName}" ` +
                      `despite the ${course.notSuggestedReason ?? 'unresolved'} conflict ` +
                      `(${course.clashRecord?.clashesWith ?? 'clash'} at ${course.clashRecord?.clashDetails ?? '—'}). ` +
                      `Lab will be handled separately / deferred.`,
                  });
                }}

                /* ── select the SUBSTITUTE (when one exists) ── */
                substitute={substitute}
                substituteSelected={substituteSelected}
                onSelectSubstitute={() => {
                  if (!substitute) return;
                  upsertCourseSelection(
                    {
                      courseId: substitute.offering?.id ?? null,
                      courseName: substitute.courseName,
                      credits: substitute.credits ?? 3,
                      category: substitute.offering?.courseCategory ?? course.category,
                      reason:
                        `Substitute for "${course.originalCourseName ?? course.courseName}" ` +
                        `(lab clash with ${course.clashRecord?.clashesWith ?? 'another course'}).`,
                      isOffered: true,
                      offeredProgram:
                        substitute.offering?.ProgramModel?.programName ?? null,
                      timeSlot: substitute.timeSlot ?? null,
                      timetableDetails: substitute.timetableDetails ?? [],
                      hasLab: false,
                      batch: substitute.offering?.BatchModel?.batchName ?? undefined,
                      actionRequired: 'SUBSTITUTE_FOR_LAB_CLASH',
                      priority: course.priority,
                      originalCourseName: course.originalCourseName ?? course.courseName,
                    } as SuggestedCourse,
                    {
                      _selectionSource: 'ALTERNATIVE_FOR_CLASH',
                      _substituteFor: course.originalCourseName ?? course.courseName,
                      _selectionReason:
                        `Advisor chose "${substitute.courseName}" as the substitute for ` +
                        `"${course.originalCourseName ?? course.courseName}". ` +
                        `Resolves the ${course.clashRecord?.clashesWith ?? 'lab'} lab clash.`,
                    }
                  );
                }}

                /* ── legacy `alternative` path ── */
                alternativeSelected={
                  !!course.alternative &&
                  isCourseSelected(
                    course.alternative.courseId ?? null,
                    course.alternative.courseName
                  )
                }
                onSelectAlternative={() => {
                  const alt = course.alternative;
                  if (!alt) return;
                  const altMeta = course.allAlternatives?.available?.find(
                    (a: any) => a.courseName === alt.courseName
                  );
                  upsertCourseSelection(
                    {
                      courseId: alt.courseId ?? null,
                      courseName: alt.courseName,
                      credits: alt.credits,
                      category: alt.category ?? altMeta?.category ?? course.category,
                      reason: alt.reason ?? 'Suggested alternative for clash',
                      isOffered: true,
                      offeredProgram: alt.offeredProgram ?? alt.program ?? null,
                      timeSlot: alt.timeSlot ?? null,
                      timetableDetails: alt.timetableDetails ?? altMeta?.timetableDetails,
                      hasLab: alt.hasLab ?? false,
                      labDetails: alt.labDetails ?? null,
                      batch: alt.batch,
                      semester: alt.bestMatchDetails?.semester ?? altMeta?.semester,
                      score: alt.score,
                      actionRequired: alt.actionRequired ?? 'ALTERNATIVE_FOR_CLASH',
                      priority: course.priority,
                      originalCourseName: alt.originalCourseName ?? course.originalCourseName,
                    } as SuggestedCourse,
                    {
                      _selectionSource: 'ALTERNATIVE_FOR_CLASH',
                      _substituteFor: course.originalCourseName ?? course.courseName,
                      _selectionReason: `Advisor chose "${alt.courseName}" as the clash-free alternative to "${course.originalCourseName ?? course.courseName}".`,
                    }
                  );
                }}
              />
            );
          }

          /* ── Regular / elective card ──
           * Electives key by parent slot; regulars key by real courseName.
           */
          const slotKey = course.originalCourseName ?? course.courseName;
          const isElectiveCourse = (course.electiveOptions?.length ?? 0) > 0;

          const chosenElective = isElectiveCourse
            ? selectedElectiveOptions[slotKey] ??
              course.categorizedOptions?.bestMatch ??
              null
            : null;

          const isSelected = isElectiveCourse
            ? isCourseSelected(course.courseId, slotKey)
            : isCourseSelected(course.courseId, course.courseName);

          return (
            <RegularCourseCard
              key={key}
              course={course}
              isSelected={isSelected}
              onToggle={() => {
                if (isElectiveCourse) {
                  const pick = chosenElective ?? course.categorizedOptions?.bestMatch ?? null;
                  if (!pick) {
                    toggleDropdown(slotKey);
                    return;
                  }
                  const override: Partial<SuggestedCourse> = {
                    courseName: pick.courseName ?? course.courseName,
                    originalCourseName: slotKey,
                    credits: pick.credits ?? course.credits,
                    timeSlot: pick.timeSlot ?? course.timeSlot,
                    timetableDetails: course.timetableDetails,
                    category: course.category,
                    isElective: true,
                    actionRequired: 'ELECTIVE_FULFILLED',
                    semester: (pick as any).semester ?? undefined,
                    program: (pick as any).program ?? undefined,
                    _selectionSource: 'ELECTIVE_OPTION',
                    _electiveOption: { ...pick },
                    _selectionReason: `Advisor fulfilled "${slotKey}" with "${pick.courseName}".`,
                  };
                  toggleCourseSelection(course, override);
                  return;
                }

                toggleCourseSelection(course, {
                  _selectionSource: 'RECOMMENDED',
                  _selectionReason: `Advisor accepted the system's recommendation. Reason: ${course.reason ?? 'n/a'}`,
                });
              }}
              chosenElective={chosenElective}
              dropdownOpen={isElectiveCourse ? !!openDropdowns[slotKey] : false}
              onToggleDropdown={() => toggleDropdown(slotKey)}
              onSelectElective={(opt: ElectiveOption) => {
                selectOption(slotKey, opt);

                const override: Partial<SuggestedCourse> = {
                  courseName: opt.courseName ?? course.courseName,
                  originalCourseName: slotKey,
                  credits: opt.credits ?? course.credits,
                  timeSlot: opt.timeSlot ?? course.timeSlot,
                  timetableDetails: opt.timetableDetails ?? course.timetableDetails,
                  category: course.category,
                  isElective: true,
                  actionRequired: 'ELECTIVE_FULFILLED',
                  semester: opt.semester ?? undefined,
                  program: opt.program ?? undefined,
                  _selectionSource: 'ELECTIVE_OPTION',
                  _electiveOption: { ...opt },
                  _selectionReason: `Advisor fulfilled "${slotKey}" with "${opt.courseName}" (${opt.matchReason}).`,
                };

                upsertCourseSelection(course, override);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── ClashCourseCard ─────────────────────────────────────────────── */

function ClashCourseCard({
  course,
  isExpanded,
  onToggle,
  primarySelected,
  onSelectPrimary,
  substitute,
  substituteSelected,
  onSelectSubstitute,
  alternativeSelected,
  onSelectAlternative,
}: {
  course: SuggestedCourse;
  isExpanded: boolean;
  onToggle: () => void;

  primarySelected: boolean;
  onSelectPrimary: () => void;

  substitute?: {
    courseName: string;
    credits?: number;
    timeSlot?: string | null;
    timetableDetails?: any[];
    reason?: string;
  };
  substituteSelected?: boolean;
  onSelectSubstitute?: () => void;

  alternativeSelected: boolean;
  onSelectAlternative: () => void;
}) {
  const courseName = course.originalCourseName || course.courseName;
  const credits = course.credits ?? 3;
  const alt = course.alternative;

  const clashArray = course.clashRecord?.clashDetails?.detailedClashes ?? [];

  const altMeta = course.allAlternatives?.available?.find(
    (a: any) => a.courseName === alt?.courseName
  ) as any | undefined;

  const altSlots: CourseTimetable[] = Array.isArray(alt?.timetableDetails)
    ? (alt!.timetableDetails as CourseTimetable[])
    : ((alt?.timetableDetails as CombinedTimetableDetails | undefined)?.lecture ?? []);

  const altLab: CourseTimetable[] = Array.isArray(alt?.timetableDetails)
    ? []
    : ((alt?.timetableDetails as CombinedTimetableDetails | undefined)?.lab ?? []);

  const altSemester = alt?.bestMatchDetails?.semester ?? altMeta?.semester;
  const altCategory = altMeta?.category;

  /* Resolve the substitute-or-alternative into one renderable source */
  const subName = substitute?.courseName ?? alt?.courseName;
  const subSlots = substitute?.timetableDetails ?? altSlots;
  const subLab = substitute ? [] : altLab;
  const subCredits = substitute?.credits ?? alt?.credits ?? 3;
  const subSemester = altSemester;
  const subCategory = altCategory;
  const subReason = substitute?.reason ?? alt?.reason;
  const subSelected = substituteSelected ?? alternativeSelected;
  const onSelectSub = onSelectSubstitute ?? onSelectAlternative;
  const hasSubstitute = !!subName;

  return (
    <div className="border-2 border-red-200 bg-red-50/40 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-100 border-2 border-red-200 flex items-center justify-center shrink-0 text-red-600">
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-bold uppercase">
              {course.notSuggestedReason === 'LAB_CLASH_UNRESOLVED'
                ? 'Lab Clash Unresolved'
                : 'Time Clash / Not Suggested'}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[9px] font-bold uppercase">
              {course.priority ?? "CRITICAL"}
            </span>
            {hasSubstitute && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-bold uppercase border border-blue-100">
                Substitute Available
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base uppercase leading-tight">
            {courseName}
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
          {credits} Credits
        </span>
      </div>

      {/* Clash reason */}
      <div className="text-xs bg-white p-3 rounded-xl border border-red-100 text-red-700 space-y-1 shadow-xs">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            {course.reason || course.notSuggestedReason || "Schedule conflict detected."}
          </p>
        </div>
        {course.clashRecord?.clashesWith && (
          <p className="text-[11px] font-semibold text-red-800 pl-6 pt-1 border-t border-red-100">
            Conflicting with:{" "}
            <span className="font-bold">{course.clashRecord.clashesWith}</span>
          </p>
        )}
      </div>

      {/* ACTION: Select Anyway (Advisor Override) */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onSelectPrimary();
        }}
        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
          primarySelected
            ? "bg-amber-50 border-amber-400"
            : "bg-white border-amber-200 hover:bg-amber-50"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <Target size={13} className="text-amber-600" />
              <span>Select Anyway (Advisor Override)</span>
            </div>
            <p className="text-[10px] text-amber-800/80 mt-1 leading-snug">
              Adds {course.originalCourseName ?? course.courseName} to the final
              recommendation despite the clash. Advisor takes responsibility for the
              {course.clashRecord ? ` ${course.clashRecord.clashesWith}` : ""} conflict.
            </p>
          </div>
          {primarySelected && (
            <CheckCircle2 size={18} className="text-amber-600 shrink-0 mt-0.5" />
          )}
        </div>
      </button>

      {/* ACTION: Substitute */}
      {hasSubstitute && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-blue-800 font-bold">
            <Split size={14} className="text-blue-600" />
            <span>Or Use Suggested Substitute:</span>
          </div>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onSelectSub();
            }}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              subSelected
                ? "bg-emerald-50 border-emerald-300"
                : "bg-white border-blue-100 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 uppercase truncate">{subName}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">
                    {subCredits} cr
                  </span>
                  {subCategory && (
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold uppercase">
                      {subCategory}
                    </span>
                  )}
                  {subSemester != null && (
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-bold uppercase">
                      Sem {subSemester}
                    </span>
                  )}
                </div>

                {subSlots.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-100 space-y-0.5">
                    {subSlots.map((s: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 text-[10px] text-gray-600 font-medium"
                      >
                        <Clock size={10} className="text-blue-600 shrink-0" />
                        <span className="truncate">
                          {s.day} {s.startTime}–{s.endTime}
                          {s.room || s.venue ? ` · ${s.room ?? s.venue}` : ""}
                          {s.instructor ? ` · ${s.instructor}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {subLab.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-blue-100 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase text-purple-700">Lab</p>
                    {subLab.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 text-[10px] text-purple-700 font-medium"
                      >
                        <Clock size={10} className="shrink-0" />
                        <span className="truncate">
                          {s.day} {s.startTime}–{s.endTime}
                          {s.room || s.venue ? ` · ${s.room ?? s.venue}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {subReason && (
                  <p className="text-[10px] text-gray-500 mt-2 italic leading-snug">
                    {subReason}
                  </p>
                )}
              </div>
              {subSelected && (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        </div>
      )}

      {/* Clash details expander */}
      {clashArray.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between text-xs bg-white border border-red-200 text-red-800 px-3 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            <span>
              {isExpanded ? "Hide" : "View"} clash details ({clashArray.length})
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-2 p-3 bg-white border border-red-200 rounded-xl text-xs space-y-1 text-gray-700">
              <p className="font-bold text-red-900 text-[10px] uppercase">
                Conflicting with: {course.clashRecord?.clashesWith ?? "—"}
              </p>
              {clashArray.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-1 text-gray-600">
                  <Clock size={12} className="text-red-500" />
                  <span>
                    {c.day}{" "}
                    {c.startTime && c.endTime ? `${c.startTime}–${c.endTime}` : c.time}
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
}

/* ─────────────────────────────────────────────── RegularCourseCard ─────────────────────────────────────────────── */

function RegularCourseCard({
  course,
  isSelected,
  onToggle,
  chosenElective,
  dropdownOpen,
  onToggleDropdown,
  onSelectElective,
}: {
  course: SuggestedCourse;
  isSelected: boolean;
  onToggle: () => void;
  chosenElective: ElectiveOption | null;
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSelectElective: (opt: ElectiveOption) => void;
}) {
  const courseName = course.courseName || course.originalCourseName;
  const credits = course.credits ?? 3;
  const electives = course.electiveOptions ?? [];
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
    <div
      onClick={onToggle}
      className={`border-2 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all cursor-pointer ${
        isSelected
          ? "border-amber-500 bg-amber-50/20 shadow-md"
          : "border-emerald-100 bg-white hover:border-amber-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
            isSelected
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}
        >
          <CheckCircle2 size={20} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-bold uppercase border border-emerald-100">
              {course.category || course.actionRequired || "ELIGIBLE"}
            </span>
            {course.actionRequired && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-md text-[9px] font-bold text-blue-600 uppercase border border-blue-100">
                <Target size={10} /> {String(course.actionRequired).replace(/_/g, " ")}
              </span>
            )}
            {isElective && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded-md text-[9px] font-bold text-purple-600 uppercase border border-purple-100">
                <Sparkles size={10} /> {electives.length || course.totalOptions || 0} options
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base uppercase leading-tight">
            {courseName}
          </h3>
          {course.originalCourseName && course.originalCourseName !== course.courseName && (
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              replaces: {course.originalCourseName}
            </p>
          )}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
          {credits} Credits
        </span>
      </div>

      {course.reason && (
        <div className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="font-medium">{course.reason}</p>
        </div>
      )}

      {lectureSlots.length > 0 && (
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Schedule:</p>
          {lectureSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1 text-gray-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue ?? "—"})
                {l.instructor ? ` · ${l.instructor}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {labSlots.length > 0 && (
        <div className="text-xs bg-purple-50 border border-purple-100 p-2.5 rounded-xl text-purple-900 font-medium space-y-1">
          <span className="font-bold block">Lab</span>
          {labSlots.map((l, i) => (
            <div key={i} className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="truncate">
                {l.day}: {l.startTime}–{l.endTime} ({l.room ?? l.venue})
              </span>
            </div>
          ))}
        </div>
      )}

      {electives.length > 0 && (
        <div
          className="relative pt-2 border-t border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-xs font-semibold text-gray-700 mb-1">Selected Elective Option:</p>
          <button
            type="button"
            onClick={onToggleDropdown}
            className="w-full flex items-center justify-between text-xs bg-blue-50 border border-blue-200 text-blue-900 px-3 py-2 rounded-xl font-medium hover:bg-blue-100 transition-colors"
          >
            <span className="truncate">
              {chosenElective?.courseName ?? "Select an elective option"}
            </span>
            {dropdownOpen ? (
              <ChevronUp className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
              {electives.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => onSelectElective(opt)}
                  className="p-3 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-800">{opt.courseName}</p>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {opt.credits}cr
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">{opt.matchReason}</p>
                  {opt.timeSlot && (
                    <p className="text-gray-400 text-[10px] mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {opt.timeSlot}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <div className="text-green-700 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
          Eligible
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── DeferredPanel ─────────────────────────────────────────────── */

function DeferredPanel({ raw }: { raw: any }) {
  const deferred = useMemo(() => {
    const list: any[] = [];
    if (Array.isArray(raw?.deferredCourses)) list.push(...raw.deferredCourses);
    if (Array.isArray(raw?.allEligibleCourses)) list.push(...raw.allEligibleCourses);
    return list;
  }, [raw]);

  if (!deferred.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks size={16} className="text-slate-500" />
        <h3 className="text-sm font-black uppercase tracking-tight text-slate-700">
          Deferred / All-Eligible (advisor reference)
        </h3>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deferred.map((c, i) => (
          <li key={i} className="border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-800 uppercase">{c.courseName}</p>
            <p className="text-slate-500">
              {c.credits} credits · {c.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────── CompleteCourseDashboard ─────────────────────────────────────────────── */

export interface CompleteCourseDashboardProps {
  studentId: number;
  studentName: string;
  selectedBatch: string;
  sessionType: string;
  sessionYear: number;
  onFinalized?: () => void;
}

export function CompleteCourseDashboard({
  studentId,
  studentName,
  selectedBatch,
  sessionType,
  sessionYear,
  onFinalized,
}: CompleteCourseDashboardProps) {
  const data = useCourseData({ studentId, sessionType, sessionYear });

  const isOverAllowed =
    data.allowedCreditHours != null &&
    data.totalSelectedCredits > data.allowedCreditHours;

  if (data.isGenerating && !data.llmRecommendations) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-indigo-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Generating recommendations…
          </p>
        </div>
      </div>
    );
  }

  if (data.generateError) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-gray-800 uppercase tracking-tight">
            Generation Failed
          </p>
          <p className="text-xs text-gray-500">{data.generateError}</p>
          <button
            onClick={data.resetRecommendations}
            className="px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase rounded-xl hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data.summary) return null;

  const commonSectionProps = {
    selectedElectiveOptions: data.electiveChoice,
    openDropdowns: data.openDropdown,
    toggleDropdown: data.toggleDropdown,
    selectOption: data.selectElectiveOption,
    isCourseSelected: data.isCourseSelected,
    toggleCourseSelection: data.toggleCourseSelection,
    upsertCourseSelection: data.upsertCourseSelection,
    expandedCourses: new Set<string>(data.expandedId ? [data.expandedId] : []),
    toggleCourseExpand: data.toggleExpand,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader
          summary={data.summary}
          isGenerating={data.isGenerating}
          onRegenerate={() => {
            data.resetRecommendations();
            data.generateRecommendations(studentId, sessionType, sessionYear);
          }}
        />

        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3">
          <div className="text-xs font-bold uppercase text-gray-500">
            {studentName} · Batch {selectedBatch} · {sessionType} {sessionYear}
          </div>
          <div
            className={`text-xs font-bold uppercase px-3 py-1 rounded-lg ${
              isOverAllowed
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {data.totalSelectedCredits} / {data.allowedCreditHours ?? "—"} credits selected
            {isOverAllowed && " · Over limit"}
          </div>
        </div>

        <div className="space-y-6">
          {(["critical", "high", "medium", "low"] as const).map(priority => {
            const courses = data.grouped[priority];
            if (!courses.length) return null;

            const meta = {
              critical: { title: "Critical Priority", badge: "bg-red-100 text-red-700 border-red-200" },
              high: { title: "High Priority", badge: "bg-orange-100 text-orange-700 border-orange-200" },
              medium: { title: "Medium Priority", badge: "bg-yellow-100 text-yellow-800 border-yellow-200" },
              low: { title: "Low Priority", badge: "bg-green-100 text-green-700 border-green-200" },
            }[priority];

            return (
              <CourseSection
                key={priority}
                title={meta.title}
                courses={courses}
                badgeColor={meta.badge}
                {...commonSectionProps}
              />
            );
          })}
        </div>

        <DeferredPanel raw={data.llmRecommendations?.raw} />

        <div className="bg-[#1e3a5f] p-6 md:p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-b-4 border-amber-400">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl uppercase tracking-tighter font-black">
              Finalize Recommendation
            </h3>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1">
              {data.selectedCourses.length === 0
                ? "Select courses above to continue"
                : `Sending ${data.selectedCourses.length} course${data.selectedCourses.length !== 1 ? "s" : ""} · ${data.totalSelectedCredits} credit hrs`}
            </p>
            {isOverAllowed && (
              <p className="text-red-400 text-xs font-bold uppercase mt-1">
                ⚠ Over allowed credit limit
              </p>
            )}
          </div>

          <button
            onClick={async () => {
              const ok = await data.finalizeRecommendations(studentId, data.sessionId ?? 0);
              if (ok) onFinalized?.();
            }}
            disabled={data.selectedCourses.length === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-4 bg-amber-500 text-slate-900 text-xs font-black uppercase rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            {data.isFinalizing ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Sending…
              </>
            ) : (
              "Send Advice to Student"
            )}
          </button>
        </div>

        {data.finalizeError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-xs font-bold text-red-600">{data.finalizeError}</p>
          </div>
        )}
      </div>
    </div>
  );
}