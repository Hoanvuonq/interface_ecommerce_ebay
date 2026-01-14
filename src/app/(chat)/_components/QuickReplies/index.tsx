"use client";

import React from "react";
import _ from "lodash";
import { ChevronUp, ChevronDown, Pin } from "lucide-react";
import { QuickReply } from "../../_types/chat.dto";
import { QUICK_REPLIES } from "../../_constants/quickReplies";

interface QuickRepliesProps {
  showQuickReplies: boolean;
  setShowQuickReplies: (show: boolean) => void;
  onSelect: (reply: QuickReply) => void;
  disabled: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  showQuickReplies,
  setShowQuickReplies,
  onSelect,
  disabled,
}) => {
  return (
    <div className="bg-white border-t border-gray-100 shrink-0">
      <button
        onClick={() => setShowQuickReplies(!showQuickReplies)}
        className="w-full px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:text-orange-500 hover:bg-orange-50/50 flex items-center justify-center gap-2 transition-all"
      >
        {showQuickReplies ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        <span>{showQuickReplies ? "Ẩn câu hỏi mẫu" : "Xem câu hỏi mẫu"}</span>
      </button>

      {showQuickReplies && (
        <div className="px-4 pb-4 pt-1 bg-gray-50/50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <Pin size={12} className="text-orange-500" />
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">
              Gợi ý cho bạn:
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {_.map(QUICK_REPLIES, (qr) => (
              <button
                key={qr.id}
                onClick={() => onSelect(qr)}
                disabled={disabled}
                className="inline-flex items-center px-3 py-2 text-xs font-semibold text-gray-600 bg-white hover:bg-orange-500 hover:text-white rounded-xl border border-gray-200 hover:border-gray-500 hover:shadow-md hover:shadow-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {qr.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};