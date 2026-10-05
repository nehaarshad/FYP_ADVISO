
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Info,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  FileStack,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
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

  if (!normalizedText) {
    return { type: "empty" as const, items: [] as string[] };
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const numberedLineRegex = /^\d+(?:[\.\),:]*)\s*(.+)$/;
  const numberedItems: string[] = [];
  let allNumbered = true;

  for (const line of lines) {
    const match = line.match(numberedLineRegex);

    if (match) {
      numberedItems.push(match[1].trim());
    } else {
      allNumbered = false;
      break;
    }
  }

  if (allNumbered && numberedItems.length >= 2) {
    return {
      type: "numbered" as const,
      items: numberedItems,
    };
  }

  const bulletLineRegex = /^[-*•]\s*(.+)$/;
  const bulletItems: string[] = [];
  let allBullets = true;

  for (const line of lines) {
    const match = line.match(bulletLineRegex);

    if (match) {
      bulletItems.push(match[1].trim());
    } else {
      allBullets = false;
      break;
    }
  }

  if (allBullets && bulletItems.length >= 2) {
    return {
      type: "bullet" as const,
      items: bulletItems,
    };
  }

  const inlineNumberedRegex = /(?:^|\s)(\d+)(?:[\.\),:]*)\s*(?=\S)/g;
  const inlineMatches = [...normalizedText.matchAll(inlineNumberedRegex)];

  if (inlineMatches.length >= 2) {
    const items: string[] = [];

    for (let i = 0; i < inlineMatches.length; i++) {
      const current = inlineMatches[i];
      const start = (current.index ?? 0) + current[0].length;
      const next = inlineMatches[i + 1];
      const end = next
        ? next.index ?? normalizedText.length
        : normalizedText.length;

      const item = normalizedText.slice(start, end).trim();

      if (item) {
        items.push(item);
      }
    }

    if (items.length >= 2) {
      return {
        type: "numbered" as const,
        items,
      };
    }
  }

  return {
    type: "paragraph" as const,
    items: [normalizedText],
  };
};

