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
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock
} from "lucide-react";
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
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

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  const handleOpen = () => {
    if (!value) onChange(new Date().toISOString());
    updatePosition();
    setIsOpen(!isOpen);
  };

  // Cuộn ngay khi mở bảng
  useEffect(() => {
    if (isOpen) {
      // Dùng "auto" để nhảy ngay lập tức khi vừa mở, sau đó click thì dùng "smooth"
      setTimeout(() => scrollToActive("auto"), 50);
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
        <label className="text-[11px] font-bold text-gray-400 ml-1 flex items-center gap-2 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleOpen}
        className={cn(
          "h-13 px-5 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-between",
          "cursor-pointer transition-all duration-300 shadow-sm hover:border-orange-300",
          isOpen && "border-orange-500 ring-4 ring-orange-500/10 shadow-md",
          error && "border-red-400 bg-red-50/20",
        )}
      >
        <div className="flex items-center gap-3">
          <Clock
            size={16}
            className={cn(value ? "text-orange-500" : "text-gray-300")}
          />
          <span
            className={cn(
              "text-[13px] font-bold",
              value ? "text-gray-800" : "text-gray-400",
            )}
          >
            {value
              ? format(selectedDate, "dd/MM/yyyy ' — ' HH:mm", { locale: vi })
              : "Chọn mốc thời gian..."}
          </span>
        </div>
        <CalendarDays
          size={18}
          className={cn(
            "transition-colors",
            isOpen ? "text-orange-500" : "text-gray-300",
          )}
        />
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ top: coords.top, left: coords.left }}
                className={cn(
                  "absolute z-99999 datetime-portal-content bg-white/95 backdrop-blur-xl",
                  "border border-white shadow-custom rounded-[3rem] py-3 px-5 flex gap-10 overflow-hidden",
                )}
              >
                <div className="w-70">
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() =>
                        setCurrentMonth(subMonths(currentMonth, 1))
                      }
                      className="p-2.5 hover:bg-orange-50 text-orange-600 rounded-2xl transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-orange-500 uppercase block mb-1">
                        Thời gian
                      </span>
                      <span className="text-sm font-bold text-gray-800 uppercase italic tracking-tighter">
                        {format(currentMonth, "MMMM yyyy", { locale: vi })}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setCurrentMonth(addMonths(currentMonth, 1))
                      }
                      className="p-2.5 hover:bg-orange-50 text-orange-600 rounded-2xl transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-8">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <span
                        key={d}
                        className="text-[9px] font-bold text-gray-300 py-2 uppercase"
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
                          "relative h-9 w-9 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all",
                          isSameDay(day, selectedDate)
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110 z-10"
                            : "hover:bg-orange-50 text-gray-600",
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
                    className=" h-12 text-[12px] font-bold rounded-[1.25rem] shadow-xl shadow-orange-500/20 transition-all active:scale-95 border-0"
                    onClick={() => setIsOpen(false)}
                  >
                    Xác nhận hoàn tất
                  </ButtonField>
                </div>

                <div className="flex border-l border-gray-100 pl-10 gap-6 relative">
                  <div className="absolute top-[44%] left-10 right-0 h-12 -translate-y-1/2 bg-orange-500/10 border-y-2 border-orange-500/20 rounded-2xl -z-10 pointer-events-none" />

                  {["Giờ", "Phút"].map((label, idx) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-[12px] font-bold text-gray-800 uppercase mb-6 ">
                        {label}
                      </span>
                      <div className="relative h-64 overflow-hidden w-16">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

                        <div
                          ref={idx === 0 ? hourScrollRef : minuteScrollRef}
                          className="h-full w-full overflow-y-auto scrollbar-none snap-y snap-mandatory p-1 py-25"
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
                                    "h-12 w-full shrink-0 flex items-center justify-center rounded-xl text-[16px] font-mono font-bold transition-all snap-center",
                                    isActive
                                      ? "text-orange-600 scale-150 drop-shadow-sm"
                                      : "text-gray-600 scale-90 hover:opacity-100",
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
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
