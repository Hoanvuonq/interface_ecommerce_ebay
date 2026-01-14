"use client";

import { cn } from "@/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SelectFieldProps } from "./type";


const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className,
  containerClassName,
  selectClassName,
  errorMessage,
  helpText,
  disabled = false,
  rules = [],
}: SelectFieldProps & { className?: string }) => {
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => String(opt.value) === String(value))?.label || "";

  const handleSelect = (val: string | number) => {
    if (onChange && name) {
      const fakeEvent = {
        target: {
          name: name,
          value: val,
        },
      };
      onChange(fakeEvent);
    }
    setIsOpen(false);
  };

  useIsomorphicLayoutEffect(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 40 + 10, 250); 
      
      let top = rect.bottom + 6;
      let placement: "top" | "bottom" = "bottom";

      if (spaceBelow < dropdownHeight) {
        top = rect.top - dropdownHeight - 6;
        placement = "top";
      }

      setDropdownStyle({
        top,
        left: rect.left,
        width: rect.width,
        placement,
      });
    } else {
        setDropdownStyle(null);
    }
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEvent = (e: Event) => {
      const target = e.target as Node;
      const dropdown = document.getElementById(`select-dropdown-${name}`);
      const wrapper = wrapperRef.current;

      if (e.type === "mousedown") {
        if (wrapper?.contains(target) || dropdown?.contains(target)) return;
        setIsOpen(false);
      }
      if (e.type === "scroll" || e.type === "resize") {
         setIsOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleEvent);
    window.addEventListener("scroll", handleEvent, { capture: true });
    window.addEventListener("resize", handleEvent);
    return () => {
      document.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("scroll", handleEvent, { capture: true });
      window.removeEventListener("resize", handleEvent);
    };
  }, [isOpen, name]);

  return (
    <div className={cn("mb-6", containerClassName)}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {rules.some((r: any) => r.required) && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            "w-full h-11 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 flex items-center justify-between cursor-pointer transition-all select-none font-medium",
            disabled
              ? "bg-gray-50 text-gray-600 cursor-not-allowed ring-0 shadow-none border-gray-200"
              : "hover:border-gray-500 focus:border-gray-500 shadow-sm",
            isOpen && !disabled ? "border-gray-500 ring-2 ring-orange-100" : "",
            errorMessage ? "border-red-500 ring-red-100 focus:border-red-500" : "",
            
            selectClassName,
            className 
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={cn("text-sm truncate", !selectedLabel && "text-gray-600 font-normal")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-gray-600 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && !disabled && dropdownStyle && createPortal(
        <div
          id={`select-dropdown-${name}`}
          className={cn(
            "fixed z-[99999] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden py-1",
            "animate-in fade-in zoom-in-95 duration-100 ease-out",
            dropdownStyle.placement === "bottom" ? "origin-top" : "origin-bottom"
          )}
          style={{
            top: dropdownStyle.top,
            left: dropdownStyle.left,
            width: dropdownStyle.width,
            maxHeight: "250px",
          }}
        >
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                    <div
                        key={opt.value}
                        className={cn(
                        "px-4 py-2.5 text-sm cursor-pointer transition-colors font-medium flex items-center justify-between",
                        isSelected
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => handleSelect(opt.value)}
                    >
                        {opt.label}
                        {isSelected && <Check size={14} className="text-orange-500" />}
                    </div>
                )
            })}
            {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-600 text-center">
                    Không có lựa chọn
                </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {!errorMessage && helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-600">
          {helpText}
        </p>
      )}
    </div>
  );
};