export default function Guidelines({ onBack }: GuidelinesProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

  const {
    userProfile,
    isLoading: profileLoading,
    getRoleDisplay,
  } = useUserProfile();

  const {
    guidelines,
    selectedProgramGuidelines,
    isLoading: guidelinesLoading,
    error: guidelinesError,
    fetchGuidelines,
    fetchGuidelinesForProgram,
  } = useDegreeGuidelines();

  const {
    videos,
    isLoading: isVideosLoading,
    fetchVideos,
  } = useSupportingVideos();

  const role = userProfile?.role;
  const isStudent = role === "student";
  const isAdvisor = role === "advisor";
  const isAdmin = role === "admin" || role === "coordinator";

  useEffect(() => {
    if (!userProfile) return;

    if (isStudent || isAdvisor) {
      const programId =
        (userProfile as any)?.profile?.Batch?.Program?.id ||
        (userProfile as any)?.profile?.BatchModel?.ProgramModel?.id ||
        (userProfile as any)?.profile?.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.id;

      if (programId) {
        fetchGuidelinesForProgram(programId);
      }
    } else if (isAdmin) {
      fetchGuidelines();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.role, userProfile?.id]);

  useEffect(() => {
    fetchVideos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleGuidelines = useMemo(() => {
    if (isStudent || isAdvisor) {
      return selectedProgramGuidelines?.length > 0
        ? selectedProgramGuidelines
        : [];
    }

    return guidelines?.length > 0 ? guidelines : [];
  }, [
    isStudent,
    isAdvisor,
    selectedProgramGuidelines,
    guidelines,
  ]);

  const programName = useMemo(() => {
    if (isStudent) {
      return (
        (userProfile as any)?.profile?.Batch?.Program?.name ||
        (userProfile as any)?.profile?.BatchModel?.ProgramModel?.name ||
        "Your Program"
      );
    }

    if (isAdvisor) {
      return (
        (userProfile as any)?.profile?.BatchAssignments?.[0]?.BatchModel?.ProgramModel?.name ||
        "Advised Program"
      );
    }

    return "";
  }, [userProfile, isStudent, isAdvisor]);

  useEffect(() => {
    if (!activeSection && visibleGuidelines.length > 0) {
      setActiveSection(String(visibleGuidelines[0].id));
    }
  }, [visibleGuidelines, activeSection]);

  const videoGuides = useMemo(() => {
    if (!videos || videos.length === 0) {
      return [
        {
          title: "How to navigate Graduation?",
          desc: "Watch this 2-minute guide to understand how to apply for your final degree and transcript.",
          tag: "Main Tutorial",
          videoUrl: null,
          id: null,
        },
        {
          title: "Credit Hours Policy 2026",
          desc: "Detailed explanation of enrollment limits based on CGPA and special request procedures.",
          tag: "Academic Policy",
          videoUrl: null,
          id: null,
        },
        {
          title: "Transcript & Degree Collection",
          desc: "Step-by-step process of clearance from different departments before the final award.",
          tag: "Clearance Guide",
          videoUrl: null,
          id: null,
        },
      ];
    }

    return videos.map((video, index) => ({
      title: video.title,
      desc:
        video.description ||
        "Watch this video guide for more information.",
      tag: index === 0 ? "Main Tutorial" : "Supporting Guide",
      videoUrl: video.videoUrl,
      id: video.id,
    }));
  }, [videos]);

  const nextVideo = () => {
    if (videoGuides.length > 1) {
      setCurrentVideo(
        (prev) => (prev + 1) % videoGuides.length
      );
    }
  };

  const prevVideo = () => {
    if (videoGuides.length > 1) {
      setCurrentVideo(
        (prev) =>
          (prev - 1 + videoGuides.length) %
          videoGuides.length
      );
    }
  };

  const activeVideo = videoGuides[currentVideo];

  const renderGuidelineContent = (guideline: any) => {
    if (
      guideline.renderType === "table" &&
      guideline.tableData
    ) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {guideline.tableData.map(
            (row: any, i: number) => (
              <div
                key={i}
                className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
                  {row.category}
                </p>
                <p className="text-base sm:text-lg font-bold text-[#1e3a5f]">
                  {row.credits} Credits
                </p>
              </div>
            )
          )}
        </div>
      );
    }

    if (
      guideline.renderType === "list" &&
      guideline.items
    ) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guideline.items.map(
            (item: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl"
              >
                <CheckCircle2
                  size={14}
                  className="text-green-500 shrink-0 mt-0.5"
                />
                <span className="break-words">
                  {item}
                </span>
              </div>
            )
          )}
        </div>
      );
    }

    if (guideline.renderType === "policy") {
      return (
        <div className="space-y-5 sm:space-y-6 text-slate-600 border-t border-slate-100 pt-5 sm:pt-6">
          {guideline.enrollmentLimits && (
            <div>
              <h4 className="text-[10px] font-bold text-amber-600 uppercase mb-3 tracking-widest">
                Enrollment Limits:
              </h4>

              <div className="text-[11px] sm:text-xs leading-relaxed space-y-2">
                {guideline.enrollmentLimits.map(
                  (row: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 border-b border-slate-50"
                    >
                      <span>{row.label}</span>
                      <span className="font-bold">
                        {row.credits}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {guideline.requiredProcessText && (
            <div className="bg-amber-50 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] border border-amber-100">
              <h4 className="text-[10px] font-bold text-[#1e3a5f] uppercase mb-2 tracking-widest flex items-center gap-2">
                <FileStack size={14} />
                Required Process:
              </h4>
              <p className="text-[11px] sm:text-xs leading-relaxed">
                {guideline.requiredProcessText}
              </p>
            </div>
          )}
        </div>
      );
    }

    const rawText =
      guideline.description ||
      guideline.content ||
      "";

    const parsed = parseGuidelineDescription(rawText);

    if (parsed.type === "empty") {
      return null;
    }

    if (parsed.type === "numbered") {
      return (
        <ol className="list-decimal pl-5 sm:pl-6 text-slate-600 text-xs sm:text-sm leading-6 sm:leading-7 space-y-0.5 sm:space-y-1 font-['Inter']">
          {parsed.items.map(
            (item: string, index: number) => (
              <li
                key={index}
                className="pl-1 break-words"
              >
                {item}
              </li>
            )
          )}
        </ol>
      );
    }

    if (parsed.type === "bullet") {
      return (
        <ul className="list-disc pl-5 sm:pl-6 text-slate-600 text-xs sm:text-sm leading-6 sm:leading-7 space-y-0.5 sm:space-y-1 font-['Inter']">
          {parsed.items.map(
            (item: string, index: number) => (
              <li
                key={index}
                className="pl-1 break-words"
              >
                {item}
              </li>
            )
          )}
        </ul>
      );
    }

    return (
      <p className="text-slate-600 text-xs sm:text-sm leading-6 sm:leading-7 whitespace-pre-line break-words font-['Inter']">
        {parsed.items[0]}
      </p>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50 font-['Inter'] animate-in fade-in duration-700">
      <div className="p-3 sm:p-4 md:p-6 shrink-0">
        <button
          title="btn"
          onClick={onBack}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6">
        <div className="w-full max-w-4xl mx-auto pb-12 sm:pb-16 md:pb-20">
          <div className="mb-7 sm:mb-9 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e3a5f] uppercase tracking-tight md:tracking-tighter flex items-center gap-2 sm:gap-3">
              <Info
                className="text-amber-500 shrink-0"
                size={24}
              />
              <span className="break-words">
                {isStudent
                  ? "Academic Guidelines"
                  : "Program Guidelines"}
              </span>
            </h2>

            <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-2 break-words">
              {isStudent
                ? `For ${programName}`
                : isAdvisor
                ? `Advisor View - ${programName}`
                : "All Programs View"}
            </p>

            {isAdmin && (
              <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {getRoleDisplay()} Access
              </span>
            )}
          </div>

          {isVideosLoading ? (
            <div className="flex items-center justify-center h-32 sm:h-40 mb-8 sm:mb-12 text-slate-400 text-xs sm:text-sm">
              <Loader2
                className="animate-spin mr-2"
                size={18}
              />
              Loading guides...
            </div>
          ) : videoGuides.length > 0 && activeVideo ? (
            <div className="relative mb-8 sm:mb-10 md:mb-12">
              <button
                title="btn"
                onClick={prevVideo}
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-white border border-slate-200 rounded-full items-center justify-center text-[#1e3a5f] shadow-lg hover:bg-slate-50 transition-all active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="group relative overflow-hidden rounded-2xl sm:rounded-[1.5rem] md:rounded-[2.5rem] bg-[#1e3a5f] p-5 sm:p-6 md:p-10 text-white shadow-2xl shadow-blue-900/20">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-5 sm:gap-6 md:gap-10">
                  <div
                    className="w-full flex-1 text-center lg:text-left animate-in slide-in-from-right-4 duration-500"
                    key={activeVideo.id ?? currentVideo}
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase break-words">
                      {activeVideo.title}
                    </h3>

                    <p className="text-blue-200 text-xs sm:text-sm mt-3 leading-5 sm:leading-relaxed max-w-xl mx-auto lg:mx-0 break-words">
                      {activeVideo.desc}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-6 sm:mt-8">
                      <div className="flex md:hidden gap-2">
                        <button
                          title="btn"
                          onClick={prevVideo}
                          className="p-2 bg-blue-800 rounded-lg"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          title="btn"
                          onClick={nextVideo}
                          className="p-2 bg-blue-800 rounded-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-92 h-40 sm:h-48 md:h-52 bg-blue-800/50 rounded-xl sm:rounded-2xl border border-blue-400/20 flex items-center justify-center transition-all cursor-pointer overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent" />

                    {videoGuides[currentVideo]?.videoUrl ? (
                      <div className="relative w-full">
                        <VideoPlayer
                          videoUrl={
                            videoGuides[currentVideo].videoUrl
                          }
                          title={
                            videoGuides[currentVideo].title
                          }
                          description={
                            videoGuides[currentVideo].desc
                          }
                          autoPlay={false}
                          className="w-full aspect-video rounded-xl"
                          allowDownload={false}
                          allowShare={false}
                          showControls={true}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-xl" />

                        <PlayCircle
                          size={40}
                          className="sm:w-12 sm:h-12 text-slate-300 group-hover:scale-110 transition-all z-10"
                        />

                        <p className="absolute bottom-3 text-[10px] sm:text-xs text-slate-400">
                          No video available
                        </p>
                      </div>
                    )}
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
          ) : null}

          {profileLoading || guidelinesLoading ? (
            <div className="flex items-center justify-center h-32 sm:h-40 text-slate-400 text-xs sm:text-sm">
              <Loader2
                className="animate-spin mr-2"
                size={18}
              />
              Loading guidelines...
            </div>
          ) : guidelinesError ? (
            <div className="flex items-start sm:items-center gap-3 p-4 sm:p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
              <AlertTriangle
                size={18}
                className="shrink-0 mt-0.5 sm:mt-0"
              />
              <span className="break-words">
                {guidelinesError}
              </span>
            </div>
          ) : visibleGuidelines.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              {isStudent || isAdvisor
                ? "No guidelines have been published for your program yet."
                : "No guidelines have been published yet."}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {visibleGuidelines.map(
                (guideline: any) => (
                  <div
                    key={guideline.id}
                    className="border border-slate-100 bg-white rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() =>
                        setActiveSection(
                          activeSection ===
                            String(guideline.id)
                            ? null
                            : String(guideline.id)
                        )
                      }
                      className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 md:p-7 text-left"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
                        <div className="min-w-0">
                          <h3 className="font-bold uppercase tracking-tight text-[#1e3a5f] text-[11px] sm:text-xs md:text-sm break-words">
                            {guideline.title}
                          </h3>

                          {isAdmin &&
                            guideline.Program && (
                              <span className="text-[8px] sm:text-[9px] font-bold text-amber-600 uppercase tracking-widest break-words">
                                {guideline.Program.name}
                              </span>
                            )}
                        </div>
                      </div>

                      <ChevronDown
                        className={`shrink-0 transition-transform ${
                          activeSection ===
                          String(guideline.id)
                            ? "rotate-180 text-amber-500"
                            : "text-slate-300"
                        }`}
                        size={20}
                      />
                    </button>

                    {activeSection ===
                      String(guideline.id) && (
                      <div className="px-4 sm:px-5 md:px-7 pb-6 sm:pb-7 md:pb-8 md:pl-20">
                        {renderGuidelineContent(
                          guideline
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}