/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
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
import {
  useGetCountryInfo,
  useGetAllProvinces,
  useGetWardsByProvinceCode,
} from "@/hooks/address/useAddress";

import { ShopOnboardingContextType } from "./shop.context.type";

const STORAGE_KEY = "shopOnboarding";

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

  const {
    fetchCountryInfo,
    data: countryData,
    loading: countryLoading,
  } = useGetCountryInfo();
  const { fetchProvinces, data: provincesData } = useGetAllProvinces();
  const { fetchWards, data: wardsData } = useGetWardsByProvinceCode();
  const wardsCache = useRef<Record<string, any[]>>({});

  const lastFetchedProvince = useRef<string | null>(null);

  const extractData = useCallback((res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    return res?.content || res?.data?.content || [];
  }, []);

  const provinces = useMemo(
    () => extractData(provincesData),
    [provincesData, extractData],
  );
  const countries = useMemo(
    () => extractData(countryData),
    [countryData, extractData],
  );
  const currentWards = useMemo(
    () => extractData(wardsData),
    [wardsData, extractData],
  );

  const initialFetched = useRef(false);

  useEffect(() => {
    if (!initialFetched.current) {
      Promise.all([fetchCountryInfo(), fetchProvinces()]);
      initialFetched.current = true;
    }
  }, [fetchCountryInfo, fetchProvinces]);

  const fetchWardsByProvince = useCallback(
    async (provinceCode: string) => {
      if (!provinceCode) return;
      if (wardsCache.current[provinceCode]) return;

      lastFetchedProvince.current = provinceCode;
      await fetchWards(provinceCode);
    },
    [fetchWards],
  );

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

  const loadInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const userDetail = getStoredUserDetail();
      const savedData: any = await localforage.getItem(STORAGE_KEY);
      const initialFormData = savedData?.values || {};

      // Auto-get email
      if (!initialFormData.email && userDetail?.email) {
        initialFormData.email = userDetail.email;
      }

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
          return;
        }
      }

      if (savedData) setFormData(initialFormData);
    } catch (e) {
      console.error("Load initial error:", e);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const currentSaved: any = await localforage.getItem(STORAGE_KEY);
      const finalValues = { ...currentSaved?.values, ...formData };

      let logoPath = originalLogoUrl || "";
      let logoAssetId = "";
      const logoFile =
        finalValues.logoUrl?.[0]?.originFileObj ||
        (finalValues.logoUrl?.[0]?.base64
          ? base64ToFile(finalValues.logoUrl[0].base64, "logo.png")
          : null);

      if (logoFile) {
        const res = await uploadPresigned(logoFile, UploadContext.SHOP_LOGO);
        logoPath = res.finalUrl || toPublicUrl(res.path || "");
        logoAssetId = res.assetId || "";
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
        logoAssetId,
        logoPath,
        legalAssetIds,
        countryData,
      );

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
    const data = extractData(wardsData);
    if (data.length > 0 && lastFetchedProvince.current) {
      wardsCache.current[lastFetchedProvince.current] = data;
    }
  }, [wardsData, extractData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <ShopOnboardingContext.Provider
      value={{
        current,
        setCurrent,
        formData,
        updateFormField,
        uploadingImage,
        initialLoading,
        rejectedReasons,
        isUpdateMode,
        saveToStorage,
        handleFinish,
        country: countries,
        provinces: provinces,
        wards:
          (lastFetchedProvince.current &&
            wardsCache.current[lastFetchedProvince.current]) ||
          currentWards,
        loading: loading || countryLoading,
        fetchWardsByProvince,
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
