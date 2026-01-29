"use client";

import {
  useChatWebSocket,
  useWebSocketContext,
} from "@/providers/WebSocketProvider";
import { getStoredUserDetail } from "@/utils/jwt";
import React, { useEffect, useRef, useState } from "react";
import { useChatLogic } from "../../_hooks/chat/useChatLogic";
import { isMessageDeleted } from "../../_services/chat-utils.service";
import { useChatStore } from "../../_store/chatStore";
import {
  CustomerShopChatProps,
  resolveOrderItemImageUrl,
} from "../../_types/customerShopChat.type";
import { ChatEmptyState } from "../ChatEmptyState";
import { ChatHeader } from "../ChatHeader";
import { ChatInputArea } from "../ChatInputArea";
import { ChatLoginAlert } from "../ChatLoginAlert";
import { ConversationList } from "../ConversationList";
import { DeleteMessageModal } from "../DeleteMessageModal";
import { MessageList } from "../MessageList";
import { OrderPicker } from "../OrderPicker";
import { ProductPicker } from "../ProductPicker";
import { PortalModal } from "@/features/PortalModal"; 

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
      const user = getStoredUserDetail();
      // 💡 Chỉ kết nối nếu có Token hợp lệ
      if (user?.accessToken) {
        connect();
      } else {
        console.warn(
          "[Chat] No access token found, skipping WebSocket connection"
        );
      }
    }
    return () => {
      if (open) disconnect();
    };
  }, [open]);

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
            onClose={onClose}
            onSearchChange={(val) => store.setUiState({ searchText: val })}
            height={height}
            isMobileView={store.isMobileChatView}
            getShopAvatar={chatLogic.getShopAvatar}
            getShopName={chatLogic.getShopName}
          />

          <div
            className={`flex-1 flex flex-col bg-gray-50 relative overflow-hidden ${
              store.isMobileChatView ? "flex" : "hidden md:flex"
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

                <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
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

                  <OrderPicker
                    isVisible={store.showOrderPicker}
                    orders={chatLogic.orders.map((order) => ({
                      ...order,
                      grandTotal: order.grandTotal ?? 0,
                    }))}
                    isLoading={chatLogic.loadingOrders}
                    searchText={store.orderSearchText}
                    onSearchChange={(val) =>
                      store.setUiState({ orderSearchText: val })
                    }
                    onClose={() => store.setUiState({ showOrderPicker: false })}
                    onSendDirect={(order) => {
                      chatLogic.onSendOrderCard(
                        order.orderId,
                        `Tôi muốn hỏi về đơn hàng: ${order.orderNumber}`
                      );
                      store.setUiState({ showOrderPicker: false });
                    }}
                    resolveOrderItemImageUrl={resolveOrderItemImageUrl}
                    onViewDetails={(order) => {}}
                    isSending={chatLogic.isSending}
                    getStatusText={(order) =>
                      typeof order === "object" && "statusText" in order
                        ? (order as any).statusText || ""
                        : ""
                    }
                  />

                  <ProductPicker
                    isVisible={store.showProductPicker}
                    products={chatLogic.products}
                    isLoading={chatLogic.loadingProducts}
                    searchText={store.productSearchText}
                    onSearchChange={(val) =>
                      store.setUiState({ productSearchText: val })
                    }
                    onClose={() =>
                      store.setUiState({ showProductPicker: false })
                    }
                    onSendDirect={(prod) => {
                      chatLogic.onSendProductCard(
                        prod.id,
                        `Tôi muốn hỏi về sản phẩm: ${prod.name}`
                      );
                      store.setUiState({ showProductPicker: false });
                    }}
                    isSending={chatLogic.isSending}
                    onViewDetails={(prod) => {
                      window.open(`/products/${prod.id}`, "_blank");
                    }}
                  />
                </div>

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
                      showProductPicker: false,
                    })
                  }
                  toggleProductPicker={() =>
                    store.setUiState({
                      showProductPicker: !store.showProductPicker,
                      showOrderPicker: false,
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

      <PortalModal
        isOpen={!!deleteConfirmMsg}
        onClose={() => setDeleteConfirmMsg(null)}
        title="Xác nhận thu hồi"
        width="max-w-sm"
      >
        <div className="p-4 text-center">
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn thu hồi tin nhắn này đối với mọi người không?
          </p>
          <div className="flex gap-3">
            <button
              className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-500"
              onClick={() => setDeleteConfirmMsg(null)}
            >
              Hủy
            </button>
            <button
              className="flex-1 py-2 rounded-xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-200"
              onClick={() => {
                if (deleteConfirmMsg)
                  chatLogic.onRevokeMessage(deleteConfirmMsg.id);
                setDeleteConfirmMsg(null);
              }}
            >
              Thu hồi
            </button>
          </div>
        </div>
      </PortalModal>
    </div>
  );
};
