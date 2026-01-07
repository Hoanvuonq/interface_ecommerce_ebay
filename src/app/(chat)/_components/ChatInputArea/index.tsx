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
  FileText,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ChatAttachment } from "../../_store/chatStore";
import { cn } from "@/utils/cn";
import { ButtonField } from "@/components";
import Image from "next/image";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ChatInputAreaProps {
  messageText: string;
  setMessageText: (val: string) => void;
  onSendMessage: () => void;
  onAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  isUploading: boolean;
  sendingMessage: boolean;
  disabled: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  onEmojiClick: (emojiData: any) => void;
  toggleOrderPicker: () => void;
  toggleProductPicker: () => void;
  showQuickReplies?: boolean;
  setShowQuickReplies?: (val: boolean) => void;
  editingMessage: any;
  replyingToMessage: any;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  messageText,
  setMessageText,
  onSendMessage,
  onAttachmentChange,
  attachments = [],
  onRemoveAttachment,
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
    <div className="px-4 py-4 bg-white border-t border-gray-100 shrink-0 relative">
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-3 pb-2 custom-scrollbar">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group w-16 h-16 shrink-0 border rounded-lg overflow-hidden custom-scrollbar bg-gray-100"
            >
              {att.type.includes("image") ? (
                <Image
                  src={att.previewUrl}
                  alt="preview"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video size={20} className="text-gray-600" />
                </div>
              )}
              <button
                onClick={() => onRemoveAttachment(att.id)}
                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          rows={1}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            editingMessage
              ? "Chỉnh sửa tin nhắn..."
              : replyingToMessage
              ? "Trả lời tin nhắn..."
              : "Nhập tin nhắn..."
          }
          className="w-full  border-none text-sm outline-none transition-all custom-scrollbar resize-none max-h-32"
          style={{ minHeight: "60px" }}
        />
      </div>
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-1 mb-1">
          {setShowQuickReplies && (
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                showQuickReplies
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "bg-gray-50 text-gray-600 hover:text-orange-500"
              }`}
              title="Tin nhắn mẫu"
            >
              <FileText size={18} />
            </button>
          )}

          <label className="p-2 cursor-pointer rounded-xl bg-gray-50 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all">
            <ImageIcon size={18} />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onAttachmentChange}
            />
          </label>

          <label className="p-2 cursor-pointer rounded-xl bg-gray-50 text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-all">
            <Video size={18} />
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={onAttachmentChange}
            />
          </label>

          <button
            onClick={toggleOrderPicker}
            className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={toggleProductPicker}
            className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <Info size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-xl transition-all ${
                showEmojiPicker
                  ? "bg-amber-100 text-amber-600"
                  : "bg-gray-50 text-gray-600 hover:text-amber-500"
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

       
         <ButtonField
          htmlType="submit"
          type="login"
           onClick={onSendMessage}
          disabled={
            disabled || (!messageText.trim() && attachments.length === 0)
          }
          className="flex w-14 items-center gap-2 px-5 py-4 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-8"
        >
          <span className="flex items-center gap-2">
            {sendingMessage || isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} fill="currentColor" className="ml-0.5" />
          )}
          </span>
        </ButtonField>

      </div>
    </div>
  );
};
