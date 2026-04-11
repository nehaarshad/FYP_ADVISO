"use client";

import React, { useState } from "react";
import { 
  BookOpen, GraduationCap, ClipboardCheck, 
  Info, ChevronDown, PlayCircle, User, 
  ShieldCheck, FileText, CheckCircle2,
  AlertCircle, FileStack, Settings2
} from "lucide-react";

export default function Guidelines() {
  const [activeSection, setActiveSection] = useState<string | null>("requirements");
  const [userRole, setUserRole] = useState<"student" | "advisor">("student");

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
    /* Scrolling remove karne ke liye h-screen ya fixed heights ko avoid kiya gaya hai */
    <div className="w-full h-auto py-10 px-6 animate-in fade-in duration-700">
      
      <div className="max-w-4xl mx-auto">
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter flex items-center gap-3">
              <Info className="text-amber-500" size={28} />
              Academic Guidelines 
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Standard Operating Procedures 2026
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setUserRole("student")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${userRole === "student" ? "bg-white text-[#1e3a5f] shadow-sm" : "text-slate-400"}`}
            >
              Student
            </button>
            <button 
              onClick={() => setUserRole("advisor")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${userRole === "advisor" ? "bg-white text-[#1e3a5f] shadow-sm" : "text-slate-400"}`}
            >
              Advisor
            </button>
          </div>
        </div>

        {/* 2. Video Guide Section */}
        <div className="mb-10 group relative overflow-hidden rounded-[2.5rem] bg-[#1e3a5f] p-8 text-white shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="bg-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Tutorial</span>
              <h3 className="text-xl font-bold mt-3 uppercase italic">How to navigate {userRole === 'student' ? 'Graduation' : 'Advisory'}?</h3>
              <p className="text-blue-200 text-xs mt-2 leading-relaxed italic">
                {userRole === "student" 
                  ? "Watch this 2-minute guide to understand how to apply for your final degree and transcript."
                  : "Advisor guide on how to verify student credit hours and approve graduation checklists."}
              </p>
              <button className="mt-6 flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-amber-500 hover:text-white transition-all shadow-lg">
                <PlayCircle size={16} /> Play Video Guide
              </button>
            </div>
            <div className="w-full md:w-64 h-40 bg-blue-800/50 rounded-2xl border border-blue-400/20 flex items-center justify-center group-hover:bg-blue-700/50 transition-all cursor-pointer">
                <PlayCircle size={48} className="text-blue-400 opacity-50 group-hover:scale-110 group-hover:text-amber-500 transition-all" />
            </div>
          </div>
        </div>

        {/* 3. Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-slate-100 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-7"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-slate-50 text-[#1e3a5f] rounded-2xl">{section.icon}</div>
                  <h3 className="font-black uppercase tracking-tight text-[#1e3a5f] text-sm">{section.title}</h3>
                </div>
                <ChevronDown className={`transition-transform ${activeSection === section.id ? "rotate-180 text-amber-500" : "text-slate-300"}`} />
              </button>

              {activeSection === section.id && (
                <div className="px-7 pb-8 pl-10 md:pl-20 animate-in slide-in-from-top-2">
                  <p className="text-slate-500 text-xs font-medium mb-6 italic">{section.content}</p>
                  
                  {!section.isTextForm && (
                    <>
                      {section.table && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {section.table.map((row, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase">{row.cat}</p>
                              <p className="text-lg font-black text-[#1e3a5f]">{row.cr} Credits</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.items && (
                        <div className="space-y-3">
                          {section.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                              <CheckCircle2 size={14} className="text-green-500" /> {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {section.isTextForm && (
                    <div className="space-y-6 text-slate-600 border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="text-[10px] font-black text-amber-600 uppercase mb-2 tracking-widest">Enrollment Limits:</h4>
                        <div className="text-[11px] leading-relaxed space-y-1">
                          <p>• <strong>CGPA below 2.0:</strong> System limit restricted to 14 Credit Hours.</p>
                          <p>• <strong>CGPA 2.0 - 2.89:</strong> System limit restricted to 16 Credit Hours.</p>
                          <p>• <strong>CGPA 2.9 & Above:</strong> Standard 18 Credit Hours allowed.</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-5 rounded-[1.5rem] border border-amber-100">
                        <h4 className="text-[10px] font-black text-[#1e3a5f] uppercase mb-2 tracking-widest flex items-center gap-2">
                          <FileStack size={14} /> Required Process:
                        </h4>
                        <p className="text-[11px] italic leading-relaxed">
                          If a student already has 14 or 16 credit hours and wishes to take additional credit hours or enroll in a special offering course, the student must submit a Special Request Form.
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
  );
}