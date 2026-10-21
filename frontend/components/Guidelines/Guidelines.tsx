"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Info,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  FileStack,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Filter,
  Search,
} from "lucide-react";
import { useUserProfile } from "@/src/hooks/profileHook/useProfile";
import { useDegreeGuidelines } from "@/src/hooks/degreeGuidlineHook/degreeGuidlineHook";
import { useSupportingVideos } from "@/src/hooks/suppportingVideo/supportingVideoHook";
import VideoPlayer from "../supportingVideos/videoPlayer";

interface GuidelinesProps {
  onBack: () => void;
}

const normalizeGuidelineText = (text: string) => {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

const parseGuidelineDescription = (text: string) => {
  const normalizedText = normalizeGuidelineText(text);
  if (!normalizedText) return { type: "empty" as const, items: [] as string[] };

  const lines = normalizedText.split("\n").map((line) => line.trim()).filter(Boolean);
  const numberedLineRegex = /^\d+(?:[\.\),:]*)\s*(.+)$/;
  const numberedItems: string[] = [];
  let allNumbered = true;

  for (const line of lines) {
    const match = line.match(numberedLineRegex);
    if (match) numberedItems.push(match[1].trim());
    else { allNumbered = false; break; }
  }
  if (allNumbered && numberedItems.length >= 2) return { type: "numbered" as const, items: numberedItems };

  const bulletLineRegex = /^[-*•]\s*(.+)$/;
  const bulletItems: string[] = [];
  let allBullets = true;

  for (const line of lines) {
    const match = line.match(bulletLineRegex);
    if (match) bulletItems.push(match[1].trim());
    else { allBullets = false; break; }
  }
  if (allBullets && bulletItems.length >= 2) return { type: "bullet" as const, items: bulletItems };

  const inlineNumberedRegex = /(?:^|\s)(\d+)(?:[\.\),:]*)\s*(?=\S)/g;
  const inlineMatches = [...normalizedText.matchAll(inlineNumberedRegex)];
  if (inlineMatches.length >= 2) {
    const items: string[] = [];
    for (let i = 0; i < inlineMatches.length; i++) {
      const current = inlineMatches[i];
      const start = (current.index ?? 0) + current[0].length;
      const next = inlineMatches[i + 1];
      const end = next ? next.index ?? normalizedText.length : normalizedText.length;
      const item = normalizedText.slice(start, end).trim();
      if (item) items.push(item);
    }
    if (items.length >= 2) return { type: "numbered" as const, items };
  }

  return { type: "paragraph" as const, items: [normalizedText] };
};

