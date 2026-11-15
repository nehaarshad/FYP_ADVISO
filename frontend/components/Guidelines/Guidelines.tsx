/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Key,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  FileStack,
  ArrowLeft,
  Loader2,
  Plus,
  Upload,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
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
    if (isAdmin && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((g: any) => g.title?.toLowerCase().includes(q));
    }
    return list;
  }, [isStudent, isAdvisor, selectedProgramGuidelines, guidelines, searchQuery, isAdmin]);

  const programName = useMemo(() => {
    if (isStudent) return (userProfile as any)?.profile?.Batch?.Program?.name || (userProfile as any)?.profile?.BatchModel?.ProgramModel?.name || "Programs Guideline";
    if (isAdvisor) return (userProfile as any)?.profile?.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.name || "Advised Program";
    return "";
  }, [userProfile, isStudent, isAdvisor]);

  const videoGuides = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return videos.map((video) => ({
      title: video.title,
      desc: video.description || "Watch this video guide for more information.",
      videoUrl: video.videoUrl,
      id: video.id,
    }));
  }, [videos]);

  const activeVideo = videoGuides[currentVideo];

  const handlePrevVideo = () => {
    setCurrentVideo((prev) => (prev > 0 ? prev - 1 : videoGuides.length - 1));
  };

  const handleNextVideo = () => {
    setCurrentVideo((prev) => (prev < videoGuides.length - 1 ? prev + 1 : 0));
  };

  const renderGuidelineContent = (guideline: any) => {
    
    const rawText = guideline.description || guideline.content || "";
    const parsed = parseGuidelineDescription(rawText);
  
    return <p className="text-slate-600 text-[17px] leading-7 whitespace-pre-line">{parsed.items[0]}</p>;
  };

  const renderContent = () => (
    <div className="flex-1 flex flex-col items-center gap-6 w-full">
      
      {/* VIDEO CAROUSEL SECTION */}
      {videoGuides.length > 0 && activeVideo && (
        <div className="flex flex-col items-center w-full my-2 px-6 md:px-10">
          
          <div className="relative w-full max-w-5xl flex items-center justify-center">
            
            {/* Left Outer Semi-Circle Button */}
            {(isStudent || isAdvisor) && (
              <button
                onClick={handlePrevVideo}
                title="Previous Video"
                className="absolute -left-7 top-1/2 -translate-y-1/2 z-30 w-8 h-16 bg-[#1e3a5f] text-[#FDB813] hover:bg-[#152a45] rounded-l-full flex items-center justify-center shadow-xl border-y border-l border-white/40 transition-all active:scale-90"
              >
                <ChevronLeft size={30} className="-ml-0.5" />
              </button>
            )}

            {/* Video Card */}
            <div className="bg-[#1e3a5f] rounded-[2rem] p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl w-full border border-white/40 relative z-10">
              <div className="w-full md:w-[280px] h-[160px] bg-black rounded-2xl overflow-hidden shrink-0 border border-white/60">
                {activeVideo.videoUrl ? (
                  <VideoPlayer 
                    videoUrl={activeVideo.videoUrl} 
                    title={activeVideo.title} 
                    autoPlay={false} 
                    showControls={true} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-500">
                    <PlayCircle size={44} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-white text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold mb-2 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3">
                  {activeVideo.desc}
                </p>
              </div>
            </div>

            {/* Right Outer Semi-Circle Button */}
            {(isStudent || isAdvisor) && (
              <button
                onClick={handleNextVideo}
                title="Next Video"
                className="absolute -right-7 top-1/2 -translate-y-1/2 z-30 w-8 h-16 bg-[#1e3a5f] text-[#FDB813] hover:bg-[#152a45] rounded-r-full flex items-center justify-center shadow-xl border-y border-r border-white/40 transition-all active:scale-90"
              >
                <ChevronRight size={30} className="-mr-0.5" />
              </button>
            )}

          </div>

          {/* Dots Indicator */}
          {(isStudent || isAdvisor) && videoGuides.length > 1 && (
            <div className="flex items-center gap-1.5 mt-4">
              {videoGuides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentVideo(idx)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    currentVideo === idx
                      ? "w-6 bg-[#1e3a5f]"
                      : "w-2 bg-slate-400 hover:bg-slate-400"
                  }`}
                  title={`Go to video ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* WIDER GUIDELINES LIST SECTION */}
      {visibleGuidelines.length === 0 ? (
        <div className="text-center py-12 text-slate-600 bg-white rounded-2xl border border-slate-300 shadow-sm w-full max-w-5xl">
          No guidelines found.
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-5xl">
          {visibleGuidelines.map((guideline: any) => (
            <div key={guideline.id} className="border border-slate-300/80 bg-white rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => setActiveSection(activeSection === String(guideline.id) ? null : String(guideline.id))} className="w-full flex items-center justify-between p-6 text-left">
                <h3 className="font-bold text-[#1e3a5f] text-[18px]">{guideline.title}</h3>
                </button>
              <div className="px-7 pb-4 pt-0">{renderGuidelineContent(guideline)}</div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full py-4 font-sans">
      <div className="relative min-h-screen w-full max-w-6.5xl mx-auto p-4 md:p-8 pb-10 -mt-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            title="Back"
            onClick={onBack}
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors w-fit border border-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* --- COORDINATOR / ADMIN VIEW --- */}
        {isAdmin ? (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1e3a5f] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <Key size={24} className="text-[#FDB813]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f]">
                    Degree Guidelines
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage academic guidelines and requirements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => console.log("Add Guideline clicked")}
                  className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold  tracking-widest shadow-md active:scale-95 transition-all hover:bg-amber-500"
                >
                  <Plus size={16} /> Add Guideline
                </button>
                <button 
                  onClick={() => console.log("Upload Video clicked")}
                  className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold  tracking-widest shadow-md active:scale-95 transition-all hover:bg-amber-500"
                >
                  <Upload size={16} /> Upload Video
                </button>
              </div>
            </div>

            {/* Filter Section (Admin) */}
            <div className="mb-6 p-4 bg-slate-100 rounded-2xl border border-slate-300">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-[#1e3a5f]" />
                <h3 className="text-sm font-bold text-[#1e3a5f]  tracking-wider">
                  Filter Guidelines
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    placeholder="Search guidelines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FDB813] outline-none"
                  />
                </div>
                <select
                  title="Filter Program"
                  className="p-2 bg-white border border-slate-300 rounded-xl text-[12px] focus:ring-2 focus:ring-[#FDB813] outline-none min-w-[200px]"
                >
                  <option>All Programs</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            {(isVideosLoading || profileLoading || guidelinesLoading) ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <Loader2 className="animate-spin mb-4 text-[#1e3a5f]" size={35} />
                <p className="text-medium font-bold">Loading...</p>
              </div>
            ) : guidelinesError ? (
              <div className="text-center py-12 text-red-500 font-bold">{guidelinesError}</div>
            ) : (
              renderContent()
            )}
          </div>
        ) : (

          /* --- STUDENT / ADVISOR VIEW --- */
          <>
            <div className="flex flex-col justify-between gap-6 mb-8 pl-0">
              <div className="flex items-center gap-4 pl-10 md:pl-13">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
                  <Key size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f]">
                    Degree Guidelines
                  </h2>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    {isStudent ? programName : `Advisor View - ${programName}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {(isVideosLoading || profileLoading || guidelinesLoading) ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <Loader2 className="animate-spin mb-4 text-[#1e3a5f]" size={35} />
                <p className="text-medium font-bold">Loading...</p>
              </div>
            ) : guidelinesError ? (
              <div className="text-center py-12 text-red-500 font-bold">{guidelinesError}</div>
            ) : (
              renderContent()
            )}
          </>
        )}

      </div>
    </div>
  );
}