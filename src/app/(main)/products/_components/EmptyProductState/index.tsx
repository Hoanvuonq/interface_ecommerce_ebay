"use client";

import { CustomButton } from "@/components";
import { Inbox, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const EmptyProductState = ({
  onReset,
  message,
  link,
}: {
  onReset?: () => void;
  message?: string;
  link?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 my-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-gray-100">
          <Inbox size={48} strokeWidth={1} className="text-gray-300" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="absolute -top-2 -right-2 w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-md"
        >
          <Search size={14} className="text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <div className="space-y-2 text-center max-w-xs mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[12px] font-bold text-gray-600 uppercase tracking-wider leading-relaxed italic"
        >
          {message || "Không tìm thấy sản phẩm nào phù hợp."}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href={link || "/products"}>
          <CustomButton
            variant="dark"
            onClick={onReset}
            className="h-14 px-6 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-orange-200/50 transition-all duration-300 group"
            icon={
              <div className="bg-orange-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <ShoppingBag size={18} className="text-white" />
              </div>
            }
          >
            <span className="font-bold uppercase tracking-widest text-xs ml-2">
              Bắt đầu mua sắm ngay
            </span>
          </CustomButton>
        </Link>
      </motion.div>
    </motion.div>
  );
};
