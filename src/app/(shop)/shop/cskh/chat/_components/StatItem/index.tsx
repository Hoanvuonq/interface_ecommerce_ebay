"use client";
import { motion } from "framer-motion";
import { itemVariants } from "../../_types/varion.type";

export const StatItem = ({ label, value, subValue, icon }: any) => (
  <motion.div
    variants={itemVariants}
    className="p-4 space-y-3 group cursor-default"
  >
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-orange-500 transition-colors">
      {icon} {label}
    </div>
    <div className="text-4xl font-bold text-gray-800 tabular-nums leading-none">
      {value}
    </div>
    <div className="text-xs font-medium text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded-md">
      {subValue}
    </div>
  </motion.div>
);
