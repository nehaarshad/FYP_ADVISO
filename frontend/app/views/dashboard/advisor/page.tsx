/* eslint-disable react-hooks/set-state-in-effect */
// app/views/dashboard/advisor/page.tsx (Main Dashboard)
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, UserMinus, Clock, Bell, Search, Filter, ChevronDown, Menu, Loader2 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdvisorAssignedBatches } from '@/src/hooks/assignBatches/useAdvisorAssignedBatches';
import { useStudents } from '@/src/hooks/studentsHook/useStudents';
import { AdvisorStudentList } from "@/components/StudentDetails/advisorStudentList";
import { StudentProfile } from "@/components/StudentDetails/StudentProfile";
import { StudentTranscript } from "@/components/StudentDetails/StudentTranscript";
import { Sidebar } from "@/components/navbars/route";
import { NotificationPanel } from "@/components/Notifications/NotificationPanel";
import { MeetingList } from "../../../../components/MeetingSchedule/MeetingList";
import AdvisoryNotes from "../../../../components/AdvisorView/AdvisoryNotes";
import { AdvisoryParentScreen } from '@/components/AdvisorView/advisoryNavPtterrn';
import AdvisorChat from "../../../../components/Chat/AdvisorChat";
import { AdvisoryLogs } from '../../../../components/AdvisorView/AdvisoryLogs';
import Guidelines from "../../../../components/Guidelines/Guidelines";
import FacultyRecommendation from "../../../../components/FacultyRecommendation/FacultyRecommendation";
import { AdvisorProfile } from "../../../../components/AdvisorView/AdvisorProfile";
import { ProfileView } from "@/components/ProfileView/route";

export default function AdvisorDashboard() {
  const [view, setView] = useState<string>("overview");
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Total");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { assignedBatches, isLoading: batchesLoading } = useAdvisorAssignedBatches();
  const { students, isLoading: studentsLoading, fetchStudents } = useStudents();
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, irregular: 0, regular: 0 });

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on selected batch
  useEffect(() => {
    if (students.length > 0 && selectedBatch) {
      const filtered = students.filter((student: any) => 
        student.BatchModel?.batchName === selectedBatch.batchName &&
        student.BatchModel?.batchYear === selectedBatch.batchYear &&
        student.BatchModel?.ProgramModel?.programName === selectedBatch.programName
      );
      setFilteredStudents(filtered);
      
      const total = filtered.length;
      const irregular = filtered.filter((s: any) => 
        s.StudentStatus?.currentStatus !== 'Regular' &&
        s.StudentStatus?.currentStatus !== 'Promoted'
      ).length;
      const regular = total - irregular;
      setStats({ total, irregular, regular });
    }
  }, [students, selectedBatch]);

  // Auto-select first batch
  useEffect(() => {
    if (assignedBatches.length > 0 && !selectedBatch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedBatch(assignedBatches[0]);
    }
  }, [assignedBatches, selectedBatch]);

  // Navigation Handlers
  const handleViewStudentProfile = (student: any) => {
    console.log("Selected Student data: ", student)
    setSelectedStudent(student);
    setView("student-profile");
  };

  const handleBackToOverview = () => {
    setSelectedStudent(null);
    setView("overview");
  };

  const handleViewTranscript = () => {
    setView("transcript");
  };

  const handleBackToProfile = () => {
    setView("student-profile");
  };

  const isLoading = batchesLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#1e3a5f] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar userRole="advisor" activeTab={view} setActiveTab={setView} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button title="btn" onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-[200px] md:max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search student..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-amber-400/20 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => { setShowNotifications(true); setHasNewNotif(false); }} className="h-10 w-10 md:h-11 md:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 relative">
              <Bell size={20} />
              {hasNewNotif && <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-500 border-2 border-white rounded-full"></span>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {/* Overview View */}
          {view === "overview" && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <StatCard icon={<Users size={22} />} label="Total Students" value={selectedBatch ? stats.total.toString() : "0"} color="bg-indigo-50" />
                <StatCard icon={<UserMinus size={22} />} label="Irregular List" value={selectedBatch ? stats.irregular.toString() : "0"} color="bg-red-50" textColor="text-red-500" />
                <StatCard icon={<Clock size={22} />} label="Meeting Schedule" value="April 24, 2026" color="bg-green-50" textColor="text-green-500" />
              </div>

              {/* Batch Buttons */}
              {assignedBatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Your Assigned Batches</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {assignedBatches.map((batch: any) => (
                      <button key={`${batch.batchName}-${batch.batchYear}`} onClick={() => { setSelectedBatch(batch); setActiveTab("Total"); }} className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border font-black text-[10px] md:text-[12px] uppercase transition-all ${selectedBatch?.batchName === batch.batchName ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-400'}`}>
                        {batch.batchName} {batch.batchYear} - {batch.programName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Student List */}
              {selectedBatch && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg md:text-xl font-black text-[#1e3a5f] uppercase tracking-tighter">{selectedBatch.programName}: <span className="text-amber-500">{selectedBatch.batchName} {selectedBatch.batchYear}</span></h3>
                    <div className="relative">
                      <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-[#1e3a5f]">
                        <Filter size={14} className="text-amber-500" /> Filter: <span className="text-slate-400">{activeTab}</span>
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-50 p-2">
                          {["Total", "Regular", "Irregular"].map((type) => (
                            <button key={type} onClick={() => { setActiveTab(type); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase ${activeTab === type ? 'bg-amber-50 text-amber-600' : 'text-slate-500'}`}>
                              {type} Students
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AdvisorStudentList 
                    students={filteredStudents}
                    activeTab={activeTab}
                    isAdvisor = {true}
                    onViewProfile={handleViewStudentProfile}

                    onRefresh={() => fetchStudents(true)}
                  />
                </div>
              )}
            </div>
            
          )}
                    {view === "advisor-chat" && (
                      <AdvisorChat onBack={() => setView("overview")} />
                    )}
                    {/* Recommendation Flow View */}
                    {view === "recommendations" && selectedStudent && (
                      <AdvisoryParentScreen
                        student={selectedStudent}
                        onBack={() => {
                          setView("student-profile");
                          setShowRecommendations(false);
                        }}
                        isAdvisor={true}
                        onViewTranscript={handleViewTranscript}
                      />
                    )}

                    {view === "advisory-logs" && (
                      <AdvisoryLogs onBack={() => setView("overview")} />
                    )}

                    {view === "guidelines" && (
                      <Guidelines onBack={() => setView("overview")} />
                    )}

                    {view === "faculty-recommendation" && (
                      <FacultyRecommendation onBack={() => setView("overview")} />
                    )}
                    {view === "meetings" && (
                    <MeetingList onBack={() => setView("overview")} />
                  )}

                  {/* Advisory Notes View */}
                  {view === "notes" && (
                    <AdvisoryNotes onBack={() => setView("overview")} />
                  )}

          {/* Student Profile View */}
          {view === "student-profile" && selectedStudent && (
            <StudentProfile 
              student={selectedStudent}
              selectedBatch={selectedBatch?.batchName || ''}
              onBack={handleBackToOverview}
              onViewTranscript={handleViewTranscript}
              isAdvisor={true}
              onNavigateToCourseRec={() => {
                
                setView("recommendations");
              }}
            />
          )}

          {/* Transcript View */}
          {view === "transcript" && selectedStudent && (
            <StudentTranscript 
              student={selectedStudent}
              onBack={handleBackToProfile}
            />
          )}
          {view === "profile" && <ProfileView />}
        </div>
      </main>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, color, textColor = "text-[#1e3a5f]" }: any) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${textColor}`}>{value}</p>
    </div>
  );
}