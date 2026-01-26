import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";

export const mapShopOnboardingPayload = (
  finalValues: any,
  logoPath: string,
  legalAssetIds: any,
) => {
  return {
    shopName: finalValues.shopName,
    description: finalValues.description,
    logoUrl: logoPath,
    legalInfo: {
      nationality: finalValues.nationality,
      identityType: finalValues.idType?.toUpperCase(),
      identityNumber: finalValues.idNumber,
      fullName: finalValues.fullName,
      frontImageAssetId: legalAssetIds.frontImageAssetId,
      backImageAssetId: legalAssetIds.backImageAssetId,
      faceImageAssetId: legalAssetIds.faceImageAssetId,
      fontImageUrl: "",
      backImageUrl: "",
      faceImageUrl: "",
    },
    taxInfo: {
      type: finalValues.businessType?.toUpperCase(),
      registeredAddress: {
        countryCode: finalValues.country,
        countryName: finalValues.country,
        provinceCode: finalValues.provinceCode || finalValues.province || "",
        provinceName: finalValues.provinceName || finalValues.province || "",
        detail: finalValues.addressDetail,
        districtCode: finalValues.districtCode || "",
        districtName: finalValues.districtName || finalValues.district || "",
        wardCode: finalValues.wardCode || "",
        wardName: finalValues.wardName || finalValues.ward || "",
      },
      email: finalValues.email,
      taxIdentificationNumber: finalValues.taxId,
    },
    address: {
      address: {
        countryCode: finalValues.pickupAddress?.countryCode || "",
        countryName:
          finalValues.pickupAddress?.countryName ||
          finalValues.pickupAddress?.country ||
          "",
        provinceCode: finalValues.pickupAddress?.provinceCode || "",
        provinceName:
          finalValues.pickupAddress?.provinceName ||
          finalValues.pickupAddress?.province ||
          "",
        districtCode: finalValues.pickupAddress?.districtCode || "",
        districtName:
          finalValues.pickupAddress?.districtName ||
          finalValues.pickupAddress?.district ||
          "",
        wardCode: finalValues.pickupAddress?.wardCode || "",
        wardName:
          finalValues.pickupAddress?.wardName ||
          finalValues.pickupAddress?.ward ||
          "",
        detail: finalValues.pickupAddress?.addressDetail || "",
      },
      detail: finalValues.pickupAddress?.addressDetail || "",
      fullName: finalValues.pickupAddress?.fullName || "",
      phone: finalValues.pickupAddress?.phone || "",
      isDefault: true,
      isDefaultPickup: true,
      isDefaultReturn: true,
    },
  };
};
