"use client";

import { toPublicUrl } from "@/utils/storage/url";
import _ from "lodash";
import { Info, Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MessageResponse } from "../../_types/chat.dto";
import type { Message as ChatMessage } from "../../_types/chat.type";
import { AudioAttachment } from "../AudioAttachment";
import { FileAttachment } from "../FileAttachment";
import { ImageAttachment } from "../ImageAttachment";
import { VideoAttachment } from "../VideoAttachment";

interface MessageContentProps {
  message: ChatMessage | MessageResponse;
}

export const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  const router = useRouter();
  const messageType = _.toLower(_.get(message, "type", "text")) as any;
  const attachments = _.get(message, "attachments", []);
  const content = _.get(message, "content", "");

  const getMetadata = () => {
    const rawMetadata = _.get(message, "metadata");
    if (!rawMetadata) return null;
    try {
      return _.isString(rawMetadata) ? JSON.parse(rawMetadata) : rawMetadata;
    } catch (e) {
      console.error("Failed to parse metadata", e);
      return null;
    }
  };

  const renderText = (text: string, className = "") => (
    <span className={`whitespace-pre-wrap wrap-break-words ${className}`}>
      {text}
    </span>
  );

  switch (messageType) {
    case "image":
      return (
        <div className="flex flex-col gap-2">
          {!_.isEmpty(attachments) ? (
            attachments.map((att: any, idx: number) => (
              <ImageAttachment key={idx} attachment={att} />
            ))
          ) : (
            <span className="text-gray-600 italic">[Hình ảnh]</span>
          )}
          {content && renderText(content, "mt-1 text-sm")}
        </div>
      );

    case "video":
      return (
        <div className="flex flex-col gap-2">
          {!_.isEmpty(attachments) ? (
            attachments.map((att: any, idx: number) => (
              <VideoAttachment key={idx} attachment={att} />
            ))
          ) : (
            <span className="text-gray-600 italic">[Video]</span>
          )}
          {content && renderText(content, "mt-1 text-sm")}
        </div>
      );

    case "audio":
      return (
        <div className="flex flex-col gap-1">
          {!_.isEmpty(attachments) ? (
            attachments.map((att: any, idx: number) => (
              <AudioAttachment key={idx} attachment={att} />
            ))
          ) : (
            <span className="text-gray-600 italic">[Âm thanh]</span>
          )}
        </div>
      );

    case "file":
      return (
        <div className="flex flex-col gap-2">
          {!_.isEmpty(attachments) ? (
            attachments.map((att: any, idx: number) => (
              <FileAttachment key={idx} attachment={att} />
            ))
          ) : (
            <span className="text-gray-600 italic">[Tệp đính kèm]</span>
          )}
          {content && renderText(content, "mt-1 text-sm")}
        </div>
      );

    case "product":
    case "product_card": {
      const product = getMetadata();
      if (!product) return renderText(content);

      const productImageUrl = product.image ? toPublicUrl(product.image) : null;

      return (
        <div
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden min-w-65 max-w-75 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            const path = product.slug
              ? `/products/${product.slug}`
              : `/products/${product.productId}`;
            if (product.slug || product.productId) router.push(path);
          }}
        >
          <div className="px-3 py-2 bg-blue-50/50 flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-tight">
            <Info size={14} /> Sản phẩm
          </div>
          <div className="p-3 space-y-2">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              {productImageUrl ? (
                <Image
                  src={productImageUrl}
                  width={280}
                  height={157} 
                  className="w-full h-full object-cover"
                  alt={product.productName || "product"}
                />
              ) : (
                <Package className="text-gray-300 w-10 h-10" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                {product.productName}
              </p>
              <p className="text-base font-bold text-orange-500 mt-1">
                {Number(product.price || 0).toLocaleString("vi-VN")}₫
              </p>
              {product.shopName && (
                <p className="text-[11px] text-gray-600 mt-1 uppercase font-bold">
                  🏪 {product.shopName}
                </p>
              )}
            </div>
          </div>
          {content && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-50 text-xs text-gray-500 italic">
              {content}
            </div>
          )}
        </div>
      );
    }

    case "order":
    case "order_card": {
      const order = getMetadata();
      if (!order) return renderText(content);
      
      const shopLogoUrl = order.logoUrl ? toPublicUrl(order.logoUrl) : null;

      return (
        <div
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden min-w-65 max-w-75 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() =>
            order.orderId && router.push(`/orders/${order.orderId}`)
          }
        >
          <div className="px-3 py-2 bg-orange-50/50 border-b border-gray-100/30">
            {order.shopName && (
              <div className="flex items-center gap-2 mb-1">
                {shopLogoUrl ? (
                   <Image
                    src={shopLogoUrl}
                    width={32}
                    height={32}
                    className="w-4 h-4 rounded-full border border-white shadow-sm object-cover"
                    alt="logo"
                  />
                ) : (
                   <div className="w-4 h-4 rounded-full bg-orange-200 flex items-center justify-center text-[8px] font-bold text-orange-700">
                     {order.shopName.charAt(0)}
                   </div>
                )}
                <span className="text-[10px] font-bold text-gray-600 uppercase truncate">
                  {order.shopName}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 flex items-center gap-1 uppercase">
                <ShoppingCart size={14} /> Đơn hàng
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold uppercase tracking-tighter">
                {order.status || "Chờ xử lý"}
              </span>
            </div>
          </div>

          <div className="p-3 space-y-2 bg-gray-50/50">
            {_.slice(_.get(order, "items", []), 0, 2).map(
              (item: any, idx: number) => {
                const itemImageUrl = item.image ? toPublicUrl(item.image) : null;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {itemImageUrl ? (
                        <Image
                          width={40}
                          height={40}
                          src={itemImageUrl}
                          className="w-full h-full object-cover"
                          alt="item"
                        />
                      ) : (
                        <Package size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-gray-600 font-bold">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase">
                Tổng cộng
              </span>
              <span className="text-sm font-bold text-orange-600">
                {Number(order.totalAmount || 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
          {content && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-50 text-xs text-gray-500 italic">
              {content}
            </div>
          )}
        </div>
      );
    }

    case "text":
    default:
      return renderText(content);
  }
};