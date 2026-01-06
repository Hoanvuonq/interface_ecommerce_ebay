"use client";

import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Search, Store, User, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ConversationListProps } from "./type";
import Image from "next/image";

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
      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
        <User size={24} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className="object-cover"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
}) => {
  const formatTimeFriendly = (date: string | Date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: false,
        locale: vi,
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`w-full md:w-[360px] border-r border-slate-100 flex flex-col bg-white transition-all ${
        isMobileView ? "hidden md:flex" : "flex"
      }`}
      style={{ height: height }}
    >
      <div className="p-4 space-y-3 bg-linear-to-br from-orange-50/50 to-white border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Store size={20} className="text-orange-500" />
          Tin nhắn Shop
        </h3>

        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm hội thoại..."
            className="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {_.isEmpty(conversations) ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Không có cuộc trò chuyện nào
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {_.map(conversations, (c) => {
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
                  className={`group relative flex items-start gap-3 px-4 py-4 cursor-pointer transition-all hover:bg-slate-50 active:bg-orange-50 ${
                    isActive ? "bg-orange-50/60" : "bg-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full" />
                  )}

                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative">
                      <ConversationAvatar
                        src={avatarSrc}
                        alt={shopName || "Shop"}
                      />
                    </div>

                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center px-1">
                        {c.unreadCount > 99 ? "99+" : c.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm truncate pr-2 ${
                          hasUnread
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {shopName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap uppercase tracking-tighter">
                        {formatTimeFriendly(lastTime)}
                      </span>
                    </div>

                    <p
                      className={`text-xs truncate ${
                        hasUnread
                          ? "text-slate-900 font-semibold"
                          : "text-slate-500 font-normal"
                      }`}
                    >
                      {_.get(c, "lastMessagePreview", "Chưa có tin nhắn")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
