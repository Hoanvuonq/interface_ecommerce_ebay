"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatCardComponents: React.FC<StatCardProps> = ({
  label,
  value,
  color = "text-gray-900",
  icon,
  size = "md",
  className,
}) => {
  const sizeConfigs = {
    sm: {
      container: "p-4 rounded-2xl min-h-[100px]",
      label: "text-[10px]",
      value: "text-2xl",
      decorSize: 60,
    },
    md: {
      container: "p-6 rounded-[2.5rem] min-h-[140px]",
      label: "text-[10px]",
      value: "text-5xl",
      decorSize: 100,
    },
    lg: {
      container: "p-8 rounded-[3rem] min-h-[180px]",
      label: "text-xs",
      value: "text-6xl",
      decorSize: 140,
    },
  };

  const config = sizeConfigs[size];

  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
      }}
      className={cn(
        "bg-white border border-gray-100 relative overflow-hidden flex flex-col justify-between transition-all duration-300",
        "shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),0_4px_6px_-2px_rgba(0,0,0,0.02)]", 
        "hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)]",
        "hover:border-gray-100",
        config.container,
        className
      )}
    >
      <motion.div 
        variants={{
          hover: { x: -15, y: -5, scale: 1.1, opacity: 0.15 } 
        }}
        className="absolute -right-2 -top-2 text-gray-600 opacity-[0.08] pointer-events-none transition-all duration-500"
      >
        {icon && React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { 
              size: config.decorSize, 
              strokeWidth: 1.5 
            })
          : null}
      </motion.div>

      <div className="relative z-10 space-y-1">
        <p className={cn(
          "font-semibold uppercase tracking-[0.25em] text-gray-600 transition-colors duration-300 group-hover:text-orange-500",
          config.label
        )}>
          {label}
        </p>
        
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="wait">
            <motion.span 
              key={value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "font-semibold tracking-tighter italic leading-none block", 
                color,
                config.value
              )}
            >
              {value.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-tighter">
            Items
          </span>
        </div>
      </div>

      <motion.div 
        variants={{
          initial: { width: 0 },
          hover: { width: "100%" }
        }}
        className="absolute bottom-0 left-0 h-1.5 bg-linear-to-r from-orange-400 to-orange-600 shadow-[0_-2px_10px_rgba(249,115,22,0.2)]"
        transition={{ duration: 0.4, ease: "circOut" }}
      />
      
      {/* 4. Hiệu ứng ánh sáng loang nhẹ khi hover (Glow effect) */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        className="absolute inset-0 bg-linear-to-tr from-orange-50/0 via-orange-50/20 to-orange-50/50 pointer-events-none"
      />
    </motion.div>
  );
};