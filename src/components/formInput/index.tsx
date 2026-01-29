"use client";

import { cn } from "@/utils/cn";
import React, { useState } from "react";
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
  maxLengthNumber?: number;
}

const formatNumber = (val: any) => {
  if (val === null || val === undefined || val === "") return "";
  const str = val.toString().replace(/\D/g, "");
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
      error: externalError,
      required,
      isTextArea,
      className,
      containerClassName,
      id,
      type,
      isCheckbox,
      checkboxChecked,
      onCheckboxChange,
      maxLengthNumber = 12, 
      onChange,
      onBlur,
      value, 
      ...props
    },
    ref,
  ) => {
    const [isShaking, setIsShaking] = useState(false);
    const [localError, setLocalError] = useState(false);
    const [emptyError, setEmptyError] = useState(false);

    const isDate = type === "date" || type === "datetime-local";

    const displayValue =
      type === "number" ? formatNumber(value) : (value ?? "");

    const triggerShake = () => {
      if (!isShaking) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<any>) => {
      let val = e.target.value;

      if (val.trim() !== "") {
        setEmptyError(false);
      }

      if (type === "number" || props.inputMode === "numeric") {
        const digitsOnly = val.replace(/\D/g, "");

        if (digitsOnly.length > maxLengthNumber) {
          triggerShake();
          setLocalError(true);
          setTimeout(() => setLocalError(false), 400);
          return;
        }

        e.target.value = digitsOnly;
      }

      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
      if (required && e.target.value.trim() === "") {
        setEmptyError(true);
        triggerShake();
      }
      onBlur?.(e);
    };

    const commonStyles = cn(
      "w-full px-5 bg-gray-50/50 border border-gray-200 rounded-2xl",
      "text-sm font-semibold text-gray-700 placeholder:text-gray-500 placeholder:font-normal",
      "transition-all duration-200 shadow-sm",
      "focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white",
      isDate && "cursor-pointer uppercase text-[11px]",
      (externalError || localError || emptyError) &&
        "border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/30",
      isShaking && "animate-shake",
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
              className={cn(
                commonStyles,
                "py-3 min-h-25 resize-none",
                className,
              )}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={value ?? ""}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              type={type === "number" ? "text" : type}
              inputMode={type === "number" ? "numeric" : props.inputMode}
              className={cn(
                commonStyles,
                "h-12 text-ellipsis",
                isCheckbox && "pr-11",
                className,
              )}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={displayValue} 
              {...props}
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

        {(externalError || emptyError) && (
          <p className="text-[10px] font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {externalError || "Trường này không được để trống"}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
