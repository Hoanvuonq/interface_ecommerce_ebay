/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CustomButtonActions } from "@/components";
import { cn } from "@/utils/cn";
import {
  AlertCircle,
  ChevronRight,
  Landmark,
  Loader2,
  Rocket,
  Save,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { StepBasicInfo, StepLegalInfo, StepTaxInfo } from "../_components";

import {
  ShopOnboardingProvider,
  useOnboarding,
} from "../_contexts/shop.onboarding.context";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { AnimatePresence } from "framer-motion";

const OnboardingContent = () => {
  const {
    current,
    setCurrent,
    loading,
    initialLoading,
    rejectedReasons,
    formData,
    saveToStorage,
    handleFinish,
    uploadingImage,
  } = useOnboarding();

  const { success: toastSuccess, error: toastError } = useToast();

  const [formErrors, setFormErrors] = useState<any>({});

  const validateCurrentStep = () => {
    const errors: any = {};
    if (current === 0) {
      if (!formData.shopName) errors.shopName = "Tên shop là bắt buộc";
      if (!formData.pickupAddress)
        errors.pickupAddress = "Vui lòng thiết lập địa chỉ lấy hàng";
      if (!formData.logoUrl || formData.logoUrl.length === 0)
        errors.logoUrl = "Vui lòng tải lên logo";
    } else if (current === 1) {
      if (!formData.taxProvinceCode)
        errors.taxProvinceCode = "Vui lòng chọn tỉnh thành";
      if (!formData.taxId) errors.taxId = "Vui lòng nhập mã số thuế";
    } else if (current === 2) {
      if (!formData.idNumber) errors.idNumber = "Vui lòng nhập số định danh";
      if (!formData.fullName)
        errors.fullName = "Vui lòng nhập họ tên chủ sở hữu";
      if (
        !formData.idImages ||
        formData.idImages.length < (formData.idType === "passport" ? 1 : 2)
      ) {
        errors.idImages = "Vui lòng tải lên đủ ảnh giấy tờ";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const steps = useMemo(
    () => [
      {
        title: "Cơ bản",
        icon: Rocket,
        content: <StepBasicInfo errors={formErrors} />,
      },
      {
        title: "Thuế",
        icon: Landmark,
        content: <StepTaxInfo errors={formErrors} />,
      },
      {
        title: "Pháp lý",
        icon: ShieldCheck,
        content: <StepLegalInfo errors={formErrors} />,
      },
    ],
    [formErrors],
  );

  const isLastStep = current === steps.length - 1;

  if (initialLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <Loader2
            className="animate-spin text-orange-500"
            size={48}
            strokeWidth={1.5}
          />
          <Zap
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500"
            size={16}
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Khởi tạo hệ thống...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      {(loading || uploadingImage) && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex flex-col justify-center items-center z-9999 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center border border-gray-100 scale-110">
            <div className="relative mb-6">
              <Loader2
                className="w-12 h-12 text-orange-500 animate-spin"
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              </div>
            </div>
            <p className="font-bold uppercase tracking-[0.25em] text-[11px] text-gray-800">
              {uploadingImage ? "Đang xử lý Media" : "Đang đồng bộ dữ liệu"}
            </p>
            <p className="mt-2 text-[10px] font-bold text-gray-400 italic">
              Vui lòng không đóng trình duyệt
            </p>
          </div>
        </div>
      )}

      {Object.keys(rejectedReasons).length > 0 && (
        <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <AlertCircle size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-rose-600">
            <AlertCircle
              size={20}
              strokeWidth={2.5}
              className="animate-bounce"
            />
            <span className="font-bold uppercase text-[10px] tracking-[0.2em]">
              Hồ sơ cần điều chỉnh
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(rejectedReasons).map(([key, val]: any) => (
              <div
                key={key}
                className="flex gap-3 items-start bg-white/60 p-3 rounded-2xl border border-rose-100/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <p className="text-[12px] font-bold text-rose-700 leading-relaxed">
                  <span className="uppercase opacity-60 mr-1">{key}:</span>{" "}
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-custom overflow-hidden transition-all">
        <div className="bg-gray-50/50 py-8 px-10 border-b border-gray-100">
          <div className="flex justify-between items-center relative max-w-2xl mx-auto">
            <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0" />
            {steps.map((step, idx) => {
              const isActive = current === idx;
              const isCompleted = idx < current;
              return (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center gap-4 group"
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 border-4 shadow-xl",
                      isActive
                        ? "bg-orange-500 border-white text-white scale-110 ring-8 ring-orange-500/10"
                        : isCompleted
                          ? "bg-emerald-500 border-white text-white"
                          : "bg-white border-gray-50 text-gray-300",
                    )}
                  >
                    <step.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.2em] transition-colors",
                      isActive ? "text-gray-900" : "text-gray-400",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 md:p-12 min-h-112.5 bg-white relative">
          <AnimatePresence mode="wait">
            <div key={current} className="w-full">
              {steps[current].content}
            </div>
          </AnimatePresence>

          <div className="mt-12 flex flex-col items-center space-y-8">
            <button
              type="button"
              onClick={async () => {
                await saveToStorage(current, formData);
                toastSuccess("Đã lưu bản nháp thành công");
              }}
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-orange-600 transition-all hover:translate-y-0.5 active:translate-y-0"
            >
              <Save size={14} strokeWidth={2.5} /> Save Progress
            </button>

            <div className="w-full h-px bg-gray-50" />

            <CustomButtonActions
              isLoading={loading}
              cancelText={current === 0 ? "Hủy bỏ hồ sơ" : "Trở lại"}
              submitText={
                isLastStep ? "Hoàn tất & Gửi duyệt" : "Tiếp tục quy trình"
              }
              submitIcon={isLastStep ? ShieldCheck : ChevronRight}
              onCancel={() =>
                current > 0 ? setCurrent(current - 1) : window.history.back()
              }
              onSubmit={async () => {
                if (validateCurrentStep()) {
                  if (isLastStep) {
                    await handleFinish();
                  } else {
                    await saveToStorage(current, formData);
                    setCurrent(current + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                } else {
                  toastError("Vui lòng hoàn thiện các trường còn thiếu");
                }
              }}
              containerClassName="w-full flex justify-between items-center gap-4"
              className="w-full md:w-64! h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            />
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em]">
        Secured by Global Registry Standards 2026
      </p>
    </div>
  );
};

export const ShopInfoScreen = () => {
  return (
    <ShopOnboardingProvider>
      <OnboardingContent />
    </ShopOnboardingProvider>
  );
};
