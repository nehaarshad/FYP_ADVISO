/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CourseRecommendation/ViewRecommedCourse.tsx
import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useStudentRecommendations } from '@/src/hooks/recommendationHook/useStudentRecommendation';

interface ViewRecommedCourseProps {
  onBack?: () => void;
}

export const ViewRecommedCourse: React.FC<ViewRecommedCourseProps> = ({ 
  onBack 
}) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  
  // Use the hook
  const { 
    recommendations, 
    isLoading, 
    error, 
    fetchStudentRecommendations 
  } = useStudentRecommendations();

  // Fetch recommendations when component mounts
  useEffect(() => {
    fetchStudentRecommendations();
  }, [fetchStudentRecommendations]);

  const toggleCourseExpand = (courseId: number | null, index: number) => {
    const key = courseId !== null ? courseId : index;
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getActionBadge = (actionRequired: string) => {
    switch (actionRequired) {
      case 'REGISTER':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, text: 'Register' };
      case 'RETAKE':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, text: 'Must Retake' };
      case 'IMPROVEMENT_RECOMMENDED':
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle, text: 'Improvement Recommended' };
      case 'SUBSTITUTE':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Info, text: 'Substitute Available' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: BookOpen, text: actionRequired };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50/30';
      case 'high':
        return 'border-l-orange-500 bg-orange-50/30';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/30';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const handleRefresh = () => {
    fetchStudentRecommendations();
  };

  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto p-4 md:p-6">
        <button   
          title='btn'
          onClick={onBack} 
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-4">
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto p-4 md:p-6">
        <button 
          title='btn'
          onClick={onBack} 
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
            No Recommendations Found
          </p>
          <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-6 px-4 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl hover:bg-amber-500 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if recommendations exist and have courses
  if (!recommendations || !recommendations.courses || recommendations.courses.length === 0) {
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto p-4 md:p-6">
        <button  
          title='btn'
          onClick={onBack} 
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 mb-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-amber-400" />
          </div>
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
            No Course Recommendations
          </p>
          <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs">
            Your advisor hasn&lsquo;t provided any course recommendations for this session.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-6 px-4 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl hover:bg-amber-500 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button  
          title='btn'
          onClick={onBack} 
          className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 hover:bg-slate-50 transition-colors"
            title="Refresh recommendations"
          >
            <RefreshCw size={18} />
          </button>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(recommendations.sentAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6e] rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">
          Your Course Recommendations
        </h2>
        <p className="text-sm text-white/80">
          Based on your academic progress and program requirements
        </p>
        <div className="flex flex-wrap gap-4 mt-4 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-400" />
            <span className="text-xs font-medium">
              Session: {recommendations.sessionType} {recommendations.sessionYear}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-amber-400" />
            <span className="text-xs font-medium">
              Total Credits: {recommendations.totalCredits}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-xs font-medium">
              {recommendations.courses.length} Courses
            </span>
          </div>
        </div>
      </div>

      {/* Notes if any */}
      {recommendations.notes && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700">{recommendations.notes}</p>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest border-l-4 border-amber-400 pl-3 mb-4">
          Recommended Courses ({recommendations.courses.length})
        </h3>
        
        {recommendations.courses.map((course: any, index: number) => {
          const actionBadge = getActionBadge(course.actionRequired);
          const ActionIcon = actionBadge.icon;
          const courseKey = course.courseId !== null ? course.courseId : index;
          const isExpanded = expandedCourses.has(courseKey);
          
          return (
            <div 
              key={`course-${courseKey}`}
              className={`bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${getPriorityColor(course.priority)} border-l-4`}
            >
              {/* Course Header */}
              <div 
                className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors" 
                onClick={() => toggleCourseExpand(course.courseId, index)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
                          <BookOpen size={18} className="text-[#1e3a5f]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base font-black text-[#1e3a5f] mb-1">
                          {course.courseName}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                            {course.category}
                          </span>
                          <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                            {course.credits} Credits
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${actionBadge.color}`}>
                            <ActionIcon size={10} className="inline mr-1" />
                            {actionBadge.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {course.timeSlot && (
                      <div className="hidden md:flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        <Clock size={10} />
                        <span>Schedule Available</span>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4">
                  {/* Reason */}
                  <div>
                    <h5 className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-wider mb-2">
                      Advisor Note
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {course.reason}
                    </p>
                  </div>

                  {/* Schedule */}
                  {course.timeSlot && (
                    <div>
                      <h5 className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-wider mb-2">
                        Schedule
                      </h5>
                      <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                        {course.timeSlot}
                      </p>
                    </div>
                  )}

                  {/* Offered Program */}
                  {course.offeredProgram && (
                    <div>
                      <h5 className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-wider mb-2">
                        Offered Program
                      </h5>
                      <p className="text-xs text-slate-600">
                        {course.offeredProgram}
                      </p>
                    </div>
                  )}

                  {/* Substitute Courses */}
                  {course.substituteCourses && course.substituteCourses.length > 0 && (
                    <div>
                      <h5 className="text-[9px] font-black text-amber-600 uppercase tracking-wider mb-2">
                        Substitute Options
                      </h5>
                      <div className="space-y-2">
                        {course.substituteCourses.map((sub: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100">
                            <p className="text-xs font-bold text-[#1e3a5f]">{sub.courseName}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">
                                {sub.credits} Credits
                              </span>
                              <span className="text-[8px] font-bold text-slate-500 uppercase">
                                {sub.category}
                              </span>
                              {sub.semester && (
                                <span className="text-[8px] font-bold text-amber-600 uppercase">
                                  Semester {sub.semester}
                                </span>
                              )}
                            </div>
                            {sub.reason && (
                              <p className="text-[9px] text-slate-500 mt-1">{sub.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with summary */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              Need help?
            </span>
          </div>
          <p className="text-[9px] text-slate-500">
            Contact your academic advisor for questions about these recommendations
          </p>
        </div>
      </div>
    </div>
  );
};