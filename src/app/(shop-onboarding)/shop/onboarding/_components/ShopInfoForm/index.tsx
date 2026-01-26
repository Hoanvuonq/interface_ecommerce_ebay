/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BasicInfo,
  StepTaxInfo,
  StepLegalInfo,
} from "@/app/(shop)/shop/profile/_components";
import {
  useCreateCompleteShop,
  useUpdateCompleteShop,
} from "@/app/(shop)/shop/profile/_hooks/useShop";
import localforage from "localforage";
import authService from "@/auth/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { mapShopOnboardingPayload } from "../../../_store/shop.payload";
import { base64ToFile } from "../../../_utils/getbase64ToFile";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast"; // Giả định bạn có hook này
import {
  Rocket,
  ShieldCheck,
  Landmark,
  ChevronRight,
  ChevronLeft,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";

const STORAGE_KEY = "shopOnboarding";

export default function ShopInfoForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rejectedReasons, setRejectedReasons] = useState<
    Record<string, string>
  >({});
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null);
  const [originalLegalImages, setOriginalLegalImages] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  const { handleCreateCompleteShop } = useCreateCompleteShop();
  const { handleUpdateCompleteShop } = useUpdateCompleteShop();
  const { uploadFile: uploadPresigned, uploading: uploadingImage } =
    usePresignedUpload();

  // 👉 Thay thế Form.useForm() bằng state local hoặc thư viện khác nếu cần, ở đây dùng local state đơn giản
  const updateFormField = (values: any) => {
    setFormData((prev: any) => ({ ...prev, ...values }));
  };

  const saveToStorage = useCallback(async (step: number, values: any) => {
    const cleaned = {
      ...values,
      logoUrl: values.logoUrl?.map((f: any) => ({
        name: f.name,
        base64: f.base64 || f.preview || f.url,
      })),
    };
    await localforage.setItem(STORAGE_KEY, { step, values: cleaned });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        let targetStep: number | null = null;
        const userDetail = getStoredUserDetail();

        if (userDetail?.shopId) {
          try {
            const shopRes = await getCurrentUserShopDetail();
            if (shopRes?.data) {
              const shop = shopRes.data;
              const verification = shop.verificationInfo;
              const hasRejected = Boolean(
                verification?.rejectedReasons &&
                Object.keys(verification.rejectedReasons).length > 0,
              );

              if (shop.status === "PENDING" && !hasRejected) {
                router.push("/shop/check");
                return;
              }

              if (verification?.rejectedReasons) {
                setRejectedReasons(verification.rejectedReasons);
                const stepMap: any = {
                  BASIC_INFO: 0,
                  TAX_INFO: 1,
                  LEGAL_INFO: 2,
                  SHOP: 0,
                };
                targetStep =
                  stepMap[Object.keys(verification.rejectedReasons)[0]] ?? 0;
              }

              setIsUpdateMode(true);
              setOriginalLogoUrl(shop.logoUrl);
              setOriginalLegalImages({
                frontImageAssetId: shop.legalInfo?.frontImageAssetId,
                backImageAssetId: shop.legalInfo?.backImageAssetId,
                faceImageAssetId: shop.legalInfo?.faceImageAssetId,
              });

              const mappedValues: any = {
                shopName: shop.shopName,
                description: shop.description,
                "email-shop": shop.user?.email || userDetail?.email,
                logoUrl: shop.logoUrl
                  ? [{ uid: "-1", name: "logo", url: shop.logoUrl }]
                  : [],
                // ... Map các trường khác tương tự code cũ
              };
              setFormData(mappedValues);
              if (targetStep !== null) setCurrent(targetStep);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }

        const saved: any = await localforage.getItem(STORAGE_KEY);
        if (saved) {
          setFormData(saved.values);
          setCurrent(saved.step);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const saved: any = await localforage.getItem(STORAGE_KEY);
      const finalValues = { ...saved?.values, ...formData };

      // Logic xử lý upload logo
      let logoPath = originalLogoUrl || "";
      const logoFile =
        finalValues.logoUrl?.[0]?.originFileObj ||
        (finalValues.logoUrl?.[0]?.base64
          ? base64ToFile(finalValues.logoUrl[0].base64, "logo.png")
          : null);

      if (logoFile) {
        const res = await uploadPresigned(logoFile, UploadContext.SHOP_LOGO);
        logoPath = res.finalUrl || toPublicUrl(res.path || "");
      }

      if (!logoPath) throw new Error("Logo là bắt buộc");

      const legalAssetIds = {
        frontImageAssetId:
          finalValues.idImages?.[0]?.assetId ||
          originalLegalImages.frontImageAssetId,
        backImageAssetId:
          finalValues.idImages?.[1]?.assetId ||
          originalLegalImages.backImageAssetId,
        faceImageAssetId:
          finalValues.faceImages?.[0]?.assetId ||
          originalLegalImages.faceImageAssetId,
      };

      const payload = mapShopOnboardingPayload(
        finalValues,
        logoPath,
        legalAssetIds,
      );

      const res = isUpdateMode
        ? await handleUpdateCompleteShop(payload)
        : await handleCreateCompleteShop(payload);

      if (res?.data) {
        await localforage.removeItem(STORAGE_KEY);
        toastSuccess("Hồ sơ đã được gửi thành công!");
        await authService.fetchAndStoreUserDetail();
        router.push("/shop/check");
      }
    } catch (err: any) {
      toastError(err.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Cơ bản",
      icon: Rocket,
      content: <BasicInfo formData={formData} setFormData={updateFormField} />,
    },
    {
      title: "Thuế",
      icon: Landmark,
      content: (
        <StepTaxInfo formData={formData} setFormData={updateFormField} />
      ),
    },
    {
      title: "Pháp lý",
      icon: ShieldCheck,
      content: (
        <StepLegalInfo formData={formData} setFormData={updateFormField} />
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in duration-700">
      {/* 🟢 Loading Overlay */}
      {(loading || uploadingImage) && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex flex-col justify-center items-center z-50">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="mt-4 font-black uppercase tracking-widest text-gray-800 animate-pulse">
            {uploadingImage
              ? "Hệ thống đang tải ảnh..."
              : "Đang xử lý dữ liệu..."}
          </p>
        </div>
      )}

      {/* 🟢 Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">
          Đăng ký <span className="text-orange-500">Merchant</span> Registry
        </h1>
        <p className="text-gray-400 font-medium uppercase text-[10px] tracking-[0.3em]">
          Calatha Store Setup Protocol v2.0
        </p>
      </div>

      {/* 🟢 Rejected Reasons */}
      {Object.keys(rejectedReasons).length > 0 && (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
            <AlertCircle size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-rose-600">
            <AlertCircle size={20} strokeWidth={2.5} />
            <span className="font-black uppercase text-xs tracking-widest italic">
              Hồ sơ bị từ chối
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(rejectedReasons).map(([key, val]) => (
              <div key={key} className="text-sm font-bold text-rose-500 italic">
                • {key}: {val}
              </div>
            ))}
          </div>
        </div>
      )}

      {initialLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-custom overflow-hidden">
          {/* 🟢 Custom Steps Header */}
          <div className="bg-gray-50/50 px-8 py-10 border-b border-gray-100">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center gap-3 group"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 shadow-sm",
                      current === idx
                        ? "bg-orange-500 border-white text-white shadow-orange-200 scale-110"
                        : idx < current
                          ? "bg-emerald-500 border-white text-white"
                          : "bg-white border-gray-100 text-gray-300",
                    )}
                  >
                    <step.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      current === idx ? "text-gray-900" : "text-gray-400",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🟢 Form Content Area */}
          <div className="p-8 sm:p-14 min-h-[450px]">
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {steps[current].content}
            </div>

            {/* 🟢 Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-10 border-t border-gray-100">
              <button
                onClick={() => current > 0 && setCurrent((prev) => prev - 1)}
                className={cn(
                  "flex items-center gap-2 h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
                  current === 0
                    ? "opacity-0 pointer-events-none"
                    : "hover:bg-gray-100 text-gray-500",
                )}
              >
                <ChevronLeft size={16} strokeWidth={3} /> Quay lại
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={async () => {
                    await saveToStorage(current, formData);
                    toastSuccess("Đã lưu bản nháp thành công");
                  }}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm active:scale-95"
                >
                  <Save size={16} strokeWidth={2.5} /> Lưu tạm
                </button>

                {current < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrent((prev) => prev + 1)}
                    className="flex items-center justify-center gap-2 h-12 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-gray-900 text-white shadow-xl shadow-gray-200 hover:bg-orange-600 transition-all active:scale-95"
                  >
                    Tiếp theo <ChevronRight size={16} strokeWidth={3} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 h-12 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Hoàn tất hồ sơ"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
