
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';

interface RoadmapDetailViewProps {
  isOpen: boolean;
  roadmap: any;
  onClose: () => void;
}

export function RoadmapDetailView({ isOpen, roadmap, onClose }: RoadmapDetailViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const semestersPerPage = 8;

  if (!isOpen || !roadmap) return null;

  const semesters = roadmap.SemesterRoadmapModels || [];
  const categories = roadmap.RoadmapCourseCategoryModels || [];

  const sortedSemesters = [...semesters].sort(
    (a, b) => parseInt(a.semesterNo) - parseInt(b.semesterNo)
  );

  const maxCourses = Math.max(
    ...sortedSemesters.map((s) => s.SemesterCourseModels?.length || 0)
  );

  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(
      (c: any) => c.CategoryModel?.categoryName === categoryName
    );

    if (category?.CategoryModel?.colorScheme) {
      let color = category.CategoryModel.colorScheme;

      if (color.startsWith('FF')) {
        color = `#${color.substring(2)}`;
      } else if (!color.startsWith('#')) {
        color = `#${color}`;
      }

      return color;
    }

    return '#e5e7eb';
  };

  const paginatedSemesters = sortedSemesters.slice(
    currentPage * semestersPerPage,
    (currentPage + 1) * semestersPerPage
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-[#FDB813]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#1e3a5f] uppercase">
                    {roadmap.versionName}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Total Credits: {roadmap.totalCreditHours}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                
                <button title='btn' onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 overflow-auto p-4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse text-xs">
                  {/* HEADER */}
                  <thead>
                    <tr className="bg-[#1e3a5f] text-white">
                     
                      {paginatedSemesters.map((sem: any) => (
                        <th key={sem.id} className="border p-2 text-center">
                          Semester {sem.semesterNo}
                          <div className="text-[10px] opacity-70">
                            {sem.totalCreditHours} cr
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {Array.from({ length: maxCourses }).map((_, rowIndex) => {
                      const hasAny = paginatedSemesters.some(
                        (s) => s.SemesterCourseModels?.[rowIndex]
                      );
                      if (!hasAny) return null;

                      return (
                        <tr key={rowIndex}>
                         

                          {/* CELLS */}
                          {paginatedSemesters.map((sem: any) => {
                            const courseData = sem.SemesterCourseModels?.[rowIndex];
                            const course =
                              courseData?.CourseCategoryModel?.CoursesModel;
                            const category =
                              courseData?.CourseCategoryModel?.CategoryModel;

                            const color = getCategoryColor(
                              category?.categoryName
                            );

                            return (
                              <td
                                key={sem.id}
                                className="border p-2 text-center align-middle"
                                style={{
                                  backgroundColor: course ? color : 'transparent',
                                  color: course ? '#000' : '#aaa',
                                }}
                              >
                                {course ? (
                                  <>
                                    <div className="font-bold">
                                      {course.courseName}
                                    </div>
                                    <div className="text-[11px]">
                                      {course.courseCredits} Credit Hrs.
                                    </div>
                                  </>
                                ) : (
                                  '-'
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot>
  <tr className="bg-gray-50 border-t-2 border-gray-300"><span></span></tr>
  
  
  {/* Grand Total Row */}
  <tr className="bg-gray-100 font-bold">
    <td colSpan={paginatedSemesters.length} className="border p-2 text-center">
      <div className="flex justify-between items-center px-4">
        <div className="flex gap-4">
          {categories.map((cat: any) => {
            const categoryName = cat.CategoryModel?.categoryName;
            const color = getCategoryColor(categoryName);
            const requiredCredits = cat.requiredCredits;
            
            return (
              <div key={cat.id} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: color }}
                />
                <span className='text-xs'>{categoryName}: {requiredCredits} Cr. Hrs.</span>
              </div>
            );
          })}
        </div>
      </div>
    </td>
  </tr>
</tfoot>             


                </table>
              </div>

            
            </div>

            {/* FOOTER */}
            <div className="border-t p-3 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}