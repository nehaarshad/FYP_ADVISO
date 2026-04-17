/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Upload, Loader2, AlertCircle, CheckCircle, X, Filter } from "lucide-react";
import { useCourseOffering } from '@/src/hooks/courseOfferingHook/useCourseOffering';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export const CourseOffering = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedSessionYear, setSelectedSessionYear] = useState('');
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filteredOfferings, setFilteredOfferings] = useState<any[]>([]);
  
  const { offerings, isLoading, error, fetchOfferings, uploadOffering, uploadProgress } = useCourseOffering();
  const { programs } = usePrograms();

  // Get unique session years from offerings
  const getUniqueSessionYears = () => {
    if (!offerings || offerings.length === 0) return [];
    const years = new Set(offerings.map((o: any) => o.SessionModel?.sessionYear).filter(Boolean));
    return Array.from(years).sort().reverse();
  };

  // Get unique session types from offerings
  const getUniqueSessionTypes = () => {
    if (!offerings || offerings.length === 0) return [];
    const types = new Set(offerings.map((o: any) => o.SessionModel?.sessionType).filter(Boolean));
    return Array.from(types);
  };

  useEffect(() => {
    fetchOfferings();
  }, []);

  // Filter offerings when session type/year changes
  useEffect(() => {
    if (!offerings || offerings.length === 0) {
      setFilteredOfferings([]);
      return;
    }

    let filtered = [...offerings];

    if (selectedSessionType) {
      filtered = filtered.filter(o => o.SessionModel?.sessionType === selectedSessionType);
    }

    if (selectedSessionYear) {
      filtered = filtered.filter(o => o.SessionModel?.sessionYear === Number(selectedSessionYear));
    }

    if (selectedProgram) {
      filtered = filtered.filter(o => o.ProgramModel?.programName === selectedProgram);
    }

    setFilteredOfferings(filtered);
  }, [offerings, selectedSessionType, selectedSessionYear, selectedProgram]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedProgram || !selectedSessionType || !selectedSessionYear) {
      alert('Please select a file, program, session type, and session year');
      return;
    }
    
    const result = await uploadOffering({
      file: selectedFile,
      sessionType: selectedSessionType,
      sessionYear: selectedSessionYear,
      programName: selectedProgram
    });
    
    if (result.success) {
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedProgram('');
      setSelectedSessionType('');
      setSelectedSessionYear('');
    }
  };

  const handleViewDetails = (offering: any) => {
    setSelectedOffering(offering);
    setShowDetailModal(true);
  };

  const handleResetFilters = () => {
    setSelectedSessionType('');
    setSelectedSessionYear('');
    setSelectedProgram('');
  };

  const sessionYears = getUniqueSessionYears();

  return (
    <>
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic">Course Offerings</h2>
            <p className="text-xs text-slate-400 mt-1">Manage and view course offerings by session</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all"
          >
            Upload New List
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-[#1e3a5f]" />
            <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-wider">Filter Offerings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              title="Session Type"
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
            >
              <option value="">All Session Types</option>
              <option value="FALL">Fall</option>
              <option value="SPRING">Spring</option>
              <option value="SUMMER">Summer</option>
            </select>

             <input
              type="text"
              placeholder="Session Year (e.g., 2024)"
              value={selectedSessionYear}
              onChange={(e) => setSelectedSessionYear(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
            />

            <select
              title="Program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
            >
              <option value="">All Programs</option>
              {programs.map((p: any) => (
                <option key={p.id} value={p.programName}>{p.programName}</option>
              ))}
            </select>

            {(selectedSessionType || selectedSessionYear || selectedProgram) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(selectedSessionType || selectedSessionYear || selectedProgram) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSessionType && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  Session: {selectedSessionType}
                  <button onClick={() => setSelectedSessionType('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedSessionYear && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  Year: {selectedSessionYear}
                  <button onClick={() => setSelectedSessionYear('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedProgram && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  Program: {selectedProgram}
                  <button onClick={() => setSelectedProgram('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#FDB813]" />
          </div>
        ) : filteredOfferings.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            {offerings.length === 0 ? (
              "No course offerings found"
            ) : (
              "No course offerings match the selected filters"
            )}
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-4 text-right">
              <span className="text-xs text-slate-500">
                Showing {filteredOfferings.length} of {offerings.length} offerings
              </span>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Course Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Credits</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Program</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Session</th>
                    <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOfferings.map((offering) => (
                    <tr key={offering.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-black text-[#1e3a5f] text-sm">{offering.courseName}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-600">{offering.credits}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-500">{offering.courseCategory}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-600">
                          {offering.BatchModel?.batchName} {offering.BatchModel?.batchYear}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-500">{offering.ProgramModel?.programName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-500">
                          {offering.SessionModel?.sessionType} {offering.SessionModel?.sessionYear}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleViewDetails(offering)}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-all"
                            title="View Details"
                          >
                            <Eye size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Upload Course Offerings</h3>
              <button title='btn' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Program Name *</label>
                <select
                  title='Program'
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.programName}>{p.programName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Session Type *</label>
                <select
                  title='Session Type'
                  value={selectedSessionType}
                  onChange={(e) => setSelectedSessionType(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                  required
                >
                  <option value="">Select Session Type</option>
                  <option value="FALL">Fall</option>
                  <option value="SPRING">Spring</option>
                  <option value="SUMMER">Summer</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Session Year *</label>
                <select
                  title='Session Year'
                  value={selectedSessionYear}
                  onChange={(e) => setSelectedSessionYear(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
                  required
                >
                  <option value="">Select Session Year</option>
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Excel File *</label>
                <input
                  title='File'
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1"
                  required
                />
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

              <button 
                type="submit" 
                className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOffering && (
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
                <InfoRow label="Course Name" value={selectedOffering.courseName} />
                <InfoRow label="Credits" value={selectedOffering.credits} />
                <InfoRow label="Category" value={selectedOffering.courseCategory} />
                <InfoRow label="Batch" value={`${selectedOffering.BatchModel?.batchName} ${selectedOffering.BatchModel?.batchYear}`} />
                <InfoRow label="Program" value={selectedOffering.ProgramModel?.programName} />
                <InfoRow label="Session" value={`${selectedOffering.SessionModel?.sessionType} ${selectedOffering.SessionModel?.sessionYear}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-[#1e3a5f]">{value || 'N/A'}</p>
    </div>
  );
}