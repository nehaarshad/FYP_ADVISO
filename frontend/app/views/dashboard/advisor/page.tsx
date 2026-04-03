"use client";
import React, { useState } from 'react';
import { Users, UserCheck, UserMinus, Clock, ArrowLeft } from 'lucide-react';
import { Sidebar } from '../../../components/Sidebar';
import { StatCard } from '../../../components/StatCard';
import { StudentList } from '../../../components/StudentList';
import { StudentProfile } from '../../../components/StudentProfile';
import { StudentTranscript } from '../../../components/StudentTranscript';

// 1. Student ki Type define kar di taake 'any' wala error na aaye
interface Student {
  id: string;
  name: string;
  code: string;
  status: 'Regular' | 'Irregular';
  academicStatus: string;
  cgpa?: string;
}

type ViewState = 'Overview' | 'BatchDetails' | 'StudentProfile' | 'Transcript';
type StudentStatus = 'Total' | 'Regular' | 'Irregular' | 'Meetings';

export default function Dashboard() {
  const [view, setView] = useState<ViewState>('Overview');
  const [selectedBatch, setSelectedBatch] = useState('Fall 2024');
  const [activeTab, setActiveTab] = useState<StudentStatus>('Total');
  
  // 2. State ko interface assign kar di
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const pastBatches = ["Fall 2023", "Spring 2022"];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        userRole="Batch Advisor" 
        activeTab={view} 
        setActiveTab={(v: any) => setView(v)} 
        setView={(v: any) => setView(v)} 
        setSelectedStudent={setSelectedStudent}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-10 w-full">
          
          {/* ---------------- LEVEL 1: OVERVIEW ---------------- */}
          {view === 'Overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl font-black text-[#1e3a5f] uppercase not-italic mb-8">
                Advisor Dashboard
              </h2>
              
              <div className="mb-12">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recent Batch</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard 
                    label="Current Advisory" 
                    value="Fall 2024" 
                    icon={Users} 
                    variant="Recent"
                    isActive={selectedBatch === 'Fall 2024'} 
                    onClick={() => { 
                      setSelectedBatch('Fall 2024'); 
                      setView('BatchDetails'); 
                      setActiveTab('Total');
                    }}
                  />
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Historical Records</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {pastBatches.map((batch) => (
                    <StatCard 
                      key={batch}
                      label="Past Batch" 
                      value={batch} 
                      icon={Clock} 
                      variant="Previous"
                      isActive={selectedBatch === batch}
                      onClick={() => { 
                        setSelectedBatch(batch); 
                        setView('BatchDetails'); 
                        setActiveTab('Total');
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 2: BATCH DETAILS ---------------- */}
          {view === 'BatchDetails' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setView('Overview')} 
                className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a5f] flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Batches
              </button>

              <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 flex justify-between items-center mb-8 shadow-lg border-b-4 border-amber-400">
                <div>
                  <p className="text-[10px] text-amber-400 font-black tracking-widest uppercase mb-1">Active Roster</p>
                  <h2 className="text-2xl font-black uppercase not-italic tracking-tight">
                    {selectedBatch} | BS SOFTWARE ENGINEERING
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { id: 'Total', label: 'Total Strength', count: '09', icon: Users, color: 'text-[#1e3a5f]', border: 'border-[#1e3a5f]' },
                  { id: 'Regular', label: 'Regular', count: '06', icon: UserCheck, color: 'text-green-600', border: 'border-green-600' },
                  { id: 'Irregular', label: 'Irregular', count: '03', icon: UserMinus, color: 'text-red-600', border: 'border-red-600' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as StudentStatus)} 
                    className={`h-[130px] rounded-[30px] bg-white transition-all flex flex-col items-start justify-between p-6 border shadow-sm group
                      ${activeTab === tab.id ? `${tab.border} border-2 scale-105 shadow-xl` : 'border-slate-100 hover:border-slate-300'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <tab.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tab.label}</p>
                      <p className={`text-2xl font-black ${activeTab === tab.id ? tab.color : 'text-slate-600'}`}>{tab.count}</p>
                    </div>
                  </button>
                ))}
              </div>

              <StudentList 
                selectedBatch={selectedBatch} 
                activeTab={activeTab} 
                onViewProfile={(student) => {
                  setSelectedStudent(student);
                  setView('StudentProfile');
                }} 
              />
            </div>
          )}

          {/* ---------------- LEVEL 3: STUDENT PROFILE ---------------- */}
          {view === 'StudentProfile' && selectedStudent && (
            <StudentProfile 
              student={selectedStudent}
              selectedBatch={selectedBatch}
              onBack={() => setView('BatchDetails')}
              onViewTranscript={() => setView('Transcript')}
            />
          )}

          {/* ---------------- LEVEL 4: TRANSCRIPT VIEW ---------------- */}
          {view === 'Transcript' && selectedStudent && (
            <StudentTranscript 
              student={selectedStudent}
              onBack={() => setView('StudentProfile')}
            />
          )}

        </div>
      </main>
    </div>
  );
}