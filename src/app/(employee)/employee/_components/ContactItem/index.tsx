"use client";

import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ContactItemProps } from "./type";

export const ContactItem: React.FC<ContactItemProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  iconColor = "text-orange-500",
}) => {
  const { success: toastSuccess } = useToast();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = async (
    e: React.MouseEvent,
    text: string,
    label: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toastSuccess(`Đã sao chép ${label.toLowerCase()}`);

      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Lỗi khi copy:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "p-5 rounded-3xl border-2 transition-all duration-300 group shadow-custom relative overflow-hidden bg-white",
        colorClass ||
          "border-gray-100 hover:border-orange-100 hover:shadow-xl ",
      )}
    >
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gray-100 rounded-full group-hover:bg-orange-50/50 transition-colors duration-500" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-2xl shadow-sm bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all",
              iconColor,
            )}
          >
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-gray-800 text-[10px] uppercase tracking-[0.15em] leading-none italic">
              {title}
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 opacity-60">
              Phòng ban hỗ trợ
            </span>
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white cursor-pointer">
          <ExternalLink size={12} strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-3 relative z-10 ml-0.5">
        <div className="flex items-center justify-between group/item">
          <Link
            href={`tel:${value.phone}`}
            className="flex items-center gap-2.5 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
              <Phone size={16} className="opacity-70" />
            </div>
            <span className="text-xs font-bold tabular-nums tracking-tight">
              {value.phone}
            </span>
          </Link>
          <button
            onClick={(e) => handleCopy(e, value.phone, "Số điện thoại")}
            className="p-1.5 rounded-md hover:bg-orange-50 text-gray-300 hover:text-orange-500 opacity-0 group-hover/item:opacity-100 transition-all active:scale-90"
          >
            {copiedField === "Số điện thoại" ? (
              <Check size={12} strokeWidth={3} className="text-emerald-500" />
            ) : (
              <Copy size={12} strokeWidth={3} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between group/item">
          <Link
            href={`mailto:${value.email}`}
            className="flex items-center gap-2.5 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
              <Mail size={16} className="opacity-70" />
            </div>
            <span className="text-[11px] font-semibold italic truncate max-w-37.5">
              {value.email}
            </span>
          </Link>
          <button
            onClick={(e) => handleCopy(e, value.email, "Email")}
            className="p-1.5 rounded-md hover:bg-orange-50 text-gray-300 hover:text-orange-500 opacity-0 group-hover/item:opacity-100 transition-all active:scale-90"
          >
            {copiedField === "Email" ? (
              <Check size={12} strokeWidth={3} className="text-emerald-500" />
            ) : (
              <Copy size={12} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
