"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Heart,
  Plus,
  CheckCircle2,
  DollarSign,
  FileText,
  Camera,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/app/(main)/wishlist/_hooks/useWishlist";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  resolveMediaUrl,
  resolveVariantImageUrl,
} from "@/utils/products/media.helpers";
import { cn } from "@/utils/cn";
import { PRIORITY_TEXT } from "@/types/wishlist/wishlist.types";
import { CustomButton } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent } from "@/components/SelectComponent";
import {
  AddToWishlistModalProps,
  WishlistFormData,
} from "../../_types/modalAddWishList";
import { SectionHeader } from "../SectionHeader";
import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";

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

  const [creatingWishlist, setCreatingWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");

  // Hooks
  const {
    getBuyerWishlists,
    createWishlist,
    addToWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { uploadFile } = usePresignedUpload();

  const loadWishlists = useCallback(async () => {
    const result = await getBuyerWishlists({ page: 0, size: 100 });
    if (result.success) {
      const list = result.data?.content || [];
      setWishlists(list);
      const def = list.find((w: any) => w.isDefault) || list[0];
      if (def && !formData.wishlistId) {
        setFormData((p) => ({ ...p, wishlistId: def.id }));
      }
    }
  }, [getBuyerWishlists, formData.wishlistId]);

  useEffect(() => {
    if (open && product) {
      loadWishlists();
      setSelectedVariantId(
        defaultVariantId || product.variants?.[0]?.id || null
      );
    }
  }, [open, product, defaultVariantId, loadWishlists]);

  const wishlistOptions = useMemo(() => {
    return wishlists.map((w) => ({
      value: w.id,
      label: `${w.name} ${w.isDefault ? "(Mặc định)" : ""}`,
    }));
  }, [wishlists]);

  const priorityOptions = useMemo(() => {
    return PRIORITY_TEXT.map((text, index) => ({
      label: text,
      value: index.toString(),
    }));
  }, []);

  const handleImageUpload = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    try {
      const res = await uploadFile(file, UploadContext.WISHLIST_COVER);
      if (res.assetId) {
        setAssetId(res.assetId);
        toast.success("Đã tải ảnh bìa");
      }
    } catch (err) {
      toast.error("Lỗi tải ảnh");
    }
  };

  const handleCreateWishlist = async () => {
    if (!formData.newWishlistName)
      return toast.warning("Vui lòng nhập tên danh sách");

    setCreatingWishlist(true);
    try {
      const res = await createWishlist({
        name: formData.newWishlistName,
        description: formData.newWishlistDescription,
        coverImageAssetId: assetId || undefined,
      });
      if (res.success) {
        toast.success("Đã tạo danh sách mới!");
        setShowCreateForm(false);
        setFormData((prev) => ({
          ...prev,
          newWishlistName: "",
          newWishlistDescription: "",
        }));
        setPreviewImage("");
        loadWishlists();
      }
    } finally {
      setCreatingWishlist(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wishlistId || !selectedVariantId) {
      return toast.error("Vui lòng chọn biến thể và danh sách lưu trữ");
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

  const renderHeader = (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-linear-to-br from-orange-100 to-amber-50 rounded-2xl text-orange-600 shadow-inner">
        <Heart size={24} className="fill-orange-500/20" />
      </div>
      <div>
        <h4 className="text-lg font-black uppercase tracking-tight text-gray-900">
          Thêm vào Wishlist
        </h4>
        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
          <Sparkles size={12} className="text-orange-400" />
          Lưu lại sản phẩm bạn yêu thích
        </p>
      </div>
    </div>
  );

  const renderFooter = (
    <>
      <Button variant="edit" onClick={onCancel} className="text-base!">
        Đóng
      </Button>
      <ButtonField
        htmlType="submit"
        type="login"
        form="add-to-wishlist-form"
        loading={submitting || wishlistLoading}
        className="w-50 text-base!"
      >
        <span className="flex items-center gap-2">
          <Heart size={18} className="fill-white/20" />
          Lưu Ngay
        </span>
      </ButtonField>
    </>
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onCancel}
      title={renderHeader}
      footer={renderFooter}
      width="max-w-xl"
      className="rounded-4xl"
    >
      <form
        id="add-to-wishlist-form"
        onSubmit={handleSubmit}
        className="space-y-8 py-2"
      >
        <section>
          <SectionHeader icon={ShoppingBag} title="Chọn Phiên Bản" />
          <div className="grid grid-cols-3 gap-3">
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
                    "group relative p-2 rounded-2xl border transition-all cursor-pointer bg-white overflow-hidden text-left",
                    isSelected
                      ? "border-orange-500 bg-orange-50/10 ring-2 ring-orange-500/20 shadow-md"
                      : "border-gray-100 hover:border-orange-200 hover:shadow-sm"
                  )}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 relative">
                    {img ? (
                      <Image
                        src={img}
                        alt="variant"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <CheckCircle2 size={10} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 px-1">
                    <p
                      className={cn(
                        "text-[10px] font-bold line-clamp-1",
                        isSelected ? "text-orange-700" : "text-gray-600"
                      )}
                    >
                      {v.optionValues?.map((o: any) => o.name).join(" / ") ||
                        "Default"}
                    </p>
                    <p className="text-xs font-black text-slate-900">
                      {new Intl.NumberFormat("vi-VN").format(v.price)}đ
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
          {!showCreateForm ? (
            <div className="space-y-3">
              <SectionHeader icon={Heart} title="Lưu vào danh sách" />
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <SelectComponent
                    options={wishlistOptions}
                    value={formData.wishlistId}
                    onChange={(val) =>
                      setFormData({ ...formData, wishlistId: val })
                    }
                    placeholder="-- Chọn danh sách --"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="aspect-square h-11 flex items-center justify-center bg-white border border-dashed border-orange-300 text-orange-500 rounded-xl hover:bg-orange-50 hover:border-orange-500 transition-all active:scale-95 shadow-sm"
                  title="Tạo danh sách mới"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
                <span className="text-xs font-black uppercase text-orange-500 tracking-wider">
                  Tạo Mới
                </span>
              </div>

              <div className="flex gap-4">
                {/* Upload Ảnh Bìa */}
                <label className="shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all group relative overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <>
                      <Camera
                        size={20}
                        className="text-gray-400 group-hover:text-orange-500 mb-1"
                      />
                      <span className="text-[9px] font-bold text-gray-400 group-hover:text-orange-500">
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
                    placeholder="Tên danh sách mới..."
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:font-normal"
                    value={formData.newWishlistName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newWishlistName: e.target.value,
                      })
                    }
                    autoFocus
                  />
                
                  <ButtonField
                    htmlType="submit"
                    type="login"
                    form="add-to-wishlist-form"
                   loading={creatingWishlist}
                    onClick={handleCreateWishlist}
                    className="w-30 m-auto text-xs! rounded-full!"
                  >
                   Tạo Ngay
                  </ButtonField>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionHeader icon={Plus} title="Số lượng" />
            <input
              type="number"
              min={1}
              className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm font-bold text-center transition-all"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <div>
            <SectionHeader icon={CheckCircle2} title="Mức độ ưu tiên" />
            <SelectComponent
              options={priorityOptions}
              value={formData.priority.toString()}
              onChange={(val) =>
                setFormData({ ...formData, priority: parseInt(val) || 0 })
              }
              placeholder="-- Mức độ ưu tiên --"
            />
          </div>
        </div>

        {/* 4. Ghi chú mở rộng (Accordion style) */}
        <details className="group border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all open:ring-2 open:ring-orange-50 open:border-orange-200">
          <summary className="p-4 cursor-pointer list-none flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-md shadow-sm text-orange-500">
                <FileText size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Ghi chú & Giá mục tiêu
              </span>
            </div>
            <ChevronDown
              size={16}
              className="text-gray-400 group-open:rotate-180 transition-transform duration-300"
            />
          </summary>

          <div className="p-4 space-y-4 bg-white animate-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                <DollarSign size={12} /> Giá mong muốn săn được
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Nhập giá (VNĐ)"
                  className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20 text-orange-600 placeholder:text-gray-300"
                  value={formData.desiredPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, desiredPrice: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                Ghi chú cá nhân
              </label>
              <textarea
                rows={2}
                className="w-full p-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 resize-none"
                placeholder="Ví dụ: Mua tặng sinh nhật..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
        </details>
      </form>
    </PortalModal>
  );
};
