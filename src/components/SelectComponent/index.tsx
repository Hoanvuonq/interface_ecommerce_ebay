// Direct export file to bypass folder resolution issues
"use client";

import { cn } from "@/utils/cn";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaSearch, FaCheck } from "react-icons/fa";

interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
}

export const SelectComponent = ({
  options,
  value,
  onChange,
  placeholder = "Chọn ...",
  disabled = false,
  className,
  isMulti = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] =
    useState<React.CSSProperties | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const getDisplayLabel = () => {
    if (isMulti) {
      const vals = Array.isArray(value) ? value : [];
      if (vals.length === 0) return placeholder;
      if (vals.length <= 2) {
        return options
          .filter((opt) => vals.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ");
      }
      return `Đã chọn ${vals.length} mục`;
    } else {
      const selectedOpt = options.find((opt) => opt.value === value);
      return selectedOpt ? selectedOpt.label : placeholder;
    }
  };

  const updatePosition = useCallback(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 280;
      const gap = 8;

      const spaceBelow = viewportHeight - rect.bottom;
      const showAtTop =
        spaceBelow < dropdownMaxHeight && rect.top > dropdownMaxHeight;

      const style: React.CSSProperties = {
        position: "fixed",
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      };

      if (showAtTop) {
        style.bottom = viewportHeight - rect.top + gap;
      } else {
        style.top = rect.bottom + gap;
      }

      setDropdownStyle(style);
    }
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !document.getElementById("select-dropdown-portal")?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(val)
        ? currentValues.filter((v) => v !== val)
        : [...currentValues, val];
      onChange(newValue);
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div ref={wrapperRef} className={cn("relative w-full", className)}>
        <div
          className={cn(
            "w-full h-12 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl flex items-center justify-between cursor-pointer transition-all select-none shadow-sm",
            disabled
              ? "opacity-50 cursor-not-allowed bg-gray-100"
              : "hover:border-orange-400 hover:bg-white",
            isOpen && "border-orange-500 ring-4 ring-orange-500/10 bg-white"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span
            className={cn(
              "text-xs font-semibold truncate",
              !value || (Array.isArray(value) && value.length === 0)
                ? "text-gray-400"
                : "text-gray-700"
            )}
          >
            {getDisplayLabel()}
          </span>
          <FaChevronDown
            className={cn(
              "text-[10px] text-gray-600 transition-transform duration-300",
              isOpen && "rotate-180 text-orange-500"
            )}
          />
        </div>
      </div>

      {isOpen &&
        dropdownStyle &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="select-dropdown-portal"
            className={cn(
              "bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden",
              "animate-in fade-in zoom-in-95 duration-200 ease-out"
            )}
            style={dropdownStyle}
          >
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                <input
                  autoFocus
                  className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-300 focus:bg-white transition-all font-medium text-gray-600"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-55 p-2 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = isMulti
                    ? Array.isArray(value) && value.includes(opt.value)
                    : value === opt.value;

                  return (
                    <div
                      key={opt.value}
                      className={cn(
                        "px-4 py-3 text-sm cursor-pointer rounded-xl transition-all flex items-center justify-between mb-1 group",
                        isSelected
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                      )}
                      onClick={() => handleSelect(opt.value)}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <FaCheck
                          className="text-orange-500 animate-in zoom-in duration-200"
                          size={12}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    Không tìm thấy kết quả
                  </span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};