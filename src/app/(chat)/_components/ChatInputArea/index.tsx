"use client";

import React from "react";
import _ from "lodash";
import { 
  Image as ImageIcon, 
  Video, 
  ShoppingCart, 
  Info, 
  Smile, 
  Send, 
  Loader2,
  FileText
} from "lucide-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ChatInputAreaProps {
  messageText: string;
  setMessageText: (val: string) => void;
  onSendMessage: () => void;
  onAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  sendingMessage: boolean;
  disabled: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  onEmojiClick: (emojiData: any) => void;
  toggleOrderPicker: () => void;
  toggleProductPicker: () => void;
  showQuickReplies: boolean;
  setShowQuickReplies: (val: boolean) => void;
  editingMessage: any;
  replyingToMessage: any;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  messageText,
  setMessageText,
  onSendMessage,
  onAttachmentChange,
  isUploading,
  sendingMessage,
  disabled,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  toggleOrderPicker,
  toggleProductPicker,
  setShowQuickReplies,
  showQuickReplies,
  editingMessage,
  replyingToMessage,
  inputRef,
}) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="px-4 py-4 bg-white border-t border-slate-100 shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1 mb-1">
          {/* Quick Reply Toggle */}
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              showQuickReplies ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-slate-50 text-slate-400 hover:text-orange-500"
            }`}
            title="Tin nhắn mẫu"
          >
            <FileText size={18} />
          </button>

          {/* Upload Image */}
          <label className="p-2 cursor-pointer rounded-xl bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
            <ImageIcon size={18} />
            <input type="file" accept="image/*" multiple className="hidden" onChange={onAttachmentChange} />
          </label>

          {/* Upload Video */}
          <label className="p-2 cursor-pointer rounded-xl bg-slate-50 text-slate-400 hover:text-purple-500 hover:bg-purple-50 transition-all">
            <Video size={18} />
            <input type="file" accept="video/*" multiple className="hidden" onChange={onAttachmentChange} />
          </label>

          {/* Order Picker */}
          <button 
            onClick={toggleOrderPicker}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
          >
            <ShoppingCart size={18} />
          </button>

          {/* Product Picker */}
          <button 
            onClick={toggleProductPicker}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <Info size={18} />
          </button>

          {/* Emoji Picker */}
          <div className="relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-xl transition-all ${
                showEmojiPicker ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-400 hover:text-amber-500"
              }`}
            >
              <Smile size={18} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-4 z-50 shadow-2xl">
                <EmojiPicker 
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  lazyLoadEmojis
                />
              </div>
            )}
          </div>
        </div>

        {/* Ô nhập liệu Text (Dùng textarea thuần) */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              editingMessage ? "Chỉnh sửa tin nhắn..." : 
              replyingToMessage ? "Trả lời tin nhắn..." : 
              "Nhập tin nhắn..."
            }
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none max-h-32"
            style={{ minHeight: '44px' }}
          />
        </div>

        <button
          onClick={onSendMessage}
          disabled={disabled || (!messageText.trim())}
          className="w-11 h-11 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all disabled:grayscale disabled:opacity-50 disabled:scale-100"
        >
          {sendingMessage || isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center mt-2 font-medium uppercase tracking-widest">
        Nhấn <span className="text-slate-600 font-bold">Enter</span> để gửi • <span className="text-slate-600 font-bold">Shift + Enter</span> để xuống dòng
      </p>
    </div>
  );
};