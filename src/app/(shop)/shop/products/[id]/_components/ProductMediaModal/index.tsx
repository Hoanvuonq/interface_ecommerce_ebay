"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Save, Loader2, Image as ImageIcon, CheckCircle2, AlertTriangle, Clock, X } from "lucide-react";
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

  // --- LOGIC GIỮ NGUYÊN ---
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

  // --- UI FIX LẠI CHO ĐẸP ---
  const footerContent = (
    <div className="flex items-center justify-between w-full px-2 py-1">
      <div className="flex items-center gap-3">
        {saveSuccess ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-in zoom-in-95 duration-300">
            <CheckCircle2 size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tight italic leading-none">Hoàn tất lưu trữ</span>
          </div>
        ) : hasChanges ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100 animate-pulse leading-none">
            <AlertTriangle size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tight italic">Chờ xác nhận lưu</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100 leading-none">
            <Clock size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tight italic">Dữ liệu ổn định</span>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
          disabled={saving}
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={cn(
            "flex items-center gap-2 px-8 py-2.5 rounded-2xl text-[11px] font-bold text-white transition-all uppercase tracking-[0.1em] italic",
            !hasChanges || saving 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-200 shadow-md shadow-orange-100 active:scale-95"
          )}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
          Lưu thay đổi
        </button>
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-5xl" // Tăng độ rộng để thao tác gallery thoải mái hơn
      title={
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-orange-400 opacity-20 blur-sm rounded-xl"></div>
            <div className="relative p-2.5 bg-orange-500 rounded-2xl text-white shadow-md border border-orange-400">
              <ImageIcon size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="text-[15px] font-bold uppercase tracking-tight text-slate-800 leading-none italic">
              Quản lý Thư viện Media
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
               <div className="h-1 w-1 rounded-full bg-orange-400"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                Sản phẩm: {productName}
              </span>
            </div>
          </div>
        </div>
      }
      footer={footerContent}
    >
      <div className="py-4">
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