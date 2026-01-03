"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
  Volume2, 
  Download, 
  Loader2,
  Video
} from "lucide-react";
import { MessageAttachmentResponse } from "../../_types/chat.dto";
import { cn } from "@/utils/cn"; 

interface VideoAttachmentProps {
  attachment: MessageAttachmentResponse;
  maxWidth?: number;
  maxHeight?: number;
}

export const VideoAttachment: React.FC<VideoAttachmentProps> = ({
  attachment,
  maxWidth = 400,
  maxHeight = 300,
}) => {
  const [playing, setPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(attachment.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName || "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download video:", error);
    }
  };

  // Tự động ẩn controls khi không di chuyển chuột
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div className="mt-2 flex flex-col gap-1">
      {!playing ? (
        <div
          className="group relative bg-black rounded-xl overflow-hidden cursor-pointer shadow-lg transition-transform hover:scale-[1.01]"
          style={{ width: maxWidth, height: maxHeight }}
          onClick={() => setPlaying(true)}
        >
          {attachment.thumbnailUrl ? (
            <Image
              src={attachment.thumbnailUrl}
              alt="Thumbnail"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              onLoad={() => setLoading(false)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Video className="w-12 h-12" />}
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 fill-current" />
            </div>
          </div>

          {attachment.duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-medium">
              {formatTime(attachment.duration)}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative bg-black rounded-xl overflow-hidden group shadow-2xl"
          style={{ maxWidth }}
        >
          <video
            ref={videoRef}
            src={attachment.fileUrl}
            className="w-full h-auto block"
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            autoPlay
          />

          {/* Controls Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-4",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            
            {/* Timeline */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
            />

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="hover:text-blue-400 transition-colors">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <span className="text-xs font-mono tabular-nums">
                  {formatTime(currentTime)} <span className="opacity-50">/</span> {formatTime(duration)}
                </span>

                <div className="hidden sm:flex items-center gap-2 group/vol">
                  <Volume2 size={18} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/vol:w-16 transition-all h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const rates = [0.5, 1, 1.5, 2];
                    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
                    videoRef.current!.playbackRate = nextRate;
                    setPlaybackRate(nextRate);
                  }}
                  className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded uppercase"
                >
                  {playbackRate}x
                </button>
                
                <button onClick={handleDownload} className="hover:text-blue-400 transition-colors">
                  <Download size={18} />
                </button>

                <button onClick={handleFullscreen} className="hover:text-blue-400 transition-colors">
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {attachment.fileName && (
        <div className="px-1 text-[11px] text-neutral-500 flex items-center gap-1">
          <span className="truncate max-w-[200px]">{attachment.fileName}</span>
        </div>
      )}
    </div>
  );
};
