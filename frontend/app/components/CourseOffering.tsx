/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Upload, Loader2, AlertCircle, CheckCircle, X, Filter } from "lucide-react";
import { useCourseOffering } from '@/src/hooks/courseOfferingHook/useCourseOffering';
import { usePrograms } from '@/src/hooks/programHook/useProgram';
import InfoRow from '@/components/courseComponents/CourseCatalog';

export const CourseOffering = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedSessionYear, setSelectedSessionYear] = useState('');
  const [selectedBatchName, setSelectedBatchName] = useState('');
  const [selectedBatchYear, setSelectedBatchYear] = useState('');
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filteredOfferings, setFilteredOfferings] = useState<any[]>([]);
  const [availableBatches, setAvailableBatches] = useState<{name: string, year: string}[]>([]);
  
  const { offerings, isLoading, error, fetchOfferings, uploadOffering, uploadProgress } = useCourseOffering();
  const { programs } = usePrograms();

  useEffect(() => {
    fetchOfferings();
  }, []);

  // Extract available batches from offerings
  useEffect(() => {
    if (offerings && offerings.length > 0) {
      const batches = new Map<string, {name: string, year: string}>();
      offerings.forEach(o => {
        if (o.BatchModel?.batchName && o.BatchModel?.batchYear) {
          const key = `${o.BatchModel.batchName}-${o.BatchModel.batchYear}`;
          if (!batches.has(key)) {
            batches.set(key, {
              name: o.BatchModel.batchName,
              year: o.BatchModel.batchYear.toString()
            });
          }
        }
      });
      setAvailableBatches(Array.from(batches.values()));
    }
  }, [offerings]);

  // Filter offerings when any filter changes
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

    if (selectedBatchName) {
      filtered = filtered.filter(o => o.BatchModel?.batchName === selectedBatchName);
    }

    if (selectedBatchYear) {
      filtered = filtered.filter(o => o.BatchModel?.batchYear === selectedBatchYear);
    }

    setFilteredOfferings(filtered);
  }, [offerings, selectedSessionType, selectedSessionYear, selectedProgram, selectedBatchName, selectedBatchYear]);

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
    setSelectedBatchName('');
    setSelectedBatchYear('');
  };

  return (
    <>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-300 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]  ">Course Offerings</h2>
            <p className="text-[13px] font-bold text-slate-600 mt-2">Manage and view course offerings by session</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-[12px]  tracking-wider hover:bg-[#FDB813] transition-all flex items-center gap-2"
          >
            <Upload size={16} /> Upload New List
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
           <div className="flex items-center gap-2 mb-3">
                      <Filter size={18} className="text-[#1e3a5f]" />
                      <h3 className="text-sm font-bold text-[#1e3a5f]  tracking-wider">Filter by Session</h3>
                    </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select
              title="Session Type"
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl text-medium focus:ring-2 focus:ring-[#FDB813] outline-none"
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
              className="p-2 bg-white border border-slate-300 rounded-xl text-medium focus:ring-2 focus:ring-[#FDB813] outline-none"
            />

            <select
              title="Program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl text-medium focus:ring-2 focus:ring-[#FDB813] outline-none"
            >
              <option value="">All Programs</option>
              {programs.map((p: any) => (
                <option key={p.id} value={p.programName}>{p.programName}</option>
              ))}
            </select>

            <select
              title="Batch Name"
              value={selectedBatchName}
              onChange={(e) => setSelectedBatchName(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl text-medium focus:ring-2 focus:ring-[#FDB813] outline-none"
            >
              <option value="">All Batches</option>
              <option value="FALL">Fall</option>
              <option value="SPRING">Spring</option>
              <option value="SUMMER">Summer</option>
            </select>

            <input
              type="text"
              placeholder="Batch Year (e.g., 2024)"
              value={selectedBatchYear}
              onChange={(e) => setSelectedBatchYear(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl text-medium focus:ring-2 focus:ring-[#FDB813] outline-none"
            />

            {(selectedSessionType || selectedSessionYear || selectedProgram || selectedBatchName || selectedBatchYear) && (
              <button
                onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all"
            >
                Clear All Filters
              </button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(selectedSessionType || selectedSessionYear || selectedProgram || selectedBatchName || selectedBatchYear) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSessionType && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  {selectedSessionType}
                  <button onClick={() => setSelectedSessionType('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedSessionYear && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
               {selectedSessionYear}
                  <button onClick={() => setSelectedSessionYear('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedProgram && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  {selectedProgram}
                  <button onClick={() => setSelectedProgram('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedBatchName && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  Batch: {selectedBatchName}
                  <button onClick={() => setSelectedBatchName('')} className="hover:text-[#FDB813]">×</button>
                </span>
              )}
              {selectedBatchYear && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-lg text-xs">
                  Batch Year: {selectedBatchYear}
                  <button onClick={() => setSelectedBatchYear('')} className="hover:text-[#FDB813]">×</button>
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
              <span className="text-sm text-slate-600">
                Showing {filteredOfferings.length} of {offerings.length} offerings
              </span>
            </div>
            
            {/* Table */}
           <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
  <table className="w-full border-collapse">
    <thead className="bg-slate-50">
      <tr>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left last:border-r-0">
          Course Name
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left last:border-r-0">
          Credits
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left last:border-r-0">
          Category
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left last:border-r-0">
          Batch
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left last:border-r-0">
          Program
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-slate-300 text-left">
          Session
        </th>
      </tr>
    </thead>
    <tbody>
      {filteredOfferings.map((offering) => (
        <tr key={offering.id} className="hover:bg-slate-50/50 transition-colors">
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <p className="font-bold text-[#1e3a5f] text-sm">{offering.courseName}</p>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-bold text-slate-600">{offering.credits}</span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">{offering.courseCategory}</span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-bold text-slate-600">
              {offering.BatchModel?.batchName} {offering.BatchModel?.batchYear}
            </span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">{offering.ProgramModel?.programName}</span>
          </td>
          <td className="px-4 py-4 border-b border-slate-300">
            <span className="text-sm font-medium text-slate-600">
              {offering.SessionModel?.sessionType} {offering.SessionModel?.sessionYear}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          </>
        )}
      </div>
{showUploadModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1e3a5f] ">Upload Course Offerings</h3>
        <button title='btn' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="text-[13px] font-bold text-slate-600 ">Program Name *</label>
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
          <label className="text-[13px] font-bold text-slate-600 ">Session Type *</label>
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
          <label className="text-[13px] font-bold text-slate-600 ">Session Year *</label>
          <input
            type="text"
            title='Session Year'
            value={selectedSessionYear}
            onChange={(e) => setSelectedSessionYear(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[13px] font-bold text-slate-600 ">Excel File *</label>
          <div className="relative mt-1">
            <input
              title='upload file'
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              required
            />
            <div className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 truncate mr-2">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
              <span className="px-4 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium shrink-0">
                Choose File
              </span>
            </div>
          </div>
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
          className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-xs  tracking-wider hover:bg-[#FDB813] transition-all"
        >
          Upload
        </button>
      </form>
    </div>
  </div>
)}
 
    </>
  );
};

