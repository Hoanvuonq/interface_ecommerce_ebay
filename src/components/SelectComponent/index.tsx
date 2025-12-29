"use client";

import { cn } from "@/utils/cn";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaSearch, FaCheck } from "react-icons/fa";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value?: string | string[]; // Có thể là 1 string hoặc mảng string
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean; // Thêm prop để phân biệt chọn 1 hay nhiều
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
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý nhãn hiển thị
  const getDisplayLabel = () => {
    if (isMulti) {
      const vals = Array.isArray(value) ? value : [];
      return vals.length > 0 ? `Đã chọn ${vals.length}` : placeholder;
    } else {
      const selectedOpt = options.find((opt) => opt.value === value);
      return selectedOpt ? selectedOpt.label : placeholder;
    }
  };

  const updatePosition = useCallback(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownMaxHeight = 250;
      const gap = 6;

      let newPlacement: "top" | "bottom" = "bottom";
      if (spaceBelow < dropdownMaxHeight && rect.top > dropdownMaxHeight) {
        newPlacement = "top";
      }

      setPlacement(newPlacement);
      setDropdownStyle({
        top: newPlacement === "bottom" ? rect.bottom + window.scrollY + gap : undefined,
        bottom: newPlacement === "top" ? viewportHeight - rect.top - window.scrollY + gap : undefined,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: `${dropdownMaxHeight}px`,
      });
    }
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdown = document.getElementById("select-dropdown-portal");
      if (!wrapperRef.current?.contains(target) && !dropdown?.contains(target)) {
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
      setIsOpen(false); // Chọn xong đóng luôn nếu là Single Select
    }
  };

  return (
    <>
      <div ref={wrapperRef} className={cn("relative w-full", className)}>
        <div
          className={cn(
            "w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-slate-700 flex items-center justify-between cursor-pointer transition-all select-none shadow-sm",
            disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:border-orange-400",
            isOpen && "border-orange-500 ring-2 ring-orange-100"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={cn(
            "text-sm truncate font-medium",
            !value || (Array.isArray(value) && value.length === 0) ? "text-slate-400" : "text-slate-700"
          )}>
            {getDisplayLabel()}
          </span>
          <FaChevronDown className={cn("text-[10px] text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </div>

      {isOpen && createPortal(
        <div
          id="select-dropdown-portal"
          className={cn(
            "fixed z-[9999] bg-white border border-slate-100 rounded-xl shadow-xl flex flex-col overflow-hidden",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
          style={dropdownStyle!}
        >
          {options.length > 5 && (
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                <input
                  autoFocus
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-300 transition-all"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = isMulti 
                  ? (Array.isArray(value) && value.includes(opt.value))
                  : value === opt.value;
                  
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer rounded-lg transition-all flex items-center justify-between mb-0.5",
                      isSelected 
                        ? "bg-orange-50 text-orange-600 font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <FaCheck className="text-orange-500" size={12} />}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};