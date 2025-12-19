"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Heart,
  Plus,
  CheckCircle2,
  DollarSign,
  FileText,
  Camera,
  Loader2,
  Sparkles,
  X,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  resolveMediaUrl,
  resolveVariantImageUrl,
} from "@/utils/products/media.helpers";
import Image from "next/image";
import { CustomButton } from "@/components/button";
import { ModalWrapper } from "@/components/modalWrapper";
import { cn } from "@/utils/cn";
import { PRIORITY_TEXT } from "@/types/wishlist/wishlist.types";
import { AddToWishlistModalProps, WishlistFormData, FormErrors } from "../type";

// --- Sub-components for better UI ---
const FieldLabel = ({ label, required, icon: Icon }: any) => (
  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-1.5">
    {Icon && <Icon size={13} className="text-orange-500" />}
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

export const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
  open,
  onCancel,
  onSuccess,
  product,
  defaultVariantId,
}) => {
  const [formData, setFormData] = useState<WishlistFormData>({
    wishlistId: "",
    variantId: "",
    quantity: 1,
    priority: 0,
    newWishlistName: "",
    newWishlistDescription: "",
    desiredPrice: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [creatingWishlist, setCreatingWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");

  const {
    getBuyerWishlists,
    createWishlist,
    addToWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { uploadFile, uploading: uploadingImage } = usePresignedUpload();

  // --- Actions ---
  const loadWishlists = useCallback(async () => {
    const result = await getBuyerWishlists({ page: 0, size: 100 });
    if (result.success) {
      const list = result.data?.content || [];
      setWishlists(list);
      const def = list.find((w: any) => w.isDefault) || list[0];
      if (def) setFormData((p) => ({ ...p, wishlistId: def.id }));
    }
  }, [getBuyerWishlists]);

  useEffect(() => {
    if (open && product) {
      loadWishlists();
      setSelectedVariantId(
        defaultVariantId || product.variants?.[0]?.id || null
      );
    }
  }, [open, product, defaultVariantId, loadWishlists]);

  const handleImageUpload = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    try {
      const res = await uploadFile(file, UploadContext.WISHLIST_COVER);
      if (res.assetId) {
        setAssetId(res.assetId);
        toast.success("Đã tải ảnh bìa thành công");
      }
    } catch (err) {
      toast.error("Lỗi tải ảnh");
    }
  };
  const handleCreateWishlist = async () => {
    if (!formData.newWishlistName) {
      toast.error("Vui lòng nhập tên wishlist");
      return;
    }
    setCreatingWishlist(true);
    try {
      const res = await createWishlist({
        name: formData.newWishlistName,
        description: formData.newWishlistDescription,
        coverImageAssetId: assetId || undefined,
      });
      if (res.success) {
        toast.success("Đã tạo wishlist mới!");
        setShowCreateForm(false);
        loadWishlists();
      }
    } finally {
      setCreatingWishlist(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wishlistId || !selectedVariantId) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addToWishlist(formData.wishlistId, {
        variantId: selectedVariantId,
        quantity: formData.quantity,
        priority: formData.priority,
        notes: formData.notes,
        desiredPrice: formData.desiredPrice
          ? parseFloat(formData.desiredPrice)
          : undefined,
      });

      if (res.success) {
        toast.success("Đã thêm vào wishlist!");
        onSuccess?.();
        onCancel();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <ModalWrapper
      open={open}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 leading-none">
              Thêm vào wishlist
            </h4>
            <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase tracking-tighter italic">
              Lưu trữ món đồ yêu thích
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleAction} className="space-y-6 pb-2">
        {/* 1. Phiên bản sản phẩm */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <FieldLabel label="Chọn phiên bản" required />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
            {product.variants?.map((v: any) => {
              const isSelected = selectedVariantId === v.id;
              const img =
                resolveVariantImageUrl(v, "_thumb") ||
                resolveMediaUrl(product.media?.[0], "_thumb");
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={cn(
                    "group relative p-2 rounded-2xl border-2 transition-all cursor-pointer bg-white overflow-hidden",
                    isSelected
                      ? "border-orange-500 shadow-lg shadow-orange-100 ring-2 ring-orange-500/10"
                      : "border-gray-100 hover:border-orange-200"
                  )}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 relative">
                    {img ? (
                      <Image
                        src={img}
                        alt="v"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white p-0.5 rounded-full shadow-md animate-in zoom-in">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-gray-700 line-clamp-1 mb-0.5">
                    {v.optionValues?.map((o: any) => o.name).join("/") ||
                      "Mặc định"}
                  </p>
                  <p className="text-[11px] font-black text-orange-600">
                    {new Intl.NumberFormat("vi-VN").format(v.price)}đ
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-gray-100" />
        <div className="space-y-4">
          {!showCreateForm ? (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FieldLabel label="Danh sách mong muốn" required />
                <div className="relative">
                  <select
                    value={formData.wishlistId}
                    onChange={(e) =>
                      setFormData({ ...formData, wishlistId: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 appearance-none text-sm font-bold text-gray-700 cursor-pointer"
                  >
                    <option value="">-- Chọn danh sách --</option>
                    {wishlists.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} {w.isDefault ? "(Mặc định)" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <CustomButton
                type="dashed"
                className="h-11.5! w-11.5! p-0! rounded-xl border-orange-200 text-orange-500"
                onClick={() => setShowCreateForm(true)}
                icon={<Plus size={24} />}
              />
            </div>
          ) : (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl space-y-4 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] font-black uppercase text-orange-600 tracking-widest">
                  Tạo danh sách mới
                </h5>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-orange-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex gap-4">
                <label className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-orange-400 transition-all group">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="preview"
                      width={64}
                      height={64}
                      className="rounded-xl object-cover h-full"
                      unoptimized
                    />
                  ) : (
                    <>
                      <Camera
                        size={20}
                        className="text-orange-300 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-[8px] font-bold text-orange-400 mt-1">
                        Ảnh bìa
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files[0])
                    }
                  />
                </label>
                <div className="flex-1 space-y-2">
                  <input
                    placeholder="Nhập tên wishlist..."
                    className="w-full bg-white border border-orange-100 p-2.5 rounded-xl text-sm font-bold outline-none focus:border-orange-500 shadow-sm"
                    value={formData.newWishlistName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newWishlistName: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <CustomButton
                      variant="dark"
                      className="flex-1 h-8! text-[10px]! rounded-lg! shadow-md"
                      loading={creatingWishlist}
                      onClick={async () => {
                        if (!formData.newWishlistName)
                          return toast.warning("Nhập tên danh sách");
                        const res = await createWishlist({
                          name: formData.newWishlistName,
                          coverImageAssetId: assetId,
                        });
                        if (res.success) {
                          loadWishlists();
                          setShowCreateForm(false);
                        }
                      }}
                    >
                      Xác nhận
                    </CustomButton>
                    <CustomButton
                      className="flex-1 h-8! text-[10px]! rounded-lg!"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Hủy
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Tùy chọn bổ sung */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel label="Số lượng" />
            <input
              type="number"
              className="w-full p-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 text-sm font-bold"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              min={1}
            />
          </div>
          <div>
            <FieldLabel label="Ưu tiên" />
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value),
                  })
                }
                className="w-full p-2.5 bg-gray-50 border text-black border-gray-200 rounded-xl outline-none focus:border-orange-500 appearance-none text-sm font-bold"
              >
                {PRIORITY_TEXT.map((text, i) => (
                  <option key={i} value={i}>
                    {text}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>

        <details className="group border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/30 shadow-sm">
          <summary className="p-4 cursor-pointer list-none flex justify-between items-center font-bold text-[10px] text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-400" /> Ghi chú & Giá
              kỳ vọng
            </div>
            <ChevronDown
              size={14}
              className="group-open:rotate-180 transition-transform"
            />
          </summary>
          <div className="p-4 bg-white space-y-4 animate-in fade-in">
            <div>
              <FieldLabel label="Giá mong muốn (VND)" icon={DollarSign} />
              <input
                placeholder="Ví dụ: 1500000"
                className="w-full p-2.5 bg-gray-50 border text-black border-gray-200 rounded-xl outline-none focus:border-orange-500 text-sm font-bold"
                value={formData.desiredPrice}
                onChange={(e) =>
                  setFormData({ ...formData, desiredPrice: e.target.value })
                }
              />
            </div>
            <div>
              <FieldLabel label="Ghi chú cá nhân" icon={FileText} />
              <textarea
                rows={2}
                className="w-full p-3 bg-gray-50 border text-black border-gray-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                placeholder="Lưu ý về sản phẩm này..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
        </details>

        {/* Footer fixed */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-4 border-t border-gray-50 flex gap-3 z-10">
          <CustomButton
            onClick={onCancel}
            className="flex-1 rounded-2xl! h-12! font-bold text-gray-500"
          >
            Hủy
          </CustomButton>
          <CustomButton
            type="primary"
            htmlType="submit"
            loading={submitting || wishlistLoading}
            className="flex-2 rounded-2xl! h-12! bg-linear-to-r from-orange-500 to-amber-600 shadow-lg shadow-orange-200 border-0 font-black uppercase tracking-widest text-sm"
            icon={<Heart size={18} fill="white" />}
          >
            Thêm vào yêu thích
          </CustomButton>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddToWishlistModal;
