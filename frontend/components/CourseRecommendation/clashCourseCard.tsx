/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CourseRecommendation/ClashCourseCard.tsx
import React from 'react';
import { AlertCircle, Clock, XCircle, CheckCircle, Info } from 'lucide-react';

interface ClashCourseCardProps {
  course: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ClashCourseCard: React.FC<ClashCourseCardProps> = ({ 
  course, 
  isExpanded, 
  onToggle 
}) => {
  const isClash = course.isNotSuggested || course.notSuggestedReason === 'TIME_CLASH';
  const hasAlternative = !!course.alternative;

  return (
    <div className={`bg-white border ${isClash ? 'border-red-200' : 'border-slate-100'} rounded-xl overflow-hidden shadow-sm`}>
      
      {/* Header */}
      <div className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={onToggle}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isClash ? 'bg-red-50' : 'bg-[#1e3a5f]/10'
                }`}>
                  {isClash ? (
                    <XCircle size={18} className="text-red-500" />
                  ) : (
                    <CheckCircle size={18} className="text-green-500" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-[#1e3a5f] mb-1">
                  {course.originalCourseName || course.courseName}
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                    {course.category}
                  </span>
                  <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                    {course.credits || 3} Credits
                  </span>
                  {isClash && (
                    <span className="text-[9px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-md uppercase border border-red-200">
                      <AlertCircle size={10} className="inline mr-1" />
                      Time Clash
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4">
          
          {/* Clash Details */}
          {isClash && course.clashRecord && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h5 className="text-[9px] font-black text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertCircle size={12} />
                Time Clash Details
              </h5>
              <p className="text-xs text-red-700 font-medium mb-2">
                Conflicts with: {course.clashRecord.clashesWith}
              </p>
              <div className="text-xs text-red-600 font-mono bg-white p-2 rounded-lg border border-red-100">
                {course.clashRecord.timeSlot}
              </div>
              {course.clashRecord.clashDetails?.detailedClashes?.map((clash: any, idx: number) => (
                <div key={idx} className="mt-2 text-xs text-red-600 bg-white p-2 rounded-lg border border-red-100">
                  <p>⏰ {clash.time}</p>
                  <p>📚 {clash.courseName}</p>
                </div>
              ))}
            </div>
          )}

          {/* Alternative Suggestion */}
          {hasAlternative && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h5 className="text-[9px] font-black text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle size={12} />
                Best Alternative
              </h5>
              <p className="text-sm font-black text-[#1e3a5f]">
                {course.alternative.courseName}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[8px] font-bold text-slate-500 uppercase bg-white px-2 py-0.5 rounded-md">
                  {course.alternative.credits} Credits
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase bg-white px-2 py-0.5 rounded-md">
                  Score: {course.alternative.score}
                </span>
                {course.alternative.bestMatchDetails?.sameSemester && (
                  <span className="text-[8px] font-bold text-green-600 uppercase bg-white px-2 py-0.5 rounded-md">
                    ✅ Same Semester
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {course.alternative.reason}
              </p>
            </div>
          )}

          {/* All Available Alternatives */}
          {course.alternative?.allAlternatives?.available?.length > 0 && (
            <div>
              <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info size={12} />
                All Available Alternatives ({course.alternative.totalAvailable})
              </h5>
              <div className="space-y-2">
                {course.alternative.allAlternatives.available.map((alt: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-[#1e3a5f]">{alt.courseName}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-bold text-slate-500">{alt.credits} Credits</span>
                        <span className="text-[8px] font-bold text-slate-500">Score: {alt.score}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      Available
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Clash Alternatives */}
          {course.alternative?.allAlternatives?.timeClashes?.length > 0 && (
            <div>
              <h5 className="text-[9px] font-black text-orange-600 uppercase tracking-wider mb-2">
                ⚠️ Other Courses with Time Clashes
              </h5>
              <div className="space-y-2">
                {course.alternative.allAlternatives.timeClashes.map((tc: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-xs font-bold text-[#1e3a5f]">{tc.courseName}</p>
                    <p className="text-[9px] text-orange-600">{tc.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Offered Courses */}
          {course.alternative?.allAlternatives?.notOffered?.length > 0 && (
            <div>
              <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">
                📌 Courses Not Offered
              </h5>
              <div className="space-y-2">
                {course.alternative.allAlternatives.notOffered.map((no: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-[#1e3a5f]">{no.courseName}</p>
                    <p className="text-[9px] text-slate-500">{no.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};