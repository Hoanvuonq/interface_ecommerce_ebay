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
        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-[10px] font-bold tracking-wide uppercase">
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
          "flex gap-3 max-w-[85%] md:max-w-[75%]",
          isMine ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar Section */}
        <div className="shrink-0 mt-auto mb-1">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center relative">
            {avatar ? (
              <Image
                src={avatar}
                alt={`${senderName}'s avatar`}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <User size={16} className="text-gray-500" />
            )}
          </div>
        </div>

        {/* Message Body */}
        <div
          className={cn(
            "flex flex-col min-w-0",
            isMine ? "items-end" : "items-start"
          )}
        >
          <span className="text-[11px] font-black text-gray-500 mb-1 px-1 uppercase tracking-wider select-none">
            {senderName}
          </span>

          <div
            className={cn(
              "relative flex items-center gap-2 group/bubble",
              isMine ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "relative px-4 py-3 rounded-2xl shadow-md text-[14px] break-words transition-all duration-200 leading-relaxed",
                isMine
                  ? "bg-slate-800 text-white rounded-tr-none shadow-slate-200"
                  : "bg-white border border-gray-200 text-slate-900 rounded-tl-none shadow-gray-100",
                isDeleted &&
                  "opacity-50 bg-gray-50 border-dashed border-gray-300 text-gray-500 shadow-none"
              )}
            >
              {/* Reply Section */}
              {message.replyToMessage && !isDeleted && (
                <div
                  className={cn(
                    "mb-2 pl-3 border-l-4 text-[12px] py-1.5 px-3 rounded-r-lg transition-opacity",
                    isMine
                      ? "border-orange-400 bg-white/10 text-gray-200"
                      : "border-slate-300 bg-slate-50 text-slate-600"
                  )}
                >
                  <span className="font-black block text-[9px] uppercase mb-0.5 opacity-70 tracking-tight">
                    Đang trả lời
                  </span>
                  <p className="line-clamp-1 italic">
                    {message.replyToMessage.content || "[Đính kèm]"}
                  </p>
                </div>
              )}

              {/* Main Content */}
              {isDeleted ? (
                <div className="flex items-center gap-2 italic text-xs py-1">
                  <RotateCcw size={13} className="opacity-70" />
                  <span>Tin nhắn đã được thu hồi</span>
                </div>
              ) : (
                <div className="font-medium">
                  <MessageContent message={message} />
                </div>
              )}

              {/* Status & Time */}
              <div
                className={cn(
                  "flex items-center justify-end gap-1.5 mt-2 text-[10px] font-bold select-none opacity-80",
                  isMine ? "text-slate-400" : "text-gray-500"
                )}
              >
                <span>{formatTime(message.sentAt)}</span>
                {isMine && (
                  <span className="ml-0.5">
                    {message.status === "READ" ? (
                      <CheckCheck
                        size={13}
                        className="text-sky-400 shadow-sm"
                      />
                    ) : (
                      <Check size={13} className="text-gray-400" />
                    )}
                  </span>
                )}
                {message.isEdited && !isDeleted && (
                  <span className="text-[9px] font-black uppercase ml-1 px-1.5 py-0.5 rounded-md bg-black/20 text-white/90">
                    Đã sửa
                  </span>
                )}
              </div>
            </div>

            {/* Menu Action Button */}
            {!isDeleted && menuItems.length > 0 && (
              <div
                className="relative opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 shrink-0"
                ref={menuRef}
              >
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={cn(
                    "p-2 rounded-full hover:bg-white hover:shadow-md text-gray-400 transition-all border border-transparent",
                    showMenu &&
                      "bg-white shadow-md text-orange-500 border-orange-100 opacity-100"
                  )}
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMenu && (
                  <div
                    className={cn(
                      "absolute bottom-full mb-3 z-[60] min-w-[160px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                      isMine
                        ? "right-0 origin-bottom-right"
                        : "left-0 origin-bottom-left"
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
                          "w-full text-left px-4 py-2.5 text-[12px] font-black flex items-center gap-3 hover:bg-orange-50 transition-colors uppercase tracking-wide",
                          item.danger
                            ? "text-red-500 hover:bg-red-50"
                            : "text-slate-700 hover:text-orange-600"
                        )}
                      >
                        {item.key === "reply" && (
                          <Reply size={14} strokeWidth={3} />
                        )}
                        {item.key === "revoke" && (
                          <Trash2 size={14} strokeWidth={3} />
                        )}
                        {item.key === "edit" && (
                          <span className="text-sm">✏️</span>
                        )}
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
