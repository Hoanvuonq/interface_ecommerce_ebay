/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ButtonField } from "@/components/buttonField";
import { cn } from "@/utils/cn";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  startOfMonth,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { DateTimeInputProps } from "./type";

export const DateTimeInput = ({
  label,
  value,
  onChange,
  required,
  error,
}: DateTimeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    isBottom: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : new Date();
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const scrollToActive = useCallback((behavior: ScrollBehavior = "smooth") => {
    const activeHour =
      hourScrollRef.current?.querySelector(`[data-active="true"]`);
    const activeMinute =
      minuteScrollRef.current?.querySelector(`[data-active="true"]`);
    if (activeHour) activeHour.scrollIntoView({ block: "center", behavior });
    if (activeMinute)
      activeMinute.scrollIntoView({ block: "center", behavior });
  }, []);

  // LOGIC KHÔN: Tự động đảo chiều nếu hết chỗ
  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 420; // Chiều cao ước tính của picker
      const gap = 8;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top: number;
      let isBottom = true;

      // Nếu phía dưới không đủ chỗ và phía trên rộng hơn -> Nhảy lên trên
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top + window.scrollY - dropdownHeight - gap;
        isBottom = false;
      } else {
        top = rect.bottom + window.scrollY + gap;
        isBottom = true;
      }

      setCoords({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
        isBottom,
      });
    }
  }, []);

  const handleOpen = () => {
    if (!value) onChange(new Date().toISOString());
    updatePosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToActive("auto"), 30);
    }
  }, [isOpen, scrollToActive]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest(".datetime-portal-content")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeChange = (type: "h" | "m", val: number) => {
    const newDate =
      type === "h"
        ? setHours(selectedDate, val)
        : setMinutes(selectedDate, val);
    onChange(newDate.toISOString());
    setTimeout(() => scrollToActive("smooth"), 10);
  };

  return (
    <div className="space-y-2.5 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-bold text-orange-400/80 ml-2 flex items-center gap-2 uppercase tracking-widest italic">
          <Clock size={12} strokeWidth={3} />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleOpen}
        className={cn(
          "h-14 px-5 rounded-[1.25rem] flex items-center justify-between transition-all duration-300 border-2",
          "bg-white/5 border-white/10 text-white hover:border-orange-500/50",
          isOpen &&
            "border-orange-500 ring-4 ring-orange-500/20 bg-white/10 shadow-[0_0_20px_rgba(249,115,22,0.15)]",
          error && "border-red-500/50 bg-red-500/5",
        )}
      >
        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className={cn(value ? "text-orange-500" : "text-gray-600")}
          />
          <span
            className={cn(
              "text-sm font-bold tracking-tight",
              value ? "text-gray-600" : "text-gray-600",
            )}
          >
            {value
              ? format(selectedDate, "dd/MM/yyyy ' — ' HH:mm", { locale: vi })
              : "Chọn thời điểm..."}
          </span>
        </div>
      </div>

      {isOpen &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={cn(
              "fixed z-99999 datetime-portal-content bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-6 flex gap-10 overflow-hidden",
              // Tailwind v4 Animation
              "animate-in fade-in zoom-in-95 duration-200 ease-out",
              coords.isBottom
                ? "slide-in-from-top-2"
                : "slide-in-from-bottom-2",
            )}
            style={{ top: coords.top, left: coords.left }}
          >
            {/* LỊCH (BÊN TRÁI) */}
            <div className="w-72">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-orange-500 uppercase block mb-0.5 tracking-tighter">
                    Tháng hiện tại
                  </span>
                  <span className="text-base font-bold text-gray-800 uppercase italic tracking-tighter">
                    {format(currentMonth, "MMMM yyyy", { locale: vi })}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-bold text-gray-300 py-2 uppercase tracking-widest"
                  >
                    {d}
                  </span>
                ))}
                {days.map((day) => (
                  <button
                    key={day.toString()}
                    onClick={() =>
                      onChange(
                        setHours(
                          setMinutes(day, selectedDate.getMinutes()),
                          selectedDate.getHours(),
                        ).toISOString(),
                      )
                    }
                    className={cn(
                      "relative h-10 w-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all",
                      isSameDay(day, selectedDate)
                        ? "bg-gray-900 text-white shadow-lg scale-110 z-10"
                        : "hover:bg-orange-50 text-gray-600 hover:text-orange-600",
                      isToday(day) &&
                        !isSameDay(day, selectedDate) &&
                        "after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-orange-500 after:rounded-full",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                ))}
              </div>

              <ButtonField
                type="login"
                className="w-full h-12 text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 border-0"
                onClick={() => setIsOpen(false)}
              >
                XÁC NHẬN MỐC GIỜ
              </ButtonField>
            </div>

            <div className="flex border-l border-gray-100 pl-10 gap-8 relative">
              <div className="absolute top-[44.5%] left-10 right-0 h-12 -translate-y-1/2 bg-orange-500/10 border-y-2 border-orange-500/20 rounded-2xl -z-10 pointer-events-none" />

              {["Giờ", "Phút"].map((label, idx) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-800 uppercase mb-6 tracking-widest italic">
                    {label}
                  </span>
                  <div className="relative h-64 overflow-hidden w-16">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

                    <div
                      ref={idx === 0 ? hourScrollRef : minuteScrollRef}
                      className="h-full w-full overflow-y-auto scrollbar-none snap-y snap-mandatory p-1 py-24 flex flex-col items-center"
                    >
                      {Array.from({ length: idx === 0 ? 24 : 60 }).map(
                        (_, i) => {
                          const isActive =
                            idx === 0
                              ? selectedDate.getHours() === i
                              : selectedDate.getMinutes() === i;
                          return (
                            <button
                              key={i}
                              data-active={isActive}
                              onClick={() =>
                                handleTimeChange(idx === 0 ? "h" : "m", i)
                              }
                              className={cn(
                                "h-12 w-full shrink-0 flex items-center justify-center rounded-xl text-lg font-mono transition-all snap-center",
                                isActive
                                  ? "text-orange-600 font-bold scale-150"
                                  : "text-gray-500 font-bold scale-90 hover:text-gray-500",
                              )}
                            >
                              {i.toString().padStart(2, "0")}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
