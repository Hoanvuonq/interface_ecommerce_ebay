"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import _ from "lodash";
import {
  User,
  Loader2,
  Check,
  CheckCheck,
  MoreHorizontal,
  RotateCcw,
  Reply,
  Trash2,
} from "lucide-react";
import type { Message as ChatMessage } from "../../_types/chat.type";
import { MessageContent } from "../MessageContent";
import { TypingIndicator } from "../TypingIndicator";
import { vi } from "date-fns/locale";
import { formatTimeFriendly } from "@/hooks/formatDistanceToNow";
import Image from "next/image";
import { MenuItem, MessageListProps } from "./type";

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
formatTime,
  isMessageDeleted,
  getMessageMenuItems,
  currentUsername,
}) => {
  if (isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-3 h-full">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-sm text-gray-600 font-medium">
          Đang tải cuộc trò chuyện...
        </span>
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
        <p className="text-xs text-gray-600 mt-1">
          Hãy bắt đầu cuộc trò chuyện ngay!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-6 scroll-smooth"
    >
      {/* Loading More Spinner */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 gap-2 text-gray-600 animate-in slide-in-from-top-2">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs font-medium">Đang tải tin nhắn cũ...</span>
        </div>
      )}

      {/* Messages */}
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

      {/* Typing Indicator */}
      {typingUsers && typingUsers.length > 0 && activeConversationId && (
        <div className="px-4 py-2">
          <TypingIndicator
            userIds={typingUsers}
            conversationId={activeConversationId}
          />
        </div>
      )}

      {/* Scroll Anchor */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};

// --- Sub Component: Message Item ---
const MessageItem = ({
  message,
  isMine,
  isSystem,
  isDeleted,
  senderName,
  avatar,
  formatTime,
  menuItems,
}: {
  message: ChatMessage;
  isMine: boolean;
  isSystem: boolean;
  isDeleted: boolean;
  senderName: string;
  avatar?: string;
  formatTime: (t: string) => string;
  menuItems: MenuItem[];
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 opacity-75">
        <span className="px-3 py-1 bg-gray-200/60 text-gray-500 rounded-full text-[10px] font-medium">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full group ${
        isMine ? "justify-end" : "justify-start"
      } animate-in fade-in duration-300 slide-in-from-bottom-1`}
    >
      <div
        className={`flex gap-2 max-w-[85%] md:max-w-[75%] ${
          isMine ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="shrink-0 mt-auto">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
            {avatar ? (
              <Image
                src={avatar}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                alt="avt"
              />
            ) : (
              <User size={16} className="text-gray-600" />
            )}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            isMine ? "items-end" : "items-start"
          } min-w-0 flex-1`}
        >
          <span className="text-[10px] font-semibold text-gray-600 mb-1 px-1 uppercase tracking-tight select-none">
            {senderName}
          </span>

          <div
            className={`relative flex items-end gap-2 group/bubble ${
              isMine ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Message Bubble */}
            <div
              className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm wrap-break-words transition-all hover:shadow-md ${
                isMine
                  ? "bg-linear-to-br from-orange-500 to-amber-500 text-white rounded-tr-sm"
                  : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
              } ${
                isDeleted
                  ? "opacity-75 bg-gray-100 border-dashed border-gray-300 text-gray-500 shadow-none"
                  : ""
              }`}
            >
              {/* Reply Context */}
              {message.replyToMessage && !isDeleted && (
                <div
                  className={`mb-2 pl-2 border-l-2 text-[11px] opacity-90 cursor-pointer line-clamp-1 hover:opacity-100 transition-opacity ${
                    isMine
                      ? "border-white/50 bg-white/10 rounded-r p-1"
                      : "border-orange-500 bg-orange-50 rounded-r p-1"
                  }`}
                >
                  <span className="font-bold block text-[9px] uppercase mb-0.5 opacity-80">
                    Trả lời
                  </span>
                  {message.replyToMessage.content || "[Đính kèm]"}
                </div>
              )}

              {/* Main Content */}
              {isDeleted ? (
                <div className="flex items-center gap-2 italic text-xs py-1 select-none">
                  <RotateCcw size={14} />
                  <span>Tin nhắn đã thu hồi</span>
                </div>
              ) : (
                <div className={isMine ? "text-white" : "text-gray-800"}>
                  <MessageContent message={message} />
                </div>
              )}

              <div
                className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] font-bold tracking-tighter select-none ${
                  isMine ? "text-white/60" : "text-gray-300"
                }`}
              >
                <span>{formatTime(message.sentAt)}</span>
                {isMine && (
                  <span>
                    {message.status === "READ" ? (
                      <CheckCheck size={12} />
                    ) : (
                      <Check size={12} />
                    )}
                  </span>
                )}
                {message.isEdited && !isDeleted && (
                  <span className="uppercase opacity-70 ml-1 bg-black/10 px-1 rounded-xs">
                    (Đã sửa)
                  </span>
                )}
              </div>
            </div>

            {!isDeleted && menuItems.length > 0 && (
              <div
                className="relative opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200"
                ref={menuRef}
              >
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition-all ${
                    showMenu ? "opacity-100 bg-gray-200 text-gray-600" : ""
                  }`}
                >
                  <MoreHorizontal size={16} />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    className={`absolute bottom-full mb-2 z-50 min-w-35 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
                      isMine
                        ? "right-0 origin-bottom-right"
                        : "left-0 origin-bottom-left"
                    }`}
                  >
                    {menuItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                          setShowMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          item.danger
                            ? "text-red-500 hover:bg-red-50"
                            : "text-gray-700"
                        }`}
                      >
                        {item.key === "reply" && (
                          <Reply size={14} strokeWidth={2.5} />
                        )}
                        {item.key === "revoke" && (
                          <Trash2 size={14} strokeWidth={2.5} />
                        )}
                        {item.key === "edit" && (
                          <span className="text-[10px]">✏️</span>
                        )}{" "}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};