/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";
import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { DropdownCourse } from './types/courseoption';
import { SearchableMultiSelect } from './selectmultiplecourse';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onSave: (courseId: number, data: any) => Promise<{ success: boolean; error?: string }>;
  allCourses: DropdownCourse[];
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onSave,
  allCourses
}) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    courseCredits: '',
    prerequisiteIds: [] as number[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getCourseData = (course: any) => {
    if (course.courseName !== undefined) {
      return course;
    }
    return course.CoursesModel || course;
  };

  const getPrerequisites = (course: any) => {
    const courseData = getCourseData(course);
    const prereqs = courseData?.prerequisites || [];
    return prereqs.map((p: any) => p.preReqCourseId || p.prerequisiteCourse?.id).filter(Boolean);
  };

  useEffect(() => {
    if (course) {
      const courseData = getCourseData(course);
      setFormData({
        courseCode: courseData?.courseCode || '',
        courseName: courseData?.courseName || '',
        courseCredits: courseData?.courseCredits || '',
        prerequisiteIds: getPrerequisites(course)
      });
    }
  }, [course]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePrerequisiteChange = (selectedIds: number[]) => {
    setFormData(prev => ({
      ...prev,
      prerequisiteIds: selectedIds
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.courseName.trim()) {
        throw new Error('Course name is required');
      }

      const updateData = {
        courseCode: formData.courseCode || undefined,
        courseName: formData.courseName || undefined,
        courseCredits: formData.courseCredits || undefined,
        prerequisiteIds: formData.prerequisiteIds.length > 0 ? formData.prerequisiteIds : undefined
      };

      const result = await onSave(course.id, updateData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to update course');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Edit Course</h3>
          <button 
          title='close'
            onClick={onClose} 
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Code */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
              Course Code
            </label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1e3a5f] transition-colors"
              placeholder="e.g., CS101"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1e3a5f] transition-colors"
              placeholder="e.g., Introduction to Computer Science"
              required
            />
          </div>

          {/* Credits */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
              Credit Hours
            </label>
            <input
              type="text"
              name="courseCredits"
              value={formData.courseCredits}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1e3a5f] transition-colors"
              placeholder="e.g., 3 or 3+1"
            />
            <p className="text-[9px] text-slate-400 mt-1">
              Enter number (e.g., 3) or format like 3+1
            </p>
          </div>

          {/* Prerequisites - Searchable Multi-Select */}
          <SearchableMultiSelect
            options={allCourses}
            selectedIds={formData.prerequisiteIds}
            onChange={handlePrerequisiteChange}
            label="Prerequisites"
            placeholder="Search courses by code or name..."
            excludeId={course?.id}
            disabled={isLoading}
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs p-3 bg-red-50 rounded-lg">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-xs p-3 bg-green-50 rounded-lg">
              <CheckCircle size={14} />
              <span>Course updated successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-2.5 bg-[#1e3a5f] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};