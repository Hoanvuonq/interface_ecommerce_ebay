"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { getStoredUserDetail } from "@/utils/jwt";
import { CustomerShopChat } from "../CustomerShopChat";
import { Store } from "lucide-react";

export const FloatingChatButtons: React.FC = () => {
  const { warning } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const router = useRouter();

  const isLoggedIn = () => {
    const userDetail = getStoredUserDetail();
    return userDetail?.userId;
  };

  const handleAction = (action: () => void) => {
    if (!isLoggedIn()) {
      warning("Vui lòng đăng nhập để sử dụng tính năng này");
      setTimeout(() => router.push("/login"), 1000);
      return;
    }
    action();
  };

  return (
    <>
      <CustomerShopChat
        open={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
      <div
        className={`fixed bottom-8 right-8 z-60 flex flex-col items-end gap-4 transition-all duration-500 ${
          isChatOpen || isShopModalOpen
            ? "translate-y-20 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="relative flex items-center group">
          <div 
            className={`absolute right-full mr-3 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-gray-100 text-orange-600 text-xs font-bold rounded-xl shadow-sm whitespace-nowrap transition-all duration-300 origin-right ${
              isHovered === 'shop' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-2 pointer-events-none'
            }`}
          >
            Chat với Shop
          </div>

          <button
            onClick={() => handleAction(() => setIsShopModalOpen(true))}
            onMouseEnter={() => setIsHovered("shop")}
            onMouseLeave={() => setIsHovered(null)}
            className="relative w-14 h-14 bg-linear-to-br from-orange-400 to-amber-500 rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all duration-300 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95"
          >
            <span className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-ping" />
            <Store
              size={24}
              className="text-white relative z-10"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </>
  );
};