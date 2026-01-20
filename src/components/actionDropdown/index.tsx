"use client";

import { cn } from "@/utils/cn";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
  type?: "divider";
}

interface ActionDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  placement?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
}

export const ActionDropdown = ({
  trigger,
  items,
  className,
  placement = "bottomRight",
}: ActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    height: number;
    windowHeight: number; 
  } | null>(null);
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        windowHeight: window.innerHeight,
      });
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleScroll = () => updateCoords();
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isOpen]);

  const getPositionStyle = (): React.CSSProperties => {
    if (!coords) return { opacity: 0 };
    
    const offset = 8;
    const menuHeight = items.length * 45; 
    const style: React.CSSProperties = { position: "fixed", minWidth: "210px" };

    const spaceBelow = coords.windowHeight - (coords.top + coords.height);
    const shouldFlip = spaceBelow < menuHeight && coords.top > menuHeight;

    if (shouldFlip || placement.startsWith("top")) {
      style.bottom = coords.windowHeight - coords.top + offset;
    } else {
      style.top = coords.top + coords.height + offset;
    }

    if (placement.endsWith("Right")) {
      style.right = window.innerWidth - (coords.left + coords.width);
    } else {
      style.left = coords.left;
    }
    return style;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn("inline-block transition-transform active:scale-90", className)}
      >
        {trigger}
      </div>

      {isOpen && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-9999 overflow-hidden rounded-2xl border border-orange-100 bg-white/95 p-1.5 shadow-[0_20px_50px_-12px_rgba(249,115,22,0.25)] backdrop-blur-xl",
              "animate-in fade-in zoom-in-95 duration-200 ease-out"
            )}
            style={getPositionStyle()}
          >
            <div className="flex flex-col gap-1">
              {items.map((item, idx) => {
                if (item.type === "divider") {
                  return <div key={idx} className="my-1 h-px bg-orange-50" />;
                }
                return (
                  <button
                    key={item.key || idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                      item.danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "shrink-0 transition-transform duration-200 group-hover:scale-110",
                        item.danger ? "text-red-400" : "text-orange-400 group-hover:text-orange-600"
                      )}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-bold tracking-tight italic whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                    
                    {!item.danger && (
                      <div className="h-4 w-0.5 rounded-full bg-orange-500 opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;