"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Gift,
  Percent,
  Hash,
  Search,
  LayoutGrid,
  CheckCircle2,
  X,
  Calendar,
  Loader2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import dayjs from "dayjs";
import { PortalModal } from "@/features/PortalModal";
import { FormInput } from "@/components"; // Giả định bạn đã có FormInput custom
import { loyaltyService } from "../../_services/loyalty.service";
import { userProductService } from "@/services/products/product.service";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import type {
  ProductLoyaltyPromotionRequest,
  ProductLoyaltyPromotionResponse,
  LoyaltyRuleType,
  BulkPromotionRequest,
} from "../../_types/loyalty.types";

interface ProductPromotionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPromotion?: ProductLoyaltyPromotionResponse | null;
}

interface ProductOption {
  id: string;
  name: string;
  thumbnail?: string;
  price?: number;
}

type ApplyMode = "single" | "multiple" | "all";

export const ProductPromotionForm: React.FC<ProductPromotionFormProps> = ({
  open,
  onClose,
  onSuccess,
  editPromotion,
}) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [searchText, setSearchText] = useState("");
  const [applyMode, setApplyMode] = useState<ApplyMode>("single");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    ruleType: "PERCENT" as LoyaltyRuleType,
    ruleValue: 1,
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
    maxPointPerItem: 0,
    enabled: true,
  });

  const isEdit = !!editPromotion;

  useEffect(() => {
    if (open) {
      fetchProducts();
      if (editPromotion) {
        setApplyMode("single");
        setSelectedProductIds([editPromotion.productId]);
        setFormData({
          productId: editPromotion.productId,
          name: editPromotion.name || "",
          ruleType: editPromotion.ruleType,
          ruleValue: editPromotion.ruleValue,
          startDate: dayjs(editPromotion.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(editPromotion.endDate).format("YYYY-MM-DD"),
          maxPointPerItem: editPromotion.maxPointPerItem || 0,
          enabled: editPromotion.enabled,
        });
      } else {
        setApplyMode("single");
        setSelectedProductIds([]);
        setFormData({
          productId: "",
          name: "",
          ruleType: "PERCENT",
          ruleValue: 1,
          startDate: dayjs().format("YYYY-MM-DD"),
          endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
          maxPointPerItem: 0,
          enabled: true,
        });
      }
    }
  }, [open, editPromotion]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await userProductService.getAllProducts(0, 500);
      setProducts(response.data?.content || []);
    } catch (error) {
      toastError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const basePayload = {
        ...formData,
        maxPointPerItem: formData.maxPointPerItem || undefined,
        name: formData.name || undefined,
      };

      if (isEdit && editPromotion) {
        await loyaltyService.updatePromotion(
          editPromotion.id,
          basePayload as any
        );
        toastSuccess("Cập nhật thành công");
      } else if (applyMode === "single") {
        await loyaltyService.createPromotion(basePayload as any);
        toastSuccess("Tạo khuyến mãi thành công");
      } else {
        const bulkPayload: BulkPromotionRequest = {
          ...basePayload,
          productIds: applyMode === "all" ? undefined : selectedProductIds,
        } as any;
        const results = await loyaltyService.bulkCreatePromotions(bulkPayload);
        toastSuccess(`Đã tạo cho ${results.length} sản phẩm`);
      }
      onSuccess();
      onClose();
    } catch (error) {
      toastError("Không thể lưu khuyến mãi");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
            <Gift size={20} />
          </div>
          <span className="font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi điểm"}
          </span>
        </div>
      }
      width="max-w-2xl"
    >
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-sm font-medium text-slate-500">
            Đang tải sản phẩm...
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 py-2 px-1">
          {/* Apply Mode Selector */}
          {!isEdit && (
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Áp dụng cho
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                {(["single", "multiple", "all"] as ApplyMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setApplyMode(mode);
                      setSelectedProductIds([]);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
                      applyMode === mode
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {mode === "single" && <CheckCircle2 size={14} />}
                    {mode === "multiple" && <LayoutGrid size={14} />}
                    {mode === "all" && <Plus size={14} />}
                    {mode === "single"
                      ? "1 Sản phẩm"
                      : mode === "multiple"
                      ? "Chọn nhiều"
                      : `Tất cả (${products.length})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All products warning */}
          {applyMode === "all" && !isEdit && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
              <AlertTriangle size={18} className="shrink-0" />
              <p className="text-xs font-medium">
                Hệ thống sẽ tạo khuyến mãi cho{" "}
                <strong>tất cả {products.length} sản phẩm</strong> của shop.
              </p>
            </div>
          )}

          {/* Product Selection List (Multiple) */}
          {applyMode === "multiple" && !isEdit && (
            <div className="space-y-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Tìm nhanh sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                        selectedProductIds.includes(product.id)
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {selectedProductIds.includes(product.id) && (
                        <CheckCircle2 size={12} strokeWidth={3} />
                      )}
                    </div>
                    <img
                      src={product.thumbnail}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                      alt=""
                    />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Single Product Select */}
          {(applyMode === "single" || isEdit) && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Chọn sản phẩm
              </label>
              <select
                disabled={isEdit}
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm appearance-none focus:outline-none focus:border-orange-500 disabled:opacity-60"
              >
                <option value="">-- Chọn một sản phẩm --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Tên khuyến mãi (tùy chọn)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Flash Sale x2 điểm"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  Loại quy tắc
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, ruleType: "PERCENT" })
                    }
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      formData.ruleType === "PERCENT"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-400"
                    )}
                  >
                    Phần trăm
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, ruleType: "FIXED" })
                    }
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      formData.ruleType === "FIXED"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-400"
                    )}
                  >
                    Cố định
                  </button>
                </div>
              </div>
              <FormInput
                label="Giá trị"
                type="number"
                value={formData.ruleValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ruleValue: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={formData.startDate}
                min={dayjs().format("YYYY-MM-DD")}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-700">
                Kích hoạt khuyến mãi
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                Áp dụng ngay sau khi lưu
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, enabled: !formData.enabled })
              }
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                formData.enabled ? "bg-orange-500" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  formData.enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                (applyMode === "multiple" && selectedProductIds.length === 0)
              }
              className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Cập nhật" : "Lưu khuyến mãi"}
            </button>
          </div>
        </form>
      )}
    </PortalModal>
  );
};
