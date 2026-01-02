"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ButtonField } from "../buttonField";
import { DropdownContainerProps } from "./type";

export const DropdownContainer: React.FC<DropdownContainerProps> = ({
  title,
  icon,
  onClose,
  children,
  footerActions,
  className,
  maxHeight = "max-h-[450px]",
}) => {
  return (
    <div className={cn("w-95 flex flex-col bg-white overflow-hidden  border border-slate-100 shadow-2xl font-inter", className)}>
      <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            {title}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className={cn("overflow-y-auto custom-scrollbar bg-slate-50/30", maxHeight)}>
        {children}
      </div>

      {footerActions && (
        <div className="grid grid-cols-2 p-3 bg-white border-t border-gray-100 gap-3">
          {footerActions.map((action, idx) => {
            const isPrimaryAction = action.variant === "login" || idx === 1;
            
            return (
              <ButtonField
                key={action.label}
                type={isPrimaryAction ? "login" : "secondary"}
                size="middle"
                loading={action.loading}
                onClick={action.onClick}
                icon={action.icon}
                className="rounded-full text-[10px] uppercase h-10 font-bold tracking-tight"
              >
                {action.label}
              </ButtonField>
            );
          })}
        </div>
      )}
    </div>
  );
};