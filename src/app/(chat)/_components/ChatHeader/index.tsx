"use client";

import React from "react";
import { ArrowLeft, MoreVertical, Wifi, WifiOff } from "lucide-react";
import _ from "lodash";

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
  const shopEmail = _.get(
    _.find(selectedConversation?.participants, (p) => p.user?.userId !== currentUserId),
    "user.email",
    ""
  );

  return (
    <div className="p-3 border-b bg-white flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBackMobile}
          className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
            {getShopAvatar(selectedConversation) ? (
              <img src={getShopAvatar(selectedConversation)} className="w-full h-full object-cover" alt="shop" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                <span className="text-xs font-bold uppercase">{getShopName(selectedConversation)[0]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-bold text-slate-800 truncate">
            {getShopName(selectedConversation)}
          </h4>
          <div className="flex items-center gap-2">
            {shopEmail && <span className="text-[10px] text-slate-400 truncate max-w-30">{shopEmail}</span>}
            
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
              wsConnected ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
            }`}>
              {wsConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
              {wsConnected ? "Trực tuyến" : "Mất kết nối"}
            </div>
          </div>
        </div>
      </div>

      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
        <MoreVertical size={20} />
      </button>
    </div>
  );
};