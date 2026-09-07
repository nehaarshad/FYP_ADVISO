/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { DropdownCourse, DropdownCategory } from './types/courseoption';
import { SearchableMultiSelect } from './selectmultiplecourse';
import { SearchableMultiSelectCategories } from './selectCourseCategory';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onSave: (courseId: number, data: any) => Promise<{ success: boolean; error?: string }>;
  allCourses: DropdownCourse[];
  allCategories: DropdownCategory[];
  onLoadCategories?: () => Promise<void>;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onSave,
  allCourses = [],
  allCategories = [],
  onLoadCategories
}) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    courseCredits: '',
    prerequisiteIds: [] as number[],
    categoryIds: [] as number[]
  });
  const [existingCategoryIds, setExistingCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getCourseData = (course: any) => {
    if (!course) return {};
    if (course.courseName !== undefined) {
      return course;
    }
    return course.CoursesModel || course;
  };

  const getPrerequisites = (course: any) => {
    if (!course) return [];
    const courseData = getCourseData(course);
    const prereqs = courseData?.prerequisites || [];
    return prereqs.map((p: any) => p.preReqCourseId || p.prerequisiteCourse?.id).filter(Boolean);
  };

  const getExistingCategories = (course: any) => {
    if (!course) return [];
    
    if (course.CourseCategoryModels && Array.isArray(course.CourseCategoryModels)) {
      return course.CourseCategoryModels
        .map((cc: any) => cc.categoryId || cc.CategoryModel?.id)
        .filter(Boolean);
    }
    return [];
  };

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen && onLoadCategories) {
      onLoadCategories();
    }
  }, [isOpen, onLoadCategories]);

  useEffect(() => {
    if (course) {
      const courseData = getCourseData(course);
      const existingCats = getExistingCategories(course);
      
      console.log('Existing category IDs:', existingCats);
      console.log('All categories available:', allCategories);
      
      setExistingCategoryIds(existingCats);
      
      setFormData({
        courseCode: courseData?.courseCode || '',
        courseName: courseData?.courseName || '',
        courseCredits: courseData?.courseCredits || '',
        prerequisiteIds: getPrerequisites(course),
        categoryIds: existingCats
      });
    }
  }, [course, allCategories]);

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

  const handleCategoryChange = (selectedIds: number[]) => {
    console.log('Category change - selected IDs:', selectedIds);
    console.log('Current existing IDs:', existingCategoryIds);
    
    // Merge existing categories with newly selected ones
    // We want to ADD new categories, not remove existing ones
    const allSelected = [...new Set([...existingCategoryIds, ...selectedIds])];
    
    console.log('All selected IDs after merge:', allSelected);
    
    setFormData(prev => ({
      ...prev,
      categoryIds: allSelected
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

      // Only send categories that are new (not already existing)
      const newCategoryIds = formData.categoryIds.filter(
        id => !existingCategoryIds.includes(id)
      );

      console.log('Form Data:', formData);
      console.log('Existing Category IDs:', existingCategoryIds);
      console.log('New Category IDs to add:', newCategoryIds);

      // Prepare update data
      const updateData: any = {};
      
      if (formData.courseCode) updateData.courseCode = formData.courseCode;
      if (formData.courseName) updateData.courseName = formData.courseName;
      if (formData.courseCredits) updateData.courseCredits = formData.courseCredits;
      if (formData.prerequisiteIds.length > 0) {
        updateData.prerequisiteIds = formData.prerequisiteIds;
      }
      // Only send categoryIds if there are new ones to add
      if (existingCategoryIds.length > 0) {
        updateData.categoryIds = existingCategoryIds;
      }

      console.log('Sending update data:', updateData);

      const result = await onSave(course.id, updateData);
      
      if (result.success) {
        setSuccess(true);
        // Update existing categories with new ones
        setExistingCategoryIds([...existingCategoryIds, ...newCategoryIds]);
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

  // Filter out already assigned categories from the dropdown options
  const availableCategories = Array.isArray(allCategories) 
    ? allCategories.filter(cat => cat && !existingCategoryIds.includes(cat.id))
    : [];

  const getCategoryById = (id: number) => {
    if (!Array.isArray(allCategories)) return null;
    return allCategories.find(c => c && c.id === id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Edit Course</h3>
          <button 
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

          {/* Categories - Add-Only Mode */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Categories
              </label>
              <span className="text-[9px] text-blue-600 font-medium">
                {existingCategoryIds.length} assigned
              </span>
            </div>
            
            {/* Display existing categories as read-only tags */}
            {existingCategoryIds.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                {existingCategoryIds.map(id => {
                  const category = getCategoryById(id);
                  if (!category) return null;
                  const color = parseColorScheme(category.colorScheme || '#64748b');
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-white text-[10px] font-medium rounded"
                      style={{ backgroundColor: color }}
                    >
                      {category.categoryName}
                      <span className="text-[8px] opacity-70">✓</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Add new categories - FIXED: Properly handle the onChange */}
            <SearchableMultiSelectCategories
              options={availableCategories}
              selectedIds={[]} // Always empty because we handle merging in parent
              onChange={(selectedIds) => {
                console.log('Selected IDs from dropdown:', selectedIds);
                // Only add categories that are not already existing
                const newIds = selectedIds.filter(id => !existingCategoryIds.includes(id));
                console.log('New IDs to add:', newIds);
                
                if (newIds.length > 0) {
                  // Update the form data with all categories (existing + new)
                  const allCategoryIds = [...existingCategoryIds, ...newIds];
                  setFormData(prev => ({
                    ...prev,
                    categoryIds: allCategoryIds
                  }));
                  // Also update the existing IDs so the tags update
                  setExistingCategoryIds(allCategoryIds);
                }
              }}
              label=""
              placeholder={availableCategories.length > 0 ? "Search and add new categories..." : "No categories available to add"}
              disabled={isLoading || availableCategories.length === 0}
            />
            <p className="text-[9px] text-slate-400 mt-1">
              {availableCategories.length > 0 
                ? "Search and select categories to add. Existing categories cannot be removed."
                : "All available categories are already assigned to this course."}
            </p>
          </div>

          {/* Prerequisites */}
          <SearchableMultiSelect
            options={allCourses}
            selectedIds={formData.prerequisiteIds}
            onChange={handlePrerequisiteChange}
            label="Prerequisites"
            placeholder="Search courses by code or name..."
            excludeId={course?.id}
            disabled={isLoading}
          />

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs p-3 bg-red-50 rounded-lg">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

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

const parseColorScheme = (colorScheme: string) => {
  if (!colorScheme) return '#e5e7eb';
  if (colorScheme.startsWith('FF')) {
    return `#${colorScheme.substring(2)}`;
  }
  if (!colorScheme.startsWith('#')) {
    return `#${colorScheme}`;
  }
  return colorScheme;
};