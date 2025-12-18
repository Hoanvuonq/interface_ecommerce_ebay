"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date | string;
  onExpire?: () => void;
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark" | "flash-sale"; // Thêm theme flash-sale theo ảnh
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
  size = "medium",
  theme = "flash-sale",
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

      // Flash sale thường chỉ hiện Giờ : Phút : Giây (tổng giờ bao gồm cả ngày)
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours: totalHours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  // Cấu hình UI theo ảnh thiết kế số 3
  const sizeConfig = {
    small: { digit: "text-xl", label: "text-[8px]", gap: "gap-2", colon: "text-lg" },
    medium: { digit: "text-3xl", label: "text-[10px]", gap: "gap-4", colon: "text-2xl" },
    large: { digit: "text-5xl", label: "text-xs", gap: "gap-6", colon: "text-4xl" },
  };

  const themeConfig = {
    "flash-sale": {
      container: "bg-[#ff7a00] rounded-3xl p-6", // Nền cam đậm bo góc mạnh
      digit: "font-black tracking-tighter text-white", // Chữ trắng, rất dày
      lastDigit: "text-yellow-300", // Giây màu vàng (như ảnh 3)
      label: "text-orange-200 font-bold uppercase tracking-widest",
      colon: "text-white/50"
    },
    light: {
      container: "bg-white border border-gray-100 shadow-xl rounded-2xl p-4",
      digit: "text-gray-900 font-bold",
      lastDigit: "text-orange-500",
      label: "text-gray-400 font-medium uppercase",
      colon: "text-gray-300"
    },
    dark: {
        container: "bg-gray-900 rounded-2xl p-4",
        digit: "text-white font-bold",
        lastDigit: "text-yellow-400",
        label: "text-gray-500 font-medium uppercase",
        colon: "text-gray-700"
      },
  };

  const config = sizeConfig[size];
  const styles = themeConfig[theme === 'light' ? 'flash-sale' : theme];

  if (isExpired) return <span className="text-red-500 font-bold italic animate-pulse">KẾT THÚC</span>;

  const TimeUnit = ({ value, label, isLast = false }: { value: number; label: string; isLast?: boolean }) => (
    <div className="flex flex-col items-center justify-center min-w-15">
      <span className={`${config.digit} ${isLast ? styles.lastDigit : styles.digit} leading-none`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className={`${config.label} ${styles.label} mt-2`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={`inline-flex items-center ${styles.container} ${config.gap}`}>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className={`${config.colon} ${styles.colon} font-light mb-5`}>:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className={`${config.colon} ${styles.colon} font-light mb-5`}>:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" isLast />
    </div>
  );
};

export default CountdownTimer;