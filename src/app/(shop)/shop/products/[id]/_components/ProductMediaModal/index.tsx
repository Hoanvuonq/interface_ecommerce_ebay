"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Save, Loader2, Image as ImageIcon, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import ProductMediaUpload, { MediaUploadItem } from "../ProductMediaUpload";
import { productMediaService } from "@/services/products/product.service";
import { useToast } from "@/hooks/useToast";
import { resolveMediaUrl, getOriginalMediaUrl } from "@/utils/products/media.helpers";
import { PortalModal } from "@/features/PortalModal"; 
import { cn } from "@/utils/cn";

interface ProductMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productVersion: number;
  existingMedia?: any[];
  onSuccess?: () => void;
}

export const ProductMediaModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  productVersion,
  existingMedia = [],
  onSuccess,
}: ProductMediaModalProps) => {
  const [mediaItems, setMediaItems] = useState<MediaUploadItem[]>([]);
  const [initialMediaItems, setInitialMediaItems] = useState<MediaUploadItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { success, error } = useToast();

  // Khởi tạo dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const converted: MediaUploadItem[] = existingMedia.map((m: any) => ({
        id: m.id,
        url: getOriginalMediaUrl(m),
        type: m.type || "IMAGE",
        title: m.title,
        altText: m.altText,
        sortOrder: m.sortOrder,
        isPrimary: m.isPrimary,
        uploaded: true,
        preview: resolveMediaUrl(m, "_medium"),
      }));
      
      setMediaItems(converted);
      setInitialMediaItems(converted);
      setSaveSuccess(false);
    }
  }, [isOpen, existingMedia]);

  // Dùng useCallback để tránh re-render component con vô hạn
  const handleMediaChange = useCallback((updated: MediaUploadItem[]) => {
    setMediaItems(updated);
  }, []);

  const hasChanges = useMemo(() => {
    if (mediaItems.length !== initialMediaItems.length) return true;
    const initialMap = new Map(initialMediaItems.map(item => [item.url, item]));
    const currentMap = new Map(mediaItems.map(item => [item.url, item]));
    
    for (const url of initialMap.keys()) {
      if (!currentMap.has(url)) return true;
    }
    for (const [url, currentItem] of currentMap) {
      const initialItem = initialMap.get(url);
      if (!initialItem) return true;
      if (
        currentItem.isPrimary !== initialItem.isPrimary ||
        currentItem.sortOrder !== initialItem.sortOrder ||
        currentItem.type !== initialItem.type
      ) return true;
    }
    return false;
  }, [mediaItems, initialMediaItems]);

  const handleSave = async () => {
    if (!hasChanges) {
      error("Không có thay đổi nào để lưu");
      return;
    }

    try {
      setSaving(true);
      const validItems = mediaItems.filter(item => !item.uploading && !item.error && item.url);
      const initialUrls = new Set(initialMediaItems.map(item => item.url));
      const currentUrls = new Set(validItems.map(item => item.url));

      const removeIds: string[] = initialMediaItems
        .filter(item => !currentUrls.has(item.url) && item.id)
        .map(item => item.id!);

      const images: any[] = [];
      const videos: any[] = [];
      
      validItems.forEach(item => {
        if (!initialUrls.has(item.url)) {
          const mediaItem = {
            url: item.url,
            type: item.type,
            isPrimary: item.isPrimary ?? false,
            sortOrder: item.sortOrder ?? 0,
            altText: item.altText || null,
            title: item.title || null,
          };
          if (item.type === "IMAGE") images.push(mediaItem);
          else if (item.type === "VIDEO") videos.push(mediaItem);
        }
      });

      let setPrimaryId: string | undefined = validItems.find(item => 
        initialUrls.has(item.url) && item.isPrimary && 
        !initialMediaItems.find(i => i.url === item.url)?.isPrimary
      )?.id;

      await productMediaService.bulkUpdate(productId, {
        images, videos, removeIds, setPrimaryId,
      }, productVersion);

      setSaveSuccess(true);
      success("Cập nhật media thành công!");
      if (onSuccess) onSuccess();
      setInitialMediaItems(mediaItems);
      setTimeout(() => onClose(), 1000); 
    } catch (err: any) {
      error("Lưu media thất bại: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const footerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {saveSuccess ? (
          <span className="text-green-600 text-xs font-bold uppercase flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 size={14} /> Đã lưu thành công
          </span>
        ) : hasChanges ? (
          <span className="text-orange-500 text-xs font-bold uppercase flex items-center gap-1 animate-pulse">
            <AlertTriangle size={14} /> Có thay đổi chưa lưu
          </span>
        ) : (
          <span className="text-gray-400 text-xs font-bold uppercase flex items-center gap-1">
            <Clock size={14} /> Chưa có thay đổi
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
          disabled={saving}
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95",
            !hasChanges || saving 
              ? "bg-gray-200 cursor-not-allowed shadow-none" 
              : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
          )}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shadow-sm border border-gray-200">
            <ImageIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-bold uppercase tracking-tight text-gray-800 leading-none">Quản lý Media</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{productName}</div>
          </div>
        </div>
      }
      footer={footerContent}
    >
      <div className="py-2">
        <ProductMediaUpload
          productId={productId}
          productName={productName}
          existingMedia={mediaItems}
          onMediaChange={handleMediaChange}
        />
      </div>
    </PortalModal>
  );
};