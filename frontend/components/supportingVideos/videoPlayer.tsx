"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Clock,
  Download,
  Share2,
  X
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  onClose?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  allowDownload?: boolean;
  allowShare?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  title = "",
  description = "",
  thumbnail = "",
  onClose,
  autoPlay = false,
  showControls = true,
  className = "",
  allowDownload = true,
  allowShare = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControlsTimeout, setShowControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // Format time
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current && !isDragging) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSeekStart = () => setIsDragging(true);


  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Handle playback speed change
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSpeedMenuOpen(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "f") {
        toggleFullscreen();
      }
      if (e.key === "m") {
        toggleMute();
      }
      if (e.key === "ArrowRight") {
        if (videoRef.current) {
          videoRef.current.currentTime += 5;
        }
      }
      if (e.key === "ArrowLeft") {
        if (videoRef.current) {
          videoRef.current.currentTime -= 5;
        }
      }
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFullscreen]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    const hideControls = () => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    };

    const showControlsTemporarily = () => {
      setIsControlsVisible(true);
      if (showControlsTimeout) {
        clearTimeout(showControlsTimeout);
      }
      const timeout = setTimeout(hideControls, 3000);
      setShowControlsTimeout(timeout);
    };

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", showControlsTemporarily);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", showControlsTemporarily);
      }
      if (showControlsTimeout) {
        clearTimeout(showControlsTimeout);
      }
    };
  }, [isPlaying, showControls]);

  // Handle video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => setIsPlaying(false);

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Share video
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Video",
          text: description || "Check out this video",
          url: videoUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(videoUrl).then(() => {
        alert("Video URL copied to clipboard!");
      });
    }
  };

  // Download video
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = title || "video";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black rounded-2xl overflow-hidden ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnail}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        autoPlay={autoPlay}
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}

    

      {/* Controls Overlay */}
      {showControls && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 ${
            isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1" onClick={togglePlay} />

          {/* Bottom Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 px-1">
              <span className="text-white text-xs font-mono min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={handleSeekStart}
             //   onMouseUp={handleSeekEnd}
                onTouchStart={handleSeekStart}
             //   onTouchEnd={handleSeekEnd}
                className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
                }}
              />
              <span className="text-white text-xs font-mono min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                </button>

                {/* Skip Back 5s */}
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
                >
                  <SkipBack size={18} />
                </button>

                {/* Skip Forward 5s */}
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
                >
                  <SkipForward size={18} />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1 group/volume">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>

                {/* Duration */}
                <span className="text-white/70 text-xs font-mono ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white text-xs font-bold"
                  >
                    {playbackSpeed}x
                  </button>
                  {isSpeedMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-1 bg-black/90 rounded-lg p-1 min-w-[60px] shadow-lg">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changePlaybackSpeed(speed)}
                          className={`block w-full px-3 py-1.5 text-xs text-left rounded transition-colors ${
                            playbackSpeed === speed
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Share */}
                {allowShare && (
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
                  >
                    <Share2 size={18} />
                  </button>
                )}

                {/* Download */}
                {allowDownload && (
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
                  >
                    <Download size={18} />
                  </button>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}