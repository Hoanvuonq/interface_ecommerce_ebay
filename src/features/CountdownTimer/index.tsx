"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date | string;
  onExpire?: () => void;
  size?: "small" | "medium" | "large";
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
  size = "medium", // Mặc định dùng medium để nhỏ gọn hơn
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = typeof endTime === "string" ? new Date(endTime) : endTime;
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
        return;
      }

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours: totalHours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  // Cấu hình kích thước đã được thu nhỏ lại
  const sizeConfig = {
    small: { digit: "text-base", label: "text-[7px]", gap: "gap-1", colon: "text-xs" },
    medium: { digit: "text-xl sm:text-2xl", label: "text-[8px] sm:text-[9px]", gap: "gap-2 sm:gap-4", colon: "text-base" },
    large: { digit: "text-3xl sm:text-4xl", label: "text-[9px] sm:text-[10px]", gap: "gap-3 sm:gap-6", colon: "text-xl" },
  };

  const config = sizeConfig[size];

  if (isExpired) return <span className="text-white text-xs font-bold px-4">ĐÃ KẾT THÚC</span>;

  const TimeUnit = ({ value, label, isLast = false }: { value: number; label: string; isLast?: boolean }) => (
    <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[55px]">
      <span className={`${config.digit} font-black leading-none tracking-tighter ${isLast ? "text-[#FFD700]" : "text-white"}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className={`${config.label} text-white/70 font-bold uppercase tracking-widest mt-1.5`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={`flex items-center justify-center bg-[#ff7a00] rounded-2xl px-4 py-3 sm:px-7 sm:py-5 shadow-inner ${config.gap}`}>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className={`${config.colon} text-white/40 font-bold -mt-3`}>:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className={`${config.colon} text-white/40 font-bold -mt-3`}>:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" isLast />
    </div>
  );
};

export default CountdownTimer;