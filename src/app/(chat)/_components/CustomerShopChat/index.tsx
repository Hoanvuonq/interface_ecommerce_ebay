"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import _ from "lodash";
import { ConversationList } from "../ConversationList";
import { ChatEmptyState } from "../ChatEmptyState";
import { ChatHeader } from "../ChatHeader";
import { ChatInputArea } from "../ChatInputArea";
import { OrderPicker } from "../OrderPicker";
import { ProductPicker } from "../ProductPicker";
import { MessageList } from "../MessageList";
import { DeleteMessageModal } from "../DeleteMessageModal";
import { ChatLoginAlert } from "../ChatLoginAlert";
import { useChatStore } from "../../_store/chatStore";
import { useChatLogic } from "../../_hooks/chat/useChatLogic";
import {
  useChatWebSocket,
  useWebSocketContext,
} from "@/providers/WebSocketProvider";
import { getStoredUserDetail } from "@/utils/jwt";
import { isMessageDeleted } from "../../_services/chat-utils.service";
import { CustomerShopChatProps, resolveOrderItemImageUrl } from "../../_types/customerShopChat.type";

export const CustomerShopChat: React.FC<CustomerShopChatProps> = ({
  open,
  onClose,
  height = 640,
  targetShopId,
}) => {
  const store = useChatStore();
  const chatLogic = useChatLogic(targetShopId);

  const messagesEndRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const messagesContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<any>(null);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<any>(null);

  const { connected: wsConnected, subscribeToPersonalMessages } =
    useChatWebSocket();
  const { connect, disconnect } = useWebSocketContext();
  const currentUserId = getStoredUserDetail()?.userId;

  useEffect(() => {
    if (!open || !wsConnected) return;
    const unsub = subscribeToPersonalMessages((msg: any) => {
      if (msg.type === "NEW_MESSAGE") {
        store.addRealtimeMessage(msg.data.conversationId, msg.data);
      } else if (msg.type === "MESSAGE_DELETED") {
        store.updateMessageInList(msg.data.conversationId, msg.data.messageId, {
          deletedAt: new Date().toISOString(),
          content: "",
          deletedType: "DELETE_FOR_EVERYONE",
        });
      }
    });
    return () => unsub();
  }, [open, wsConnected]);

  useEffect(() => {
    if (open) {
      connect();
      if (targetShopId) {
        const targetConv = store.conversations.find((c) =>
          c.participants?.some((p) => p.user?.userId === targetShopId)
        );
        if (targetConv) store.setActiveConversation(targetConv.id, targetConv);
      }
    }
    return () => {
      if (open) disconnect();
    };
  }, [open, targetShopId]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (
      container &&
      container.scrollTop < 50 &&
      chatLogic.hasMoreMessages &&
      !chatLogic.isLoadingMore
    ) {
      chatLogic.loadMoreMessages();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1000 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-slate-500 hover:text-red-500 transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex h-full overflow-hidden">
          <ConversationList
            conversations={store.conversations}
            selectedConversationId={store.activeConversationId ?? undefined}
            onSelect={(c) => {
              if (!c.id) return;
              store.setActiveConversation(c.id, c);
              store.setUiState({ isMobileChatView: true });
            }}
            searchText={store.searchText}
            onSearchChange={(val) => store.setUiState({ searchText: val })}
            height={height}
            isMobileView={store.isMobileChatView}
            getShopAvatar={chatLogic.getShopAvatar}
            getShopName={chatLogic.getShopName}
          />

          <div
            className={`flex-1 flex flex-col bg-slate-50 relative ${
              store.isMobileChatView ? "block" : "hidden md:flex"
            }`}
          >
            {store.selectedConversation ? (
              <>
                <ChatHeader
                  selectedConversation={store.selectedConversation}
                  currentUserId={currentUserId}
                  wsConnected={wsConnected}
                  onBackMobile={() =>
                    store.setUiState({ isMobileChatView: false })
                  }
                  getShopAvatar={chatLogic.getShopAvatar}
                  getShopName={chatLogic.getShopName}
                />
                {!currentUserId && <ChatLoginAlert />}
                <MessageList
                  messages={chatLogic.messages}
                  currentUserId={currentUserId}
                  isInitializing={chatLogic.isInitializing}
                  isLoadingMore={chatLogic.isLoadingMore}
                  hasMoreMessages={chatLogic.hasMoreMessages}
                  typingUsers={chatLogic.typingUsers}
                  activeConversationId={store.activeConversationId ?? null}
                  latestMessageId={chatLogic.latestMessageId ?? null}
                  messagesContainerRef={messagesContainerRef ?? null}
                  messagesEndRef={messagesEndRef}
                  onScroll={handleScroll}
                  getMessageSender={(m) =>
                    m.user?.userId === currentUserId ? "customer" : "shop"
                  }
                  getMessageSenderName={(m) => m.user?.username || "Shop"}
                  getMessageSenderAvatar={(m) => m.user?.image}
                  formatTime={(ts) => ts}
                  isMessageDeleted={(m, username) =>
                    isMessageDeleted(m as any, username)
                  }
                  getMessageMenuItems={(m, isMine) =>
                    [
                      {
                        key: "reply",
                        label: "Trả lời",
                        onClick: () => store.setReplyingTo(m),
                      },
                      isMine && {
                        key: "revoke",
                        label: "Thu hồi",
                        danger: true,
                        onClick: () => setDeleteConfirmMsg(m),
                      },
                    ].filter(Boolean)
                  }
                  currentUsername={getStoredUserDetail()?.username}
                />
                {store.showOrderPicker && (
                  <div className="absolute bottom-full left-0 right-0 z-20">
                    <OrderPicker
                      orders={chatLogic.orders}
                      isLoading={chatLogic.loadingOrders}
                      searchText={store.orderSearchText}
                      onSearchChange={(val) =>
                        store.setUiState({ orderSearchText: val })
                      }
                      onClose={() =>
                        store.setUiState({ showOrderPicker: false })
                      }
                      onSendDirect={(order) => {}}
                      resolveOrderItemImageUrl={resolveOrderItemImageUrl}
                      isVisible={store.showOrderPicker}
                      onViewDetails={(order) => {}}
                      isSending={false}
                      getStatusText={(order) =>
                        typeof order === "object" && "statusText" in order
                          ? (order as any).statusText || ""
                          : ""
                      }
                    />
                  </div>
                )}
                {store.showProductPicker && (
                  <div className="absolute bottom-full left-0 right-0 z-20">
                    <ProductPicker
                      isVisible={store.showProductPicker}
                      onClose={() =>
                        store.setUiState({ showProductPicker: false })
                      }
                      products={chatLogic.products}
                      isLoading={chatLogic.loadingProducts}
                      searchText={store.productSearchText}
                      onSearchChange={(val) =>
                        store.setUiState({ productSearchText: val })
                      }
                      onSendDirect={(prod) => {}}
                      isSending={chatLogic.isSending}
                      onViewDetails={(prod) => {
                        window.open(`/products/${prod.id}`, "_blank");
                      }}
                    />
                  </div>
                )}
                <ChatInputArea
                  inputRef={inputRef}
                  messageText={store.messageText}
                  setMessageText={(val) =>
                    store.setUiState({ messageText: val })
                  }
                  onSendMessage={() => chatLogic.onSendMessage()}
                  sendingMessage={chatLogic.isSending}
                  isUploading={false}
                  showEmojiPicker={store.showEmojiPicker}
                  setShowEmojiPicker={(val) =>
                    store.setUiState({ showEmojiPicker: val })
                  }
                  onEmojiClick={(e) =>
                    store.setUiState({
                      messageText: store.messageText + e.emoji,
                    })
                  }
                  replyingToMessage={store.replyingToMessage}
                  editingMessage={store.editingMessage}
                  attachments={store.attachments}
                  onAttachmentChange={(e) => {
                    if (e.target.files) store.addAttachments(e.target.files);
                  }}
                  onRemoveAttachment={(id) => store.removeAttachment(id)}
                  toggleOrderPicker={() =>
                    store.setUiState({
                      showOrderPicker: !store.showOrderPicker,
                    })
                  }
                  toggleProductPicker={() =>
                    store.setUiState({
                      showProductPicker: !store.showProductPicker,
                    })
                  }
                  disabled={!currentUserId}
                />
              </>
            ) : (
              <ChatEmptyState
                onStartChat={() =>
                  store.setUiState({ isMobileChatView: false })
                }
                onSearchFocus={() => {}}
                hasConversations={store.conversations.length > 0}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteMessageModal
        isOpen={!!deleteConfirmMsg}
        onCancel={() => setDeleteConfirmMsg(null)}
        onConfirm={() => {
          if (deleteConfirmMsg) chatLogic.onRevokeMessage(deleteConfirmMsg.id);
          setDeleteConfirmMsg(null);
        }}
      />
    </div>
  );
};
