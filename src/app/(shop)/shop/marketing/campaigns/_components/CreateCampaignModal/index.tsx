"use client";

import { CustomButtonActions } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { CheckCircle, ChevronRight, Plus } from "lucide-react";
import React from "react";
import { ICreateCampaignModal } from "./type";

import {
  CreateCampaignConfirm,
  CreateCampaignProduction,
  CreateCampignStepInfo,
} from "../CreateCampaignByStep";

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
  const isAddProductMode = isOpen && step === "PRODUCTS" && !form.name;

  const renderFooter = () => {
    const isNoProductSelected = !Object.values(selectedVariants).some(
      (v: any) => v.selected,
    );
    const config = (() => {
      if (isAddProductMode) {
        return {
          text: "XÁC NHẬN THÊM",
          icon: Plus,
          action: onSubmit, // Sẽ gọi handleAddProducts từ hook
          disabled: isNoProductSelected,
          cancelText: "ĐÓNG",
        };
      }

      // TRƯỜNG HỢP: TẠO MỚI TỪNG BƯỚC
      switch (step) {
        case "INFO":
          return {
            text: "TIẾP THEO",
            icon: ChevronRight,
            action: () => setStep("PRODUCTS"),
            disabled: !form.name || !form.startDate || !form.endDate,
            cancelText: "ĐÓNG",
          };
        case "PRODUCTS":
          return {
            text: "TIẾP THEO",
            icon: ChevronRight,
            action: () => setStep("CONFIRM"),
            disabled: isNoProductSelected,
            cancelText: "QUAY LẠI",
          };
        case "CONFIRM":
          return {
            text: "KÍCH HOẠT CHIẾN DỊCH",
            icon: CheckCircle,
            action: onSubmit, // Sẽ gọi handleCreateCampaign từ hook
            disabled: false,
            cancelText: "QUAY LẠI",
          };
        default:
          return {
            text: "TIẾP THEO",
            icon: ChevronRight,
            action: () => {},
            disabled: true,
            cancelText: "ĐÓNG",
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
    if (isAddProductMode) return "Bổ sung sản phẩm";
    switch (step) {
      case "INFO":
        return "Bước 1: Thông tin cơ bản";
      case "PRODUCTS":
        return "Bước 2: Chọn sản phẩm";
      case "CONFIRM":
        return "Bước 3: Xác nhận";
      default:
        return "Cấu hình chiến dịch";
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
                  step === s ? "bg-orange-500" : "bg-gray-200",
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
        {!isAddProductMode && step === "INFO" && (
          <CreateCampignStepInfo form={form} setForm={setForm} />
        )}

        {step === "PRODUCTS" && (
          <CreateCampaignProduction
            myProducts={myProducts}
            productsLoading={productsLoading}
            selectedVariants={selectedVariants}
            setSelectedVariants={setSelectedVariants}
            onRefreshProducts={onRefreshProducts}
          />
        )}

        {!isAddProductMode && step === "CONFIRM" && (
          <CreateCampaignConfirm
            form={form}
            selectedVariants={selectedVariants}
          />
        )}
      </div>
    </PortalModal>
  );
};
