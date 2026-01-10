// hooks/useShopCheck.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/local.storage";
import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import _ from "lodash";

export type ShopCheckStatus = "checking" | "no-shop" | "pending" | "needs-update" | "verified";

export interface ShopVerificationInfo {
  isVerified: boolean;
  canSell: boolean;
  missingFields: string[];
  redirectTo: string | null;
  message: string;
  rejectedReasons?: Record<string, string>;
}

export const useShopCheck = () => {
  const router = useRouter();

  const { data: shopData, isLoading, isError } = useQuery({
    queryKey: ["currentUserShop"],
    queryFn: async () => {
      if (!isAuthenticated()) {
        router.push("/shop/login");
        return null;
      }
      const res = await getCurrentUserShopDetail();
      return res?.data || null;
    },
    retry: false,
  });

  const getStatus = (): ShopCheckStatus => {
    if (isLoading) return "checking";
    if (isError || !shopData) return "no-shop";

    const verification: ShopVerificationInfo = shopData.verificationInfo || {
        isVerified: false,
        canSell: false,
        missingFields: [],
        redirectTo: null,
        message: "",
        rejectedReasons: {}
    };

    // 1. Đã active hoặc verified -> Verified
    if (shopData.status === "ACTIVE" || verification.isVerified) {
        return "verified";
    }

    if (
        shopData.status === "PENDING" &&
        _.isEmpty(verification.missingFields) &&
        _.isEmpty(verification.rejectedReasons)
    ) {
        return "pending";
    }

    return "needs-update";
  };

  const getRedirectPath = (verification: ShopVerificationInfo | undefined): string => {
    if (!verification) return "/shop/onboarding?step=0";

    const rejectedReasons = verification.rejectedReasons || {};
    
    if (!_.isEmpty(rejectedReasons)) {
      const firstSection = _.keys(rejectedReasons)[0];
      const routeMap: Record<string, string> = {
        BASIC_INFO: "/shop/onboarding?step=0",
        LEGAL_INFO: "/shop/onboarding?step=2",
        TAX_INFO: "/shop/onboarding?step=1",
        SHOP: "/shop/onboarding?step=0",
      };
      return routeMap[firstSection] || "/shop/onboarding?step=0";
    }

    const routeMap: Record<string, string> = {
      BASIC_INFO: "/shop/onboarding?step=0",
      LEGAL_INFO: "/shop/onboarding?step=2",
      TAX_INFO: "/shop/onboarding?step=1",
      ADDRESS: "/shop/onboarding?step=0",
    };

    return routeMap[verification.redirectTo || ""] || "/shop/onboarding?step=0";
  };

  const getSectionName = (verification: ShopVerificationInfo | undefined) => {
      if(!verification) return "Thông tin shop";
      
      const rejectedReasons = verification.rejectedReasons || {};
      if (!_.isEmpty(rejectedReasons)) {
        const firstSection = _.keys(rejectedReasons)[0];
        const names: Record<string, string> = {
            BASIC_INFO: "Thông tin cơ bản",
            LEGAL_INFO: "Thông tin pháp lý",
            TAX_INFO: "Thông tin thuế",
            SHOP: "Thông tin shop"
        }
        return names[firstSection] || "Thông tin shop";
      }
      
      const redirectNames: Record<string, string> = {
          BASIC_INFO: "Thông tin cơ bản",
          LEGAL_INFO: "Thông tin pháp lý",
          TAX_INFO: "Thông tin thuế",
          ADDRESS: "Địa chỉ shop"
      }
      return redirectNames[verification.redirectTo || ""] || "Thông tin shop";
  }

  return {
    status: getStatus(),
    verificationInfo: shopData?.verificationInfo,
    redirectPath: getRedirectPath(shopData?.verificationInfo),
    sectionName: getSectionName(shopData?.verificationInfo),
    router
  };
};