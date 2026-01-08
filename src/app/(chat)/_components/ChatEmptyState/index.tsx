"use client";

import React from "react";
import { MessageSquare, ShoppingBag, Search } from "lucide-react";

interface ChatEmptyStateProps {
  hasConversations: boolean;
  onStartChat: () => void;
  onSearchFocus: () => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  hasConversations,
  onStartChat,
  onSearchFocus,
}) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-gray-50/30">
      <div className="text-center px-8 py-12 bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-gray-100 max-w-sm mx-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-200 rotate-3">
          <MessageSquare size={40} fill="currentColor" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">
          Chào mừng đến với Chat Shop! 👋
        </h3>
        
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {hasConversations
            ? "Chọn một cuộc trò chuyện bên trái để bắt đầu trao đổi với các Shop bạn yêu thích."
            : "Bạn chưa có cuộc trò chuyện nào. Hãy tìm sản phẩm và nhắn tin cho Shop để được hỗ trợ nhé!"}
        </p>

        <div className="flex flex-col gap-3">
          {hasConversations ? (
            <button
              onClick={onStartChat}
              className="w-full py-3 bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
            >
              Bắt đầu trò chuyện
            </button>
          ) : (
            <button
              onClick={() => window.location.href = "/"}
              className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Khám phá sản phẩm
            </button>
          )}
          
          <button
            onClick={onSearchFocus}
            className="w-full py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Tìm cuộc trò chuyện
          </button>
        </div>
      </div>
    </div>
  );
};