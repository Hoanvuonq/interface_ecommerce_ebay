"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Pencil } from "lucide-react";
import { useState } from "react";
import { FormInput, CustomButtonActions } from "@/components";
import { WorkingHoursConfig } from "../WorkingHoursConfig";

export const SettingCard = ({
  title,
  desc,
  isActive,
  onToggle,
  isEditing,
  onEdit,
  placeholder,
  showTimeAction,
  isLoading = false,
}: any) => {
  const [tempText, setTempText] = useState("");

  const handleSave = () => {
    console.log("Saving content:", tempText);
    // Thực hiện logic lưu ở đây
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-custom overflow-hidden transition-all group">
      {/* --- Card Header --- */}
      <div className="p-8 flex items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 uppercase leading-none">
              {title}
            </h2>
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isActive ? "bg-green-500" : "bg-gray-300",
              )}
            />
          </div>
          <p className="text-sm text-gray-600 italic font-medium">{desc}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Switch */}
          <button
            onClick={onToggle}
            className={cn(
              "w-16 h-9 rounded-full p-1.5 transition-all duration-500 flex items-center shadow-inner relative",
              isActive ? "bg-orange-500" : "bg-gray-200",
            )}
          >
            <motion.div
              layout
              className="w-6 h-6 bg-white rounded-full shadow-lg"
              animate={{ x: isActive ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>

          {/* Nút Edit */}
          <button
            onClick={onEdit}
            className={cn(
              "p-3 rounded-3xl transition-all active:scale-90 border-2",
              isEditing
                ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                : "bg-gray-50 text-gray-500 border-gray-100 hover:border-orange-200 hover:text-orange-500 hover:bg-white",
            )}
          >
            <Pencil size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* --- Vùng soạn thảo & Cấu hình --- */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-visible bg-gray-50/50 border-t border-gray-100"
          >
            <div className="p-8 space-y-8 flex flex-col">
              {" "}
              {/* Đổi flex thành flex-col */}
              {/* Phần soạn thảo tin nhắn */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[12px] font-bold uppercase text-gray-700 tracking-tight">
                    Nội dung tin nhắn
                  </label>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-100">
                    {tempText.length}/600
                  </span>
                </div>

                <FormInput
                  isTextArea
                  placeholder={placeholder}
                  maxLength={600}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  className="rounded-4xl shadow-xl shadow-gray-200/20 min-h-40 bg-white border-transparent focus:bg-white"
                />
              </div>
              {/* Phần cấu hình lịch trình */}
              {showTimeAction && (
                <div className="space-y-5 pt-6 border-t border-gray-200/60">
                  <div className="flex items-center gap-2 ml-1">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <CalendarDays className="text-orange-500" size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase text-gray-800 italic tracking-tight">
                      Cấu hình lịch làm việc
                    </h3>
                  </div>

                  <div className="px-1">
                    <WorkingHoursConfig />
                  </div>
                </div>
              )}
              <div className="pt-2">
                <CustomButtonActions
                  onCancel={onEdit}
                  onSubmit={handleSave}
                  isLoading={isLoading}
                  hasChanges={tempText.length > 0}
                  submitText="Lưu thay đổi"
                  containerClassName="w-full flex gap-3 border-t-0 pt-0 justify-end"
                  className="w-40! rounded-4xl h-12"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
