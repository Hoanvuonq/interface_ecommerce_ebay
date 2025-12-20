"use client";

import React from "react";
import { FiLock, FiShield, FiX } from "react-icons/fi";

interface HeaderModalProps {
  title?: string; 
  isFirstTimeChange?: boolean;
  onClose: () => void;
}

export const HeaderModal: React.FC<HeaderModalProps> = ({ 
  title, 
  isFirstTimeChange = false, 
  onClose 
}) => {
  
  const displayTitle = title || (isFirstTimeChange ? "Thiết lập mật khẩu" : "Đổi mật khẩu ví");
  
  const iconBgClass = isFirstTimeChange 
    ? "bg-orange-100 text-orange-600" 
    : "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconBgClass}`}>
          {isFirstTimeChange ? <FiShield size={20} /> : <FiLock size={20} />}
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {displayTitle}
        </h3>
      </div>
      
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="Close modal"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};