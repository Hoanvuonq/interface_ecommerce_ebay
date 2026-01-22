"use client";

import React, { useMemo } from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  CustomButtonActions,
  Checkbox,
  DataTable,
} from "@/components";
import { Column } from "@/components/DataTable/type";
import {
  RefreshCw,
  ChevronRight,
  CheckCircle,
  Package,
  Layers,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ICreateCampaignModal } from "./type";
import { IStepInfo } from "./type";
import { getProductSelectionColumns } from "./column.product.selection";
import { CreateCampignStepInfo } from "../CreateCampignStepInfo";

export const CreateCampaignModal: React.FC<ICreateCampaignModal> = ({
  isOpen,
  onClose,
  step,
  setStep,
  form,
  setForm,
  loading,
  productsLoading,
  myProducts,
  selectedVariants,
  setSelectedVariants,
  onRefreshProducts,
  onSubmit,
}) => {
  const flatVariants = useMemo(() => {
    if (!myProducts) return [];
    return myProducts
      .filter((p: any) => p && p.variants && p.variants.length > 0)
      .flatMap((prod: any) =>
        prod.variants.map((v: any) => ({
          ...v,
          productName: prod.name,
        })),
      );
  }, [myProducts]);

  const productColumns: Column<any>[] = useMemo(
    () => [
      {
        header: "Chọn",
        align: "center",
        className: "w-[5%] min-w-[50px]",
        render: (variant: any) => (
          <Checkbox
            checked={!!selectedVariants[variant.id]?.selected}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setSelectedVariants((prev: any) => ({
                ...prev,
                [variant.id]: {
                  ...prev[variant.id],
                  selected: isChecked,
                  salePrice:
                    prev[variant.id]?.salePrice ||
                    Math.round(variant.price * 0.9),
                  stockLimit: prev[variant.id]?.stockLimit || 10,
                  discountPercent: prev[variant.id]?.discountPercent || 10,
                },
              }));
            }}
          />
        ),
      },
      {
        header: "Thông tin Biến thể",
        className: "w-[15%] min-w-[200px]",
        render: (variant: any) => (
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] font-bold text-slate-700 line-clamp-1 uppercase leading-tight">
              {variant.productName}
            </p>
            <span className="text-[10px] text-gray-500 font-medium bg-slate-50 w-fit px-1 rounded border border-slate-100">
              SKU: {variant.sku}
            </span>
          </div>
        ),
      },
      {
        header: "Giá niêm yết",
        align: "right",
        className: "w-[15%]",
        render: (variant: any) => (
          <span className="text-xs font-bold text-gray-500 line-through whitespace-nowrap">
            {variant.price.toLocaleString()}đ
          </span>
        ),
      },
      {
        header: "% Giảm",
        align: "center",
        className: "w-[15%]",
        render: (variant: any) => {
          const isSelected = !!selectedVariants[variant.id]?.selected;
          return (
            <div className="w-full px-2">
              <FormInput
                type="number"
                disabled={!isSelected}
                className="h-8 text-center font-bold text-red-500 bg-gray-50 border-gray-200 focus:bg-white"
                value={selectedVariants[variant.id]?.discountPercent ?? ""}
                onChange={(e) => {
                  const pct =
                    e.target.value === "" ? "" : parseInt(e.target.value);
                  const newPrice =
                    pct !== ""
                      ? Math.round(variant.price * (1 - (pct as number) / 100))
                      : "";
                  setSelectedVariants((prev: any) => ({
                    ...prev,
                    [variant.id]: {
                      ...prev[variant.id],
                      discountPercent: pct,
                      salePrice: newPrice,
                    },
                  }));
                }}
              />
            </div>
          );
        },
      },
      {
        header: "Giá KM (VNĐ)",
        align: "center",
        className: "w-[15%]",
        render: (variant: any) => {
          const isSelected = !!selectedVariants[variant.id]?.selected;
          const rawValue = selectedVariants[variant.id]?.salePrice;

          const displayValue =
            rawValue !== undefined
              ? Number(rawValue).toLocaleString("vi-VN")
              : "";

          return (
            <div className="w-full px-2">
              <FormInput
                type="text"
                inputMode="numeric"
                disabled={!isSelected}
                className="h-8 text-center font-bold text-orange-600 bg-white border-orange-100 focus:ring-orange-500/20"
                value={displayValue}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^\d]/g, "");
                  const val =
                    numericValue === "" ? "" : parseInt(numericValue);

                  const newPct =
                    val !== ""
                      ? Math.round(
                          ((variant.price - (val as number)) / variant.price) *
                            100,
                        )
                      : "";

                  setSelectedVariants((prev: any) => ({
                    ...prev,
                    [variant.id]: {
                      ...prev[variant.id],
                      salePrice: val,
                      discountPercent: newPct,
                    },
                  }));
                }}
                placeholder="0"
              />
            </div>
          );
        },
      },
      {
        header: "Số lượng",
        align: "center",
        className: "w-[15%]",
        render: (variant: any) => (
          <div className="w-full px-2">
            <FormInput
              type="number"
              disabled={!selectedVariants[variant.id]?.selected}
              className="h-8 text-center font-bold text-slate-600 bg-white border-gray-200"
              value={selectedVariants[variant.id]?.stockLimit ?? ""}
              onChange={(e) => {
                const val =
                  e.target.value === "" ? "" : parseInt(e.target.value);
                setSelectedVariants((prev: any) => ({
                  ...prev,
                  [variant.id]: { ...prev[variant.id], stockLimit: val },
                }));
              }}
            />
          </div>
        ),
      },
    ],
    [selectedVariants, setSelectedVariants],
  );

  const renderFooter = () => {
    const config = (() => {
      switch (step) {
        case "INFO":
          return {
            text: "TIẾP THEO",
            icon: ChevronRight,
            action: () => setStep("PRODUCTS"),
            disabled: !form.name || !form.startDate || !form.endDate,
          };
        case "PRODUCTS":
          return {
            text: "XÁC NHẬN CHỌN",
            icon: ChevronRight,
            action: () => setStep("CONFIRM"),
            disabled: !Object.values(selectedVariants).some(
              (v: any) => v.selected,
            ),
          };
        case "CONFIRM":
          return {
            text: "KÍCH HOẠT CHIẾN DỊCH",
            icon: CheckCircle,
            action: onSubmit,
            disabled: false,
          };
        default:
          return {
            text: "TIẾP THEO",
            icon: ChevronRight,
            action: () => {},
            disabled: true,
          };
      }
    })();

    return (
      <CustomButtonActions
        isLoading={loading}
        isDisabled={config.disabled}
        cancelText={step === "INFO" ? "ĐÓNG" : "QUAY LẠI"}
        submitText={config.text}
        submitIcon={config.icon}
        onCancel={() => {
          if (step === "PRODUCTS") setStep("INFO");
          else if (step === "CONFIRM") setStep("PRODUCTS");
          else onClose();
        }}
        onSubmit={config.action}
        containerClassName="w-full flex gap-3 border-t-0 p-0"
        className="w-60! rounded-4xl h-11 font-bold shadow-orange-500/10 shadow-lg"
      />
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case "INFO":
        return "Thông tin chiến dịch";
      case "PRODUCTS":
        return "Chọn sản phẩm";
      case "CONFIRM":
        return "Xác nhận";
      default:
        return "Cấu hình Shop Sale";
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">{getStepTitle()}</span>
          <div className="flex items-center gap-1">
            {["INFO", "PRODUCTS", "CONFIRM"].map((s, idx) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step === s ? "bg-orange-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      }
      width="max-w-6xl"
      footer={renderFooter()}
    >
      <div className="min-h-112.5">
        {step === "INFO" && <CreateCampignStepInfo form={form} setForm={setForm} />}

        {step === "PRODUCTS" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shadow-sm">
                  <Layers size={18} />
                </div>
                <span className="font-bold text-sm text-slate-700 uppercase tracking-tight">
                  Biến thể khả dụng
                </span>
              </div>
              <button
                onClick={onRefreshProducts}
                className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-[11px] font-bold transition-all"
              >
                <RefreshCw
                  size={12}
                  className={cn(productsLoading && "animate-spin")}
                />{" "}
                LÀM MỚI
              </button>
            </div>

              <DataTable
                data={flatVariants}
                columns={productColumns}
                loading={productsLoading}
                page={0}
                size={flatVariants.length || 10}
                totalElements={flatVariants.length}
                onPageChange={() => {}}
                emptyMessage="Không tìm thấy sản phẩm"
                rowKey={(item: any) => item.id}
              />
          </div>
        )}

        {step === "CONFIRM" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white border border-slate-200 p-8 rounded-4xl relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 p-10 opacity-[0.03]">
                <Package size={140} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-3 uppercase tracking-tight border-b border-slate-100 pb-4">
                <CheckCircle className="text-green-500" size={22} /> Xác nhận
                chiến dịch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  {/* Preview Banner */}
                  {form.bannerPreview && (
                    <div className="relative h-24 rounded-xl overflow-hidden">
                      <img
                        src={form.bannerPreview}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Chiến dịch
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {form.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Hiệu lực
                    </p>
                    <p className="text-sm font-bold text-slate-600 italic">
                      {new Date(form.startDate).toLocaleString("vi-VN")} →{" "}
                      {new Date(form.endDate).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">
                    Quy mô biến thể
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-orange-500 tracking-tighter leading-none">
                      {
                        Object.values(selectedVariants).filter(
                          (v: any) => v.selected,
                        ).length
                      }
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase italic">
                      Items Selected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};