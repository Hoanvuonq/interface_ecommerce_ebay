"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Copy, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { DAYS_OF_WEEK, WorkDay } from "../../_types/workday";
import { SelectField } from "@/components";

interface WorkingHoursConfigProps {
  initialData?: { start: string; end: string; days: string[] };
  onChange?: (data: { start: string; end: string; days: string[] }) => void;
}

const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return { label: `${hour}:${minute}`, value: `${hour}:${minute}` };
});

const TIMEZONE_OPTIONS = [
  { label: "GMT+7 TH/ID/VN", value: "GMT+7" },
  { label: "GMT+8 SG/MY/PH", value: "GMT+8" },
];

export const WorkingHoursConfig = ({
  initialData,
  onChange,
}: WorkingHoursConfigProps) => {
  const [schedule, setSchedule] = useState<WorkDay[]>(DAYS_OF_WEEK);
  const [timezone, setTimezone] = useState("GMT+7");

  // 1. Chỉ khởi tạo dữ liệu khi initialData thực sự thay đổi (Dùng stringify để so sánh giá trị)
  useEffect(() => {
    if (initialData?.days) {
      setSchedule((prev) =>
        prev.map((day) => ({
          ...day,
          isActive:
            initialData.days.includes(day.value) ||
            initialData.days.includes(day.dayId.toString()),
          startTime: initialData.start || day.startTime,
          endTime: initialData.end || day.endTime,
        })),
      );
    }
  }, [initialData?.start, initialData?.end, JSON.stringify(initialData?.days)]);

  // 2. Hàm helper gửi dữ liệu lên cha - Chỉ gọi khi User hành động
  const notifyChange = (updatedSchedule: WorkDay[]) => {
    const activeDays = updatedSchedule.filter((d) => d.isActive);
    if (activeDays.length > 0) {
      onChange?.({
        start: activeDays[0].startTime,
        end: activeDays[0].endTime,
        days: activeDays.map((d) => d.value),
      });
    } else {
      onChange?.({ start: "09:00", end: "18:00", days: [] });
    }
  };

  const toggleDay = (id: number) => {
    const nextSchedule = schedule.map((d) =>
      d.dayId === id ? { ...d, isActive: !d.isActive } : d,
    );
    setSchedule(nextSchedule);
    notifyChange(nextSchedule); // Thông báo ngay lập tức cho cha
  };

  const updateTime = (
    id: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const nextSchedule = schedule.map((d) =>
      d.dayId === id ? { ...d, [field]: value } : d,
    );
    setSchedule(nextSchedule);
    notifyChange(nextSchedule);
  };

  const applyAll = () => {
    const firstActive = schedule.find((d) => d.isActive);
    if (!firstActive) return;
    const nextSchedule = schedule.map((d) =>
      d.isActive
        ? {
            ...d,
            startTime: firstActive.startTime,
            endTime: firstActive.endTime,
          }
        : d,
    );
    setSchedule(nextSchedule);
    notifyChange(nextSchedule);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Timezone & Quick Toggle Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100 gap-4">
        <div className="flex gap-1.5 bg-white p-1 rounded-full shadow-sm border border-slate-100 flex-wrap justify-center">
          {schedule.map((day) => (
            <button
              key={day.dayId}
              type="button"
              onClick={() => toggleDay(day.dayId)}
              className={cn(
                "w-9 h-9 rounded-full text-[10px] font-bold transition-all active:scale-90 border flex items-center justify-center uppercase tracking-tighter",
                day.isActive
                  ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-200"
                  : "bg-transparent border-transparent  text-gray-400 hover:bg-slate-50 hover:text-orange-500",
              )}
            >
              {day.shortLabel}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-56">
          <SelectField
            name="timezone"
            value={timezone}
            options={TIMEZONE_OPTIONS}
            onChange={(e) => setTimezone(String(e.target.value))}
            containerClassName="mb-0"
            selectClassName="h-10 rounded-xl border-slate-100 bg-white text-[11px] font-bold shadow-sm focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Details List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <Clock className="text-orange-500" size={14} strokeWidth={3} />
            <span className="text-[11px] font-bold uppercase  text-gray-800 tracking-widest italic">
              Timeline Settings
            </span>
          </div>
          <button
            type="button"
            onClick={applyAll}
            className="flex items-center gap-1.5 text-[9px] font-bold text-orange-600 uppercase hover:bg-orange-100 transition-all active:scale-95 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100"
          >
            <Copy size={12} /> Sync all days
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {schedule
              .filter((d) => d.isActive)
              .map((day) => (
                <motion.div
                  key={day.dayId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/30 hover:bg-white transition-all group border border-transparent hover:border-orange-100 hover:shadow-sm"
                >
                  <div className="w-20 shrink-0">
                    <span className="text-[11px] font-bold  text-gray-700 uppercase tracking-widest italic">
                      {day.label}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <SelectField
                        name={`start-${day.dayId}`}
                        value={day.startTime}
                        options={TIME_OPTIONS}
                        onChange={(e) =>
                          updateTime(
                            day.dayId,
                            "startTime",
                            String(e.target.value),
                          )
                        }
                        containerClassName="mb-0"
                        selectClassName="h-10 rounded-xl border-slate-100 text-[12px] font-bold shadow-xs focus:ring-orange-100 cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] font-bold  text-gray-300 uppercase italic">
                      to
                    </span>
                    <div className="flex-1">
                      <SelectField
                        name={`end-${day.dayId}`}
                        value={day.endTime}
                        options={TIME_OPTIONS}
                        onChange={(e) =>
                          updateTime(
                            day.dayId,
                            "endTime",
                            String(e.target.value),
                          )
                        }
                        containerClassName="mb-0"
                        selectClassName="h-10 rounded-xl border-slate-100 text-[12px] font-bold shadow-xs focus:ring-orange-100 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDay(day.dayId)}
                    className="p-2  text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>

          {schedule.every((d) => !d.isActive) && (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-4xl bg-slate-50/20">
              <Clock
                className="mx-auto  text-gray-200 mb-2"
                size={32}
                strokeWidth={1}
              />
              <p className="text-[10px] font-bold  text-gray-400 uppercase tracking-[0.2em]">
                No active working days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
