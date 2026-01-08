"use client";

import _ from "lodash";
import { ChevronLeft, MoreVertical, Wifi, WifiOff } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ChatHeaderProps {
  selectedConversation: any;
  currentUserId?: string;
  wsConnected: boolean;
  onBackMobile: () => void;
  getShopAvatar: (c: any) => string | undefined;
  getShopName: (c: any) => string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedConversation,
  currentUserId,
  wsConnected,
  onBackMobile,
  getShopAvatar,
  getShopName,
}) => {
  const avatarSrc = getShopAvatar(selectedConversation);
  const shopEmail = _.get(
    _.find(
      selectedConversation?.participants,
      (p) => p.user?.userId !== currentUserId
    ),
    "user.email",
    ""
  );

  return (
    <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={onBackMobile}
          className="p-2 md:hidden cursor-pointer text-gray-600 hover:text-orange-600 hover:bg-amber-50 rounded-lg transition-colors hover:scale-105 focus:outline-none"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                alt="shop"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                <span className="text-xs font-bold uppercase">
                  {getShopName(selectedConversation)[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex gap-6 items-center">
            <h4 className="text-md font-bold text-gray-800 truncate">
              {getShopName(selectedConversation)}
            </h4>
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                wsConnected
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {wsConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
              {wsConnected ? "Trực tuyến" : "Mất kết nối"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {shopEmail && (
              <span className="text-[12px] text-gray-600 truncate max-w-50">
                {shopEmail}
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-full">
        <MoreVertical size={20} />
      </button>
    </div>
  );
};
