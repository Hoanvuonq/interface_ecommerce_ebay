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
  Trash2
} from "lucide-react";
import type { Message as ChatMessage } from "../../_types/chat.type";
import { MessageContent } from "../MessageContent"; 
import { TypingIndicator } from "../TypingIndicator";

// 1. Định nghĩa kiểu cho Menu Item
interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

// 2. Định nghĩa Props khớp với file cha
interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isInitializing: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  typingUsers?: string[];
  activeConversationId: string | null;
  latestMessageId?: string | null;
  
  // Refs
    messagesContainerRef: RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  
  // Helpers
  getMessageSender: (m: ChatMessage) => "customer" | "shop" | "system";
  getMessageSenderName: (m: ChatMessage) => string;
  getMessageSenderAvatar: (m: ChatMessage) => string | undefined;
  formatTime: (ts: string) => string;
  isMessageDeleted: (m: ChatMessage, username?: string) => boolean;
  getMessageMenuItems: (m: ChatMessage, isMine: boolean) => (MenuItem | boolean | undefined)[];
  currentUsername?: string;
  
  // Props thừa (để tương thích nếu chưa clean hết file cũ)
  isLoadingMessages?: boolean;
}

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
  currentUsername
}) => {
  
  // --- Loading State ---
  if (isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Đang tải cuộc trò chuyện...</span>
      </div>
    );
  }

  // --- Empty State ---
  if (_.isEmpty(messages)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-200">
          <User size={32} />
        </div>
        <p className="text-slate-500 font-medium">Chưa có tin nhắn nào</p>
        <p className="text-xs text-slate-400 mt-1">Hãy bắt đầu cuộc trò chuyện ngay!</p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-6 scroll-smooth"
    >
      {/* Loading More Spinner */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 gap-2 text-slate-400 animate-in slide-in-from-top-2">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs font-medium">Đang tải tin nhắn cũ...</span>
        </div>
      )}

      {/* Render Messages */}
      <div className="flex flex-col gap-4">
        {messages.map((m) => {
          const senderType = getMessageSender(m);
          const isMine = senderType === 'customer'; // Hoặc check ID trực tiếp
          const menuItems = getMessageMenuItems(m, isMine).filter(Boolean) as MenuItem[];

          return (
            <MessageItem
              key={m.id}
              message={m}
              isMine={isMine}
              isSystem={senderType === 'system'}
              isDeleted={isMessageDeleted(m, currentUsername)}
              senderName={getMessageSenderName(m)}
              avatar={getMessageSenderAvatar(m)}
              formatTime={formatTime}
              menuItems={menuItems}
            />
          );
        })}
      </div>

      {/* Typing Indicator */}
      {typingUsers && typingUsers.length > 0 && activeConversationId && (
         <div className="px-4 py-2">
            <TypingIndicator userIds={typingUsers} conversationId={activeConversationId} />
         </div>
      )}

      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};

// --- Sub Component: Message Item (Tách ra để quản lý menu state) ---
const MessageItem = ({ 
    message, isMine, isSystem, isDeleted, senderName, avatar, formatTime, menuItems 
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
            <div className="flex justify-center my-2">
                <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-medium border border-slate-300">
                    {message.content}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex w-full group ${isMine ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}>
            <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0 mt-auto">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm bg-slate-200 flex items-center justify-center">
                        {avatar ? (
                            <img src={avatar} className="w-full h-full object-cover" alt="avt" />
                        ) : (
                            <User size={16} className="text-slate-400" />
                        )}
                    </div>
                </div>

                {/* Content Block */}
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} min-w-0`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1 uppercase tracking-tight">
                        {senderName}
                    </span>

                    <div className={`relative flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        
                        {/* Bubble */}
                        <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words ${
                            isMine 
                            ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-tr-none" 
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                        } ${isDeleted ? "opacity-75 bg-slate-100 border-dashed border-slate-300 text-slate-500" : ""}`}>
                            
                            {/* Reply Context */}
                            {message.replyToMessage && (
                                <div className={`mb-2 pl-2 border-l-2 text-[11px] opacity-90 cursor-pointer line-clamp-1 ${isMine ? "border-white/50" : "border-orange-500"}`}>
                                    <span className="font-bold block text-[9px] uppercase mb-0.5 opacity-80">Đang trả lời</span>
                                    {message.replyToMessage.content || "[Đính kèm]"}
                                </div>
                            )}

                            {/* Main Content */}
                            {isDeleted ? (
                                <div className="flex items-center gap-2 italic text-xs">
                                    <RotateCcw size={14} />
                                    <span>Tin nhắn đã thu hồi</span>
                                </div>
                            ) : (
                                <MessageContent message={message} />
                            )}

                            {/* Footer */}
                            <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] font-bold tracking-tighter ${isMine ? "text-white/70" : "text-slate-400"}`}>
                                <span>{formatTime(message.sentAt)}</span>
                                {isMine && (
                                    <span>
                                        {message.status === "READ" ? <CheckCheck size={12} /> : <Check size={12} />}
                                    </span>
                                )}
                                {message.isEdited && <span className="uppercase opacity-70 ml-1">(Đã sửa)</span>}
                            </div>
                        </div>

                        {/* Action Menu Trigger (Only show if not deleted & has items) */}
                        {!isDeleted && menuItems.length > 0 && (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setShowMenu(!showMenu)}
                                    className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-all ${showMenu ? 'opacity-100 bg-slate-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                
                                {/* Custom Dropdown Menu */}
                                {showMenu && (
                                    <div className={`absolute bottom-full mb-2 z-50 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isMine ? 'right-0 origin-bottom-right' : 'left-0 origin-bottom-left'}`}>
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.key}
                                                onClick={() => {
                                                    item.onClick();
                                                    setShowMenu(false);
                                                }}
                                                className={`w-full text-left px-3 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'}`}
                                            >
                                                {item.key === 'reply' && <Reply size={14} />}
                                                {item.key === 'revoke' && <Trash2 size={14} />}
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