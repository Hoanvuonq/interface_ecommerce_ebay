"use client";

import React from "react";
import _ from "lodash";
import { User, MoreHorizontal, Check, CheckCheck, Loader2, RotateCcw } from "lucide-react";
import { MessageContent } from "../MessageContent";
import { TypingIndicator } from "../TypingIndicator";
import { MessageResponse } from "../../_types/chat.dto";
import type { Message as ChatMessage } from "../../_types/chat.type";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isInitializing: boolean;
  isLoadingMessages: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  typingUsers: string[];
  activeConversationId: string | null;
  latestMessageId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  // Helpers từ file cha
  getMessageSender: (m: any) => "customer" | "shop" | "system";
  getMessageSenderName: (m: any) => string;
  getMessageSenderAvatar: (m: any) => string | undefined;
  formatTime: (ts: string) => string;
  isMessageDeleted: (m: any, username?: string) => boolean;
  getMessageMenuItems: (m: any, isMine: boolean) => any[];
  currentUsername?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isInitializing,
  isLoadingMessages,
  isLoadingMore,
  hasMoreMessages,
  typingUsers,
  activeConversationId,
  latestMessageId,
  onScroll,
  messagesContainerRef,
  messagesEndRef,
  getMessageSender,
  getMessageSenderName,
  getMessageSenderAvatar,
  formatTime,
  isMessageDeleted,
  getMessageMenuItems,
  currentUsername,
}) => {
  
  if (isInitializing || isLoadingMessages) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Đang tải tin nhắn...</span>
      </div>
    );
  }

  if (_.isEmpty(messages)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-200">
          <User size={32} />
        </div>
        <p className="text-slate-500 font-medium">Chưa có tin nhắn nào</p>
        <p className="text-xs text-slate-400 mt-1">Gửi tin nhắn để bắt đầu trò chuyện với Shop</p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-6 custom-scrollbar"
    >
      {/* Load More Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 gap-2 text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs font-medium">Đang tải tin nhắn cũ...</span>
        </div>
      )}

      {/* End of history indicator */}
      {!hasMoreMessages && !_.isEmpty(messages) && (
        <div className="flex items-center justify-center py-2">
          <span className="px-3 py-1 bg-slate-200/50 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Bắt đầu cuộc hội thoại
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {_.map(messages, (m) => {
          const senderType = getMessageSender(m);
          const isCustomer = senderType === "customer";
          const isSystem = senderType === "system";
          const isNew = m.id === latestMessageId && !isCustomer;
          const isDeleted = isMessageDeleted(m, currentUsername);
          
          if (isSystem) {
            return (
              <div key={m.id} className="flex justify-center my-2">
                <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[11px] font-medium">
                  {m.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              id={`message-${m.id}`}
              className={`flex w-full group animate-in fade-in duration-300 ${isCustomer ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[85%] sm:max-w-[70%] ${isCustomer ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className="flex-shrink-0 mt-auto mb-5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm bg-slate-200 flex items-center justify-center">
                    {getMessageSenderAvatar(m) ? (
                      <img src={getMessageSenderAvatar(m)} className="w-full h-full object-cover" alt="avt" />
                    ) : (
                      <User size={14} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] font-bold text-slate-400 mb-1 px-1 uppercase tracking-tight">
                    {getMessageSenderName(m)}
                  </span>

                  <div className={`flex items-center gap-1 ${isCustomer ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Message Bubble */}
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-300 ${
                        isCustomer
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-tr-none"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      } ${isNew ? "ring-2 ring-orange-500 ring-offset-2" : ""}`}
                    >
                      {/* Reply Link */}
                      {m.replyToMessage && (
                        <div className={`mb-2 pl-2 border-l-2 text-[11px] opacity-80 cursor-pointer line-clamp-1 ${isCustomer ? "border-white/40" : "border-slate-300"}`}>
                           <span className="font-bold block">Đang trả lời:</span>
                           {m.replyToMessage.content || "[Hình ảnh/Tệp]"}
                        </div>
                      )}

                      {isDeleted ? (
                        <div className="flex items-center gap-2 text-sm italic opacity-70">
                          <RotateCcw size={14} />
                          <span>Tin nhắn đã bị thu hồi</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {m.isEdited && <span className="text-[9px] font-bold uppercase opacity-50">(Đã sửa)</span>}
                          <MessageContent message={m} />
                        </div>
                      )}

                      {/* Footer inside bubble */}
                      <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] font-bold tracking-tighter ${isCustomer ? "text-white/60" : "text-slate-400"}`}>
                        <span>{formatTime(m.sentAt)}</span>
                        {isCustomer && (
                          <span className="flex items-center">
                            {m.status === "READ" ? <CheckCheck size={10} /> : <Check size={10} />}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Button (Dropdown placeholder) */}
                    {!isDeleted && (
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:bg-slate-200 rounded-full transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && activeConversationId && (
        <TypingIndicator userIds={typingUsers} conversationId={activeConversationId} />
      )}
      
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};