export default function Guidelines({ onBack }: GuidelinesProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const { guidelines, selectedProgramGuidelines, isLoading: guidelinesLoading, error: guidelinesError, fetchGuidelines, fetchGuidelinesForProgram } = useDegreeGuidelines();
  const { videos, isLoading: isVideosLoading, fetchVideos } = useSupportingVideos();

  const role = userProfile?.role;
  const isStudent = role === "student";
  const isAdvisor = role === "advisor";
  const isAdmin = role === "admin" || role === "coordinator";

  useEffect(() => {
    if (!userProfile) return;
    if (isStudent || isAdvisor) {
      const programId = (userProfile as any)?.profile?.Batch?.Program?.id || (userProfile as any)?.profile?.BatchModel?.ProgramModel?.id || (userProfile as any)?.profile?.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.id;
      if (programId) fetchGuidelinesForProgram(programId);
    } else if (isAdmin) {
      fetchGuidelines();
    }
  }, [userProfile?.role, userProfile?.id]);

  useEffect(() => { fetchVideos(); }, []);

  const visibleGuidelines = useMemo(() => {
    let list = [];
    if (isStudent || isAdvisor) {
      list = selectedProgramGuidelines?.length > 0 ? selectedProgramGuidelines : [];
    } else {
      list = guidelines?.length > 0 ? guidelines : [];
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((g: any) => g.title?.toLowerCase().includes(q));
    }
    return list;
  }, [isStudent, isAdvisor, selectedProgramGuidelines, guidelines, searchQuery]);

  const programName = useMemo(() => {
    if (isStudent) return (userProfile as any)?.profile?.Batch?.Program?.name || (userProfile as any)?.profile?.BatchModel?.ProgramModel?.name || "Your Program";
    if (isAdvisor) return (userProfile as any)?.profile?.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.name || "Advised Program";
    return "";
  }, [userProfile, isStudent, isAdvisor]);

  useEffect(() => {
    if (!activeSection && visibleGuidelines.length > 0) setActiveSection(String(visibleGuidelines[0].id));
  }, [visibleGuidelines, activeSection]);

  const videoGuides = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return videos.map((video, index) => ({
      title: video.title,
      desc: video.description || "Watch this video guide for more information.",
      videoUrl: video.videoUrl,
      id: video.id,
    }));
  }, [videos]);

  const activeVideo = videoGuides[currentVideo];

  const renderGuidelineContent = (guideline: any) => {
    if (guideline.renderType === "table" && guideline.tableData) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {guideline.tableData.map((row: any, i: number) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{row.category}</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{row.credits} Credits</p>
            </div>
          ))}
        </div>
      );
    }
    if (guideline.renderType === "list" && guideline.items) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guideline.items.map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl">
              <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
              <span className="break-words">{item}</span>
            </div>
          ))}
        </div>
      );
    }
    if (guideline.renderType === "policy") {
      return (
        <div className="space-y-5 text-slate-600 border-t border-slate-100 pt-5">
          {guideline.enrollmentLimits && (
            <div>
              <h4 className="text-[10px] font-bold text-[#1e3a5f] uppercase mb-3 tracking-widest">Enrollment Limits:</h4>
              <div className="text-xs leading-relaxed space-y-2">
                {guideline.enrollmentLimits.map((row: any, i: number) => (
                  <div key={i} className="flex justify-between p-2 border-b border-slate-50">
                    <span>{row.label}</span>
                    <span className="font-bold">{row.credits}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {guideline.requiredProcessText && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-[10px] font-bold text-[#1e3a5f] uppercase mb-2 tracking-widest flex items-center gap-2">
                <FileStack size={14} /> Required Process:
              </h4>
              <p className="text-xs leading-relaxed">{guideline.requiredProcessText}</p>
            </div>
          )}
        </div>
      );
    }
    const rawText = guideline.description || guideline.content || "";
    const parsed = parseGuidelineDescription(rawText);
    if (parsed.type === "empty") return null;
    if (parsed.type === "numbered") {
      return (
        <ol className="list-decimal pl-5 text-slate-600 text-sm leading-7 space-y-1">
          {parsed.items.map((item: string, index: number) => (
            <li key={index} className="pl-1">{item}</li>
          ))}
        </ol>
      );
    }
    if (parsed.type === "bullet") {
      return (
        <ul className="list-disc pl-5 text-slate-600 text-sm leading-7 space-y-1">
          {parsed.items.map((item: string, index: number) => (
            <li key={index} className="pl-1">{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-slate-600 text-sm leading-7 whitespace-pre-line">{parsed.items[0]}</p>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* 1. Back Button (Bahar) */}
      <button
        onClick={onBack}
        className="mb-4 p-2 bg-white shadow-sm rounded-full text-[#1e3a5f] border border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* 2. SINGLE MAIN CARD */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] uppercase flex items-center gap-2">
              <Info className="text-[#1e3a5f]" size={24} /> 
              DEGREE GUIDELINES
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isStudent ? `For ${programName}` : isAdvisor ? `Advisor View - ${programName}` : "Manage academic guidelines and requirements"}
            </p>
          </div>
        </div>

        {/* FILTER SECTION (Exact Match with Course Offerings) */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-[#1e3a5f]" />
            <h3 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
              Filter Guidelines
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search guidelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
              />
            </div>
            
            {/* Dropdown */}
            <select
              title="Filter Program"
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none min-w-[200px]"
            >
              <option>All Programs</option>
            </select>
          </div>
        </div>

        {/* CONTENT AREA */}
        {(isVideosLoading || profileLoading || guidelinesLoading) ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-[#1e3a5f]" size={32} />
            <p className="text-sm font-bold">Loading...</p>
          </div>
        ) : guidelinesError ? (
          <div className="text-center py-12 text-red-500 font-bold">
            {guidelinesError}
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-6">
            
            {/* VIDEO SECTION (If any) */}
            {videoGuides.length > 0 && activeVideo && (
              <div className="bg-[#1e3a5f] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-[300px] h-[160px] bg-black rounded-xl overflow-hidden shrink-0">
                  {activeVideo.videoUrl ? (
                    <VideoPlayer videoUrl={activeVideo.videoUrl} title={activeVideo.title} autoPlay={false} showControls={true} />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full"><PlayCircle size={40} className="text-slate-600" /></div>
                  )}
                </div>
                <div className="flex-1 text-white">
                  <h3 className="text-lg font-bold uppercase mb-2">{activeVideo.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed">{activeVideo.desc}</p>
                </div>
              </div>
            )}

            {/* LIST OR EMPTY STATE */}
            {visibleGuidelines.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No guidelines found.
              </div>
            ) : (
              <div className="space-y-3">
                {visibleGuidelines.map((guideline: any) => (
                  <div key={guideline.id} className="border border-slate-200 bg-white rounded-xl overflow-hidden">
                    <button onClick={() => setActiveSection(activeSection === String(guideline.id) ? null : String(guideline.id))} className="w-full flex items-center justify-between p-4 text-left">
                      <h3 className="font-bold text-[#1e3a5f] text-sm">{guideline.title}</h3>
                      <ChevronDown size={20} className={activeSection === String(guideline.id) ? "rotate-180" : ""} />
                    </button>
                    {activeSection === String(guideline.id) && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-4">{renderGuidelineContent(guideline)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}