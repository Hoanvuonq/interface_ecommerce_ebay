"use client";
import { motion } from "framer-motion";
import { itemVariants } from "../../_types/varion.type";
import { cn } from "@/utils/cn";

export const AssistantCard = ({
  title,
  desc,
  btnText,
  icon,
  gradient,
}: any) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="relative bg-white p-8 rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between group overflow-hidden"
  >
    <div
      className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br ${gradient} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`}
    />

    <div className="space-y-5 relative z-10">
      <div
        className={`w-14 h-14 bg-linear-to-br ${gradient} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20`}
      >
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>

    <div className="mt-8 relative z-10">
      <button
        className={cn(
          "w-full py-3 rounded-2xl bg-linear-to-r text-white text-xs font-bold uppercase",
          "tracking-widest shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all",
          `${gradient}`,
        )}
      >
        {btnText}
      </button>
    </div>
  </motion.div>
);
