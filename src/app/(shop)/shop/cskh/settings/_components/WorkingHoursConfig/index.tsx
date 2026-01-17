"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Copy, Trash2, Globe } from "lucide-react";
import { useState } from "react";
import { DAYS_OF_WEEK, WorkDay } from "../../_types/workday";
import { SelectField } from "@/components";

// Danh sách giờ cách nhau 30 phút
const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return { label: `${hour}:${minute}`, value: `${hour}:${minute}` };
});

// Danh sách múi giờ phổ biến
const TIMEZONE_OPTIONS = [
  { label: "GMT+7 TH/ID/VN", value: "GMT+7" },
  { label: "GMT+8 SG/MY/PH", value: "GMT+8" },
  { label: "GMT+2 ES", value: "GMT+2" },
  { label: "GMT+1 FR/PL", value: "GMT+1" },
];

export const WorkingHoursConfig = () => {
  const [schedule, setSchedule] = useState<WorkDay[]>(DAYS_OF_WEEK);
  const [timezone, setTimezone] = useState("GMT+7");

  const toggleDay = (id: number) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayId === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const updateTime = (id: number, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayId === id ? { ...d, [field]: value } : d))
    );
  };

  const applyAll = () => {
    const firstActive = schedule.find((d) => d.isActive);
    if (!firstActive) return;
    setSchedule((prev) =>
      prev.map((d) =>
        d.isActive
          ? { ...d, startTime: firstActive.startTime, endTime: firstActive.endTime }
          : d
      )
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* 1. Header chọn nhanh & Timezone */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100 gap-4">
        <div className="flex gap-1.5 bg-white p-1 rounded-full shadow-sm border border-slate-100">
          {schedule.map((day) => (
            <button
              key={day.dayId}
              onClick={() => toggleDay(day.dayId)}
              className={cn(
                "w-9 h-9 rounded-full text-[10px] font-bold transition-all active:scale-90 border flex items-center justify-center",
                day.isActive
                  ? "bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-200"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-50 hover:text-orange-500"
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
            selectClassName="h-10 rounded-xl border-slate-100 bg-white text-[11px] font-bold shadow-sm"
          />
        </div>
      </div>

      {/* 2. Danh sách cấu hình chi tiết hàng ngang */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <Clock className="text-orange-500" size={14} />
            <span className="text-[11px] font-bold uppercase text-slate-800 tracking-tight italic">
              Khung giờ hoạt động
            </span>
          </div>
          <button
            onClick={applyAll}
            className="flex items-center gap-1.5 text-[9px] font-bold text-orange-500 uppercase hover:text-orange-600 transition-all active:scale-95 bg-orange-50 px-3 py-1.5 rounded-lg"
          >
            <Copy size={12} /> Áp dụng nhanh cho các ngày
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar overflow-visible">
          <AnimatePresence mode="popLayout">
            {schedule
              .filter((d) => d.isActive)
              .map((day) => (
                <motion.div
                  key={day.dayId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-2.5 rounded-2xl bg-slate-50/30 hover:bg-white transition-all group border border-transparent hover:border-orange-100"
                >
                  <div className="w-20 shrink-0">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
                      {day.label}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 min-w-25">
                      <SelectField
                        name={`start-${day.dayId}`}
                        value={day.startTime}
                        options={TIME_OPTIONS}
                        onChange={(e) => updateTime(day.dayId, "startTime", String(e.target.value))}
                        containerClassName="mb-0"
                        selectClassName="h-10 rounded-xl border-slate-100 text-[12px] font-bold shadow-xs focus:ring-orange-100"
                      />
                    </div>
                    
                    <span className="text-[12px] font-bold text-slate-600 uppercase">đến</span>

                    <div className="flex-1 min-w-25">
                      <SelectField
                        name={`end-${day.dayId}`}
                        value={day.endTime}
                        options={TIME_OPTIONS}
                        onChange={(e) => updateTime(day.dayId, "endTime", String(e.target.value))}
                        containerClassName="mb-0"
                        selectClassName="h-10 rounded-xl border-slate-100 text-[12px] font-bold shadow-xs focus:ring-orange-100"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDay(day.dayId)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="Xóa ngày này"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>

          {schedule.every((d) => !d.isActive) && (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-4xl bg-slate-50/20">
              <Clock className="mx-auto text-slate-200 mb-2" size={32} strokeWidth={1} />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Vui lòng chọn ngày làm việc
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};