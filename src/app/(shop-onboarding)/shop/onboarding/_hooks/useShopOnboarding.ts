/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import localforage from "localforage";
import { useToast } from "@/hooks/useToast";
import {
  useCreateCompleteShop,
  useUpdateCompleteShop,
} from "@/app/(shop)/shop/profile/_hooks/useShop";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { mapShopOnboardingPayload } from "../../_store/shop.payload";
import { base64ToFile } from "../../_utils/getbase64ToFile";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import authService from "@/auth/services/auth.service";

const STORAGE_KEY = "shopOnboarding";

export const useShopOnboarding = () => {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rejectedReasons, setRejectedReasons] = useState<
    Record<string, string>
  >({});
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
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
            const targetStep =
              stepMap[Object.keys(verification.rejectedReasons)[0]] ?? 0;
            setCurrent(targetStep);
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
            country: shop.taxInfo?.registeredAddress?.countryName,
            province: shop.taxInfo?.registeredAddress?.provinceName,
            provinceCode: shop.taxInfo?.registeredAddress?.provinceCode,
            districtName: shop.taxInfo?.registeredAddress?.districtName,
            districtCode: shop.taxInfo?.registeredAddress?.districtCode,
            wardName: shop.taxInfo?.registeredAddress?.wardName,
            wardCode: shop.taxInfo?.registeredAddress?.wardCode,
            addressDetail: shop.taxInfo?.registeredAddress?.detail,
            pickupAddress: (() => {
              const addr =
                shop.address ||
                (shop.addresses?.length > 0 ? shop.addresses[0] : null);
              if (!addr) return undefined;
              return {
                fullName: addr.fullName,
                phone: addr.phone,
                country: addr.address?.countryName,
                provinceName: addr.address?.provinceName,
                provinceCode: addr.address?.provinceCode,
                districtName: addr.address?.districtName,
                districtCode: addr.address?.districtCode,
                wardName: addr.address?.wardName,
                wardCode: addr.address?.wardCode,
                addressDetail: addr.address?.detail,
              };
            })(),
          };
          setFormData(mappedValues);
          await localforage.setItem(STORAGE_KEY, {
            step: current,
            values: mappedValues,
          });
          setInitialLoading(false);
          return;
        }
      }

      const saved: any = await localforage.getItem(STORAGE_KEY);
      if (saved) {
        setFormData(saved.values);
        // setCurrent(saved.step);
      }
    } catch (e) {
      console.error(e);
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
        legalAssetIds.frontImageAssetId,
        legalAssetIds.backImageAssetId,
        legalAssetIds.faceImageAssetId,
      );

      // Ensure legalInfo includes fontImageUrl, backImageUrl, faceImageUrl
      if (payload.legalInfo) {
        
      } else {
        payload.legalInfo = {
          nationality: finalValues.nationality,
          identityType: finalValues.idType,
          identityNumber: finalValues.idNumber,
          fullName: finalValues.fullName,
          frontImageAssetId: legalAssetIds.frontImageAssetId,
          backImageAssetId: legalAssetIds.backImageAssetId,
          faceImageAssetId: legalAssetIds.faceImageAssetId,
       
        };
      }

      const res = isUpdateMode
        ? await handleUpdateCompleteShop(payload as any)
        : await handleCreateCompleteShop(payload as any);

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

  return {
    current,
    setCurrent,
    loading,
    initialLoading,
    rejectedReasons,
    formData,
    updateFormField,
    saveToStorage,
    handleFinish,
    isUpdateMode,
    uploadingImage,
    toastSuccess,
  };
};
