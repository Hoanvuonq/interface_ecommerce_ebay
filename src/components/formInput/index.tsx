"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Checkbox } from "../checkbox";

interface BaseProps {
  label?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  isTextArea?: boolean;
  isCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
}

type FormInputProps = BaseProps &
  (React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export const FormInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(
  (
    {
      label,
      error,
      required,
      isTextArea,
      className,
      containerClassName,
      id,
      type,
      isCheckbox,
      checkboxChecked,
      onCheckboxChange,
      ...props
    },
    ref,
  ) => {
    const isDate = type === "date" || type === "datetime-local";

    const commonStyles = cn(
      "w-full px-5 bg-gray-50/50 border border-gray-200 rounded-2xl",
      "text-sm font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal",
      "transition-all duration-200 shadow-sm",

      "focus:outline-none",
      "focus:border-orange-500",
      "focus:ring-4 focus:ring-orange-500/10",
      "focus:bg-white",

      isDate && "cursor-pointer uppercase text-[11px]",

      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/30"
        : "",
    );

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500 text-sm">*</span>}
          </label>
        )}

        <div className="relative">
          {isTextArea ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              id={id}
              className={cn(
                commonStyles,
                "py-3 min-h-25 resize-none",
                className,
              )}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={id}
              type={type}
              className={cn(
                commonStyles,
                "h-12 text-ellipsis",
                isCheckbox && "pr-11",
                className,
              )}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {isCheckbox && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center border-l border-gray-200 pl-2 h-5">
              <Checkbox
                checked={checkboxChecked}
                onChange={(e) => onCheckboxChange?.(e.target.checked)}
                sizeClassName="w-4 h-4"
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-[10px] font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
