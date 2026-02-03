/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import React, { useId } from "react";
import { CheckboxProps } from "./type";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      className,
      containerClassName,
      sizeClassName,
      id,
      checked = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const checkboxId = id || reactId;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex items-center gap-2.5 group cursor-pointer select-none w-fit",
          containerClassName,
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={!!checked} 
            onChange={onChange}
            className="sr-only"
            {...props}
          />

          <div
            className={cn(
              "rounded-sm border-2 transition-all duration-200 flex items-center justify-center relative",
              "w-4.5 h-4.5",
              sizeClassName,
              checked
                ? "bg-orange-500 border-orange-500 shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
                : "bg-white border-gray-300",
              "group-hover:border-orange-400",
              className,
            )}
          >
            <Check
              size={12}
              strokeWidth={4.5}
              className={cn(
                "text-white transition-all duration-200 transform",
                checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
            />
          </div>
        </div>

        {label && (
          <span
            className={cn(
              "text-[13px] font-bold tracking-tight transition-all duration-200",
              checked ? "text-gray-800" : "text-gray-500",
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
