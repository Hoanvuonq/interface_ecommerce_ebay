"use client";

import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Search, Store, User, Inbox, MessageSquare, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ConversationListProps } from "./type";
import Image from "next/image";
import { cn } from "@/utils/cn";

const ConversationAvatar = ({
  src,
  alt,
}: {
  src: string | undefined;
  alt: string;
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (!src || imgError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
        <Store size={20} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className="object-cover"
      fill
      sizes="48px"
      onError={() => setImgError(true)}
    />
  );
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelect,
  searchText,
  onSearchChange,
  height,
  isMobileView,
  getShopAvatar,
  getShopName,
  onClose
}) => {
  const formatTimeFriendly = (date: string | Date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: false,
        locale: vi,
      }).replace("khoảng ", ""); // Rút gọn text
    } catch {
      return "";
    }
  };

  return (
    <div
      className={cn(
        "w-full md:w-[340px] lg:w-[380px] border-r border-gray-100 flex flex-col bg-gray-50/50 transition-all h-full",
        isMobileView ? "hidden md:flex" : "flex"
      )}
      style={{ height: height }}
    >
      <div className="p-5 pb-2 space-y-4 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
              <MessageSquare size={20} strokeWidth={2.5} />
            </div>
            Tin nhắn
          </h3>

          {/* Nút Đóng - Chỉ hiện ở Mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all active:scale-90"
            aria-label="Close chat list"
          >
            <X size={22} />
          </button>
        </div>

        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm shop..."
            className="w-full bg-gray-100 border-transparent border focus:border-orange-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all outline-none"
          />
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 pt-2 space-y-1.5">
        {_.isEmpty(conversations) ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Inbox size={36} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              Chưa có tin nhắn nào
            </p>
            <p className="text-xs text-gray-600 mt-1 max-w-[200px]">
              Hãy bắt đầu trò chuyện với Shop để được hỗ trợ tốt nhất nhé!
            </p>
          </div>
        ) : (
          _.map(conversations, (c) => {
            const isActive = selectedConversationId === c.id;
            const hasUnread = _.get(c, "unreadCount", 0) > 0;
            const lastTime =
              _.get(c, "lastModifiedDate") || _.get(c, "lastMessageAt");

            const avatarSrc = getShopAvatar(c);
            const shopName = getShopName(c);

            return (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                className={cn(
                  "group relative flex items-start gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 border",
                  isActive
                    ? "bg-white border-orange-200 shadow-sm shadow-orange-100 ring-1 ring-orange-100"
                    : "bg-transparent border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm"
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-[52px] h-[52px] rounded-2xl overflow-hidden border border-gray-100 bg-white relative shadow-sm">
                    <ConversationAvatar
                      src={avatarSrc}
                      alt={shopName || "Shop"}
                    />
                  </div>

                  {hasUnread && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-[3px] border-white flex items-center justify-center px-1 shadow-sm z-10">
                      {c.unreadCount > 99 ? "99+" : c.unreadCount}
                    </span>
                  )}
                  
                  {/* Online indicator (optional - giả lập) */}
                  {/* <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[3px] border-white rounded-full z-10" /> */}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={cn(
                        "text-[15px] truncate pr-2 leading-tight",
                        hasUnread || isActive
                          ? "font-bold text-gray-900"
                          : "font-semibold text-gray-700"
                      )}
                    >
                      {shopName}
                    </h4>
                    <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap shrink-0">
                      {formatTimeFriendly(lastTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                        className={cn(
                        "text-[13px] truncate max-w-[85%] leading-relaxed",
                        hasUnread
                            ? "text-gray-900 font-semibold"
                            : isActive 
                                ? "text-gray-600 font-medium" 
                                : "text-gray-500"
                        )}
                    >
                        {_.get(c, "lastMessagePreview", "Chưa có tin nhắn") || "File đính kèm"}
                    </p>
                    {/* Read status icon (optional) */}
                    {/* <CheckCheck size={14} className="text-blue-500 shrink-0" /> */}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};