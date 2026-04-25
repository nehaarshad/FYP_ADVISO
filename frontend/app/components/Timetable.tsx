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

  const handleViewSchedule = (timetable: any) => {
    setSelectedTimetable(timetable);
    setShowDetailModal(true);
  };

  const sessionYears = getUniqueSessionYears();

  return (
    <>
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">
              Class Timetables
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
              {filteredByDay.length} schedules found
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FDB813] transition-all"
          >
            Upload Timetable
          </button>
        </div>

        {/* Session Filter Section */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-[#1e3a5f]" />
            <h3 className="text-xs font-black text-[#1e3a5f] uppercase tracking-wider">Filter by Session</h3>
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

        {/* Day Filter */}
        {filteredTimetables.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                selectedDay === 'all' ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              All Days
            </button>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                  selectedDay === day ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
              <span className="text-xs text-slate-500">
                Showing {filteredByDay.length} of {filteredTimetables.length} schedules
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Day</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Venue</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Instructor</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Session</th>
                    <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredByDay.map((timetable: any) => (
                    <tr key={timetable.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-black text-[#1e3a5f] text-sm">{timetable.day}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-sm text-slate-700">{timetable.CourseOfferingModel?.courseName}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-600">
                          {timetable.startTime} - {timetable.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-slate-500">{timetable.venue}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-slate-500">{timetable.instructor}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-600">
                          {timetable.CourseOfferingModel?.BatchModel?.batchName} {timetable.CourseOfferingModel?.BatchModel?.batchYear}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-600">
                          {timetable.CourseOfferingModel?.SessionModel?.sessionType} {timetable.CourseOfferingModel?.SessionModel?.sessionYear}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => handleViewSchedule(timetable)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-all"
                          title="View Schedule"
                        >
                          <Eye size={16}/>
                        </button>
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
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Upload Timetable</h3>
              <button title='btn' onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
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

              <button type="submit" className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all">
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      {showDetailModal && selectedTimetable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#1e3a5f] uppercase">Schedule Details</h3>
              <button title='btn' onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <InfoRow icon={<CalendarDays size={14} />} label="Day" value={selectedTimetable.day} />
              <InfoRow icon={<Clock size={14} />} label="Time" value={`${selectedTimetable.startTime} - ${selectedTimetable.endTime}`} />
              <InfoRow icon={<MapPin size={14} />} label="Venue" value={selectedTimetable.venue} />
              <InfoRow icon={<User size={14} />} label="Instructor" value={selectedTimetable.instructor} />
              <InfoRow label="Course" value={selectedTimetable.CourseOfferingModel?.courseName} />
              <InfoRow label="Credits" value={selectedTimetable.CourseOfferingModel?.credits} />
              <InfoRow label="Batch" value={`${selectedTimetable.CourseOfferingModel?.BatchModel?.batchName} ${selectedTimetable.CourseOfferingModel?.BatchModel?.batchYear}`} />
              <InfoRow label="Session" value={`${selectedTimetable.CourseOfferingModel?.SessionModel?.sessionType} ${selectedTimetable.CourseOfferingModel?.SessionModel?.sessionYear}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon && <div className="text-slate-400">{icon}</div>}
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-[#1e3a5f]">{value || 'N/A'}</p>
      </div>
    </div>
  );
}