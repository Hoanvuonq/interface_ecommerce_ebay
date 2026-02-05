"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import {
  Search,
  MessageSquare,
  User,
  Store,
  Headphones,
  Users,
  MoreVertical,
  Pin,
  PinOff,
  Bell,
  BellOff,
  Archive,
  Plus,
  Loader2,
  Inbox,
} from "lucide-react";
import { useConversations } from "@/app/(chat)/_hooks";
import {
  ConversationListResponse,
  ConversationType,
  GetConversationsRequest,
} from "@/app/(chat)/_types/chat.dto";
import { ActionDropdown, SelectComponent, FormInput } from "@/components";
import { cn } from "@/utils/cn";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation?: () => void;
  height?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  height = 600,
}) => {
  // ==================== STATE ====================
  const [filters, setFilters] = useState<GetConversationsRequest>({
    page: 0,
    size: 20,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  // ==================== HOOKS ====================
  const { conversations, loading, error, hasMore, loadMore, refresh } =
    useConversations(filters);

  // ==================== HANDLERS ====================
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setFilters((prev) => ({
      ...prev,
      keyword: keyword || undefined,
      page: 0,
    }));
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0,
    }));
  };

  // ==================== RENDER HELPERS ====================
  const getTypeIcon = (type: ConversationType) => {
    switch (type) {
      case ConversationType.BUYER_TO_SHOP:
        return <Store size={14} className="text-blue-500" />;
      case ConversationType.BUYER_TO_PLATFORM:
      case ConversationType.SHOP_TO_PLATFORM:
        return <Headphones size={14} className="text-emerald-500" />;
      case ConversationType.GROUP:
        return <Users size={14} className="text-purple-500" />;
      default:
        return <MessageSquare size={14} className="text-gray-400" />;
    }
  };

  const getTypeText = (type: ConversationType) => {
    const map: any = {
      [ConversationType.BUYER_TO_SHOP]: "Khách hàng - Shop",
      [ConversationType.BUYER_TO_PLATFORM]: "Khách hàng - CSKH",
      [ConversationType.SHOP_TO_PLATFORM]: "Shop - Admin",
      [ConversationType.GROUP]: "Nhóm chat",
      [ConversationType.BUYER_TO_BUYER]: "Khách hàng - Khách hàng",
      [ConversationType.SYSTEM]: "Hệ thống",
    };
    return map[type] || type;
  };

  const formatTime = (timestamp: string) => {
    const now = dayjs();
    const time = dayjs(timestamp);
    if (now.diff(time, "hour") < 24) return time.format("HH:mm");
    if (now.diff(time, "day") < 7) return time.format("ddd");
    return time.format("DD/MM");
  };

  const getMenuItems = (conversation: ConversationListResponse) => [
    {
      key: "pin",
      label: conversation.isPinned ? "Bỏ ghim" : "Ghim hội thoại",
      icon: conversation.isPinned ? <PinOff size={16} /> : <Pin size={16} />,
      onClick: () => console.log("Pin", conversation.id),
    },
    {
      key: "mute",
      label: conversation.isMuted ? "Bật thông báo" : "Tắt thông báo",
      icon: conversation.isMuted ? <Bell size={16} /> : <BellOff size={16} />,
      onClick: () => console.log("Mute", conversation.id),
    },
    { type: "divider" as const, key: "div-1" },
    {
      key: "archive",
      label: "Lưu trữ hội thoại",
      icon: <Archive size={16} />,
      danger: true,
      onClick: () => console.log("Archive", conversation.id),
    },
  ];

  return (
    <div
      className="bg-white rounded-4xl border border-gray-100 shadow-custom flex flex-col overflow-hidden"
      style={{ height }}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Hội thoại
          </h3>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5 italic">
            Chat Management System
          </p>
        </div>
        {onCreateConversation && (
          <button
            onClick={onCreateConversation}
            className="p-2.5 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-90"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 bg-gray-50/30">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
            size={16}
          />
          <FormInput
            placeholder="Tìm theo tên hoặc nội dung..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-11 h-11 bg-white border-transparent shadow-sm rounded-2xl focus:bg-white"
          />
        </div>

        <SelectComponent
          placeholder="Lọc theo loại hội thoại"
          options={Object.values(ConversationType).map((type) => ({
            label: getTypeText(type),
            value: type,
          }))}
          value={filters.conversationType}
          onChange={(val) => handleFilterChange("conversationType", val)}
          className="rounded-2xl h-11 bg-white shadow-sm"
        />
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        {loading && conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
              Đang đồng bộ...
            </span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Inbox size={48} className="text-gray-300 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Trống trải quá...
            </p>
          </div>
        ) : (
          <div className="space-y-1 mt-2">
            {conversations.map((item) => {
              const isActive = selectedConversationId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectConversation(item.id)}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-3xl cursor-pointer transition-all duration-300 mx-1",
                    isActive
                      ? "bg-orange-50/80 shadow-sm border border-orange-100"
                      : "hover:bg-gray-50 border border-transparent",
                  )}
                >
                  {/* Avatar Section */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold text-xs">
                          {item.name?.charAt(0) || "C"}
                        </div>
                      )}
                    </div>
                    {item.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in">
                        {item.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={cn(
                          "text-[13px] truncate uppercase tracking-tight",
                          item.unreadCount > 0
                            ? "font-bold text-gray-900"
                            : "font-bold text-gray-700",
                        )}
                      >
                        {item.name || getTypeText(item.conversationType)}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                        {item.lastMessageAt
                          ? formatTime(item.lastMessageAt)
                          : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p
                        className={cn(
                          "text-[11px] truncate pr-4",
                          item.unreadCount > 0
                            ? "text-gray-900 font-bold"
                            : "text-gray-500 font-medium",
                        )}
                      >
                        {item.lastMessagePreview || "Chưa có tin nhắn..."}
                      </p>

                      <div className="flex items-center gap-1">
                        {item.isPinned && (
                          <Pin
                            size={10}
                            className="text-orange-500 fill-current"
                          />
                        )}
                        {item.isMuted && (
                          <BellOff size={10} className="text-gray-300" />
                        )}
                        {getTypeIcon(item.conversationType)}
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <ActionDropdown
                      trigger={
                        <div className="p-1.5 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100">
                          <MoreVertical size={16} className="text-gray-400" />
                        </div>
                      }
                      items={getMenuItems(item)}
                    />
                  </div>

                  {isActive && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-orange-500 rounded-full shadow-[2px_0_10px_rgba(249,115,22,0.4)]" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all rounded-xl"
            >
              {loading ? "Đang tải..." : "Xem thêm hội thoại"}
            </button>
          </div>
        )}
      </div>

      {/* Error Boundary Footer */}
      {error && (
        <div className="p-4 bg-rose-50 border-t border-rose-100 flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight italic">
            {error}
          </p>
          <button
            onClick={refresh}
            className="text-[11px] font-bold text-rose-600 underline uppercase tracking-widest"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

