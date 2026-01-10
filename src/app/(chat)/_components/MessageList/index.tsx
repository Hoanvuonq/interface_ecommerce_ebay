"use client";

import React, { useEffect } from "react";
import _ from "lodash";
import { User, Loader2 } from "lucide-react";
import { TypingIndicator } from "../TypingIndicator";
import { formatTimeFriendly } from "@/hooks/formatDistanceToNow";
import { MenuItem, MessageListProps } from "./type";
import { MessageItem } from "../MessageItem";

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isInitializing,
  isLoadingMore,
  hasMoreMessages,
  typingUsers = [],
  activeConversationId,
  messagesContainerRef,
  messagesEndRef,
  onScroll,
  getMessageSender,
  getMessageSenderName,
  getMessageSenderAvatar,
  isMessageDeleted,
  getMessageMenuItems,
  currentUsername,
}) => {
  
  // Logic 1: Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang gõ
  useEffect(() => {
    if (messagesEndRef?.current) {
      // Sử dụng scrollIntoView với behavior smooth để tạo hiệu ứng mượt
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUsers]); // Chạy lại mỗi khi tin nhắn thay đổi hoặc có ai đó đang gõ

  if (isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-3 h-full">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-sm text-gray-600 font-medium">Đang tải cuộc trò chuyện...</span>
      </div>
    );
  }

  if (_.isEmpty(messages)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center h-full">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-200">
          <User size={32} />
        </div>
        <p className="text-gray-500 font-medium">Chưa có tin nhắn nào</p>
        <p className="text-xs text-gray-600 mt-1">Hãy bắt đầu cuộc trò chuyện ngay!</p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      /* Ẩn thanh cuộn bằng CSS: scrollbar-hide (nếu dùng tailwind-scrollbar-hide) 
         hoặc dùng style inline bên dưới */
      className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-6 custom-scrollbar-hidden"
      style={{
        scrollbarWidth: 'none', // Cho Firefox
        msOverflowStyle: 'none', // Cho IE/Edge
      }}
    >
      {/* Ẩn scrollbar cho Chrome/Safari */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 gap-2 text-gray-600 animate-in fade-in">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs font-medium">Đang tải tin nhắn cũ...</span>
        </div>
      )}

      <div className="flex flex-col gap-4 pb-2">
        {messages.map((m) => {
          const senderType = getMessageSender(m);
          const isMine = senderType === "customer";
          const menuItemsRaw = getMessageMenuItems(m, isMine);
          const menuItems = menuItemsRaw.filter(
            (item): item is MenuItem => !!item && typeof item === "object"
          );

          return (
            <MessageItem
              key={m.id}
              message={m}
              isMine={isMine}
              isSystem={senderType === "system"}
              isDeleted={isMessageDeleted(m, currentUsername)}
              senderName={getMessageSenderName(m)}
              avatar={getMessageSenderAvatar(m)}
              formatTime={formatTimeFriendly}
              menuItems={menuItems}
            />
          );
        })}
      </div>

      {/* Logic 2: Typing Indicator - Sửa lại để hiện ngay dưới tin nhắn cuối cùng */}
      {typingUsers && typingUsers.length > 0 && activeConversationId && (
        <div className="px-4 py-2 animate-in slide-in-from-bottom-2">
          <TypingIndicator
            userIds={typingUsers}
            conversationId={activeConversationId}
          />
        </div>
      )}

      {/* Neo cuộn */}
      <div ref={messagesEndRef} className="h-4 w-full" />
    </div>
  );
};