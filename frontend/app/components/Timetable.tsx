/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { CalendarDays, Eye, Upload, Loader2, AlertCircle, X, Clock, MapPin, User, Filter } from "lucide-react";
import { useTimetable } from '@/src/hooks/timetableHook/useTimetable';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export const Timetable = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedSessionYear, setSelectedSessionYear] = useState('');
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [filteredTimetables, setFilteredTimetables] = useState<any[]>([]);
  
  const { timetables, isLoading, error, fetchTimetables, uploadTimetable, uploadProgress } = useTimetable();
  const { programs } = usePrograms();

  useEffect(() => {
    fetchTimetables();
  }, []);

  // Filter timetables when session type/year changes
  useEffect(() => {
    if (!timetables || timetables.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredTimetables([]);
      return;
    }

    let filtered = [...timetables];

    if (selectedSessionType) {
      filtered = filtered.filter((t: any) => 
        t.CourseOfferingModel?.SessionModel?.sessionType === selectedSessionType
      );
    }

    if (selectedSessionYear) {
      filtered = filtered.filter((t: any) => 
        t.CourseOfferingModel?.SessionModel?.sessionYear === parseInt(selectedSessionYear)
      );
    }

    if (selectedProgram) {
      filtered = filtered.filter((t: any) => 
        t.CourseOfferingModel?.ProgramModel?.programName === selectedProgram
      );
    }

    setFilteredTimetables(filtered);
  }, [timetables, selectedSessionType, selectedSessionYear, selectedProgram]);

  // Further filter by day
  const filteredByDay = selectedDay === 'all' 
    ? filteredTimetables 
    : filteredTimetables.filter((t: any) => t.day === selectedDay);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedProgram || !selectedSessionType || !selectedSessionYear) {
      alert('Please select a file, program, session type, and session year');
      return;
    }
    
    const result = await uploadTimetable({
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

  const handleResetFilters = () => {
    setSelectedSessionType('');
    setSelectedSessionYear('');
    setSelectedProgram('');
    setSelectedDay('all');
  };

  // Get unique session years from timetables
  const getUniqueSessionYears = () => {
    if (!timetables || timetables.length === 0) return [];
    const years = new Set(
      timetables.map((t: any) => t.CourseOfferingModel?.SessionModel?.sessionYear)
        .filter(Boolean)
        .map(String)
    );
    return Array.from(years).sort().reverse();
  };

  return (
    <>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-300 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]   tracking-tighter">
              Class Timetables
            </h2>
            <p className="text-[13px] font-bold text-slate-600 mt-2">
              {filteredByDay.length} schedules found
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-[12px]  tracking-wider hover:bg-[#FDB813] transition-all flex items-center gap-2"
            >
            Upload Timetable
          </button>
        </div>

        {/* Session Filter Section */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-[#1e3a5f]" />
            <h3 className="text-sm font-bold text-[#1e3a5f]  tracking-wider">Filter by Session</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              title="Session Type"
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl font-medium text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
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
              className="p-2 bg-white border border-slate-300 rounded-xl font-medium text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
            />

            <select
              title="Program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-xl font-medium text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
            >
              <option value="">All Programs</option>
              {programs.map((p: any) => (
                <option key={p.id} value={p.programName}>{p.programName}</option>
              ))}
            </select>

            {(selectedSessionType || selectedSessionYear || selectedProgram) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all"
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
            </div>
          )}
        </div>

        {/* Day Filter */}
        {filteredTimetables.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold truncate-[0.1rem] transition-all ${
                selectedDay === 'all' ? 'bg-[#1a3457] text-white' : 'bg-slate-300 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Days
            </button>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold truncate-[0.1rem] transition-all ${
                  selectedDay === day ? 'bg-[#1a3457] text-white' : 'bg-slate-300 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#FDB813]" />
          </div>
        ) : filteredByDay.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            {timetables.length === 0 ? (
              "No timetables found"
            ) : (
              "No timetables match the selected filters"
            )}
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-4 text-right">
              <span className="text-sm text-slate-600">
                Showing {filteredByDay.length} of {filteredTimetables.length} schedules
              </span>
            </div>
            
           <div className="overflow-x-auto rounded-xl border border-slate-300">
  <table className="w-full border-collapse">
    {/* HEADER */}
    <thead className="bg-slate-50">
      <tr>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Day
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Course
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Time
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Venue
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Instructor
        </th>
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Batch
        </th>
        {/* Note: Added border-r to the last header so it matches the rows below */}
        <th className="p-4 text-[17px] font-bold text-[#1e3a5f] border-b border-r border-slate-300 text-left">
          Session
        </th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filteredByDay.map((timetable: any) => (
        <tr key={timetable.id} className="hover:bg-slate-50/50 transition-colors">
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="font-bold text-[#1e3a5f] text-sm">{timetable.day}</span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <p className="font-bold text-sm text-slate-700">{timetable.CourseOfferingModel?.courseName}</p>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">
              {timetable.startTime} - {timetable.endTime}
            </span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">{timetable.venue}</span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">{timetable.instructor}</span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-bold text-slate-600">
              {timetable.CourseOfferingModel?.BatchModel?.batchName} {timetable.CourseOfferingModel?.BatchModel?.batchYear}
            </span>
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-300">
            <span className="text-sm font-medium text-slate-600">
              {timetable.CourseOfferingModel?.SessionModel?.sessionType} {timetable.CourseOfferingModel?.SessionModel?.sessionYear}
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
{/* Upload Modal */}
{showUploadModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1e3a5f] ">Upload Timetable</h3>
        <button title='btn' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleUpload} className="space-y-4">
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
            placeholder="e.g., 2024"
            value={selectedSessionYear}
            onChange={(e) => setSelectedSessionYear(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#FDB813] outline-none"
            required
          />
        </div>

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

        <button type="submit" className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-xs  tracking-wider hover:bg-[#FDB813] transition-all">
          Upload
        </button>
      </form>
    </div>
  </div>
)}

    </>
  );
};
