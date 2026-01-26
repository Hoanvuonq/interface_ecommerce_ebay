"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Info,
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
import { PortalModal } from "@/features/PortalModal";
import {
  SelectComponent,
  SectionHeader,
  FormInput,
  ButtonField,
} from "@/components";
import {
  AddToWishlistModalProps,
  WishlistFormData,
} from "../../_types/modalAddWishList";
import { Button } from "@/components/button/button";
import { useToast } from "@/hooks/useToast";

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
  const { success, error, warning } = useToast();
  const [creatingWishlist, setCreatingWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
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
        defaultVariantId || product.variants?.[0]?.id || null,
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
        success("Đã tải ảnh bìa");
      }
    } catch (err) {
      error("Lỗi tải ảnh");
    }
  };

  const handleCreateWishlist = async () => {
    if (!formData.newWishlistName)
      return warning("Vui lòng nhập tên danh sách");
    setCreatingWishlist(true);
    try {
      const res = await createWishlist({
        name: formData.newWishlistName,
        description: formData.newWishlistDescription,
        coverImageAssetId: assetId || undefined,
      });
      if (res.success) {
        success("Đã tạo danh sách mới!");
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
      return error("Vui lòng chọn biến thể và danh sách lưu trữ");
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
        success("Đã thêm vào wishlist!");
        onSuccess?.();
        onCancel();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onCancel}
      title={
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Heart size={22} className="fill-orange-500/20" />
          </div>
          <div>
            <h4 className="text-lg font-bold uppercase tracking-tight text-gray-900">
              Wishlist
            </h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
              <Sparkles size={10} className="text-orange-500 animate-pulse" />
              Bộ sưu tập cá nhân
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 w-full border-t border-gray-100 pt-4 mt-2">
          <Button
            variant="edit"
            onClick={onCancel}
            className="rounded-xl px-8 border-gray-200"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            htmlType="submit"
            type="login"
            form="add-to-wishlist-form"
            loading={submitting || wishlistLoading}
            className="w-52 rounded-xl h-11 text-sm font-bold shadow-lg shadow-orange-500/20 border-0"
          >
            <span className="flex items-center gap-2">
              <Heart size={18} className="fill-white/20" /> Lưu vào danh sách
            </span>
          </ButtonField>
        </div>
      }
      width="max-w-2xl"
    >
      <form
        id="add-to-wishlist-form"
        onSubmit={handleSubmit}
        className="space-y-8 py-2"
      >
        {/* SECTION 1: VARIANT SELECTION */}
        <div className="space-y-4">
          <SectionHeader icon={ShoppingBag} title="Chọn Phiên Bản" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                    "group relative p-2.5 rounded-2xl border transition-all cursor-pointer bg-white overflow-hidden",
                    isSelected
                      ? "border-orange-500 ring-4 ring-orange-500/10 shadow-xl shadow-orange-500/5 translate-y-0.5"
                      : "border-gray-100 hover:border-orange-200 hover:shadow-md",
                  )}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-2 relative">
                    <Image
                      src={img}
                      alt="v"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-1">
                    <p
                      className={cn(
                        "text-[10px] font-bold truncate uppercase tracking-tight",
                        isSelected ? "text-orange-600" : "text-gray-500",
                      )}
                    >
                      {v.optionValues?.map((o: any) => o.name).join(" / ") ||
                        "Default"}
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {new Intl.NumberFormat("vi-VN").format(v.price)}đ
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: WISHLIST SELECTION */}
        <div className="p-6 rounded-[2.5rem] bg-orange-50/40 border border-orange-100/50 space-y-6">
          {!showCreateForm ? (
            <div className="space-y-4">
              <SectionHeader icon={Heart} title="Danh mục lưu trữ" />
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 mb-2 block">
                    Chọn danh sách sẵn có
                  </label>
                  <SelectComponent
                    options={wishlistOptions}
                    value={formData.wishlistId}
                    onChange={(val) =>
                      setFormData({ ...formData, wishlistId: val })
                    }
                    placeholder="-- Chọn danh sách --"
                    className="rounded-2xl border-gray-200 h-12 shadow-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-orange-100 pb-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-orange-600"
                >
                  <ArrowLeft size={14} strokeWidth={3} /> QUAY LẠI
                </button>
                <SectionHeader
                  icon={Plus}
                  title="Danh sách mới"
                  className="mb-0!"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <label className="shrink-0 w-24 h-24 rounded-4xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-orange-50 transition-all group overflow-hidden relative shadow-inner">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="C"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Camera
                        size={20}
                        className="text-orange-400 mx-auto mb-1"
                      />
                      <span className="text-[8px] font-bold uppercase text-gray-400">
                        Ảnh bìa
                      </span>
                    </div>
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
                <div className="flex-1 w-full space-y-4">
                  <FormInput
                    label="Tên danh sách"
                    placeholder="Ví dụ: Đồ decor phòng ngủ..."
                    value={formData.newWishlistName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newWishlistName: e.target.value,
                      })
                    }
                    required
                  />
                  <ButtonField
                    type="login"
                    loading={creatingWishlist}
                    onClick={handleCreateWishlist}
                    className="w-full sm:w-32 h-10 text-[10px] uppercase font-bold rounded-full border-0"
                  >
                    Tạo & Chọn
                  </ButtonField>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: QUANTITY & PRIORITY */}
        <div className="grid grid-cols-2 gap-5">
          <FormInput
            type="number"
            label="Số lượng muốn lưu"
            min={1}
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 1,
              })
            }
          />
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 ml-1">
              Mức độ ưu tiên
            </label>
            <SelectComponent
              options={priorityOptions}
              value={formData.priority.toString()}
              onChange={(val) =>
                setFormData({ ...formData, priority: parseInt(val) || 0 })
              }
              placeholder="Ưu tiên thấp"
              className="rounded-2xl border-gray-200 h-12 shadow-sm"
            />
          </div>
        </div>

        {/* SECTION 4: ADVANCED INFO (Collapsible) */}
        <details className="group border border-orange-100 rounded-4xl overflow-hidden bg-white shadow-sm transition-all open:ring-4 open:ring-orange-500/5">
          <summary className="p-4 cursor-pointer list-none flex justify-between items-center bg-gray-50/50 hover:bg-orange-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                <FileText size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                Thông tin bổ sung
              </span>
            </div>
            <ChevronDown
              size={18}
              className="text-gray-400 group-open:rotate-180 transition-transform duration-500"
            />
          </summary>
          <div className="p-6 space-y-6 bg-white animate-in slide-in-from-top-2 duration-500">
            <FormInput
              label="Giá mục tiêu chờ săn (VNĐ)"
              placeholder="Ví dụ: 200,000"
              type="number"
              value={formData.desiredPrice}
              onChange={(e) =>
                setFormData({ ...formData, desiredPrice: e.target.value })
              }
              maxLengthNumber={12}
            />
            <FormInput
              isTextArea
              label="Ghi chú cá nhân"
              placeholder="Lý do bạn muốn mua sản phẩm này..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: (e.target as any).value })
              }
            />
            <div className="flex gap-2 items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <Info size={16} className="text-blue-500 shrink-0" />
              <p className="text-[10px] font-bold text-blue-600/80 leading-relaxed uppercase">
                Chúng tôi sẽ thông báo cho bạn khi sản phẩm chạm mức giá này.
              </p>
            </div>
          </div>
        </details>
      </form>
    </PortalModal>
  );
};
