"use client";

import { cn } from "@/utils/cn";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { SearchableSelectProps } from "./type";
import { useIsomorphicLayoutEffect } from "framer-motion";


export const SelectComponent = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // State for positioning
  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";
  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const updatePosition = useCallback(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250; 
      
      let top = rect.bottom + 6; 
      let placement: "top" | "bottom" = "bottom";

      if (spaceBelow < dropdownHeight) {
        top = rect.top - dropdownHeight - 6;
        placement = "top";
      }

      setDropdownStyle({
        top: top, 
        left: rect.left,
        width: rect.width,
        placement,
      });
    }
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    } else {
      setDropdownStyle(null);
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEvent = (e: Event) => {
      const target = e.target as Node;
      const dropdown = document.getElementById("searchable-select-dropdown");
      const wrapper = wrapperRef.current;

      // Click Outside -> Close
      if (e.type === "mousedown") {
        if (wrapper?.contains(target) || dropdown?.contains(target)) {
          return;
        }
        setIsOpen(false);
      }
      
      if (e.type === "scroll" || e.type === "resize") {
         updatePosition();
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
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  return (
    <>
      <div ref={wrapperRef} className={cn("relative w-full", className)}>
        <div
          className={cn(
            "w-full h-11 px-4 border border-gray-300 rounded-xl bg-white text-gray-900 flex items-center justify-between cursor-pointer transition-all select-none",
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "hover:border-orange-500 focus:border-orange-500",
            isOpen && !disabled ? "border-orange-500 ring-2 ring-orange-100" : ""
          )}
          onClick={(e) => {
            if (disabled) return;
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <span className={cn("text-sm font-medium truncate", !selectedLabel && "text-gray-400")}>
            {selectedLabel || placeholder}
          </span>
          <FaChevronDown
            className={cn(
              "text-xs text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && !disabled && dropdownStyle && createPortal(
        <div
          id="searchable-select-dropdown"
          className={cn(
            "fixed z-[99999] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden",
            "animate-in fade-in zoom-in-95 duration-150 ease-out",
            dropdownStyle.placement === "bottom" ? "origin-top slide-in-from-top-2" : "origin-bottom slide-in-from-bottom-2"
          )}
          style={{
            top: dropdownStyle.top,
            left: dropdownStyle.left,
            width: dropdownStyle.width,
            maxHeight: "250px",
          }}
        >
          <div className="p-2 border-b border-gray-50 bg-white sticky top-0 z-10">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                autoFocus
                type="text"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar p-1 max-h-[200px]">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "px-3 py-2.5 text-sm cursor-pointer rounded-lg transition-colors font-medium flex items-center justify-between",
                    opt.value === value
                      ? "bg-orange-50 text-orange-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                  {opt.value === value && <span className="text-orange-500 text-xs font-bold">✓</span>}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};