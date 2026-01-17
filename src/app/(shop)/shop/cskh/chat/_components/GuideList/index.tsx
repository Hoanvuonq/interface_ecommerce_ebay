"use client";
import { motion } from "framer-motion";

export const GuideList = ({ items }: { items: any[] }) => (
  <ul className="space-y-4">
    {items.map((item, i) => (
      <motion.li
        key={i}
        whileHover={{ x: 5 }}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-orange-200 group-hover:bg-orange-500 transition-all shadow-xs shadow-orange-500/0 group-hover:shadow-orange-500/50" />
        <span className="text-sm font-semibold text-gray-600 group-hover:text-orange-500 transition-colors">
          {item.text}
        </span>
        {item.hot && (
          <span className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-md shadow-orange-500/20 animate-pulse">
            HOT
          </span>
        )}
      </motion.li>
    ))}
  </ul>
);
