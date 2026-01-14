"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface BaseProps {
  label?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  isTextArea?: boolean;
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
      ...props
    },
    ref
  ) => {
     const isDate = type === "date" || type === "datetime-local";
    const commonStyles = cn(
      "w-full px-5 bg-gray-50/50 border border-gray-200 rounded-2xl",
      "text-sm font-semibold text-gray-700 placeholder:text-gray-500 placeholder:font-normal",
      "focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10",
      "transition-all duration-200 shadow-sm",
       isDate && "cursor-pointer uppercase text-[11px]", 
      error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""
    );

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-[12px] font-bold  text-gray-700 ml-1 flex items-center gap-1"
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
                className
              )}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={id}
              type={type}
              className={cn(commonStyles, "h-12", className)}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        {error && (
          <p className="text-[10px] font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
