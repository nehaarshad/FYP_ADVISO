/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, BookOpen, Loader2, AlertCircle, Info, ListChecks,
} from 'lucide-react';
import { CourseSection } from './CompleteCourseDashboard';

interface SmartAdvisoryProps {
  studentName: string;
  selectedBatch: string;
  onBack: () => void;
  onSentSuccess: () => void;
  llmRecommendations: any;
  allRecommendedCourses: any[];
  selectedCourses: any[];
  totalSelectedCredits: number;
  allowedCreditHours: number | null;
  requiredCreditHours?: number | null;
  isFinalizing: boolean;
  finalizeError: string | null;
  generateError: string | null;
  toggleCourseSelection: (course: any, override?: any) => void;
  upsertCourseSelection: (course: any, override?: any, parentKey?: string) => void;
  isCourseSelected: (courseId: number | null, courseName: string, originalCourseName?: string | null) => boolean;
  finalizeRecommendations: () => Promise<boolean>;
}

export default function SmartAdvisory({
  studentName, selectedBatch, onBack, onSentSuccess,
  llmRecommendations, allRecommendedCourses, selectedCourses, totalSelectedCredits,
  allowedCreditHours, requiredCreditHours, isFinalizing, finalizeError, generateError,
  toggleCourseSelection, upsertCourseSelection, isCourseSelected, finalizeRecommendations,
}: SmartAdvisoryProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [electiveChoice, setElectiveChoice] = useState<Record<string, any>>({});
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) =>
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const isOverAllowed  = allowedCreditHours  != null && totalSelectedCredits > allowedCreditHours;
  const isOverRequired = requiredCreditHours != null && totalSelectedCredits > requiredCreditHours;

  const handleSend = async () => {
    setLocalError(null);
    if (!selectedCourses.length) return setLocalError('Please select at least one course to send.');
    try {
      const ok = await finalizeRecommendations();
      if (ok) onSentSuccess();
    } catch (err: any) {
      setLocalError(err?.message ?? 'Failed to send recommendations.');
    }
  };

  if (generateError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 px-4">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <p className="text-sm font-bold text-[#1e3a5f] uppercase tracking-tight mb-1">Generation Failed</p>
        <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs mb-6">{generateError}</p>
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 hover:text-[#1e3a5f]">
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

  const grouped = {
    critical: llmRecommendations.recommendations?.critical ?? [],
    high:     llmRecommendations.recommendations?.high     ?? [],
    medium:   llmRecommendations.recommendations?.medium   ?? [],
    low:      llmRecommendations.recommendations?.low      ?? [],
  };
  const summary = llmRecommendations.summary ?? {
    priorityBreakdown: {
      critical: grouped.critical.length, high: grouped.high.length,
      medium: grouped.medium.length, low: grouped.low.length,
    },
    totalCoursesRecommended: allRecommendedCourses.length,
  };

  const commonSectionProps = {
    selectedElectiveOptions: electiveChoice,
    openDropdowns: openDropdown,
    toggleDropdown: (name: string) => setOpenDropdown(p => ({ ...p, [name]: !p[name] })),
    selectOption: (courseName: string, option: any) => {
      setElectiveChoice(p => ({ ...p, [courseName]: option }));
      setOpenDropdown(p => ({ ...p, [courseName]: false }));
    },
    isCourseSelected,
    toggleCourseSelection,
    upsertCourseSelection,
    expandedCourses: expanded,
    toggleCourseExpand: toggleExpand,
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 space-y-8 bg-gray-50 min-h-screen rounded-2xl shadow-sm">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={onBack} className="p-2 hover:bg-slate-100 bg-white shadow-sm rounded-full text-black w-fit mb-3 border border-gray-200">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
              <BookOpen className="text-blue-600" /> System <span className="text-amber-500">Recommendations</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium uppercase tracking-widest">
              {studentName} · Batch: {selectedBatch}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CreditBadge
              label="Credits Selected"
              current={totalSelectedCredits}
              allowed={allowedCreditHours}
              required={requiredCreditHours}
              isOverAllowed={isOverAllowed}
              isOverRequired={isOverRequired}
            />
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

        {(isOverAllowed || isOverRequired) && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-3 rounded-xl text-red-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold">
              {isOverAllowed
                ? `Exceeds allowed credit cap (${allowedCreditHours}). Deselect courses before sending.`
                : `Above required semester load (${requiredCreditHours}). Verify with the advisor — sending still possible under cap of ${allowedCreditHours}.`}
            </p>
          </div>
        )}

        <PriorityGrid summary={summary} fallbackCounts={grouped} />
      </div>

      <div className="space-y-6">
        <CourseSection title="Critical Priority (Retakes & Core Roadmaps)"
          courses={grouped.critical} badgeColor="bg-red-100 text-red-700 border-red-200" {...commonSectionProps} />
        <CourseSection title="High Priority Courses"
          courses={grouped.high} badgeColor="bg-orange-100 text-orange-700 border-orange-200" {...commonSectionProps} />
        <CourseSection title="Medium Priority / Electives & Clashes"
          courses={grouped.medium} badgeColor="bg-yellow-100 text-yellow-800 border-yellow-200" {...commonSectionProps} />
        {grouped.low.length > 0 && (
          <CourseSection title="Low Priority Courses"
            courses={grouped.low} badgeColor="bg-green-100 text-green-700 border-green-200" {...commonSectionProps} />
        )}
      </div>

      <DeferredPanel raw={llmRecommendations.raw} />

      {llmRecommendations.specialRequests?.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">Special Offering Requests</p>
          <div className="space-y-3">
            {llmRecommendations.specialRequests.map((req: any, i: number) => (
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
          <h3 className="text-lg md:text-xl uppercase tracking-tighter font-bold">Finalize Recommendation</h3>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1">
            {selectedCourses.length === 0
              ? 'Select courses above to continue'
              : `Sending ${selectedCourses.length} course${selectedCourses.length !== 1 ? 's' : ''} · ${totalSelectedCredits} credit hrs`}
          </p>
        </div>
        <button onClick={handleSend} disabled={selectedCourses.length === 0 || isFinalizing || isOverAllowed}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-4 bg-amber-500 text-slate-900 text-xs font-bold uppercase rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95">
          {isFinalizing ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : 'Send Advice to Student'}
        </button>
      </div>
    </div>
  );
}

/* ─── Small pieces ─── */

function CreditBadge({ label, current, allowed, required, isOverAllowed, isOverRequired }: any) {
  const tone = isOverAllowed ? 'bg-red-50 border-red-200 text-red-600'
             : isOverRequired ? 'bg-amber-50 border-amber-200 text-amber-700'
             : 'bg-blue-50 border-blue-100 text-blue-900';
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${tone}`}>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</p>
        <p className="text-lg font-bold">
          {current} / <span className="opacity-70">{allowed ?? '—'} Allowed</span>
          {required != null && <span className="text-xs ml-2 opacity-70">· req {required}</span>}
          {isOverAllowed && <span className="text-xs text-red-500 block font-bold">⚠ Over limit</span>}
        </p>
      </div>
    </div>
  );
}

function PriorityGrid({ summary, fallbackCounts }: any) {
  const b = summary.priorityBreakdown ?? {};
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
      <Stat label="Critical Priority" value={b.critical ?? fallbackCounts.critical.length} tone="red" />
      <Stat label="High Priority"     value={b.high     ?? fallbackCounts.high.length}     tone="orange" />
      <Stat label="Medium Priority"   value={b.medium   ?? fallbackCounts.medium.length}   tone="yellow" />
      <Stat label="Total Recommended" value={summary.totalCoursesRecommended ?? 0}        tone="green" />
    </div>
  );
}

function Stat({ label, value, tone }: any) {
  const map: Record<string, string> = {
    red: 'bg-red-50 border-red-100 text-red-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700',
    green: 'bg-green-50 border-green-100 text-green-700',
  };
  return (
    <div className={`${map[tone]} border p-4 rounded-xl text-center`}>
      <span className="text-xs font-semibold uppercase">{label}</span>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function DeferredPanel({ raw }: { raw: any }) {
  const deferred = useMemo(() => {
    const list: any[] = [];
    const pc = raw?.priorityWiseCourses ?? {};
    ['critical','high','medium','low'].forEach(p => {
      (pc[p] ?? []).forEach((c: any) => {
        if (c.deferred || c.isDeferred || c.beyondCap) list.push({ ...c, _prio: p });
      });
    });
    if (Array.isArray(raw?.deferredCourses)) list.push(...raw.deferredCourses);
    if (Array.isArray(raw?.allEligibleCourses)) list.push(...raw.allEligibleCourses);
    return list;
  }, [raw]);

  if (!deferred.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks size={16} className="text-slate-500" />
        <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">
          Deferred / All-Eligible (advisor reference)
        </h3>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deferred.map((c, i) => (
          <li key={i} className="border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-800 uppercase">{c.courseName}</p>
            <p className="text-slate-500">{c.credits} credits · {c.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}