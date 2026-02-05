"use client";

import { CustomButton } from "@/components";
import { motion } from "framer-motion";
import { Inbox, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CustomEmptyStateProps } from "./type";

export const CustomEmptyState = ({
  title,
  description = "Không tìm thấy dữ liệu phù hợp.",
  icon: MainIcon = Inbox,
  subIcon: SubIcon = Search,
  showButton = true,
  buttonText = "Quay lại trang chủ",
  link,
  onAction,
  className,
}: CustomEmptyStateProps) => {
  const renderButton = () => {
    const FinalButtonIcon = MainIcon || ShoppingBag;

    const iconElement = (
      <div className="bg-orange-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
        <FinalButtonIcon size={18} className="text-white" />
      </div>
    );

    const buttonContent = (
      <CustomButton
        variant="dark"
        onClick={onAction}
        className="h-14 px-8 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-orange-200/50 transition-all duration-300 group"
       icon={iconElement}
      >
        <span className="font-bold uppercase tracking-widest text-[10px] ml-2">
          {buttonText}
        </span>
      </CustomButton>
    );

    if (link) {
      return <Link href={link}>{buttonContent}</Link>;
    }

    return buttonContent;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 my-4 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-gray-100">
          <MainIcon size={48} strokeWidth={1} className="text-gray-400" />
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
          <SubIcon size={14} className="text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <div className="space-y-2 text-center max-w-sm mb-8">
        {title && (
          <h3 className="text-lg font-bold text-gray-800 uppercase italic tracking-wider">
            {title}
          </h3>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {showButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {renderButton()}
        </motion.div>
      )}
    </motion.div>
  );
};
