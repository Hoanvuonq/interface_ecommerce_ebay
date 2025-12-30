"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionLoadingProps {
  message?: string;
  className?: string;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
  message = "Đang tải dữ liệu...",
  className = "",
}) => {
  return (
    <section
      className={`min-h-100 flex items-center justify-center relative overflow-hidden bg-white ${className}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-20 h-20 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 border-t-4 border-r-4 border-orange-500 border-l-transparent border-b-transparent rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-2 border-b-2 border-l-2 border-slate-200 border-t-transparent border-r-transparent rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <motion.h3
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900"
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
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};