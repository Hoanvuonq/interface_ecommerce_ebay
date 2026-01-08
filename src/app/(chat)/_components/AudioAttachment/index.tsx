"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import _ from "lodash";
import { 
  Play, 
  Pause, 
  Mic, 
  Zap, 
  Loader2 
} from "lucide-react";
import { MessageAttachmentResponse } from "../../_types/chat.dto";

interface AudioAttachmentProps {
  attachment: MessageAttachmentResponse;
}

export const AudioAttachment: React.FC<AudioAttachmentProps> = ({ attachment }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileUrl = _.get(attachment, "fileUrl", "");
  const fileName = _.get(attachment, "fileName", "Tin nhắn thoại");
  const initialDuration = _.get(attachment, "duration", 0);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      // Khởi tạo waveform ngẫu nhiên
      setWaveformData(_.times(30, () => _.random(20, 80)));
    }
  };

  const handleSeek = (percent: number) => {
    if (audioRef.current) {
      const time = percent * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlaybackRateChange = () => {
    const rates = [1, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };

  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || _.isEmpty(waveformData)) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const barWidth = width / waveformData.length;
    const progress = duration > 0 ? currentTime / duration : 0;

    ctx.clearRect(0, 0, width, height);

    _.forEach(waveformData, (value, index) => {
      const x = index * barWidth;
      const barHeight = (value / 100) * height;
      const y = (height - barHeight) / 2;

      // Màu sắc dựa trên tiến độ phát
      const isPlayed = index / waveformData.length <= progress;
      ctx.fillStyle = isPlayed ? "#3b82f6" : "#d1d5db"; // blue-500 : gray-300

      // Vẽ thanh bo góc nhẹ
      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
      ctx.fill();
    });
  }, [currentTime, duration, waveformData]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  return (
    <div className="mt-2 p-3 w-full max-w-[320px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <audio
        ref={audioRef}
        src={fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />

      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Mic size={14} className="text-blue-500" />
          <span className="text-xs font-semibold text-gray-700 truncate">
            {fileName}
          </span>
        </div>

        {/* Player Core */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="group relative flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full transition-transform active:scale-90 hover:bg-blue-600 disabled:bg-gray-300 shadow-lg shadow-blue-200"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Waveform Area */}
          <div className="flex-1 h-10 relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={40}
              className="w-full h-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleSeek((e.clientX - rect.left) / rect.width);
              }}
            />
          </div>

          {/* Speed Toggle */}
          <button
            onClick={handlePlaybackRateChange}
            className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
              playbackRate !== 1 ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
            }`}
          >
            <Zap size={10} fill={playbackRate !== 1 ? "currentColor" : "none"} />
            {playbackRate}x
          </button>
        </div>

        {/* Time Display */}
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-mono font-medium text-gray-500">
            {formatTime(currentTime)}
          </span>
          <span className="text-[10px] font-mono font-medium text-gray-600">
            {formatTime(duration || initialDuration)}
          </span>
        </div>
      </div>
    </div>
  );
};
