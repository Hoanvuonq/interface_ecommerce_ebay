"use client";

import React from "react";
import _ from "lodash";

interface TypingIndicatorProps {
  userIds: string[];
  conversationId: string;
  users?: Array<{
    userId: string;
    username: string;
    image?: string;
  }>;
}


export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userIds,
  users,
}) => {
  if (_.isEmpty(userIds)) return null;

  const getUserData = (userId: string) => {
    return _.find(users, { userId });
  };

  const getUserName = (userId: string) => {
    return _.get(getUserData(userId), "username", "Ai đó");
  };

  const getUserAvatar = (userId: string) => {
    return _.get(getUserData(userId), "image");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {userIds.length === 1 ? (
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 shrink-0 bg-slate-200 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center">
            {getUserAvatar(userIds[0]) ? (
              <img
                src={getUserAvatar(userIds[0])}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {getUserName(userIds[0])[0]}
              </span>
            )}
          </div>
          
          <span className="text-xs italic text-slate-400">
            <span className="font-semibold not-italic">{getUserName(userIds[0])}</span> đang gõ...
          </span>
        </div>
      ) : (
        <span className="text-xs italic text-slate-400 font-medium">
          {userIds.length} người đang gõ...
        </span>
      )}

      {/* Bộ ba chấm động - Tận dụng Tailwind hoặc CSS Animation */}
      <div className="flex items-center gap-1 ml-1 pt-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
      </div>

      {/* Global CSS để tinh chỉnh animation mượt hơn (nếu không dùng Tailwind animate-bounce) */}
      <style jsx>{`
        .animate-bounce {
          animation: typing-bounce 1s infinite ease-in-out;
        }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
