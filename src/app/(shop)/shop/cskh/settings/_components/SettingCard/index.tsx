"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Pencil } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
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
  value = "",
  onSave,
  workingConfig
}: any) => {
  const [tempText, setTempText] = useState(value);
  const [tempConfig, setTempConfig] = useState(workingConfig);

  useEffect(() => {
    if (isEditing) {
      setTempText(value);
      setTempConfig(workingConfig);
    }
  }, [value, workingConfig, isEditing]);

  const handleConfigChange = useCallback((newConfig: any) => {
    setTempConfig(newConfig);
  }, []);

  const handleFinalSubmit = () => {
    if (showTimeAction) {
      onSave(tempText, tempConfig);
    } else {
      onSave(tempText);
    }
  };

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-custom overflow-hidden transition-all group">
      <div className="p-8 flex items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 uppercase leading-none italic">{title}</h2>
            <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-gray-300")} />
          </div>
          <p className="text-sm text-gray-600 italic font-medium">{desc}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
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

          <button
            type="button"
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

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-visible bg-gray-50/50 border-t border-gray-100"
          >
            <div className="p-8 space-y-8 flex flex-col">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[12px] font-bold uppercase text-gray-700 tracking-tight leading-none">Nội dung phản hồi</label>
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-100">
                    {tempText?.length || 0}/500
                  </span>
                </div>

                <FormInput
                  isTextArea
                  placeholder={placeholder}
                  maxLength={500}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  className="rounded-4xl shadow-xl shadow-gray-200/20 min-h-40 bg-white border-transparent focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {showTimeAction && (
                <div className="space-y-5 pt-6 border-t border-gray-200/60">
                  <div className="flex items-center gap-2 ml-1">
                    <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500 shadow-sm">
                      <CalendarDays size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-bold uppercase text-gray-800 italic">Lịch biểu hoạt động</h3>
                  </div>
                  
                  <WorkingHoursConfig 
                    initialData={workingConfig} 
                    onChange={handleConfigChange} 
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <CustomButtonActions
                  onCancel={onEdit}
                  onSubmit={handleFinalSubmit}
                  isLoading={isLoading}
                  hasChanges={true}
                  submitText="Xác nhận lưu"
                  containerClassName="w-full flex gap-3 border-t-0 pt-0 justify-end"
                  className="w-44! rounded-4xl h-12 shadow-orange-200 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};