/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/RoadmapContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, Filter, X, Layers, 
  GraduationCap, Clock, CheckCircle, AlertCircle,
  Loader2, Map, Calendar
} from 'lucide-react';
import { useRoadmap } from '@/src/hooks/contentUploader/roadmapUploader/roadmapHook';

interface RoadmapContentProps {
  programName?: string;
  batchName?: string;
  batchYear?: string;
}

export function RoadmapContent({ programName = "Software Engineering", batchName, batchYear }: RoadmapContentProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  
  const { 
    programRoadmaps, 
    batchRoadmap,
    isLoading, 
    error, 
    fetchProgramRoadmaps,
    fetchBatchRoadmap,
    clearError 
  } = useRoadmap();

  // Fetch roadmaps on component mount
  useEffect(() => {
    if (batchName && batchYear) {
      fetchBatchRoadmap(batchName, batchYear, programName);
    } else {
      fetchProgramRoadmaps(programName);
    }
  }, [programName, batchName, batchYear]);

  // Get the active roadmap data
  const roadmapData = batchName && batchYear ? batchRoadmap : 
    (selectedVersion ? programRoadmaps.find(r => r.versionName === selectedVersion) : programRoadmaps[0]);

  // Get all versions for dropdown
  const versions = programRoadmaps.map(r => r.versionName);

  // Get semester data
  const semesters = roadmapData?.SemesterRoadmapModels || [];
  const selectedSemesterData = semesters.find((s: any) => s.semesterNo === selectedSemester);

  // Get category colors mapping
  const categoryColors: Record<string, string> = {};
  roadmapData?.RoadmapCourseCategoryModels?.forEach((cat: any) => {
    if (cat.CategoryModel) {
      categoryColors[cat.CategoryModel.categoryName] = cat.CategoryModel.colorScheme || '#e5e7eb';
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-2">Error loading roadmap</p>
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={() => clearError()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
        <Map size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 font-bold">No roadmap available</p>
        <p className="text-slate-400 text-sm">Upload a roadmap to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">
              Academic Roadmap
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {batchName && batchYear 
                ? `${batchName} ${batchYear} - ${programName}`
                : `${programName} Program`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Version Selector */}
            {versions.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold text-[#1e3a5f] hover:bg-slate-100 transition-colors"
                >
                  <Layers size={16} />
                  {roadmapData.versionName}
                  <ChevronDown size={16} className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showVersionDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-10 overflow-hidden"
                    >
                      {versions.map((version: string) => (
                        <button
                          key={version}
                          onClick={() => {
                            setSelectedVersion(version);
                            setShowVersionDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-bold text-[#1e3a5f] hover:bg-slate-50 transition-colors"
                        >
                          {version}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Total Credits Badge */}
            <div className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl">
              <span className="text-xs font-bold">Total: {roadmapData.totalCreditHours} Credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {roadmapData.RoadmapCourseCategoryModels?.map((category: any) => (
          <div 
            key={category.id}
            className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div 
              className="w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: category.CategoryModel?.colorScheme || '#cbd5e1' }}
            />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {category.CategoryModel?.categoryName}
            </p>
            <p className="text-lg font-black text-[#1e3a5f]">
              {category.requiredCredits}
            </p>
            <p className="text-[9px] text-slate-400">Required Credits</p>
          </div>
        ))}
      </div>

      {/* Semester Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={18} className="text-[#FDB813]" />
          <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider">Select Semester</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {semesters.map((semester: any) => (
            <button
              key={semester.id}
              onClick={() => setSelectedSemester(semester.semesterNo)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                selectedSemester === semester.semesterNo
                  ? 'bg-[#1e3a5f] text-white shadow-md'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              Semester {semester.semesterNo}
            </button>
          ))}
        </div>
      </div>

      {/* Semester Details */}
      {selectedSemesterData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        >
          {/* Semester Header */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase italic">
                  Semester {selectedSemesterData.semesterNo}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  Total Credit Hours: {selectedSemesterData.totalCreditHours}
                </p>
              </div>
              <Clock size={32} className="text-[#FDB813] opacity-50" />
            </div>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Pre-Requisites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedSemesterData.SemesterCourseModels?.map((courseMap: any) => {
                  const course = courseMap.CourseCategoryModel?.CoursesModel;
                  const category = courseMap.CourseCategoryModel?.CategoryModel;
                  const prerequisites = course?.prerequisites || [];
                  
                  return (
                    <tr key={courseMap.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase">
                          {course?.courseCode || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#1e3a5f]">{course?.courseName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category?.colorScheme || '#cbd5e1' }}
                          />
                          <span className="text-[10px] font-bold text-slate-500">
                            {category?.categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-black text-[#1e3a5f]">
                          {course?.courseCredits}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {prerequisites.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {prerequisites.map((pre: any, idx: number) => (
                              <span 
                                key={idx}
                                className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"
                              >
                                {pre.prerequisiteCourse?.courseName || 'N/A'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Footer Summary */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Program
            </p>
            <p className="text-sm font-bold text-[#1e3a5f]">{programName}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Roadmap Version
            </p>
            <p className="text-sm font-bold text-[#1e3a5f]">{roadmapData.versionName}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Total Credit Hours
            </p>
            <p className="text-sm font-bold text-[#FDB813]">{roadmapData.totalCreditHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}