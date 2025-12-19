"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

export const ModalWrapper: React.FC<any> = ({
  open,
  onCancel,
  title,
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.style.overflow = 'hidden'; // Chặn cuộn trang chính
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !mounted) return null;

  // Nội dung Modal
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Lớp nền mờ (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onCancel} 
      />

      {/* Khung Modal chính */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex-1 min-w-0 mr-4">
            {title}
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-white">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};