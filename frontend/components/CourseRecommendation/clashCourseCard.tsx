/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface ClashCourseCardProps {
  course: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ClashCourseCard({ course, isExpanded, onToggle }: ClashCourseCardProps) {
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