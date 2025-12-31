"use client";

import React, { useEffect, useState } from "react";
import { CountdownTimerProps, TimeLeft } from "./type";
import { SlotNumber } from "../SlotNumber";

const Separator = () => (
  <div className="flex flex-col justify-center items-center h-8 sm:h-10 pb-1 mx-0.5 sm:mx-1">
    <div className="text-orange-500 font-semibold text-lg sm:text-xl animate-pulse">:</div>
  </div>
);

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const digits = String(value).padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center md:gap-1 gap-2">
      <div className="flex gap-1">
        {digits.map((digit, index) => (
          <div 
            key={index} 
            className="w-12 h-14 sm:w-8 sm:h-9 flex items-center justify-center bg-linear-to-b from-orange-500 to-red-600 rounded-md shadow-sm border-b-2 border-red-800"
          >
            <div className="text-white font-bold leading-none shadow-black/20 drop-shadow-md">
                <SlotNumber value={digit} />
            </div>
          </div>
        ))}
      </div>
      
      <span className="text-base sm:text-sm font-light text-black  tracking-wider passero-one-regular">
        {label}
      </span>
    </div>
  );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
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

  if (isExpired) return <span className="text-slate-500 text-xs font-bold">ĐÃ KẾT THÚC</span>;

  return (
    <div className="flex items-start justify-center">
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Minute" />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Second" />
    </div>
  );
};

export default CountdownTimer;