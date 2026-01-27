/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import localforage from "localforage";
import { useToast } from "@/hooks/useToast";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { mapShopOnboardingPayload } from "../../_store/shop.payload";
import { base64ToFile } from "../../_utils/getbase64ToFile";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import authService from "@/auth/services/auth.service";
import {
  useCreateCompleteShop,
  useUpdateCompleteShop,
} from "@/app/(shop)/shop/profile/_hooks/useShop";

const STORAGE_KEY = "shopOnboarding";

interface ShopOnboardingContextType {
  current: number;
  setCurrent: (step: number) => void;
  formData: any;
  updateFormField: (fieldOrValues: any, value?: any) => void;
  loading: boolean;
  uploadingImage: boolean;
  initialLoading: boolean;
  rejectedReasons: Record<string, string>;
  isUpdateMode: boolean;
  saveToStorage: (step: number, values: any) => Promise<void>;
  handleFinish: () => Promise<void>;
}

const ShopOnboardingContext = createContext<
  ShopOnboardingContextType | undefined
>(undefined);

export const ShopOnboardingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rejectedReasons, setRejectedReasons] = useState<
    Record<string, string>
  >({});
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null);
  const [originalLegalImages, setOriginalLegalImages] = useState<any>({});

  const { handleCreateCompleteShop } = useCreateCompleteShop();
  const { handleUpdateCompleteShop } = useUpdateCompleteShop();
  const { uploadFile: uploadPresigned, uploading: uploadingImage } =
    usePresignedUpload();

  const updateFormField = useCallback((fieldOrValues: any, value?: any) => {
    setFormData((prev: any) => {
      if (typeof fieldOrValues === "string") {
        return { ...prev, [fieldOrValues]: value };
      }
      return { ...prev, ...fieldOrValues };
    });
  }, []);

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

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const userDetail = getStoredUserDetail();

      if (userDetail?.shopId) {
        const shopRes = await getCurrentUserShopDetail();
        if (shopRes?.data) {
          const shop = shopRes.data;
          const verification = shop.verificationInfo;

          if (verification?.rejectedReasons) {
            setRejectedReasons(verification.rejectedReasons);
            const stepMap: any = {
              BASIC_INFO: 0,
              TAX_INFO: 1,
              LEGAL_INFO: 2,
              SHOP: 0,
            };
            setCurrent(
              stepMap[Object.keys(verification.rejectedReasons)[0]] ?? 0,
            );
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
            email: shop.user?.email || userDetail?.email,
            logoUrl: shop.logoUrl
              ? [{ uid: "-1", name: "logo", url: shop.logoUrl, status: "done" }]
              : [],
            nationality: shop.legalInfo?.nationality,
            idType: shop.legalInfo?.identityType?.toLowerCase(),
            idNumber: shop.legalInfo?.identityNumber,
            fullName: shop.legalInfo?.fullName,
            businessType: shop.taxInfo?.type?.toLowerCase(),
            taxId: shop.taxInfo?.taxIdentificationNumber,
            ...shop.taxInfo?.registeredAddress,
            addressDetail: shop.taxInfo?.registeredAddress?.detail,
            pickupAddress: shop.address
              ? {
                  ...shop.address,
                  ...shop.address.address,
                  addressDetail: shop.address.address?.detail,
                }
              : undefined,
          };
          setFormData(mappedValues);
          setInitialLoading(false);
          return;
        }
      }

      const saved: any = await localforage.getItem(STORAGE_KEY);
      if (saved) setFormData(saved.values);
    } catch (e) {
      console.error("Load initial error:", e);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const saved: any = await localforage.getItem(STORAGE_KEY);
      const finalValues = { ...saved?.values, ...formData };

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

      // 2. Gom Asset IDs cho ảnh định danh
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
        fontImageUrl:
          finalValues.idImages?.[0]?.url ||
          finalValues.idImages?.[0]?.base64 ||
          "",
        backImageUrl:
          finalValues.idImages?.[1]?.url ||
          finalValues.idImages?.[1]?.base64 ||
          "",
        faceImageUrl:
          finalValues.faceImages?.[0]?.url ||
          finalValues.faceImages?.[0]?.base64 ||
          "",
      };

      // Ensure legalInfo includes all required fields
      const payload = {
        ...mapShopOnboardingPayload(
          finalValues,
          logoPath,
          legalAssetIds,
        ),
        legalInfo: {
          ...mapShopOnboardingPayload(
            finalValues,
            logoPath,
            legalAssetIds,
          ).legalInfo,
          fontImageUrl: legalAssetIds.fontImageUrl,
          backImageUrl: legalAssetIds.backImageUrl,
          faceImageUrl: legalAssetIds.faceImageUrl,
        },
      };

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

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <ShopOnboardingContext.Provider
      value={{
        current,
        setCurrent,
        formData,
        updateFormField,
        loading,
        uploadingImage,
        initialLoading,
        rejectedReasons,
        isUpdateMode,
        saveToStorage,
        handleFinish,
      }}
    >
      {children}
    </ShopOnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(ShopOnboardingContext);
  if (!context)
    throw new Error("useOnboarding must be used within ShopOnboardingProvider");
  return context;
};
