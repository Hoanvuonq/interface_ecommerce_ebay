"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SectionLoadingProps {
  message?: string;
  className?: string;
  isOverlay?: boolean; 
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
  message = "Đang tải dữ liệu...",
  className = "",
  isOverlay = false,
}) => {
  return (
    <section
      className={cn(
        "flex items-center justify-center relative overflow-hidden bg-white/60 backdrop-blur-[2px] transition-all duration-300",
        isOverlay ? "absolute inset-0 z-50 rounded-xl" : "min-h-50",
        className
      )}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center scale-75 md:scale-90">
        <div className="relative w-12 h-12 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-orange-500 border-l-transparent border-b-transparent rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-1.5 border-b border-l border-gray-200 border-t-transparent border-r-transparent rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"
          />
        </div>
        <div className="flex flex-col items-center space-y-1">
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[12px] font-bold italic uppercase tracking-wider text-gray-800"
          >
            {message.split("...")[0]}
            <span className="text-orange-500">...</span>
          </motion.h3>

          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  backgroundColor: ["#cbd5e1", "#f97316", "#cbd5e1"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.15,
                }}
                className="w-1 h-1 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
