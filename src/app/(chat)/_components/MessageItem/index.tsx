"use client";

import { useEffect, useRef, useState } from "react";
import type { Message as ChatMessage } from "../../_types/chat.type";
import { MenuItem } from "../MessageList/type";
import Image from "next/image";
import {
  Check,
  CheckCheck,
  MoreHorizontal,
  Reply,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import { MessageContent } from "../MessageContent";
import { cn } from "@/utils/cn";

export const MessageItem = ({
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
        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-semibold tracking-wide">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full group mb-4 animate-in fade-in duration-300 slide-in-from-bottom-1",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-2.5 max-w-[85%] md:max-w-[75%]",
          isMine ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar Section */}
        <div className="shrink-0 mt-auto mb-1">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center relative">
            {avatar ? (
              <Image
                src={avatar}
                alt={`${senderName}'s avatar`}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <User size={14} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Message Body */}
        <div className={cn("flex flex-col min-w-0", isMine ? "items-end" : "items-start")}>
          <span className="text-[10px] font-bold text-gray-400 mb-1 px-2 uppercase tracking-tighter select-none">
            {senderName}
          </span>

          <div
            className={cn(
              "relative flex items-end gap-2 group/bubble",
              isMine ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "relative px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words transition-all duration-200",
                isMine
                  ? "bg-gray-200 text-black rounded-tr-none" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none",
                isDeleted && "opacity-60 bg-gray-50 border-dashed border-gray-300 text-gray-700 shadow-none"
              )}
            >
              {/* Reply Section */}
              {message.replyToMessage && !isDeleted && (
                <div
                  className={cn(
                    "mb-2 pl-2 border-l-2 text-[11px] py-1 px-2 rounded-r-md transition-opacity",
                    isMine 
                      ? "border-slate-400 bg-white/10" // Trả lời trong block xám của mình
                      : "border-slate-500 bg-slate-100" // Trả lời trong block trắng của người khác
                  )}
                >
                  <span className="font-black block text-[8px] uppercase mb-0.5 opacity-60">
                    Đang trả lời
                  </span>
                  <p className="line-clamp-1 italic opacity-80">
                    {message.replyToMessage.content || "[Đính kèm]"}
                  </p>
                </div>
              )}

              {/* Main Content */}
              {isDeleted ? (
                <div className="flex items-center gap-2 italic text-xs py-1 opacity-80">
                  <RotateCcw size={12} />
                  <span>Tin nhắn đã thu hồi</span>
                </div>
              ) : (
                <div className="leading-relaxed">
                  <MessageContent message={message} />
                </div>
              )}

              {/* Status & Time */}
              <div
                className={cn(
                  "flex items-center justify-end gap-1.5 mt-1.5 text-[9px] font-bold select-none",
                  isMine ? "text-slate-300" : "text-gray-600"
                )}
              >
                <span>{formatTime(message.sentAt)}</span>
                {isMine && (
                  <span className="ml-0.5">
                    {message.status === "READ" ? (
                      <CheckCheck size={11} className="text-sky-400" />
                    ) : (
                      <Check size={11} />
                    )}
                  </span>
                )}
                {message.isEdited && !isDeleted && (
                  <span className="text-[8px] font-black uppercase ml-1 opacity-50 bg-black/5 px-1 rounded-sm">
                    Đã sửa
                  </span>
                )}
              </div>
            </div>

            {!isDeleted && menuItems.length > 0 && (
              <div
                className="relative opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 self-center"
                ref={menuRef}
              >
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={cn(
                    "p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-all",
                    showMenu && "bg-gray-100 text-gray-600 opacity-100"
                  )}
                >
                  <MoreHorizontal size={16} />
                </button>

                {showMenu && (
                  <div
                    className={cn(
                      "absolute bottom-full mb-2 z-50 min-w-[140px] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                      isMine ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left"
                    )}
                  >
                    {menuItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                          setShowMenu(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[11px] font-bold flex items-center gap-3 hover:bg-gray-50 transition-colors uppercase tracking-tight",
                          item.danger ? "text-red-500 hover:bg-red-50" : "text-gray-600"
                        )}
                      >
                        {item.key === "reply" && <Reply size={13} strokeWidth={2.5} />}
                        {item.key === "revoke" && <Trash2 size={13} strokeWidth={2.5} />}
                        {item.key === "edit" && <span className="text-xs">✏️</span>}
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