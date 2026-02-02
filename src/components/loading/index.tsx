"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

type LoadingSize = "sm" | "md" | "lg";

interface SectionLoadingProps {
  message?: string;
  className?: string;
  isOverlay?: boolean;
  size?: LoadingSize; // Thêm prop size
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
  message = "Đang xử lý dữ liệu...",
  className = "",
  isOverlay = false,
  size = "sm", // Mặc định là sm theo ý bro
}) => {
  // Mapping kích thước xịn sò
  const sizeConfig = {
    sm: {
      container: "w-10 h-10",
      ring1: "border-2",
      ring2: "border",
      dot: "w-1 h-1",
      textSize: "text-[10px]",
      spacing: "space-y-2",
    },
    md: {
      container: "w-16 h-16",
      ring1: "border-t-2 border-r-2",
      ring2: "border-b border-l",
      dot: "w-2 h-2",
      textSize: "text-[13px]",
      spacing: "space-y-4",
    },
    lg: {
      container: "w-24 h-24",
      ring1: "border-t-[3px] border-r-[3px]",
      ring2: "border-b-2 border-l-2",
      dot: "w-3 h-3",
      textSize: "text-[16px]",
      spacing: "space-y-6",
    },
  };

  const config = sizeConfig[size];

  return (
    <section
      className={cn(
        "flex items-center justify-center relative overflow-hidden bg-white/40 backdrop-blur-sm transition-all duration-500",
        isOverlay
          ? "absolute inset-0 z-50 rounded-2xl"
          : "min-h-62.5 w-full",
        className,
      )}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-100 max-h-100 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div
        className={cn(
          "relative z-10 flex flex-col items-center",
          config.spacing,
        )}
      >
        <div className={cn("relative", config.container)}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className={cn(
              "absolute inset-0 rounded-full border-orange-500 border-l-transparent border-b-transparent",
              config.ring1,
            )}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className={cn(
              "absolute inset-1.5 rounded-full border-gray-300 border-t-transparent border-r-transparent opacity-60",
              config.ring2,
            )}
          />

          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                "0 0 0px rgba(249,115,22,0)",
                "0 0 15px rgba(249,115,22,0.5)",
                "0 0 0px rgba(249,115,22,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full",
              config.dot,
            )}
          />
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <h3
              className={cn(
                "font-bold italic uppercase tracking-widest text-gray-800",
                config.textSize,
              )}
            >
              {message.replace("...", "")}
            </h3>

            <div className="flex gap-1 items-end pb-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.3, 1, 0.3],
                    color: ["#1f2937", "#f97316", "#1f2937"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-current"
                />
              ))}
            </div>
          </motion.div>

          {size === "lg" && (
            <motion.p
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2"
            >
             Vui lòng chờ trong giây lát
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};
