"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/utils/cn";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  trend?: number;
  className?: string;
}

export const StatCardComponents: React.FC<StatCardProps> = ({
  label,
  value,
  color = "text-gray-900",
  icon,
  size = "md",
  trend = 12,
  className,
}) => {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (displayValueRef.current) {
        displayValueRef.current.textContent =
          Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  const sizeConfigs = {
    sm: {
      container: "p-4 rounded-2xl min-h-[110px]",
      label: "text-[10px]",
      value: "text-3xl",
      decorSize: 50,
      iconContainer: "w-8 h-8",
    },
    md: {
      container: "p-6 rounded-[2rem] min-h-[160px]",
      label: "text-[11px]",
      value: "text-5xl",
      decorSize: 80,
      iconContainer: "w-12 h-12",
    },
    lg: {
      container: "p-8 rounded-[2.5rem] min-h-[200px]",
      label: "text-xs",
      value: "text-7xl",
      decorSize: 120,
      iconContainer: "w-16 h-16",
    },
  };

  const config = sizeConfigs[size];

  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      }}
      className={cn(
        "group bg-white border border-gray-100 shadow-custom relative overflow-hidden flex flex-col justify-between transition-all duration-500",

        config.container,
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors duration-500" />

      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: { rotate: -12, scale: 1.1, opacity: 0.12 },
        }}
        className="absolute -right-2 top-4 text-orange-500 opacity-[0.05] pointer-events-none transition-all duration-700"
      >
        {icon && React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{
                size?: number;
                strokeWidth?: number;
              }>,
              {
                size: config.decorSize,
                strokeWidth: 1.2,
              },
            )
          : null}
      </motion.div>

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p
            className={cn(
              "font-bold uppercase tracking-widest text-gray-700 group-hover:text-orange-600 transition-colors duration-300",
              config.label,
            )}
          >
            {label}
          </p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit border border-emerald-100">
            <TrendingUp size={10} />
            <span>+{trend}%</span>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-400",
            "group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 group-hover:shadow-lg group-hover:shadow-orange-200 transition-all duration-500",
            config.iconContainer,
          )}
        >
          {icon && React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{
                  size?: number;
                  strokeWidth?: number;
                }>,
                {
                  size: size === "sm" ? 16 : 22,
                  strokeWidth: 2,
                },
              )
            : null}
        </div>
      </div>

      {/* Main Value */}
      <div className="relative z-10 mt-4 flex items-baseline gap-2">
        <span
          ref={displayValueRef}
          className={cn(
            "font-bold tracking-tight italic block transition-all duration-500 group-hover:scale-[1.02] origin-left",
            color,
            config.value,
          )}
        >
          0
        </span>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 group-hover:text-orange-300 transition-colors">
          Thực thể
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.75 bg-gray-100 overflow-hidden">
        <motion.div
          variants={{
            initial: { x: "-100%" },
            hover: { x: "0%" },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full bg-linear-to-r from-orange-400 via-orange-500 to-amber-400"
        />
      </div>

      <motion.div
        variants={{
          initial: { opacity: 0, y: 20 },
          hover: { opacity: 1, y: 0 },
        }}
        className="absolute inset-0 bg-linear-to-b from-transparent via-orange-50/5 to-orange-50/30 pointer-events-none"
      />
    </motion.div>
  );
};
