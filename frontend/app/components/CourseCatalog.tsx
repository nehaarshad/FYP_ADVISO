/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/CourseCatalog.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Search, Book, Eye, Upload, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { useCourseCatalog } from '@/src/hooks/courseDetailHook/useCourseDetails';

export const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const { 
    courses, 
    isLoading, 
    error, 
    uploadProgress, 
    uploadSuccess,
    categories,
    fetchCourses, 
    uploadCourseDetail, 
    searchCourses,
    filterByCategory,
    clearUploadSuccess
  } = useCourseCatalog();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchCourses(searchTerm);
    } else if (selectedCategory) {
      filterByCategory(selectedCategory);
    } else {
      filterByCategory('');
    }
  }, [searchTerm, selectedCategory, courses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('');
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    
    const result = await uploadCourseDetail({ file: selectedFile });
    
    if (result.success) {
      setShowUploadModal(false);
      setSelectedFile(null);
      setTimeout(clearUploadSuccess, 3000);
    }
  };

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  // Helper function to get course data (handles both old and new structure)
  const getCourseData = (course: any) => {
    // New structure: course has direct properties
    if (course.courseCode !== undefined || course.courseName !== undefined) {
      return course;
    }
    // Old structure: course has CoursesModel
    return course.CoursesModel || course;
  };

  // Helper function to get category (handles both old and new structure)
  const getCategory = (course: any) => {
    // New structure: course has CourseCategoryModels array with CategoryModel inside
    if (course.CourseCategoryModels && course.CourseCategoryModels.length > 0) {
      return course.CourseCategoryModels[0].CategoryModel;
    }
    // Old structure: course has CategoryModel directly
    if (course.CategoryModel) {
      return course.CategoryModel;
    }
    return null;
  };

  // Format prerequisites for display
  const getPrerequisites = (course: any) => {
    const courseData = getCourseData(course);
    const prereqs = courseData?.prerequisites || [];
    if (prereqs.length === 0) return 'None';
    if (prereqs.length === null) return 'None';
    return prereqs.map((p: any) => p.prerequisiteCourse?.courseName || 'None').join(', ');
  };

  // Get used as prerequisite for display
  const getUsedAsPrerequisiteFor = (course: any) => {
    const courseData = getCourseData(course);
    const usedAs = courseData?.usedAsPrerequisiteFor || [];
    if (usedAs.length === 0) return 'None';
    return usedAs.map((p: any) => p.mainCourse?.courseName || 'Unknown').join(', ');
  };

  // Get credit hours in display format
  const getCreditDisplay = (credits: number) => {
    if (!credits && credits !== 0) return '0 Credits';
    return `${credits} Credit${credits !== 1 ? 's' : ''}`;
  };

  // Parse color scheme (handles FF prefix)
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

  return (
    <>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Course Catalog</h2>
            <div className="h-1 w-12 bg-slate-900 mt-1"></div>
            <p className="text-[10px] text-slate-400 mt-2">{courses.length} courses available</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={handleSearch}
                placeholder="SEARCH COURSES..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all uppercase" 
              />
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-[#FDB813] transition-all flex items-center gap-2"
            >
              <Upload size={14} /> Upload
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                !selectedCategory ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                  selectedCategory === cat ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && courses.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#FDB813]" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p>{error}</p>
            <button onClick={() => fetchCourses(true)} className="mt-2 text-sm underline">Retry</button>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Code</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Course Name</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Credit</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest border-r border-slate-200">Category</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-900 tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <Book size={48} className="mx-auto mb-2 text-slate-300" />
                      No courses found
                    </td>
                  </tr>
                ) : (
                  courses.map((course: any) => {
                    const courseData = getCourseData(course);
                    const category = getCategory(course);
                    const categoryName = category?.categoryName || 'Uncategorized';
                    const hasNoCategory = course.CourseCategoryModels?.length === 0 || (!category && !course.CategoryModel);
                    
                    return (
                      <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-xs font-black text-slate-900 border-r border-slate-200 uppercase">
                          {courseData?.courseCode || 'N/A'}
                        </td>
                        <td className="p-4 border-r border-slate-200">
                          <p className="text-[11px] text-slate-900 font-bold uppercase">{courseData?.courseName || 'N/A'}</p>
                        </td>
                        <td className="p-4 text-xs font-black text-slate-900 border-r border-slate-200">
                          {getCreditDisplay(courseData?.courseCredits)}
                        </td>
                        <td 
                          className="p-4 border-r border-slate-200"
                          style={{
                            backgroundColor: hasNoCategory ? '#f3f4f6' : parseColorScheme(category?.colorScheme),
                            color: hasNoCategory ? '#6b7280' : '#000000'
                          }}
                        >
                          <span className="text-[10px] font-bold uppercase">
                            {categoryName}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleViewDetails(course)}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Show uncategorized count if any */}
        {courses.filter((c: any) => getCategory(c) === null).length > 0 && (
          <div className="mt-4 text-right">
            <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-1 rounded">
              ⚠️ {courses.filter((c: any) => getCategory(c) === null).length} course(s) without category
            </span>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Upload Course Details</h3>
              <button title='btn' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Excel File</label>
                <div className="relative">
                  <input
                    title='btn'
                    type="file"
                    accept=".xlsx,.xls"
                    id="file-upload"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                    <span className="px-4 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium">
                      Choose File
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  Format: Course Code | Prerequisite | Course Name | Credit Hours
                </p>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#FDB813] h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-center text-slate-500">{uploadProgress}%</p>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs p-2 bg-red-50 rounded">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {uploadSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-xs p-2 bg-green-50 rounded">
                  <CheckCircle size={14} /> Course details uploaded successfully!
                </div>
              )}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Course Details</h3>
              <button title='btn' onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Course Code" value={getCourseData(selectedCourse)?.courseCode || 'N/A'} />
                <InfoRow label="Course Name" value={getCourseData(selectedCourse)?.courseName || 'N/A'} />
                <InfoRow label="Credit Hours" value={getCourseData(selectedCourse)?.courseCredits || 0} />
                <InfoRow label="Category" value={getCategory(selectedCourse)?.categoryName || 'Uncategorized'} />
                <InfoRow label="Prerequisites" value={getPrerequisites(selectedCourse)} />
                <InfoRow label="Used As Prerequisite For" value={getUsedAsPrerequisiteFor(selectedCourse)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-[#1e3a5f] break-words">{value || 'N/A'}</p>
    </div>
  );
}