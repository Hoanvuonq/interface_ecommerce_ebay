"use client";

import React, { useEffect, useState } from "react";
import { CountdownTimerProps } from "./type"; // Cập nhật interface trong file type nếu cần
import { SlotNumber } from "../SlotNumber";

// Định nghĩa lại TimeLeft để có thêm trường days
interface TimeLeftFull {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Separator = () => (
  <div className="flex flex-col justify-center items-center h-8 sm:h-10 pb-1 mx-0.5 sm:mx-1">
    <div className="text-orange-500 font-semibold text-lg sm:text-xl animate-pulse">
      :
    </div>
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

      <span className="text-base sm:text-sm  text-black tracking-wider uppercase italic font-bold ">
        {label}
      </span>
    </div>
  );
};

interface ExtendedProps extends CountdownTimerProps {
  isFull?: boolean; 
}

const CountdownTimer: React.FC<ExtendedProps> = ({
  endTime,
  onExpire,
  isFull = false, 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeftFull>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = typeof endTime === "string" ? new Date(endTime) : endTime;
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours = isFull
        ? Math.floor((difference / (1000 * 60 * 60)) % 24)
        : Math.floor(difference / (1000 * 60 * 60));

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, onExpire, isFull]);

  if (isExpired)
    return (
      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest italic">
        Chương trình đã kết thúc
      </span>
    );

  return (
    <div className="flex items-start justify-center">
      {isFull && timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Ngày" />
          <Separator />
        </>
      )}

      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

export default CountdownTimer;
