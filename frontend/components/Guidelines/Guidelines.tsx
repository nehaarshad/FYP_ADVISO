"use client";

import React, { useState } from "react";
import { 
  BookOpen, GraduationCap, Info, ChevronDown, PlayCircle, 
  Settings2, CheckCircle2, FileStack, ChevronLeft, ChevronRight,
  ArrowLeft 
} from "lucide-react";

interface GuidelinesProps {
  onBack: () => void;
}

export default function Guidelines({ onBack }: GuidelinesProps) {
  const [activeSection, setActiveSection] = useState<string | null>("requirements");
  const [userRole, setUserRole] = useState<"student" | "advisor">("student");
  const [currentVideo, setCurrentVideo] = useState(0);

  const videoGuides = [
    {
      title: `How to navigate ${userRole === 'student' ? 'Graduation' : 'Advisory'}?`,
      desc: userRole === "student" 
            ? "Watch this 2-minute guide to understand how to apply for your final degree and transcript."
            : "Advisor guide on how to verify student credit hours and approve graduation checklists.",
      tag: "Main Tutorial"
    },
    {
      title: "Credit Hours Policy 2026",
      desc: "Detailed explanation of enrollment limits based on CGPA and special request procedures.",
      tag: "Academic Policy"
    },
    {
      title: "Transcript & Degree Collection",
      desc: "Step-by-step process of clearance from different departments before the final award.",
      tag: "Clearance Guide"
    }
  ];

  const nextVideo = () => setCurrentVideo((prev) => (prev + 1) % videoGuides.length);
  const prevVideo = () => setCurrentVideo((prev) => (prev - 1 + videoGuides.length) % videoGuides.length);

  const sections = [
    {
      id: "requirements",
      title: "Degree Requirements",
      icon: <GraduationCap size={20} />,
      content: "Minimum criteria to be eligible for the BS SE degree awarding process.",
      items: ["Minimum CGPA: 2.00", "Total Credit Hours: 130+", "Residency: 8-14 Semesters"]
    },
    {
      id: "categories",
      title: "Course Categories & Credits",
      icon: <BookOpen size={20} />,
      content: "Breakdown of credit requirements as per HEC & PEC roadmap.",
      table: [
        { cat: "Computing Core", cr: "42" },
        { cat: "SE Core", cr: "24" },
        { cat: "General Ed", cr: "19" },
      ]
    },
    {
      id: "usage-policy",
      title: "System Usage & Credit Policy",
      icon: <Settings2 size={20} />,
      isTextForm: true,
      content: "Important rules regarding CGPA-based credit limits and form submissions."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50 animate-in fade-in duration-700">
      
      {/* Top Navigation - Consistent Back Arrow Style */}
      <div className="p-4 md:p-6 shrink-0">
        <button     title="btn"
          onClick={onBack} 
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto pb-20">
          
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter flex items-center gap-3">
              <Info className="text-amber-500 shrink-0" size={28} />
              Academic Guidelines 
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Standard Operating Procedures 2026
            </p>
          </div>

          {/* Video Guide Carousel */}
          <div className="relative mb-12">
            {/* Desktop Navigation Buttons */}
            <button    title="btn"
              onClick={prevVideo}
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-white border border-slate-200 rounded-full items-center justify-center text-[#1e3a5f] shadow-lg hover:bg-slate-50 transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-[#1e3a5f] p-6 md:p-10 text-white shadow-2xl shadow-blue-900/20">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-10">
                <div className="flex-1 text-center lg:text-left animate-in slide-in-from-right-4 duration-500" key={currentVideo}>
                  <span className="inline-block bg-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                    {videoGuides[currentVideo].tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold uppercase">{videoGuides[currentVideo].title}</h3>
                  <p className="text-blue-200 text-xs md:text-sm mt-3 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {videoGuides[currentVideo].desc}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-8">
                    <button className="flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                      <PlayCircle size={16} /> Play Now
                    </button>
                    {/* Mobile Navigation inside card */}
                    <div className="flex md:hidden gap-2">
                       <button    title="btn" onClick={prevVideo} className="p-2 bg-blue-800 rounded-lg"><ChevronLeft size={18} /></button>
                       <button    title="btn" onClick={nextVideo} className="p-2 bg-blue-800 rounded-lg"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                </div>
                
                {/* Video Placeholder */}
                <div className="w-full lg:w-72 h-44 md:h-52 bg-blue-800/50 rounded-2xl border border-blue-400/20 flex items-center justify-center transition-all cursor-pointer overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent" />
                    <PlayCircle size={48} className="text-blue-400 opacity-50 group-hover:scale-110 transition-all z-10" />
                </div>
              </div>
            </div>

            <button 
            title="btn"
              onClick={nextVideo}
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-white border border-slate-200 rounded-full items-center justify-center text-[#1e3a5f] shadow-lg hover:bg-slate-50 transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border border-slate-100 bg-white rounded-[1.2rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-5 md:p-7 text-left"
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="p-2.5 md:p-3 bg-slate-50 text-[#1e3a5f] rounded-xl md:rounded-2xl shrink-0">
                      {section.icon}
                    </div>
                    <h3 className="font-black uppercase tracking-tight text-[#1e3a5f] text-xs md:text-sm">
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown className={`shrink-0 transition-transform ${activeSection === section.id ? "rotate-180 text-amber-500" : "text-slate-300"}`} />
                </button>

                {activeSection === section.id && (
                  <div className="px-5 md:px-7 pb-8 md:pl-20 animate-in slide-in-from-top-2">
                    <p className="text-slate-500 text-[11px] md:text-xs font-medium mb-6">
                      {section.content}
                    </p>
                    
                    {!section.isTextForm ? (
                      <div className="w-full">
                        {section.table && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            {section.table.map((row, i) => (
                              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase">{row.cat}</p>
                                <p className="text-base md:text-lg font-black text-[#1e3a5f]">{row.cr} Credits</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {section.items && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {section.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-[11px] md:text-xs font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                                <CheckCircle2 size={14} className="text-green-500 shrink-0" /> {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6 text-slate-600 border-t border-slate-100 pt-6">
                        <div>
                          <h4 className="text-[10px] font-black text-amber-600 uppercase mb-3 tracking-widest">Enrollment Limits:</h4>
                          <div className="text-[11px] md:text-xs leading-relaxed space-y-2">
                            <div className="flex justify-between p-2 border-b border-slate-50"><span>CGPA below 2.0</span> <span className="font-black">14 Credits</span></div>
                            <div className="flex justify-between p-2 border-b border-slate-50"><span>CGPA 2.0 - 2.89</span> <span className="font-black">16 Credits</span></div>
                            <div className="flex justify-between p-2 border-b border-slate-50"><span>CGPA 2.9 & Above</span> <span className="font-black">18 Credits</span></div>
                          </div>
                        </div>
                        <div className="bg-amber-50 p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-amber-100">
                          <h4 className="text-[10px] font-black text-[#1e3a5f] uppercase mb-2 tracking-widest flex items-center gap-2">
                            <FileStack size={14} /> Required Process:
                          </h4>
                          <p className="text-[11px] leading-relaxed">
                            Submit a Special Request Form for additional credits beyond these limits.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}